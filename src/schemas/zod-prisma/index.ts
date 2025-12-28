import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput =
  | Prisma.JsonValue
  | null
  | 'JsonNull'
  | 'DbNull'
  | Prisma.NullTypes.DbNull
  | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.NullTypes.DbNull;
  if (v === 'JsonNull') return Prisma.NullTypes.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(
      z.string(),
      z.lazy(() => JsonValueSchema.optional()),
    ),
    z.array(z.lazy(() => JsonValueSchema)),
  ]),
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(
  () =>
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.object({ toJSON: z.any() }),
      z.record(
        z.string(),
        z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)])),
      ),
      z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    ]),
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum([
  'ReadUncommitted',
  'ReadCommitted',
  'RepeatableRead',
  'Serializable',
]);

export const CouponScalarFieldEnumSchema = z.enum([
  'id',
  'code',
  'discount',
  'expiryDate',
  'type',
  'discountType',
  'usageLimit',
  'details',
  'createdAt',
  'updatedAt',
]);

export const SortOrderSchema = z.enum(['asc', 'desc']);

export const JsonNullValueInputSchema = z
  .enum(['JsonNull'])
  .transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default', 'insensitive']);

export const JsonNullValueFilterSchema = z
  .enum(['DbNull', 'JsonNull', 'AnyNull'])
  .transform((value) =>
    value === 'JsonNull'
      ? Prisma.JsonNull
      : value === 'DbNull'
        ? Prisma.DbNull
        : value === 'AnyNull'
          ? Prisma.AnyNull
          : value,
  );

export const DiscountTypeSchema = z.enum(['PERCENTAGE', 'AMOUNT']);

export type DiscountTypeType = `${z.infer<typeof DiscountTypeSchema>}`;

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// COUPON SCHEMA
/////////////////////////////////////////

export const CouponSchema = z.object({
  discountType: DiscountTypeSchema,
  id: z.number().int(),
  code: z.string(),
  discount: z.number().int(),
  expiryDate: z.coerce.date(),
  type: z.string(),
  usageLimit: z.number().int(),
  details: JsonValueSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Coupon = z.infer<typeof CouponSchema>;

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// COUPON
//------------------------------------------------------

export const CouponSelectSchema: z.ZodType<Prisma.CouponSelect> = z
  .object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    discount: z.boolean().optional(),
    expiryDate: z.boolean().optional(),
    type: z.boolean().optional(),
    discountType: z.boolean().optional(),
    usageLimit: z.boolean().optional(),
    details: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
  })
  .strict();

