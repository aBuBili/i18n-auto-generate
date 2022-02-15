import { RulesSeries } from '@datagroup/web-utils';
import {
  InputProps,
  SelectMultipleProps,
  SelectOptionWithGroup,
  SelectProps,
} from 'tea-component';

// ========================================================== Generic type utils start ==========================================================

type FilterArray<T extends string> = T extends `${infer R}[]` ? R : never;
type FilterOptionalArray<T extends string> = T extends `${infer R}[]?`
  ? R
  : never;
type FilterOptional<T extends string> = T extends `${infer R}?`
  ? never
  : T extends `${infer S}`
  ? S
  : never;
type FilterNormal<T extends string> = T extends `${infer R}?` ? R : never;

type ArrayKeyWord = '[]' | '[]?';
type IsArray<T extends string> = T extends `${infer R}${ArrayKeyWord}`
  ? never
  : T;

type MakeOptional<K extends string, T> = {
  [P in K as FilterNormal<IsArray<P>>]?: T;
};

type MakeRequired<K extends string, T> = {
  [P in K as FilterOptional<IsArray<P>>]: T;
};

type MakeRequiredArray<K extends string, T> = {
  [P in K as FilterArray<K>]: Array<T>;
};

type MakeOptionalArray<K extends string, T> = {
  [P in K as FilterOptionalArray<K>]?: Array<T>;
};

export type RecordType<T extends string, K> = MakeOptional<T, K> &
  MakeRequired<T, K> &
  MakeOptionalArray<T, K> &
  MakeRequiredArray<T, K>;

/**
 * Type string & number is the most appear in project
 * Record string and number, and deal with optional operations by string, just add optional flag in individual string
 * It can simplify code and more readable
 * e.g:
 *    type Test = RecordString<'A?' | 'B[]' | 'C[]?', 'D'> & RecordNumber<'E?' | 'F'>
 *    const test: Test = {
 *      A: '',  optional
 *      C: [''],optional
 *      B: ['', ''],
 *      E: '', optional
 *      F: '
 *    }
 */
export type RecordString<T extends string> = RecordType<T, string>;
export type RecordNumber<T extends string> = RecordType<T, number>;

// ========================================================== Generic type utils end ==========================================================

// ========================================================== Generic type utils from web utils ==========================================================

export declare type InitialValuesType<T> = T extends Array<infer U>
  ? ReadonlyArray<InitialValuesType<U>>
  : T extends {}
  ? {
      [K in keyof T]?: InitialValuesType<T[K]>;
    }
  : Readonly<T>;

export declare type Rules =
  | RulesSeries<{}, never>
  | RulesSeries<{}, never>[]
  | undefined;

// ========================================================== Generic type utils from web utils ==========================================================

// ========================================================== Uniform business generic type start ==========================================================

export declare type EditFormInitialValuesEdit = RecordString<
  'group_code' | 'group_name' | 'remark' | 'group_header[]?' | 'group_member[]?'
> & { business_id: number };

export declare type EditFormInitialValuesDetail = RecordString<
  'group_code' | 'group_name' | 'remark' | 'group_header?' | 'group_member?'
> & { business_id: number };

export declare type EditFormOptions = Array<{
  title?: string;
  data: Required<
    Array<
      | {
          type: 'select';
          name: string;
          label?: string;
          key?: string;
          selections?: Array<SelectOptionWithGroup>;
          formProps: SelectProps;
          rules?: Rules;
          readonly?: {
            style?: React.CSSProperties;
            disabledColor?: 'gray' | 'black' | 'none';
            bgTransparent?: boolean;
          };
        }
      | {
          type: 'selectMultiple';
          name: string;
          label?: string;
          key?: string;
          selections?: Array<SelectMultipleProps>;
          formProps: SelectMultipleProps;
          rules?: Rules;
          readonly?: {
            style?: React.CSSProperties;
            disabledColor?: 'gray' | 'black' | 'none';
            bgTransparent?: boolean;
          };
        }
      | {
          type: 'input';
          name: string;
          label?: string;
          key?: string;
          selections?: Array<InputProps>;
          formProps: InputProps;
          rules?: Rules;
          readonly?: {
            style?: React.CSSProperties;
            disabledColor?: 'gray' | 'black' | 'none';
            bgTransparent?: boolean;
          };
        }
    >
  >;
}>;

// ========================================================== Uniform business generic type end ==========================================================
