// src/helpers/queryBuilder.ts

import { Query } from "mongoose";
import { excludefield } from "../constants";

export class QueryBuilder<T> {
  private modelQuery: Query<T[], T>;
  private readonly queryParams: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, queryParams: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.queryParams = queryParams;
  }

  // 🔍 Search by text in specific fields
  search(searchableFields: string[]): this {
    const searchTerm = this.queryParams.searchTerm;

    if (searchTerm) {
      const searchConditions = {
        $or: searchableFields.map(field => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      };

      this.modelQuery = this.modelQuery.find(searchConditions);
    }

    return this;
  }


  filter(): this {
    const filterFields = { ...this.queryParams };

    for (const field of excludefield) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filterFields[field];
    }

    if (Object.keys(filterFields).length > 0) {
      this.modelQuery = this.modelQuery.find(filterFields);
    }

    return this;
  }

  // ⬇ Sort by specified field
  sort(): this {
    const sortBy = this.queryParams.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  // 📌 Project specific fields
  fields(): this {
    const fields = this.queryParams.fields?.split(",").join(" ");
    if (fields) {
      this.modelQuery = this.modelQuery.select(fields);
    }
    return this;
  }

  // 📄 Pagination logic
  paginate(): this {
    const page = parseInt(this.queryParams.page || "1", 10);
    const limit = parseInt(this.queryParams.limit || "10", 10);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // 🔨 Return the final built query
  build(): Query<T[], T> {
    return this.modelQuery;
  }

  // 📊 Return metadata for pagination response
  async getMeta(): Promise<{
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  }> {
    const page = parseInt(this.queryParams.page || "1", 10);
    const limit = parseInt(this.queryParams.limit || "10", 10);

    const total = await this.modelQuery.model.countDocuments();
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}
