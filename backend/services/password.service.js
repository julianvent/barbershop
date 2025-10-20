import bcrypt from 'bcrypt';

const ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? '10');
const PEPPER = process.env.PASSWORD_PEPPER ?? '';

const withPepper = (plain) => (PEPPER ? `${plain}${PEPPER}` : plain);

export async function hash(plain) {
  if (typeof plain !== 'string') {
    throw new TypeError('Password.hash espera un string');
  }
  return bcrypt.hash(withPepper(plain), ROUNDS);
}

export async function compare(plain, hashValue) {
  return bcrypt.compare(withPepper(plain), hashValue);
}

// opcional: export default con ambas
export default { hash, compare };
