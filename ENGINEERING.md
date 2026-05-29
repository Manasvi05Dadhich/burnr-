in recomedation.js :

```js id="z2m8qc"
AuditSchema.virtual("hasSavings").get(function () {
  return this.totalMonthlySavings > 0;
});
```

Creates a virtual/computed field called `hasSavings`.

* Not stored in DB
* Calculated dynamically
* Returns:

  * `true` if savings > 0
  * `false` otherwise

Example:

```js id="q7v1pk"
audit.hasSavings
```

instead of:

```js id="m4x9rb"
audit.totalMonthlySavings > 0
```
-2- in mongoose we can do type : string and type : [string], here in [] it can store array of strings (multiple strings),

-3-  in default we can do null or [], []
"I have a list, but it's empty." , null
"No list exists / no value assigned."

-4-  statics  in mongoose :Statics are model-level methods in Mongoose that are defined on the schema and can be called directly on the model. They are commonly used for reusable query and collection-related operations.