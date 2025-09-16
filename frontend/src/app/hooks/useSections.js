"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getPageService } from "@/app/services";
import { mergeRegistryWithRecords, toDbBit } from "@/app/services/sectionsAdapter";

export const useSections = ({
  organizationId,
  pageType,
  pageReferenceId,
  registrySections
}) => {
  const pageService = useMemo(() => getPageService(), []);
  const [sections, setSections] = useState(registrySections);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch and merge
  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await pageService.getPageSectionsByPage(
          organizationId,
          pageType,
          pageReferenceId
        );
        const merged = mergeRegistryWithRecords(registrySections, response.data || []);
        if (isMounted) setSections(merged);
      } catch (e) {
        if (isMounted) setError(e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    if (organizationId && pageReferenceId && pageType) fetch();
    return () => {
      isMounted = false;
    };
  }, [organizationId, pageType, pageReferenceId, pageService, registrySections]);

  const toggle = useCallback((name) => {
    setSections((prev) =>
      prev.map((s) => (s.name === name && !s.required ? { ...s, active: !s.active } : s))
    );
  }, []);

  const setDropdown = useCallback((name, open) => {
    setSections((prev) => prev.map((s) => (s.name === name ? { ...s, dropdown: open } : s)));
  }, []);

  const saveActives = useCallback(async () => {
    const items = sections
      .filter((s) => s.pageSectionId)
      .map((s) => ({ id: s.pageSectionId, active: toDbBit(s.active) }));
    if (items.length === 0) return;
    await pageService.bulkUpdateSections(items);
  }, [sections, pageService]);

  const saveOrder = useCallback(async () => {
    const ordered = sections
      .filter((s) => s.pageSectionId)
      .map((s, index) => ({ id: s.pageSectionId, order: index }));
    if (ordered.length === 0) return;
    await pageService.updateSectionsOrder(organizationId, pageType, pageReferenceId, ordered);
  }, [sections, pageService, organizationId, pageType, pageReferenceId]);

  return {
    sections,
    setSections,
    toggle,
    setDropdown,
    saveActives,
    saveOrder,
    isLoading,
    error,
  };
};





