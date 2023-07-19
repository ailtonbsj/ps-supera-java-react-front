export async function getTransferencias(query) {
  try {
    const raw = await fetch(`http://localhost:8080/api/transferencia?${query}`);
    return await raw.json();
  } catch (error) {
    console.log(error);
  }
}
