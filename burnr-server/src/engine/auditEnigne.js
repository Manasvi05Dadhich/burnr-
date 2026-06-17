
const { getUseCaseFit } = require("./capabilityMatrix");


const TOOL_CATEGORIES = {
  "Cursor":          "ai_coding_assistant",
  "GitHub Copilot":  "ai_coding_assistant",
  "Windsurf":        "ai_coding_assistant",
  "ChatGPT":         "general_llm_chat",
  "Claude":          "general_llm_chat",
  "Gemini":          "general_llm_chat",
  "OpenAI API":      "direct_api",
  "Anthropic API":   "direct_api",
};

const runAudit = (formInput, pricingRecords) => {
  const { teamSize, useCase, tools } = formInput;

  const overlapMap = detectOverlaps(tools);
  const recommendations = tools.map((tool) => {
    return scoreTool(tool, useCase, teamSize, pricingRecords, overlapMap);
  });

  
  recommendations.sort((a, b) => {
    if (b.monthlySavings !== a.monthlySavings) return b.monthlySavings - a.monthlySavings;
    const confidenceOrder = { high: 0, medium: 1, low: 2 };
    return confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
  });

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const spendMismatchFlagged = recommendations.some((r) => r.spendMismatch);

  return {
    recommendations,
    totalMonthlySavings: Math.round(totalMonthlySavings),
    totalAnnualSavings: Math.round(totalAnnualSavings),
    spendMismatchFlagged,
  };
};


const scoreTool = (tool, useCase, teamSize, pricingRecords, overlapMap) => {
  const { toolName, planName, seats, monthlySpend } = tool;

  const currentPlanData = pricingRecords.find(
    (p) => p.toolName === toolName && p.planName === planName && p.isActive
  );

  if (!currentPlanData) {
    return unknownPlanResult(tool);
  }


  const calculatedSpend = currentPlanData.pricePerSeat
    ? currentPlanData.pricePerSeat * seats
    : monthlySpend; 
  const spendMismatch = currentPlanData.pricePerSeat
    ? Math.abs(calculatedSpend - monthlySpend) / calculatedSpend > 0.1
    : false;
 const effectiveSpend = currentPlanData.pricePerSeat ? calculatedSpend : monthlySpend;
  const effectivePricePerSeat = currentPlanData.pricePerSeat
    ? currentPlanData.pricePerSeat
    : monthlySpend / seats;
  const { priceFitScore, benchmarkTool, benchmarkPrice } = scorePriceFit(
    toolName,
    effectivePricePerSeat,
    useCase,
    pricingRecords
  );

  const { planFitScore, planFitNote } = scorePlanFit(seats, currentPlanData);
  const useCaseFit = getUseCaseFit(toolName, useCase);
  const useCaseFitScore = useCaseFit.score;

  const { overlapScore, overlapsWith } = scoreOverlap(toolName, overlapMap);

  const totalScore = priceFitScore + planFitScore + useCaseFitScore + overlapScore;

  const { action, recommendedTool, recommendedPlan, projectedSpend } = determineAction(
    totalScore,
    toolName,
    planName,
    seats,
    effectiveSpend,
    useCase,
    pricingRecords,
    planFitScore,
    priceFitScore,
    useCaseFitScore,
    benchmarkTool,
    benchmarkPrice
  );

  const monthlySavings = action !== "keep"
    ? Math.max(0, Math.round(effectiveSpend - (projectedSpend || 0)))
    : 0;
  const annualSavings = monthlySavings * 12;
  const reason = generateReason(
    action,
    toolName,
    planName,
    seats,
    effectiveSpend,
    recommendedTool,
    recommendedPlan,
    projectedSpend,
    monthlySavings,
    planFitScore,
    priceFitScore,
    useCaseFit,
    overlapsWith,
    currentPlanData
  );
  const confidence = assignConfidence(totalScore, action, spendMismatch);

  return {
    toolName,
    currentPlan: planName,
    currentSpend: Math.round(effectiveSpend),
    scores: {
      priceFit: priceFitScore,
      planFit: planFitScore,
      useCaseFit: useCaseFitScore,
      overlap: overlapScore,
      total: totalScore,
    },
    action,
    recommendedTool: recommendedTool || null,
    recommendedPlan: recommendedPlan || null,
    projectedSpend: projectedSpend ? Math.round(projectedSpend) : null,
    monthlySavings,
    annualSavings,
    reason,
    confidence,
    hasOverlap: overlapScore < 25,
    overlapsWith: overlapsWith || null,
    spendMismatch,
  };
};



