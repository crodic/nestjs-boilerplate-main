/**
 * Interface representing a nested filter object.
 * Supports simple values, nested relations, or arrays for $in operator.
 */
interface FilterObject {
  [key: string]: string | number | boolean | FilterObject | (string | number)[];
}

/**
 * Interface representing all possible parameters
 * for building a NestJS REST-style paginate query string.
 */
interface PaginateQueryParams {
  /** Number of items per page */
  limit?: number;

  /** Page number (for page-based pagination) */
  page?: number;

  /** Cursor string (for cursor-based pagination) */
  cursor?: string;

  /** Sorting string in the format "column:ASC|DESC" */
  sortBy?: string;

  /** Global search keyword */
  search?: string;

  /** List of fields to select */
  select?: string[];

  /** Include soft-deleted items */
  withDeleted?: boolean;

  /** Relations to include */
  with?: string[];

  /** Filter object, supports nested relations and array values for $in */
  filter?: FilterObject;
}

/**
 * Recursively flattens a nested filter object into dot notation.
 * Converts arrays into $in:val1,val2 format automatically.
 *
 * e.g., { toys: { name: ['Mouse','Ball'] } } -> "filter.toys.name=$in:Mouse,Ball"
 *
 * @param obj - The filter object to flatten
 * @param prefix - Current prefix for recursion, defaults to "filter"
 * @param parts - Array of strings to push the flattened key=value pairs
 */
function flattenFilter(
  obj: FilterObject,
  prefix = 'filter',
  parts: string[] = [],
) {
  for (const key in obj) {
    const val = obj[key];
    if (Array.isArray(val)) {
      // Convert array to $in format
      parts.push(`${prefix}.${key}=$in:${val.join(',')}`);
    } else if (val && typeof val === 'object') {
      // Recursive for nested object
      flattenFilter(val as FilterObject, `${prefix}.${key}`, parts);
    } else {
      parts.push(`${prefix}.${key}=${val}`);
    }
  }
  return parts;
}

/**
 * Builds a NestJS REST-style paginate query string from a parameter object.
 *
 * Example:
 * {
 *   limit: 5,
 *   page: 2,
 *   sortBy: 'color:DESC',
 *   filter: { age: '$gte:3', owner: { name: '$eq:John' }, toys: { name: ['Mouse','Ball'] } },
 *   select: ['id','name'],
 *   withDeleted: true
 * }
 * =>
 * "limit=5&page=2&sortBy=color:DESC&filter.age=$gte:3&filter.owner.name=$eq:John&filter.toys.name=$in:Mouse,Ball&select=id,name&withDeleted=true"
 *
 * @param params - PaginateQueryParams object
 * @returns Query string ready to append to API URL
 */
function buildPaginateQuery(params: PaginateQueryParams): string {
  const parts: string[] = [];

  // Pagination & basic params
  if (params.limit !== undefined) parts.push(`limit=${params.limit}`);
  if (params.page !== undefined) parts.push(`page=${params.page}`);
  if (params.cursor) parts.push(`cursor=${params.cursor}`);
  if (params.sortBy) parts.push(`sortBy=${params.sortBy}`);
  if (params.search) parts.push(`search=${params.search}`);
  if (params.select) parts.push(`select=${params.select.join(',')}`);
  if (params.withDeleted !== undefined)
    parts.push(`withDeleted=${params.withDeleted}`);
  if (params.with) parts.push(`with=${params.with.join(',')}`);

  // Flatten nested filter object
  if (params.filter) flattenFilter(params.filter, 'filter', parts);

  return parts.join('&');
}

// ===== Example Usage =====
const params: PaginateQueryParams = {
  limit: 5,
  sortBy: 'lastVetVisit:ASC',
  cursor: 'V998328469600000', // cursor-based pagination
  filter: {
    age: '$gte:3',
    owner: { name: '$eq:John' },
    toys: { name: ['Mouse', 'Ball'] }, // array converted to $in automatically
  },
  select: ['id', 'name', 'color', 'age'],
  withDeleted: true,
  with: ['owner', 'toys'],
};

const queryString = buildPaginateQuery(params);

console.log(queryString);
/*
Output:
limit=5&cursor=V998328469600000&sortBy=lastVetVisit:ASC&select=id,name,color,age&withDeleted=true&with=owner,toys&filter.age=$gte:3&filter.owner.name=$eq:John&filter.toys.name=$in:Mouse,Ball
*/
