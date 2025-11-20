import bcrypt from 'bcrypt';

const ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? '10');
const PEPPER = process.env.PASSWORD_PEPPER ?? '';

const withPepper = (plain) => (PEPPER ? `${plain}${PEPPER}` : plain);

export async function hash(plain) {
  if (typeof plain !== 'string') {
    throw new TypeError('Password.hash expects a string');
  }
  return bcrypt.hash(withPepper(plain), ROUNDS);
}

export async function compare(plain, hashValue) {
  return bcrypt.compare(withPepper(plain), hashValue);
}

// optional: default export with both helpers
export default { hash, compare };