const scorePriceFit = (toolName, pricePerSeat, useCase, pricingRecords) => {
  
  const alternatives = pricingRecords.filter(
    (p) =>
      p.toolName !== toolName &&
      p.isActive &&
      p.pricePerSeat !== null &&
      p.useCases.includes(useCase)
  );

  if (alternatives.length === 0) {
    return { priceFitScore: 25, benchmarkTool: null, benchmarkPrice: null };
  }

  const cheapest = alternatives.reduce((min, p) =>
    p.pricePerSeat < min.pricePerSeat ? p : min
  );

  const benchmarkPrice = cheapest.pricePerSeat;
  const benchmarkTool = cheapest.toolName;

  if (benchmarkPrice === 0) {
    
    return { priceFitScore: 5, benchmarkTool, benchmarkPrice };
  }

  const ratio = pricePerSeat / benchmarkPrice;

  let priceFitScore;
  if (ratio > 2.0)       priceFitScore = Math.round(2 + (2.0 / ratio) * 3);   
  else if (ratio > 1.5)  priceFitScore = Math.round(6 + ((2.0 - ratio) / 0.5) * 6); 
  else if (ratio > 1.0)  priceFitScore = Math.round(13 + ((1.5 - ratio) / 0.5) * 5); 
  else                   priceFitScore = Math.round(19 + ((1.0 - ratio) * 6)); 

  priceFitScore = Math.max(0, Math.min(25, priceFitScore));

  return { priceFitScore, benchmarkTool, benchmarkPrice };
};

const scorePlanFit = (seats, planData) => {
  const { minSensibleSeats, maxSensibleSeats } = planData;

  if (seats < minSensibleSeats) {
    const ratio = seats / minSensibleSeats;
    const planFitScore = Math.round(ratio * 18); 
    return {
      planFitScore: Math.max(0, Math.min(18, planFitScore)),
      planFitNote: "overkill",
    };
  }


  if (maxSensibleSeats && seats > maxSensibleSeats) {
    return { planFitScore: 15, planFitNote: "undersized" };
  }

  
  return { planFitScore: 22, planFitNote: "good" };
};


const detectOverlaps = (tools) => {

  const overlapMap = {};
  const categoryGroups = {};

  tools.forEach((tool) => {
    const category = TOOL_CATEGORIES[tool.toolName];
    if (!category) return;
    if (!categoryGroups[category]) categoryGroups[category] = [];
    categoryGroups[category].push(tool.toolName);
  });

  tools.forEach((tool) => {
    const category = TOOL_CATEGORIES[tool.toolName];
    if (!category) return;
    const group = categoryGroups[category] || [];
    const others = group.filter((t) => t !== tool.toolName);
    overlapMap[tool.toolName] = others;
  });

  return overlapMap;
};

const scoreOverlap = (toolName, overlapMap) => {
  const overlaps = overlapMap[toolName] || [];

  if (overlaps.length === 0) return { overlapScore: 25, overlapsWith: null };
  if (overlaps.length === 1) return { overlapScore: 12, overlapsWith: overlaps[0] };
  return { overlapScore: 5, overlapsWith: overlaps.join(" and ") };
};


const determineAction = (
  totalScore,
  toolName,
  planName,
  seats,
  currentSpend,
  useCase,
  pricingRecords,
  planFitScore,
  priceFitScore,
  useCaseFitScore,
  benchmarkTool,
  benchmarkPrice
) => {
 
  if (totalScore >= 80) {
    return { action: "keep", recommendedTool: null, recommendedPlan: null, projectedSpend: currentSpend };
  }

  if (useCaseFitScore <= 5 && totalScore < 60) {
    
    const bestAlternative = findBestAlternativeForUseCase(useCase, toolName, seats, pricingRecords);
    if (bestAlternative) {
      return {
        action: "switch_tool",
        recommendedTool: bestAlternative.toolName,
        recommendedPlan: bestAlternative.planName,
        projectedSpend: bestAlternative.pricePerSeat * seats,
      };
    }
  }
l
  if (planFitScore <= 10 && totalScore < 70) {
    const cheaperPlan = findCheaperPlanForTool(toolName, planName, seats, pricingRecords);
    if (cheaperPlan) {
      return {
        action: "switch_plan",
        recommendedTool: toolName,
        recommendedPlan: cheaperPlan.planName,
        projectedSpend: cheaperPlan.pricePerSeat * seats,
      };
    }
  }

  
  if (priceFitScore <= 12 && benchmarkTool && benchmarkPrice) {
    const altPlan = findBestPlanForTool(benchmarkTool, seats, useCase, pricingRecords);
    if (altPlan) {
      return {
        action: "switch_tool",
        recommendedTool: benchmarkTool,
        recommendedPlan: altPlan.planName,
        projectedSpend: altPlan.pricePerSeat * seats,
      };
    }
  }

  
  if (totalScore >= 60) {
    return { action: "review", recommendedTool: null, recommendedPlan: null, projectedSpend: currentSpend };
  }

  
  return { action: "review", recommendedTool: null, recommendedPlan: null, projectedSpend: currentSpend };
};

  

