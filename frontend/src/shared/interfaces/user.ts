import { Base } from './base';

export default interface User extends Base {
  username: string;
  email: string;
  profileImage: string;
}
