import md5 from 'min-md5';
import qs from 'qs';

export default function gravatar(email, options) {
  return `https://secure.gravatar.com/avatar/${md5(email)}?${qs.stringify(
    options,
  )}`;
}