/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const CouponWhereInputSchema: z.ZodType<Prisma.CouponWhereInput> =
  z.strictObject({
    AND: z
      .union([
        z.lazy(() => CouponWhereInputSchema),
        z.lazy(() => CouponWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => CouponWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => CouponWhereInputSchema),
        z.lazy(() => CouponWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    code: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    discount: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    expiryDate: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    type: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    discountType: z
      .union([
        z.lazy(() => EnumDiscountTypeFilterSchema),
        z.lazy(() => DiscountTypeSchema),
      ])
      .optional(),
    usageLimit: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    details: z.lazy(() => JsonFilterSchema).optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    updatedAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
  });

export const CouponOrderByWithRelationInputSchema: z.ZodType<Prisma.CouponOrderByWithRelationInput> =
  z.strictObject({
    id: z.lazy(() => SortOrderSchema).optional(),
    code: z.lazy(() => SortOrderSchema).optional(),
    discount: z.lazy(() => SortOrderSchema).optional(),
    expiryDate: z.lazy(() => SortOrderSchema).optional(),
    type: z.lazy(() => SortOrderSchema).optional(),
    discountType: z.lazy(() => SortOrderSchema).optional(),
    usageLimit: z.lazy(() => SortOrderSchema).optional(),
    details: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
  });

export const CouponWhereUniqueInputSchema: z.ZodType<Prisma.CouponWhereUniqueInput> =
  z
    .union([
      z.object({
        id: z.number().int(),
        code: z.string(),
      }),
      z.object({
        id: z.number().int(),
      }),
      z.object({
        code: z.string(),
      }),
    ])
    .and(
      z.strictObject({
        id: z.number().int().optional(),
        code: z.string().optional(),
        AND: z
          .union([
            z.lazy(() => CouponWhereInputSchema),
            z.lazy(() => CouponWhereInputSchema).array(),
          ])
          .optional(),
        OR: z
          .lazy(() => CouponWhereInputSchema)
          .array()
          .optional(),
        NOT: z
          .union([
            z.lazy(() => CouponWhereInputSchema),
            z.lazy(() => CouponWhereInputSchema).array(),
          ])
          .optional(),
        discount: z
          .union([z.lazy(() => IntFilterSchema), z.number().int()])
          .optional(),
        expiryDate: z
          .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
          .optional(),
        type: z
          .union([z.lazy(() => StringFilterSchema), z.string()])
          .optional(),
        discountType: z
          .union([
            z.lazy(() => EnumDiscountTypeFilterSchema),
            z.lazy(() => DiscountTypeSchema),
          ])
          .optional(),
        usageLimit: z
          .union([z.lazy(() => IntFilterSchema), z.number().int()])
          .optional(),
        details: z.lazy(() => JsonFilterSchema).optional(),
        createdAt: z
          .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
          .optional(),
        updatedAt: z
          .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
          .optional(),
      }),
    );

export const CouponOrderByWithAggregationInputSchema: z.ZodType<Prisma.CouponOrderByWithAggregationInput> =
  z.strictObject({
    id: z.lazy(() => SortOrderSchema).optional(),
    code: z.lazy(() => SortOrderSchema).optional(),
    discount: z.lazy(() => SortOrderSchema).optional(),
    expiryDate: z.lazy(() => SortOrderSchema).optional(),
    type: z.lazy(() => SortOrderSchema).optional(),
    discountType: z.lazy(() => SortOrderSchema).optional(),
    usageLimit: z.lazy(() => SortOrderSchema).optional(),
    details: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
    _count: z.lazy(() => CouponCountOrderByAggregateInputSchema).optional(),
    _avg: z.lazy(() => CouponAvgOrderByAggregateInputSchema).optional(),
    _max: z.lazy(() => CouponMaxOrderByAggregateInputSchema).optional(),
    _min: z.lazy(() => CouponMinOrderByAggregateInputSchema).optional(),
    _sum: z.lazy(() => CouponSumOrderByAggregateInputSchema).optional(),
  });

export const CouponScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CouponScalarWhereWithAggregatesInput> =
  z.strictObject({
    AND: z
      .union([
        z.lazy(() => CouponScalarWhereWithAggregatesInputSchema),
        z.lazy(() => CouponScalarWhereWithAggregatesInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => CouponScalarWhereWithAggregatesInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => CouponScalarWhereWithAggregatesInputSchema),
        z.lazy(() => CouponScalarWhereWithAggregatesInputSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
      .optional(),
    code: z
      .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
      .optional(),
    discount: z
      .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
      .optional(),
    expiryDate: z
      .union([
        z.lazy(() => DateTimeWithAggregatesFilterSchema),
        z.coerce.date(),
      ])
      .optional(),
    type: z
      .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
      .optional(),
    discountType: z
      .union([
        z.lazy(() => EnumDiscountTypeWithAggregatesFilterSchema),
        z.lazy(() => DiscountTypeSchema),
      ])
      .optional(),
    usageLimit: z
      .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
      .optional(),
    details: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
    createdAt: z
      .union([
        z.lazy(() => DateTimeWithAggregatesFilterSchema),
        z.coerce.date(),
      ])
      .optional(),
    updatedAt: z
      .union([
        z.lazy(() => DateTimeWithAggregatesFilterSchema),
        z.coerce.date(),
      ])
      .optional(),
  });

export const CouponCreateInputSchema: z.ZodType<Prisma.CouponCreateInput> =
  z.strictObject({
    code: z.string(),
    discount: z.number().int(),
    expiryDate: z.coerce.date(),
    type: z.string(),
    discountType: z.lazy(() => DiscountTypeSchema).optional(),
    usageLimit: z.number().int(),
    details: z.union([
      z.lazy(() => JsonNullValueInputSchema),
      InputJsonValueSchema,
    ]),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  });

export const CouponUncheckedCreateInputSchema: z.ZodType<Prisma.CouponUncheckedCreateInput> =
  z.strictObject({
    id: z.number().int().optional(),
    code: z.string(),
    discount: z.number().int(),
    expiryDate: z.coerce.date(),
    type: z.string(),
    discountType: z.lazy(() => DiscountTypeSchema).optional(),
    usageLimit: z.number().int(),
    details: z.union([
      z.lazy(() => JsonNullValueInputSchema),
      InputJsonValueSchema,
    ]),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  });

export const CouponUpdateInputSchema: z.ZodType<Prisma.CouponUpdateInput> =
  z.strictObject({
    code: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    discount: z
      .union([
        z.number().int(),
        z.lazy(() => IntFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    expiryDate: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    type: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    discountType: z
      .union([
        z.lazy(() => DiscountTypeSchema),
        z.lazy(() => EnumDiscountTypeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    usageLimit: z
      .union([
        z.number().int(),
        z.lazy(() => IntFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    details: z
      .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    updatedAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
  });

export const CouponUncheckedUpdateInputSchema: z.ZodType<Prisma.CouponUncheckedUpdateInput> =
  z.strictObject({
    id: z
      .union([
        z.number().int(),
        z.lazy(() => IntFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    code: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    discount: z
      .union([
        z.number().int(),
        z.lazy(() => IntFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    expiryDate: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    type: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    discountType: z
      .union([
        z.lazy(() => DiscountTypeSchema),
        z.lazy(() => EnumDiscountTypeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    usageLimit: z
      .union([
        z.number().int(),
        z.lazy(() => IntFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    details: z
      .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    updatedAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
  });

export const CouponCreateManyInputSchema: z.ZodType<Prisma.CouponCreateManyInput> =
  z.strictObject({
    id: z.number().int().optional(),
    code: z.string(),
    discount: z.number().int(),
    expiryDate: z.coerce.date(),
    type: z.string(),
    discountType: z.lazy(() => DiscountTypeSchema).optional(),
    usageLimit: z.number().int(),
    details: z.union([
      z.lazy(() => JsonNullValueInputSchema),
      InputJsonValueSchema,
    ]),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  });

export const CouponUpdateManyMutationInputSchema: z.ZodType<Prisma.CouponUpdateManyMutationInput> =
  z.strictObject({
    code: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    discount: z
      .union([
        z.number().int(),
        z.lazy(() => IntFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    expiryDate: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    type: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    discountType: z
      .union([
        z.lazy(() => DiscountTypeSchema),
        z.lazy(() => EnumDiscountTypeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    usageLimit: z
      .union([
        z.number().int(),
        z.lazy(() => IntFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    details: z
      .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    updatedAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
  });

export const CouponUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CouponUncheckedUpdateManyInput> =
  z.strictObject({
    id: z
      .union([
        z.number().int(),
        z.lazy(() => IntFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    code: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    discount: z
      .union([
        z.number().int(),
        z.lazy(() => IntFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    expiryDate: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    type: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    discountType: z
      .union([
        z.lazy(() => DiscountTypeSchema),
        z.lazy(() => EnumDiscountTypeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    usageLimit: z
      .union([
        z.number().int(),
        z.lazy(() => IntFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    details: z
      .union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
      .optional(),
    createdAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    updatedAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
  });

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> =
  z.strictObject({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringFilterSchema)])
      .optional(),
  });

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> =
  z.strictObject({
    equals: z.coerce.date().optional(),
    in: z.coerce.date().array().optional(),
    notIn: z.coerce.date().array().optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z
      .union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)])
      .optional(),
  });

export const EnumDiscountTypeFilterSchema: z.ZodType<Prisma.EnumDiscountTypeFilter> =
  z.strictObject({
    equals: z.lazy(() => DiscountTypeSchema).optional(),
    in: z
      .lazy(() => DiscountTypeSchema)
      .array()
      .optional(),
    notIn: z
      .lazy(() => DiscountTypeSchema)
      .array()
      .optional(),
    not: z
      .union([
        z.lazy(() => DiscountTypeSchema),
        z.lazy(() => NestedEnumDiscountTypeFilterSchema),
      ])
      .optional(),
  });

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.strictObject({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
});

export const CouponCountOrderByAggregateInputSchema: z.ZodType<Prisma.CouponCountOrderByAggregateInput> =
  z.strictObject({
    id: z.lazy(() => SortOrderSchema).optional(),
    code: z.lazy(() => SortOrderSchema).optional(),
    discount: z.lazy(() => SortOrderSchema).optional(),
    expiryDate: z.lazy(() => SortOrderSchema).optional(),
    type: z.lazy(() => SortOrderSchema).optional(),
    discountType: z.lazy(() => SortOrderSchema).optional(),
    usageLimit: z.lazy(() => SortOrderSchema).optional(),
    details: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
  });

export const CouponAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CouponAvgOrderByAggregateInput> =
  z.strictObject({
    id: z.lazy(() => SortOrderSchema).optional(),
    discount: z.lazy(() => SortOrderSchema).optional(),
    usageLimit: z.lazy(() => SortOrderSchema).optional(),
  });

export const CouponMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CouponMaxOrderByAggregateInput> =
  z.strictObject({
    id: z.lazy(() => SortOrderSchema).optional(),
    code: z.lazy(() => SortOrderSchema).optional(),
    discount: z.lazy(() => SortOrderSchema).optional(),
    expiryDate: z.lazy(() => SortOrderSchema).optional(),
    type: z.lazy(() => SortOrderSchema).optional(),
    discountType: z.lazy(() => SortOrderSchema).optional(),
    usageLimit: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
  });

export const CouponMinOrderByAggregateInputSchema: z.ZodType<Prisma.CouponMinOrderByAggregateInput> =
  z.strictObject({
    id: z.lazy(() => SortOrderSchema).optional(),
    code: z.lazy(() => SortOrderSchema).optional(),
    discount: z.lazy(() => SortOrderSchema).optional(),
    expiryDate: z.lazy(() => SortOrderSchema).optional(),
    type: z.lazy(() => SortOrderSchema).optional(),
    discountType: z.lazy(() => SortOrderSchema).optional(),
    usageLimit: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
  });

export const CouponSumOrderByAggregateInputSchema: z.ZodType<Prisma.CouponSumOrderByAggregateInput> =
  z.strictObject({
    id: z.lazy(() => SortOrderSchema).optional(),
    discount: z.lazy(() => SortOrderSchema).optional(),
    usageLimit: z.lazy(() => SortOrderSchema).optional(),
  });

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> =
  z.strictObject({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)])
      .optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
    _sum: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedIntFilterSchema).optional(),
    _max: z.lazy(() => NestedIntFilterSchema).optional(),
  });

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> =
  z.strictObject({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)])
      .optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedStringFilterSchema).optional(),
    _max: z.lazy(() => NestedStringFilterSchema).optional(),
  });

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> =
  z.strictObject({
    equals: z.coerce.date().optional(),
    in: z.coerce.date().array().optional(),
    notIn: z.coerce.date().array().optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z
      .union([
        z.coerce.date(),
        z.lazy(() => NestedDateTimeWithAggregatesFilterSchema),
      ])
      .optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
    _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  });

export const EnumDiscountTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDiscountTypeWithAggregatesFilter> =
  z.strictObject({
    equals: z.lazy(() => DiscountTypeSchema).optional(),
    in: z
      .lazy(() => DiscountTypeSchema)
      .array()
      .optional(),
    notIn: z
      .lazy(() => DiscountTypeSchema)
      .array()
      .optional(),
    not: z
      .union([
        z.lazy(() => DiscountTypeSchema),
        z.lazy(() => NestedEnumDiscountTypeWithAggregatesFilterSchema),
      ])
      .optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedEnumDiscountTypeFilterSchema).optional(),
    _max: z.lazy(() => NestedEnumDiscountTypeFilterSchema).optional(),
  });

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> =
  z.strictObject({
    equals: InputJsonValueSchema.optional(),
    path: z.string().array().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    string_contains: z.string().optional(),
    string_starts_with: z.string().optional(),
    string_ends_with: z.string().optional(),
    array_starts_with: InputJsonValueSchema.optional().nullable(),
    array_ends_with: InputJsonValueSchema.optional().nullable(),
    array_contains: InputJsonValueSchema.optional().nullable(),
    lt: InputJsonValueSchema.optional(),
    lte: InputJsonValueSchema.optional(),
    gt: InputJsonValueSchema.optional(),
    gte: InputJsonValueSchema.optional(),
    not: InputJsonValueSchema.optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedJsonFilterSchema).optional(),
    _max: z.lazy(() => NestedJsonFilterSchema).optional(),
  });

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> =
  z.strictObject({
    set: z.string().optional(),
  });

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> =
  z.strictObject({
    set: z.number().optional(),
    increment: z.number().optional(),
    decrement: z.number().optional(),
    multiply: z.number().optional(),
    divide: z.number().optional(),
  });

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> =
  z.strictObject({
    set: z.coerce.date().optional(),
  });

export const EnumDiscountTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDiscountTypeFieldUpdateOperationsInput> =
  z.strictObject({
    set: z.lazy(() => DiscountTypeSchema).optional(),
  });

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> =
  z.strictObject({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
  });

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> =
  z.strictObject({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringFilterSchema)])
      .optional(),
  });

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> =
  z.strictObject({
    equals: z.coerce.date().optional(),
    in: z.coerce.date().array().optional(),
    notIn: z.coerce.date().array().optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z
      .union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)])
      .optional(),
  });

export const NestedEnumDiscountTypeFilterSchema: z.ZodType<Prisma.NestedEnumDiscountTypeFilter> =
  z.strictObject({
    equals: z.lazy(() => DiscountTypeSchema).optional(),
    in: z
      .lazy(() => DiscountTypeSchema)
      .array()
      .optional(),
    notIn: z
      .lazy(() => DiscountTypeSchema)
      .array()
      .optional(),
    not: z
      .union([
        z.lazy(() => DiscountTypeSchema),
        z.lazy(() => NestedEnumDiscountTypeFilterSchema),
      ])
      .optional(),
  });

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> =
  z.strictObject({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)])
      .optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
    _sum: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedIntFilterSchema).optional(),
    _max: z.lazy(() => NestedIntFilterSchema).optional(),
  });

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> =
  z.strictObject({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedFloatFilterSchema)])
      .optional(),
  });

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> =
  z.strictObject({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)])
      .optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedStringFilterSchema).optional(),
    _max: z.lazy(() => NestedStringFilterSchema).optional(),
  });

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> =
  z.strictObject({
    equals: z.coerce.date().optional(),
    in: z.coerce.date().array().optional(),
    notIn: z.coerce.date().array().optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z
      .union([
        z.coerce.date(),
        z.lazy(() => NestedDateTimeWithAggregatesFilterSchema),
      ])
      .optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
    _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  });

export const NestedEnumDiscountTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDiscountTypeWithAggregatesFilter> =
  z.strictObject({
    equals: z.lazy(() => DiscountTypeSchema).optional(),
    in: z
      .lazy(() => DiscountTypeSchema)
      .array()
      .optional(),
    notIn: z
      .lazy(() => DiscountTypeSchema)
      .array()
      .optional(),
    not: z
      .union([
        z.lazy(() => DiscountTypeSchema),
        z.lazy(() => NestedEnumDiscountTypeWithAggregatesFilterSchema),
      ])
      .optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedEnumDiscountTypeFilterSchema).optional(),
    _max: z.lazy(() => NestedEnumDiscountTypeFilterSchema).optional(),
  });

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> =
  z.strictObject({
    equals: InputJsonValueSchema.optional(),
    path: z.string().array().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    string_contains: z.string().optional(),
    string_starts_with: z.string().optional(),
    string_ends_with: z.string().optional(),
    array_starts_with: InputJsonValueSchema.optional().nullable(),
    array_ends_with: InputJsonValueSchema.optional().nullable(),
    array_contains: InputJsonValueSchema.optional().nullable(),
    lt: InputJsonValueSchema.optional(),
    lte: InputJsonValueSchema.optional(),
    gt: InputJsonValueSchema.optional(),
    gte: InputJsonValueSchema.optional(),
    not: InputJsonValueSchema.optional(),
  });

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const CouponFindFirstArgsSchema: z.ZodType<Prisma.CouponFindFirstArgs> =
  z
    .object({
      select: CouponSelectSchema.optional(),
      where: CouponWhereInputSchema.optional(),
      orderBy: z
        .union([
          CouponOrderByWithRelationInputSchema.array(),
          CouponOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: CouponWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          CouponScalarFieldEnumSchema,
          CouponScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const CouponFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CouponFindFirstOrThrowArgs> =
  z
    .object({
      select: CouponSelectSchema.optional(),
      where: CouponWhereInputSchema.optional(),
      orderBy: z
        .union([
          CouponOrderByWithRelationInputSchema.array(),
          CouponOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: CouponWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          CouponScalarFieldEnumSchema,
          CouponScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const CouponFindManyArgsSchema: z.ZodType<Prisma.CouponFindManyArgs> = z
  .object({
    select: CouponSelectSchema.optional(),
    where: CouponWhereInputSchema.optional(),
    orderBy: z
      .union([
        CouponOrderByWithRelationInputSchema.array(),
        CouponOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: CouponWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([CouponScalarFieldEnumSchema, CouponScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();

export const CouponAggregateArgsSchema: z.ZodType<Prisma.CouponAggregateArgs> =
  z
    .object({
      where: CouponWhereInputSchema.optional(),
      orderBy: z
        .union([
          CouponOrderByWithRelationInputSchema.array(),
          CouponOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: CouponWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const CouponGroupByArgsSchema: z.ZodType<Prisma.CouponGroupByArgs> = z
  .object({
    where: CouponWhereInputSchema.optional(),
    orderBy: z
      .union([
        CouponOrderByWithAggregationInputSchema.array(),
        CouponOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: CouponScalarFieldEnumSchema.array(),
    having: CouponScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const CouponFindUniqueArgsSchema: z.ZodType<Prisma.CouponFindUniqueArgs> =
  z
    .object({
      select: CouponSelectSchema.optional(),
      where: CouponWhereUniqueInputSchema,
    })
    .strict();

export const CouponFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CouponFindUniqueOrThrowArgs> =
  z
    .object({
      select: CouponSelectSchema.optional(),
      where: CouponWhereUniqueInputSchema,
    })
    .strict();

export const CouponCreateArgsSchema: z.ZodType<Prisma.CouponCreateArgs> = z
  .object({
    select: CouponSelectSchema.optional(),
    data: z.union([CouponCreateInputSchema, CouponUncheckedCreateInputSchema]),
  })
  .strict();

export const CouponUpsertArgsSchema: z.ZodType<Prisma.CouponUpsertArgs> = z
  .object({
    select: CouponSelectSchema.optional(),
    where: CouponWhereUniqueInputSchema,
    create: z.union([
      CouponCreateInputSchema,
      CouponUncheckedCreateInputSchema,
    ]),
    update: z.union([
      CouponUpdateInputSchema,
      CouponUncheckedUpdateInputSchema,
    ]),
  })
  .strict();

export const CouponCreateManyArgsSchema: z.ZodType<Prisma.CouponCreateManyArgs> =
  z
    .object({
      data: z.union([
        CouponCreateManyInputSchema,
        CouponCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const CouponCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CouponCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        CouponCreateManyInputSchema,
        CouponCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const CouponDeleteArgsSchema: z.ZodType<Prisma.CouponDeleteArgs> = z
  .object({
    select: CouponSelectSchema.optional(),
    where: CouponWhereUniqueInputSchema,
  })
  .strict();

export const CouponUpdateArgsSchema: z.ZodType<Prisma.CouponUpdateArgs> = z
  .object({
    select: CouponSelectSchema.optional(),
    data: z.union([CouponUpdateInputSchema, CouponUncheckedUpdateInputSchema]),
    where: CouponWhereUniqueInputSchema,
  })
  .strict();

export const CouponUpdateManyArgsSchema: z.ZodType<Prisma.CouponUpdateManyArgs> =
  z
    .object({
      data: z.union([
        CouponUpdateManyMutationInputSchema,
        CouponUncheckedUpdateManyInputSchema,
      ]),
      where: CouponWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict();

export const CouponUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CouponUpdateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        CouponUpdateManyMutationInputSchema,
        CouponUncheckedUpdateManyInputSchema,
      ]),
      where: CouponWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict();

export const CouponDeleteManyArgsSchema: z.ZodType<Prisma.CouponDeleteManyArgs> =
  z
    .object({
      where: CouponWhereInputSchema.optional(),
      limit: z.number().optional(),
    })
    .strict();
