import { describe, expect, it } from "vitest";

import {
  LeadSortBy,
  LeadSortOrder,
  LeadSource,
  LeadStatusValue,
} from "@/enums/lead.enums.ts";
import {
  getQueryFromSearchParams,
  getSearchParamsFromQuery,
} from "@/utils/lead.utils.ts";

describe("lead utils", () => {
  it("parses search params into normalized lead query", () => {
    const searchParams = new URLSearchParams({
      limit: "80",
      search: "  jamie  ",
      sort: LeadSortOrder.ASC,
      sortBy: LeadSortBy.STATUS,
      source: LeadSource.WALK_IN,
      status: LeadStatusValue.CONTACTED,
    });

    expect(getQueryFromSearchParams(searchParams)).toEqual({
      limit: 50,
      search: "jamie",
      sort: LeadSortOrder.ASC,
      sortBy: LeadSortBy.STATUS,
      source: LeadSource.WALK_IN,
      status: LeadStatusValue.CONTACTED,
    });
  });

  it("falls back to defaults for invalid search params", () => {
    const searchParams = new URLSearchParams({
      limit: "0",
      sort: "invalid",
      sortBy: "invalid",
      source: "invalid",
      status: "invalid",
    });

    expect(getQueryFromSearchParams(searchParams)).toEqual({
      limit: 20,
      search: undefined,
      sort: LeadSortOrder.DESC,
      sortBy: LeadSortBy.CREATED_AT,
      source: undefined,
      status: undefined,
    });
  });

  it("serializes only non-default query values", () => {
    const searchParams = getSearchParamsFromQuery({
      limit: 20,
      search: "jamie",
      sort: LeadSortOrder.ASC,
      sortBy: LeadSortBy.SOURCE,
      source: LeadSource.PHONE_INBOUND,
      status: undefined,
    });

    expect(searchParams.toString()).toBe(
      "sortBy=source&sort=asc&search=jamie&source=phone_inbound",
    );
  });
});
