import { ReferList } from './ReferList';
import { ReferShow } from './ReferShow';
import { ReferEdit } from './ReferEdit';
import { ReferCreate } from './ReferCreate';
import { withStandardList } from "../common/withStandardList";

export default {
  list: withStandardList(ReferList),
  show: ReferShow,
  edit: ReferEdit,
  create: ReferCreate,
};
