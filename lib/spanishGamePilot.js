export function localizeSpanishSpain(detail, pilot) {
  return { ...detail, ...pilot, parameters: detail.parameters.map((item, index) => ({ ...item, ...pilot.parameters[index] })) };
}
