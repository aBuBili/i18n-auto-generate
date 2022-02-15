import { RecordNumber } from './index';
import { RecordString } from '.';

export declare interface AppGroupManagementSearchProps {
  onSearch?: (
    values: RecordString<'key_word?' | 'group_role?'> &
      RecordNumber<'start_time_unix' | 'end_time_unix'>
  ) => void;
}

export declare interface DatabasePermissionSearchProps {
  onSearch?: (
    values: RecordString<'key_word?'> &
      RecordNumber<'start_time_unix' | 'end_time_unix'>
  ) => void;
}
