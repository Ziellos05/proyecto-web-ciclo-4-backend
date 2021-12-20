import userSchema from "./userSchema.js";
import projectSchema from "./projectSchema.js";
import enrollmentSchema from "./enrollmentSchema.js";
import miscSchema from "./miscSchema.js";
import advanceSchema from "./advanceSchema.js";

export default [
  ...userSchema,
  ...projectSchema,
  ...enrollmentSchema,
  ...miscSchema,
  ...advanceSchema,
];
