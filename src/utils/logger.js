// Replace with provided logging middleware in real setup
export default function logger(event, payload) {
  console.info("LOG:", event, payload);
}
