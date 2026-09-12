/**
 * Sage MCP Server — Schema Types Expansion (Phase 6, 15 tools)
 *
 * All schema.org JSON-LD generators: FAQ, HowTo, Event, Course, JobPosting,
 * Recipe, Review, Product, Video, NewsArticle, SoftwareApplication, Service,
 * Organization, Person, NLWeb aggregation.
 *
 * Every tool returns valid JSON-LD ready to inject into <head>.
 */
import type { ToolDef } from "./types";

export const schemaTypeTools: ToolDef[] = [
  {
    name: "sage.schema.faq",
    category: "Schema Types",
    description: "Generate FAQPage JSON-LD schema from a list of Q&A pairs. Wins featured snippets + PAA boxes.",
    inputSchema: {
      type: "object",
      properties: {
        faqs: { type: "array", items: { type: "object", properties: { question: { type: "string" }, answer: { type: "string" } }, required: ["question", "answer"] } },
      },
      required: ["faqs"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const faqs = (args.faqs as Array<{ question: string; answer: string }>) || [];
      const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      };
      return { schema, json: JSON.stringify(schema, null, 2), scriptTag: `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>` };
    },
  },
  {
    name: "sage.schema.howto",
    category: "Schema Types",
    description: "Generate HowTo JSON-LD schema from steps. Wins HowTo rich results.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        steps: { type: "array", items: { type: "object", properties: { name: { type: "string" }, text: { type: "string" }, imageUrl: { type: "string" } }, required: ["name"] } },
        totalTime: { type: "string", description: "ISO 8601 duration (e.g. PT30M)" },
        estimatedCost: { type: "string" },
        supply: { type: "array", items: { type: "string" } },
        tool: { type: "array", items: { type: "string" } },
      },
      required: ["name", "steps"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: String(args.name),
        step: (args.steps as Array<Record<string, unknown>>).map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text || s.name,
          ...(s.imageUrl ? { image: s.imageUrl } : {}),
        })),
      };
      if (args.description) schema.description = String(args.description);
      if (args.totalTime) schema.totalTime = String(args.totalTime);
      if (args.estimatedCost) schema.estimatedCost = { "@type": "MonetaryAmount", currency: "USD", value: args.estimatedCost };
      if (args.supply) schema.supply = (args.supply as string[]).map((s) => ({ "@type": "HowToSupply", name: s }));
      if (args.tool) schema.tool = (args.tool as string[]).map((t) => ({ "@type": "HowToTool", name: t }));
      return { schema, json: JSON.stringify(schema, null, 2) };
    },
  },
  {
    name: "sage.schema.event",
    category: "Schema Types",
    description: "Generate Event JSON-LD schema. Wins event rich results in SERP.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        startDate: { type: "string", description: "ISO 8601 (e.g. 2026-03-15T19:00)" },
        endDate: { type: "string" },
        location: { type: "object", properties: { name: { type: "string" }, address: { type: "string" } } },
        organizer: { type: "object", properties: { name: { type: "string" }, url: { type: "string" } } },
        offers: { type: "object", properties: { price: { type: "string" }, currency: { type: "string" }, availability: { type: "string" } } },
        image: { type: "string" },
        eventStatus: { type: "string", default: "EventScheduled" },
        eventAttendanceMode: { type: "string", default: "OfflineEventAttendanceMode" },
      },
      required: ["name", "startDate", "location"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: String(args.name),
        startDate: String(args.startDate),
        location: { "@type": "Place", name: (args.location as Record<string, string>)?.name, address: { "@type": "PostalAddress", streetAddress: (args.location as Record<string, string>)?.address } },
        eventStatus: `https://schema.org/${args.eventStatus || "EventScheduled"}`,
        eventAttendanceMode: `https://schema.org/${args.eventAttendanceMode || "OfflineEventAttendanceMode"}`,
      };
      if (args.description) schema.description = String(args.description);
      if (args.endDate) schema.endDate = String(args.endDate);
      if (args.image) schema.image = String(args.image);
      if (args.organizer) schema.organizer = { "@type": "Organization", ...(args.organizer as Record<string, string>) };
      if (args.offers) schema.offers = { "@type": "Offer", price: (args.offers as Record<string, string>).price, priceCurrency: (args.offers as Record<string, string>).currency || "USD", availability: `https://schema.org/${(args.offers as Record<string, string>).availability || "InStock"}` };
      return { schema, json: JSON.stringify(schema, null, 2) };
    },
  },
  {
    name: "sage.schema.course",
    category: "Schema Types",
    description: "Generate Course JSON-LD schema. Wins course rich results.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        provider: { type: "object", properties: { name: { type: "string" }, url: { type: "string" } } },
        image: { type: "string" },
        offers: { type: "object", properties: { price: { type: "string" }, currency: { type: "string" } } },
        hasCourseInstance: { type: "array", items: { type: "object", properties: { courseMode: { type: "string" }, startDate: { type: "string" } } } },
      },
      required: ["name", "description", "provider"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: String(args.name),
        description: String(args.description),
        provider: { "@type": "Organization", name: (args.provider as Record<string, string>).name, ...(args.provider as Record<string, string>).url ? { sameAs: (args.provider as Record<string, string>).url } : {} },
      };
      if (args.image) schema.image = String(args.image);
      if (args.offers) schema.offers = { "@type": "Offer", price: (args.offers as Record<string, string>).price, priceCurrency: (args.offers as Record<string, string>).currency || "USD" };
      if (args.hasCourseInstance) schema.hasCourseInstance = (args.hasCourseInstance as Array<Record<string, unknown>>).map((ci) => ({ "@type": "CourseInstance", courseMode: ci.courseMode || "Online", ...(ci.startDate ? { startDate: ci.startDate } : {}) }));
      return { schema, json: JSON.stringify(schema, null, 2) };
    },
  },
  {
    name: "sage.schema.jobposting",
    category: "Schema Types",
    description: "Generate JobPosting JSON-LD schema. Wins Google for Jobs listings.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string", description: "HTML description of the job" },
        hiringOrganization: { type: "object", properties: { name: { type: "string" }, logo: { type: "string" } } },
        jobLocation: { type: "object", properties: { address: { type: "string" }, city: { type: "string" }, region: { type: "string" } } },
        baseSalary: { type: "object", properties: { amount: { type: "number" }, currency: { type: "string" }, unit: { type: "string" } } },
        employmentType: { type: "string", default: "FULL_TIME" },
        datePosted: { type: "string" },
        validThrough: { type: "string" },
      },
      required: ["title", "description", "hiringOrganization", "jobLocation", "datePosted"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: String(args.title),
        description: String(args.description),
        hiringOrganization: { "@type": "Organization", name: (args.hiringOrganization as Record<string, string>).name, ...(args.hiringOrganization as Record<string, string>).logo ? { logo: (args.hiringOrganization as Record<string, string>).logo } : {} },
        jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", streetAddress: (args.jobLocation as Record<string, string>)?.address, addressLocality: (args.jobLocation as Record<string, string>)?.city, addressRegion: (args.jobLocation as Record<string, string>)?.region } },
        employmentType: String(args.employmentType || "FULL_TIME"),
        datePosted: String(args.datePosted),
      };
      if (args.validThrough) schema.validThrough = String(args.validThrough);
      if (args.baseSalary) schema.baseSalary = { "@type": "MonetaryAmount", currency: (args.baseSalary as Record<string, unknown>).currency as string || "USD", value: { "@type": "QuantitativeValue", value: (args.baseSalary as Record<string, unknown>).amount, unitText: (args.baseSalary as Record<string, unknown>).unit || "YEAR" } };
      return { schema, json: JSON.stringify(schema, null, 2) };
    },
  },
  {
    name: "sage.schema.recipe",
    category: "Schema Types",
    description: "Generate Recipe JSON-LD schema. Wins recipe rich results with images + ratings.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        image: { type: "string" },
        author: { type: "string" },
        prepTime: { type: "string", description: "ISO 8601 (PT15M)" },
        cookTime: { type: "string" },
        totalTime: { type: "string" },
        recipeYield: { type: "string", description: "e.g. '4 servings'" },
        ingredients: { type: "array", items: { type: "string" } },
        instructions: { type: "array", items: { type: "string" } },
        nutrition: { type: "object", properties: { calories: { type: "string" }, fatContent: { type: "string" } } },
        recipeCategory: { type: "string" },
        recipeCuisine: { type: "string" },
        keywords: { type: "string" },
      },
      required: ["name", "ingredients", "instructions"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        name: String(args.name),
        recipeIngredient: args.ingredients,
        recipeInstructions: (args.instructions as string[]).map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
      };
      if (args.description) schema.description = String(args.description);
      if (args.image) schema.image = String(args.image);
      if (args.author) schema.author = { "@type": "Person", name: String(args.author) };
      if (args.prepTime) schema.prepTime = String(args.prepTime);
      if (args.cookTime) schema.cookTime = String(args.cookTime);
      if (args.totalTime) schema.totalTime = String(args.totalTime);
      if (args.recipeYield) schema.recipeYield = String(args.recipeYield);
      if (args.recipeCategory) schema.recipeCategory = String(args.recipeCategory);
      if (args.recipeCuisine) schema.recipeCuisine = String(args.recipeCuisine);
      if (args.keywords) schema.keywords = String(args.keywords);
      return { schema, json: JSON.stringify(schema, null, 2) };
    },
  },
  {
    name: "sage.schema.review",
    category: "Schema Types",
    description: "Generate Review JSON-LD schema. Wins review rich results with star ratings.",
    inputSchema: {
      type: "object",
      properties: {
        itemReviewed: { type: "object", properties: { name: { type: "string" }, type: { type: "string", default: "Product" } } },
        reviewRating: { type: "object", properties: { ratingValue: { type: "number" }, bestRating: { type: "number", default: 5 } } },
        author: { type: "string" },
        publisher: { type: "string" },
        reviewBody: { type: "string" },
        datePublished: { type: "string" },
      },
      required: ["itemReviewed", "reviewRating", "author"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: { "@type": (args.itemReviewed as Record<string, unknown>).type || "Product", name: (args.itemReviewed as Record<string, unknown>).name },
        reviewRating: { "@type": "Rating", ratingValue: (args.reviewRating as Record<string, unknown>).ratingValue, bestRating: (args.reviewRating as Record<string, unknown>).bestRating || 5 },
        author: { "@type": "Person", name: String(args.author) },
      };
      if (args.publisher) schema.publisher = { "@type": "Organization", name: String(args.publisher) };
      if (args.reviewBody) schema.reviewBody = String(args.reviewBody);
      if (args.datePublished) schema.datePublished = String(args.datePublished);
      return { schema, json: JSON.stringify(schema, null, 2) };
    },
  },
  {
    name: "sage.schema.product",
    category: "Schema Types",
    description: "Generate Product JSON-LD schema with price, availability, reviews. Wins product rich results.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        image: { type: "string" },
        brand: { type: "string" },
        sku: { type: "string" },
        gtin: { type: "string", description: "GTIN-13/UPC/EAN" },
        mpn: { type: "string", description: "Manufacturer Part Number" },
        offers: { type: "object", properties: { price: { type: "number" }, currency: { type: "string" }, availability: { type: "string" }, url: { type: "string" } } },
        aggregateRating: { type: "object", properties: { ratingValue: { type: "number" }, reviewCount: { type: "number" } } },
      },
      required: ["name"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = { "@context": "https://schema.org", "@type": "Product", name: String(args.name) };
      if (args.description) schema.description = String(args.description);
      if (args.image) schema.image = String(args.image);
      if (args.brand) schema.brand = { "@type": "Brand", name: String(args.brand) };
      if (args.sku) schema.sku = String(args.sku);
      if (args.gtin) schema.gtin13 = String(args.gtin);
      if (args.mpn) schema.mpn = String(args.mpn);
      if (args.offers) schema.offers = { "@type": "Offer", price: (args.offers as Record<string, unknown>).price, priceCurrency: (args.offers as Record<string, unknown>).currency || "USD", availability: `https://schema.org/${(args.offers as Record<string, unknown>).availability || "InStock"}` };
      if (args.aggregateRating) schema.aggregateRating = { "@type": "AggregateRating", ratingValue: (args.aggregateRating as Record<string, unknown>).ratingValue, reviewCount: (args.aggregateRating as Record<string, unknown>).reviewCount };
      return { schema, json: JSON.stringify(schema, null, 2) };
    },
  },
  {
    name: "sage.schema.video",
    category: "Schema Types",
    description: "Generate VideoObject JSON-LD schema. Wins video rich results + Google Video search.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        thumbnailUrl: { type: "string" },
        uploadDate: { type: "string" },
        contentUrl: { type: "string", description: "Direct video file URL" },
        embedUrl: { type: "string", description: "Embed player URL (YouTube/Vimeo)" },
        duration: { type: "string", description: "ISO 8601 (PT5M30S)" },
        transcript: { type: "string" },
      },
      required: ["name", "thumbnailUrl", "uploadDate"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: String(args.name),
        thumbnailUrl: String(args.thumbnailUrl),
        uploadDate: String(args.uploadDate),
      };
      if (args.description) schema.description = String(args.description);
      if (args.contentUrl) schema.contentUrl = String(args.contentUrl);
      if (args.embedUrl) schema.embedUrl = String(args.embedUrl);
      if (args.duration) schema.duration = String(args.duration);
      if (args.transcript) schema.transcript = String(args.transcript);
      return { schema, json: JSON.stringify(schema, null, 2) };
    },
  },
  {
    name: "sage.schema.newsarticle",
    category: "Schema Types",
    description: "Generate NewsArticle JSON-LD schema. Required for Google News inclusion.",
    inputSchema: {
      type: "object",
      properties: {
        headline: { type: "string" },
        datePublished: { type: "string" },
        dateModified: { type: "string" },
        author: { type: "object", properties: { name: { type: "string" }, url: { type: "string" } } },
        publisher: { type: "object", properties: { name: { type: "string" }, logo: { type: "string" } } },
        image: { type: "string" },
        articleBody: { type: "string" },
        articleSection: { type: "string" },
        keywords: { type: "string" },
      },
      required: ["headline", "datePublished", "author", "publisher"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: String(args.headline),
        datePublished: String(args.datePublished),
        author: { "@type": "Person", name: (args.author as Record<string, string>).name, ...(args.author as Record<string, string>).url ? { url: (args.author as Record<string, string>).url } : {} },
        publisher: { "@type": "Organization", name: (args.publisher as Record<string, string>).name, ...(args.publisher as Record<string, string>).logo ? { logo: { "@type": "ImageObject", url: (args.publisher as Record<string, string>).logo } } : {} },
      };
      if (args.dateModified) schema.dateModified = String(args.dateModified);
      if (args.image) schema.image = String(args.image);
      if (args.articleBody) schema.articleBody = String(args.articleBody);
      if (args.articleSection) schema.articleSection = String(args.articleSection);
      if (args.keywords) schema.keywords = String(args.keywords);
      return { schema, json: JSON.stringify(schema, null, 2) };
    },
  },
  {
    name: "sage.schema.softwareapplication",
    category: "Schema Types",
    description: "Generate SoftwareApplication JSON-LD schema. For SaaS + app products.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        applicationCategory: { type: "string", default: "BusinessApplication" },
        operatingSystem: { type: "string", default: "Web" },
        offers: { type: "object", properties: { price: { type: "number" }, currency: { type: "string" } } },
        aggregateRating: { type: "object", properties: { ratingValue: { type: "number" }, reviewCount: { type: "number" } } },
        screenshot: { type: "string" },
        downloadUrl: { type: "string" },
      },
      required: ["name"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: String(args.name),
        applicationCategory: String(args.applicationCategory || "BusinessApplication"),
        operatingSystem: String(args.operatingSystem || "Web"),
      };
      if (args.description) schema.description = String(args.description);
      if (args.offers) schema.offers = { "@type": "Offer", price: (args.offers as Record<string, unknown>).price, priceCurrency: (args.offers as Record<string, unknown>).currency || "USD" };
      if (args.aggregateRating) schema.aggregateRating = { "@type": "AggregateRating", ratingValue: (args.aggregateRating as Record<string, unknown>).ratingValue, reviewCount: (args.aggregateRating as Record<string, unknown>).reviewCount };
      if (args.screenshot) schema.screenshot = String(args.screenshot);
      if (args.downloadUrl) schema.downloadUrl = String(args.downloadUrl);
      return { schema, json: JSON.stringify(schema, null, 2) };
    },
  },
  {
    name: "sage.schema.service",
    category: "Schema Types",
    description: "Generate Service JSON-LD schema. For service-based businesses.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        serviceType: { type: "string" },
        provider: { type: "object", properties: { name: { type: "string" }, url: { type: "string" } } },
        areaServed: { type: "string" },
        offers: { type: "object", properties: { price: { type: "number" }, currency: { type: "string" } } },
        description: { type: "string" },
      },
      required: ["name", "serviceType", "provider"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: String(args.name),
        serviceType: String(args.serviceType),
        provider: { "@type": "Organization", name: (args.provider as Record<string, string>).name, ...(args.provider as Record<string, string>).url ? { url: (args.provider as Record<string, string>).url } : {} },
      };
      if (args.areaServed) schema.areaServed = String(args.areaServed);
      if (args.description) schema.description = String(args.description);
      if (args.offers) schema.offers = { "@type": "Offer", price: (args.offers as Record<string, unknown>).price, priceCurrency: (args.offers as Record<string, unknown>).currency || "USD" };
      return { schema, json: JSON.stringify(schema, null, 2) };
    },
  },
  {
    name: "sage.schema.organization",
    category: "Schema Types",
    description: "Generate Organization JSON-LD schema. For Knowledge Graph eligibility.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        url: { type: "string" },
        logo: { type: "string" },
        description: { type: "string" },
        sameAs: { type: "array", items: { type: "string" }, description: "Social profile URLs" },
        contactPoint: { type: "array", items: { type: "object", properties: { phone: { type: "string" }, email: { type: "string" }, contactType: { type: "string" } } } },
        address: { type: "object", properties: { street: { type: "string" }, city: { type: "string" }, region: { type: "string" }, postalCode: { type: "string" }, country: { type: "string" } } },
      },
      required: ["name", "url"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = { "@context": "https://schema.org", "@type": "Organization", name: String(args.name), url: String(args.url) };
      if (args.logo) schema.logo = { "@type": "ImageObject", url: String(args.logo) };
      if (args.description) schema.description = String(args.description);
      if (args.sameAs) schema.sameAs = args.sameAs;
      if (args.contactPoint) schema.contactPoint = (args.contactPoint as Array<Record<string, string>>).map((cp) => ({ "@type": "ContactPoint", telephone: cp.phone, email: cp.email, contactType: cp.contactType || "customer support" }));
      if (args.address) {
        const a = args.address as Record<string, string>;
        schema.address = { "@type": "PostalAddress", streetAddress: a.street, addressLocality: a.city, addressRegion: a.region, postalCode: a.postalCode, addressCountry: a.country };
      }
      return { schema, json: JSON.stringify(schema, null, 2) };
    },
  },
  {
    name: "sage.schema.person",
    category: "Schema Types",
    description: "Generate Person JSON-LD schema. For author E-E-A-T + Knowledge Graph.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        jobTitle: { type: "string" },
        url: { type: "string" },
        image: { type: "string" },
        email: { type: "string" },
        sameAs: { type: "array", items: { type: "string" } },
        knowsAbout: { type: "array", items: { type: "string" } },
        worksFor: { type: "string" },
        description: { type: "string" },
      },
      required: ["name"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schema: Record<string, unknown> = { "@context": "https://schema.org", "@type": "Person", name: String(args.name) };
      if (args.jobTitle) schema.jobTitle = String(args.jobTitle);
      if (args.url) schema.url = String(args.url);
      if (args.image) schema.image = String(args.image);
      if (args.email) schema.email = String(args.email);
      if (args.sameAs) schema.sameAs = args.sameAs;
      if (args.knowsAbout) schema.knowsAbout = args.knowsAbout;
      if (args.worksFor) schema.worksFor = { "@type": "Organization", name: String(args.worksFor) };
      if (args.description) schema.description = String(args.description);
      return { schema, json: JSON.stringify(schema, null, 2) };
    },
  },
  {
    name: "sage.schema.nlweb.aggregate",
    category: "Schema Types",
    description: "Aggregate multiple schema.org JSON-LD documents into a single NLWeb-ready graph. Deduplicates + produces one @graph array for AI agents.",
    inputSchema: {
      type: "object",
      properties: {
        schemas: { type: "array", items: { type: "object" }, description: "Array of JSON-LD objects to aggregate" },
      },
      required: ["schemas"],
      additionalProperties: false,
    },
    readOnly: true,
    handler: async (args) => {
      const schemas = (args.schemas as Array<Record<string, unknown>>) || [];
      // Deduplicate by @type + name/url/id
      const seen = new Set<string>();
      const deduped = schemas.filter((s) => {
        const key = `${s["@type"]}_${s.name || s.url || s.id || JSON.stringify(s)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const aggregated = {
        "@context": "https://schema.org",
        "@graph": deduped,
        "nlweb:aggregated": true,
        "nlweb:version": "1.0",
        "nlweb:generatedAt": new Date().toISOString(),
      };

      return {
        original: schemas.length,
        deduplicated: deduped.length,
        removed: schemas.length - deduped.length,
        schema: aggregated,
        json: JSON.stringify(aggregated, null, 2),
        scriptTag: `<script type="application/ld+json">\n${JSON.stringify(aggregated, null, 2)}\n</script>`,
        nlwebReady: true,
        publishInstructions: "Inject this single script tag in <head>. AI agents (ChatGPT, Perplexity) can read the entire graph in one request.",
      };
    },
  },
];