const findCheaperPlanForTool = (toolName, currentPlanName, seats, pricingRecords) => {
  const currentPlan = pricingRecords.find(
    (p) => p.toolName === toolName && p.planName === currentPlanName
  );
  if (!currentPlan || !currentPlan.pricePerSeat) return null;

  return pricingRecords
    .filter(
      (p) =>
        p.toolName === toolName &&
        p.planName !== currentPlanName &&
        p.isActive &&
        p.pricePerSeat !== null &&
        p.pricePerSeat < currentPlan.pricePerSeat &&
        seats >= p.minSensibleSeats
    )
    .sort((a, b) => b.pricePerSeat - a.pricePerSeat)[0] || null;
  
};

const findBestAlternativeForUseCase = (useCase, excludeTool, seats, pricingRecords) => {
  return pricingRecords
    .filter(
      (p) =>
        p.toolName !== excludeTool &&
        p.isActive &&
        p.pricePerSeat !== null &&
        p.useCases.includes(useCase) &&
        seats >= p.minSensibleSeats
    )
    .sort((a, b) => a.pricePerSeat - b.pricePerSeat)[0] || null;
};

const findBestPlanForTool = (toolName, seats, useCase, pricingRecords) => {
  return pricingRecords
    .filter(
      (p) =>
        p.toolName === toolName &&
        p.isActive &&
        p.pricePerSeat !== null &&
        p.useCases.includes(useCase) &&
        seats >= p.minSensibleSeats
    )
    .sort((a, b) => a.pricePerSeat - b.pricePerSeat)[0] || null;
};

  

const generateReason = (
  action,
  toolName,
  planName,
  seats,
  currentSpend,
  recommendedTool,
  recommendedPlan,
  projectedSpend,
  monthlySavings,
  planFitScore,
  priceFitScore,
  useCaseFit,
  overlapsWith,
  currentPlanData
) => {
  if (action === "keep") {
    return `${toolName} ${planName} is well matched to your team size and use case — no action needed.`;
  }

  if (action === "switch_tool") {
    if (useCaseFit.score <= 5) {
      return useCaseFit.reason;
    }
    return `${toolName} costs $${Math.round(currentSpend / seats)}/seat — ${recommendedTool} covers the same use case at $${Math.round((projectedSpend || 0) / seats)}/seat, saving $${monthlySavings}/month.`;
  }

  if (action === "switch_plan" || action === "downgrade") {
    if (planFitScore <= 10 && currentPlanData) {
      const features = currentPlanData.keyFeatures.slice(0, 2).join(" and ");
      return `${planName} adds ${features} — with ${seats} seats you're paying for enterprise features designed for teams 2–3x your size.`;
    }
    return `Switching from ${planName} to ${recommendedPlan} saves $${monthlySavings}/month with no impact on the features your team actually uses.`;
  }

  if (action === "review") {
    if (overlapsWith) {
      return `${toolName} and ${overlapsWith} overlap in functionality — your team may be paying for the same capability twice.`;
    }
    return `Minor optimisation possible — review your ${toolName} usage against the ${planName} plan limits.`;
  }

  if (action === "drop") {
    return `${toolName} overlaps entirely with ${overlapsWith} already in your stack — dropping it saves $${monthlySavings}/month.`;
  }

  return `Review your ${toolName} ${planName} plan for potential savings.`;
};

                    

const assignConfidence = (totalScore, action, spendMismatch) => {
  if (spendMismatch) return "low"; 

  if (action === "keep") return "high";

  if (totalScore <= 40) return "high";  
  if (totalScore <= 60) return "medium";
  return "low";
};


const unknownPlanResult = (tool) => ({
  toolName: tool.toolName,
  currentPlan: tool.planName,
  currentSpend: tool.monthlySpend,
  scores: { priceFit: 0, planFit: 0, useCaseFit: 0, overlap: 0, total: 0 },
  action: "review",
  recommendedTool: null,
  recommendedPlan: null,
  projectedSpend: null,
  monthlySavings: 0,
  annualSavings: 0,
  reason: `We don't have pricing data for ${tool.toolName} ${tool.planName} yet — verify your plan details manually.`,
  confidence: "low",
  hasOverlap: false,
  overlapsWith: null,
  spendMismatch: false,
});

module.exports = { runAudit };