/**
 * ModelFilterEngine
 * Object-Oriented multi-tag filtering engine.
 * Filters and extracts facets dynamically using the real API schema:
 * - Pipeline Tags -> hf_tags.pipeline_tag
 * - Family Tags -> family
 * - Architecture Tags -> hf_tags.architecture / architecture_category
 * - Weight Tags -> weight_format
 * - Safetensor minimum -> safetensor_file_count (numeric, safe conversion)
 * - Safetensor maximum -> safetensor_file_count (numeric, safe conversion)
 */

export class ModelFilterEngine {
  /**
   * Safely retrieves safetensor numeric count or null
   */
  getSafetensorCount(model) {
    const raw = model.safetensor_file_count !== undefined 
      ? model.safetensor_file_count 
      : (model.safetensors_file_count !== undefined 
          ? model.safetensors_file_count 
          : model.safetensorCount);

    if (raw === null || raw === undefined || String(raw).trim() === '') return null;
    const num = Number(raw);
    return !isNaN(num) && isFinite(num) ? num : null;
  }

  /**
   * Evaluates if a model matches the specified filter state.
   * 
   * @param {Array<Object>} models - Source list of models
   * @param {Object} filterState - Active filters configuration
   * @returns {Array<Object>} Filtered models
   */
  filter(models, filterState = {}) {
    if (!Array.isArray(models)) return [];
    if (!filterState || typeof filterState !== 'object') return models;

    const {
      pipelineTags = [],
      familyTags = [],
      architectureTags = [],
      weightTags = [],
      safetensorMin = null,
      safetensorMax = null,
    } = filterState;

    return models.filter((model) => {
      if (!model) return false;

      // 1. Pipeline tags filter -> hf_tags.pipeline_tag (or pipeline_tag)
      if (Array.isArray(pipelineTags) && pipelineTags.length > 0) {
        const pipelineVal = String(model.hf_tags?.pipeline_tag || model.pipeline_tag || '').trim().toLowerCase();
        const modelPipelines = Array.isArray(model.pipelineTags) 
          ? model.pipelineTags.map(p => String(p).trim().toLowerCase()) 
          : [];
        const hasPipelineMatch = pipelineTags.some((tag) => {
          const t = String(tag).trim().toLowerCase();
          return pipelineVal === t || modelPipelines.includes(t);
        });
        if (!hasPipelineMatch) return false;
      }

      // 2. Family tags filter -> family
      if (Array.isArray(familyTags) && familyTags.length > 0) {
        const familyVal = String(model.family || model.model_family || '').trim().toLowerCase();
        const hasFamilyMatch = familyTags.some((tag) => 
          familyVal === String(tag).trim().toLowerCase()
        );
        if (!hasFamilyMatch) return false;
      }

      // 3. Architecture tags filter -> hf_tags.architecture / architecture_category
      if (Array.isArray(architectureTags) && architectureTags.length > 0) {
        const archCategory = String(model.architecture_category || '').trim().toLowerCase();
        const rawHfArch = model.hf_tags?.architecture;
        const hfArchs = Array.isArray(rawHfArch) 
          ? rawHfArch.map(a => String(a).trim().toLowerCase()) 
          : (rawHfArch ? [String(rawHfArch).trim().toLowerCase()] : []);
        const pytorchArch = String(model.pytorch_architecture || '').trim().toLowerCase();
        const archList = [archCategory, pytorchArch, ...hfArchs].filter(Boolean);

        const hasArchMatch = architectureTags.some((tag) => {
          const t = String(tag).trim().toLowerCase();
          return archList.includes(t);
        });
        if (!hasArchMatch) return false;
      }

      // 4. Weight tags filter -> weight_format
      if (Array.isArray(weightTags) && weightTags.length > 0) {
        const weightVal = String(model.weight_format || '').trim().toLowerCase();
        const modelWeights = Array.isArray(model.weightTags) 
          ? model.weightTags.map(w => String(w).trim().toLowerCase()) 
          : [];
        const hasWeightMatch = weightTags.some((tag) => {
          const t = String(tag).trim().toLowerCase();
          return weightVal === t || modelWeights.includes(t);
        });
        if (!hasWeightMatch) return false;
      }

      // 5. Safetensors file count range filter (safetensor_file_count converted safely to number)
      const count = this.getSafetensorCount(model);

      if (safetensorMin !== null && safetensorMin !== '' && !isNaN(Number(safetensorMin))) {
        if (count === null || count < Number(safetensorMin)) {
          return false;
        }
      }

      if (safetensorMax !== null && safetensorMax !== '' && !isNaN(Number(safetensorMax))) {
        if (count === null || count > Number(safetensorMax)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Extracts distinct categories dynamically from the real API data.
   * Generates available filter options from the API data (no hardcoded options).
   * @param {Array<Object>} models 
   * @returns {Object} facets map
   */
  extractFacets(models = []) {
    const pipelines = new Map();
    const families = new Map();
    const architectures = new Map();
    const weights = new Map();
    let minSafetensors = Infinity;
    let maxSafetensors = 0;

    models.forEach((m) => {
      // Pipeline tag -> hf_tags.pipeline_tag
      const pTag = m.hf_tags?.pipeline_tag || m.pipeline_tag;
      if (pTag && String(pTag).trim()) {
        const name = String(pTag).trim();
        pipelines.set(name, (pipelines.get(name) || 0) + 1);
      }

      // Family -> family
      if (m.family && String(m.family).trim()) {
        const name = String(m.family).trim();
        families.set(name, (families.get(name) || 0) + 1);
      }

      // Architecture -> hf_tags.architecture / architecture_category
      if (m.architecture_category && String(m.architecture_category).trim()) {
        const name = String(m.architecture_category).trim();
        architectures.set(name, (architectures.get(name) || 0) + 1);
      }
      const rawHfArch = m.hf_tags?.architecture;
      if (Array.isArray(rawHfArch)) {
        rawHfArch.forEach((a) => {
          if (a && String(a).trim()) {
            const name = String(a).trim();
            architectures.set(name, (architectures.get(name) || 0) + 1);
          }
        });
      } else if (rawHfArch && String(rawHfArch).trim()) {
        const name = String(rawHfArch).trim();
        architectures.set(name, (architectures.get(name) || 0) + 1);
      }

      // Weight -> weight_format
      if (m.weight_format && String(m.weight_format).trim()) {
        const name = String(m.weight_format).trim();
        weights.set(name, (weights.get(name) || 0) + 1);
      }

      // Safetensors count range
      const count = this.getSafetensorCount(m);
      if (count !== null) {
        if (count < minSafetensors) minSafetensors = count;
        if (count > maxSafetensors) maxSafetensors = count;
      }
    });

    return {
      pipelines: Array.from(pipelines.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
      families: Array.from(families.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
      architectures: Array.from(architectures.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
      weights: Array.from(weights.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
      safetensorRange: {
        min: minSafetensors === Infinity ? 0 : minSafetensors,
        max: maxSafetensors === 0 ? 32 : maxSafetensors
      }
    };
  }
}
