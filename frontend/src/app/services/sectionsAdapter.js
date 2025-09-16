// Sections Adapter: normalize DB <-> UI and merge registry with DB records

export const toDbBit = (value) => {
  if (typeof value === 'boolean') return value ? 1 : 0;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? 0 : (numeric ? 1 : 0);
};

export const fromDbBit = (value) => {
  return typeof value === 'number' ? value === 1 : !!value;
};

// Merge a registry of sections (UI config) with DB records for a page
// registrySection.name is treated as the canonical handle
export const mergeRegistryWithRecords = (registrySections, dbRecords = []) => {
  return registrySections.map((section) => {
    const record = dbRecords.find((r) => r.name === section.name);
    if (!record) return section;
    return {
      ...section,
      pageSectionId: record.id,
      active: fromDbBit(record.active),
      // Optionally map ordering if needed in UI later
      display_order: record.display_order
    };
  });
};





