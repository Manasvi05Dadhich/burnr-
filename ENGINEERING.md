in recomedation.js :```js id="z2m8qc"
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
