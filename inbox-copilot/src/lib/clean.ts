export function stripSignaturesAndQuotes(raw: string): string {
  const withoutSignature = raw.replace(/\n--+\n[\s\S]*$/m, "");
  const withoutQuoted = withoutSignature.replace(/On .*wrote:\n[\s\S]*/m, "");
  return withoutQuoted.trim();
}


