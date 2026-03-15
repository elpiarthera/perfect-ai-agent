import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  wallResponses: defineTable({
    modelName: v.string(),
    responseText: v.string(),
    pullQuote: v.string(),
    source: v.union(v.literal("benchmark"), v.literal("community")),
    status: v.union(v.literal("approved"), v.literal("pending"), v.literal("rejected")),
    submitterName: v.optional(v.string()),
    submittedAt: v.number(),
    approvedAt: v.optional(v.number()),
  }).index("by_status", ["status"])
    .index("by_model", ["modelName"]),
});
