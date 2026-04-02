export function info(msg, meta = {}) {
  console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, meta);
}

export function error(msg, meta = {}) {
  console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, meta);
}

export default { info, error };
