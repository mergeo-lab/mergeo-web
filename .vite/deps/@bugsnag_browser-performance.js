import "./chunk-G3PMV62Z.js";

// node_modules/@bugsnag/core-performance/dist/custom-attribute-limits.js
var ATTRIBUTE_KEY_LENGTH_LIMIT = 128;
var ATTRIBUTE_STRING_VALUE_LIMIT_DEFAULT = 1024;
var ATTRIBUTE_STRING_VALUE_LIMIT_MAX = 1e4;
var ATTRIBUTE_ARRAY_LENGTH_LIMIT_DEFAULT = 1e3;
var ATTRIBUTE_ARRAY_LENGTH_LIMIT_MAX = 1e4;
var ATTRIBUTE_COUNT_LIMIT_DEFAULT = 128;
var ATTRIBUTE_COUNT_LIMIT_MAX = 1e3;
var defaultSpanAttributeLimits = {
  attributeStringValueLimit: ATTRIBUTE_STRING_VALUE_LIMIT_DEFAULT,
  attributeArrayLengthLimit: ATTRIBUTE_ARRAY_LENGTH_LIMIT_DEFAULT,
  attributeCountLimit: ATTRIBUTE_COUNT_LIMIT_DEFAULT
};
var defaultResourceAttributeLimits = {
  attributeStringValueLimit: Infinity,
  attributeArrayLengthLimit: Infinity,
  attributeCountLimit: Infinity
};

// node_modules/@bugsnag/core-performance/dist/validation.js
var isBoolean = (value) => value === true || value === false;
var isObject = (value) => !!value && typeof value === "object" && !Array.isArray(value);
var isNumber = (value) => typeof value === "number" && Number.isFinite(value) && !Number.isNaN(value);
var isString = (value) => typeof value === "string";
var isStringWithLength = (value) => isString(value) && value.length > 0;
var isLogger = (value) => isObject(value) && typeof value.debug === "function" && typeof value.info === "function" && typeof value.warn === "function" && typeof value.error === "function";
var isStringArray = (value) => Array.isArray(value) && value.every(isStringWithLength);
var isStringOrRegExpArray = (value) => Array.isArray(value) && value.every((item) => isStringWithLength(item) || item instanceof RegExp);
function isPersistedProbability(value) {
  return isObject(value) && isNumber(value.value) && isNumber(value.time);
}
var isSpanContext = (value) => isObject(value) && typeof value.id === "string" && typeof value.traceId === "string" && typeof value.isValid === "function";
var isParentContext = (value) => isObject(value) && typeof value.id === "string" && typeof value.traceId === "string";
function isTime(value) {
  return isNumber(value) || value instanceof Date;
}
function isPlugin(value) {
  return isObject(value) && typeof value.configure === "function";
}
function isPluginArray(value) {
  return Array.isArray(value) && value.every((plugin) => isPlugin(plugin));
}
function isOnSpanEndCallbacks(value) {
  return Array.isArray(value) && value.every((method) => typeof method === "function");
}

// node_modules/@bugsnag/core-performance/dist/attributes.js
function truncateString(value, limit) {
  const originalLength = value.length;
  const newString = value.slice(0, limit);
  const truncatedLength = newString.length;
  return `${newString} *** ${originalLength - truncatedLength} CHARS TRUNCATED`;
}
var SpanAttributes = class {
  get droppedAttributesCount() {
    return this._droppedAttributesCount;
  }
  constructor(initialValues, spanAttributeLimits, spanName, logger) {
    this._droppedAttributesCount = 0;
    this.attributes = initialValues;
    this.spanAttributeLimits = spanAttributeLimits;
    this.spanName = spanName;
    this.logger = logger;
  }
  validateAttribute(name, value) {
    if (typeof value === "string" && value.length > this.spanAttributeLimits.attributeStringValueLimit) {
      this.attributes.set(name, truncateString(value, this.spanAttributeLimits.attributeStringValueLimit));
      this.logger.warn(`Span attribute ${name} in span ${this.spanName} was truncated as the string exceeds the ${this.spanAttributeLimits.attributeStringValueLimit} character limit set by attributeStringValueLimit.`);
    }
    if (Array.isArray(value) && value.length > this.spanAttributeLimits.attributeArrayLengthLimit) {
      const truncatedValue = value.slice(0, this.spanAttributeLimits.attributeArrayLengthLimit);
      this.attributes.set(name, truncatedValue);
      this.logger.warn(`Span attribute ${name} in span ${this.spanName} was truncated as the array exceeds the ${this.spanAttributeLimits.attributeArrayLengthLimit} element limit set by attributeArrayLengthLimit.`);
    }
  }
  set(name, value) {
    if (typeof name === "string" && (typeof value === "string" || typeof value === "boolean" || isNumber(value) || Array.isArray(value))) {
      this.attributes.set(name, value);
    }
  }
  // Used by the public API to set custom attributes
  setCustom(name, value) {
    if (typeof name === "string" && (typeof value === "string" || typeof value === "boolean" || isNumber(value) || Array.isArray(value))) {
      if (!this.attributes.has(name) && this.attributes.size >= this.spanAttributeLimits.attributeCountLimit) {
        this._droppedAttributesCount++;
        this.logger.warn(`Span attribute ${name} in span ${this.spanName} was dropped as the number of attributes exceeds the ${this.spanAttributeLimits.attributeCountLimit} attribute limit set by attributeCountLimit.`);
        return;
      }
      if (name.length > ATTRIBUTE_KEY_LENGTH_LIMIT) {
        this._droppedAttributesCount++;
        this.logger.warn(`Span attribute ${name} in span ${this.spanName} was dropped as the key length exceeds the ${ATTRIBUTE_KEY_LENGTH_LIMIT} character fixed limit.`);
        return;
      }
      this.attributes.set(name, value);
    }
  }
  remove(name) {
    this.attributes.delete(name);
  }
  toJson() {
    Array.from(this.attributes).forEach(([key, value]) => {
      this.validateAttribute(key, value);
    });
    return Array.from(this.attributes).map(([key, value]) => attributeToJson(key, value));
  }
  toObject() {
    return Object.fromEntries(this.attributes);
  }
};
var ResourceAttributes = class extends SpanAttributes {
  constructor(releaseStage, appVersion, serviceName, sdkName, sdkVersion, logger) {
    const initialValues = /* @__PURE__ */ new Map([
      ["deployment.environment", releaseStage],
      ["telemetry.sdk.name", sdkName],
      ["telemetry.sdk.version", sdkVersion],
      ["service.name", serviceName]
    ]);
    if (appVersion.length > 0) {
      initialValues.set("service.version", appVersion);
    }
    super(initialValues, defaultResourceAttributeLimits, "resource-attributes", logger);
  }
};
function getJsonAttributeValue(value) {
  switch (typeof value) {
    case "number":
      if (Number.isNaN(value) || !Number.isFinite(value)) {
        return void 0;
      }
      if (Number.isInteger(value)) {
        return { intValue: `${value}` };
      }
      return { doubleValue: value };
    case "boolean":
      return { boolValue: value };
    case "string":
      return { stringValue: value };
  }
}
function getJsonArrayAttributeValue(attributeArray) {
  return attributeArray.map((value) => getJsonAttributeValue(value)).filter((value) => typeof value !== "undefined");
}
function attributeToJson(key, attribute) {
  switch (typeof attribute) {
    case "number":
      if (Number.isNaN(attribute) || !Number.isFinite(attribute)) {
        return void 0;
      }
      if (key !== "bugsnag.sampling.p" && Number.isInteger(attribute)) {
        return { key, value: { intValue: `${attribute}` } };
      }
      return { key, value: { doubleValue: attribute } };
    case "boolean":
      return { key, value: { boolValue: attribute } };
    case "string":
      return { key, value: { stringValue: attribute } };
    case "object":
      if (Array.isArray(attribute)) {
        const arrayValues = getJsonArrayAttributeValue(attribute);
        return { key, value: { arrayValue: arrayValues.length > 0 ? { values: arrayValues } : {} } };
      }
      return void 0;
    default:
      return void 0;
  }
}

// node_modules/@bugsnag/core-performance/dist/clock.js
var NANOSECONDS_IN_MILLISECONDS = 1e6;
function millisecondsToNanoseconds(milliseconds) {
  return Math.round(milliseconds * NANOSECONDS_IN_MILLISECONDS);
}

// node_modules/@bugsnag/core-performance/dist/config.js
var schema = {
  appVersion: {
    defaultValue: "",
    message: "should be a string",
    validate: isStringWithLength
  },
  endpoint: {
    defaultValue: "https://otlp.bugsnag.com/v1/traces",
    message: "should be a string",
    validate: isStringWithLength
  },
  apiKey: {
    defaultValue: "",
    message: "should be a 32 character hexadecimal string",
    validate: (value) => isString(value) && /^[a-f0-9]{32}$/.test(value)
  },
  logger: {
    defaultValue: {
      debug(message) {
        console.debug(message);
      },
      info(message) {
        console.info(message);
      },
      warn(message) {
        console.warn(message);
      },
      error(message) {
        console.error(message);
      }
    },
    message: "should be a Logger object",
    validate: isLogger
  },
  releaseStage: {
    defaultValue: "production",
    message: "should be a string",
    validate: isStringWithLength
  },
  enabledReleaseStages: {
    defaultValue: null,
    message: "should be an array of strings",
    validate: (value) => value === null || isStringArray(value)
  },
  plugins: {
    defaultValue: [],
    message: "should be an array of plugin objects",
    validate: isPluginArray
  },
  bugsnag: {
    defaultValue: void 0,
    message: "should be an instance of Bugsnag",
    validate: (value) => isObject(value) && typeof value.addOnError === "function"
  },
  samplingProbability: {
    defaultValue: void 0,
    message: "should be a number between 0 and 1",
    validate: (value) => value === void 0 || isNumber(value) && value >= 0 && value <= 1
  },
  onSpanEnd: {
    defaultValue: void 0,
    message: "should be an array of functions",
    validate: isOnSpanEndCallbacks
  },
  attributeStringValueLimit: {
    defaultValue: ATTRIBUTE_STRING_VALUE_LIMIT_DEFAULT,
    message: `should be a number between 1 and ${ATTRIBUTE_STRING_VALUE_LIMIT_MAX}`,
    validate: (value) => isNumber(value) && value > 0 && value <= ATTRIBUTE_STRING_VALUE_LIMIT_MAX
  },
  attributeArrayLengthLimit: {
    defaultValue: ATTRIBUTE_ARRAY_LENGTH_LIMIT_DEFAULT,
    message: `should be a number between 1 and ${ATTRIBUTE_ARRAY_LENGTH_LIMIT_MAX}`,
    validate: (value) => isNumber(value) && value > 0 && value <= ATTRIBUTE_ARRAY_LENGTH_LIMIT_MAX
  },
  attributeCountLimit: {
    defaultValue: ATTRIBUTE_COUNT_LIMIT_DEFAULT,
    message: `should be a number between 1 and ${ATTRIBUTE_COUNT_LIMIT_MAX}`,
    validate: (value) => isNumber(value) && value > 0 && value <= ATTRIBUTE_COUNT_LIMIT_MAX
  }
};
function validateConfig(config, schema2) {
  if (typeof config === "string") {
    config = { apiKey: config };
  }
  if (!isObject(config) || !isString(config.apiKey) || config.apiKey.length === 0) {
    throw new Error("No Bugsnag API Key set");
  }
  let warnings = "";
  const cleanConfiguration = {};
  for (const option of Object.keys(schema2)) {
    if (Object.prototype.hasOwnProperty.call(config, option)) {
      if (schema2[option].validate(config[option])) {
        cleanConfiguration[option] = config[option];
      } else {
        warnings += `
  - ${option} ${schema2[option].message}, got ${typeof config[option]}`;
        cleanConfiguration[option] = schema2[option].defaultValue;
      }
    } else {
      cleanConfiguration[option] = schema2[option].defaultValue;
    }
  }
  cleanConfiguration.apiKey = config.apiKey;
  cleanConfiguration.maximumBatchSize = config.maximumBatchSize || 100;
  cleanConfiguration.batchInactivityTimeoutMs = config.batchInactivityTimeoutMs || 30 * 1e3;
  if (warnings.length > 0) {
    cleanConfiguration.logger.warn(`Invalid configuration${warnings}`);
  }
  return cleanConfiguration;
}

// node_modules/@bugsnag/core-performance/dist/events.js
var SpanEvents = class {
  constructor() {
    this.events = [];
  }
  add(name, time) {
    this.events.push({ name, time });
  }
  toJson(clock) {
    return this.events.map(({ name, time }) => ({ name, timeUnixNano: clock.toUnixTimestampNanoseconds(time) }));
  }
};

// node_modules/@bugsnag/core-performance/dist/trace-id-to-sampling-rate.js
function traceIdToSamplingRate(traceId) {
  let samplingRate = 0;
  for (let i = 0; i < traceId.length / 8; i++) {
    const position = i * 8;
    const segment = Number.parseInt(traceId.slice(position, position + 8), 16);
    samplingRate = (samplingRate ^ segment) >>> 0;
  }
  return samplingRate;
}

// node_modules/@bugsnag/core-performance/dist/span.js
var HOUR_IN_MILLISECONDS = 60 * 60 * 1e3;
function spanToJson(span, clock) {
  return {
    name: span.name,
    kind: span.kind,
    spanId: span.id,
    traceId: span.traceId,
    parentSpanId: span.parentSpanId,
    ...span.attributes.droppedAttributesCount > 0 ? { droppedAttributesCount: span.attributes.droppedAttributesCount } : {},
    startTimeUnixNano: clock.toUnixTimestampNanoseconds(span.startTime),
    endTimeUnixNano: clock.toUnixTimestampNanoseconds(span.endTime),
    attributes: span.attributes.toJson(),
    events: span.events.toJson(clock)
  };
}
function spanEndedToSpan(span) {
  return {
    get id() {
      return span.id;
    },
    get traceId() {
      return span.traceId;
    },
    get samplingRate() {
      return span.samplingRate;
    },
    get name() {
      return span.name;
    },
    isValid: () => false,
    end: () => {
    },
    // no-op
    setAttribute: (name, value) => {
      span.attributes.setCustom(name, value);
    }
  };
}
async function runSpanEndCallbacks(spanEnded, logger, callbacks) {
  if (!callbacks)
    return true;
  const span = spanEndedToSpan(spanEnded);
  const callbackStartTime = performance.now();
  let shouldSample = true;
  for (const callback of callbacks) {
    try {
      let result = callback(span);
      if (typeof result.then === "function") {
        result = await result;
      }
      if (result === false) {
        shouldSample = false;
        break;
      }
    } catch (err) {
      logger.error("Error in onSpanEnd callback: " + err);
    }
  }
  if (shouldSample) {
    const duration = millisecondsToNanoseconds(performance.now() - callbackStartTime);
    span.setAttribute("bugsnag.span.callbacks_duration", duration);
  }
  return shouldSample;
}
var SpanInternal = class {
  constructor(id, traceId, name, startTime2, attributes, clock, parentSpanId) {
    this.kind = 3;
    this.events = new SpanEvents();
    this.id = id;
    this.traceId = traceId;
    this.parentSpanId = parentSpanId;
    this.name = name;
    this.startTime = startTime2;
    this.attributes = attributes;
    this.samplingRate = traceIdToSamplingRate(this.traceId);
    this.clock = clock;
  }
  addEvent(name, time) {
    this.events.add(name, time);
  }
  setAttribute(name, value) {
    this.attributes.set(name, value);
  }
  setCustomAttribute(name, value) {
    this.attributes.setCustom(name, value);
  }
  end(endTime, samplingProbability) {
    this.endTime = endTime;
    let _samplingProbability = samplingProbability;
    this.attributes.set("bugsnag.sampling.p", _samplingProbability.raw);
    return {
      id: this.id,
      name: this.name,
      kind: this.kind,
      traceId: this.traceId,
      startTime: this.startTime,
      attributes: this.attributes,
      events: this.events,
      samplingRate: this.samplingRate,
      endTime,
      get samplingProbability() {
        return _samplingProbability;
      },
      set samplingProbability(samplingProbability2) {
        _samplingProbability = samplingProbability2;
        this.attributes.set("bugsnag.sampling.p", _samplingProbability.raw);
      },
      parentSpanId: this.parentSpanId
    };
  }
  isValid() {
    return this.endTime === void 0 && this.startTime > this.clock.now() - HOUR_IN_MILLISECONDS;
  }
};
var coreSpanOptionSchema = {
  startTime: {
    message: "should be a number or Date",
    getDefaultValue: () => void 0,
    validate: isTime
  },
  parentContext: {
    message: "should be a SpanContext",
    getDefaultValue: () => void 0,
    validate: (value) => value === null || isSpanContext(value)
  },
  makeCurrentContext: {
    message: "should be true|false",
    getDefaultValue: () => void 0,
    validate: isBoolean
  },
  isFirstClass: {
    message: "should be true|false",
    getDefaultValue: () => void 0,
    validate: isBoolean
  }
};

// node_modules/@bugsnag/core-performance/dist/batch-processor.js
var BatchProcessor = class {
  constructor(delivery, configuration, retryQueue, sampler, probabilityManager, encoder) {
    this.spans = [];
    this.timeout = null;
    this.flushQueue = Promise.resolve();
    this.delivery = delivery;
    this.configuration = configuration;
    this.retryQueue = retryQueue;
    this.sampler = sampler;
    this.probabilityManager = probabilityManager;
    this.encoder = encoder;
    this.flush = this.flush.bind(this);
  }
  stop() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
  start() {
    this.stop();
    this.timeout = setTimeout(this.flush, this.configuration.batchInactivityTimeoutMs);
  }
  add(span) {
    if (this.configuration.enabledReleaseStages && !this.configuration.enabledReleaseStages.includes(this.configuration.releaseStage)) {
      return;
    }
    this.spans.push(span);
    if (this.spans.length >= this.configuration.maximumBatchSize) {
      this.flush();
    } else {
      this.start();
    }
  }
  async flush() {
    this.stop();
    this.flushQueue = this.flushQueue.then(async () => {
      const batch = await this.prepareBatch();
      if (!batch) {
        return;
      }
      const payload = await this.encoder.encode(batch);
      const batchTime = Date.now();
      try {
        const response = await this.delivery.send(payload);
        if (response.samplingProbability !== void 0) {
          this.probabilityManager.setProbability(response.samplingProbability);
        }
        switch (response.state) {
          case "success":
            this.retryQueue.flush();
            break;
          case "failure-discard":
            this.configuration.logger.warn("delivery failed");
            break;
          case "failure-retryable":
            this.configuration.logger.info("delivery failed, adding to retry queue");
            this.retryQueue.add(payload, batchTime);
            break;
          default:
            response.state;
        }
      } catch (err) {
        this.configuration.logger.warn("delivery failed");
      }
    });
    await this.flushQueue;
  }
  async prepareBatch() {
    if (this.spans.length === 0) {
      return;
    }
    await this.probabilityManager.ensureFreshProbability();
    const batch = [];
    const probability = this.sampler.spanProbability;
    for (const span of this.spans) {
      if (span.samplingProbability.raw > probability.raw) {
        span.samplingProbability = probability;
      }
      if (this.sampler.sample(span)) {
        const shouldAddToBatch = await runSpanEndCallbacks(span, this.configuration.logger, this.configuration.onSpanEnd);
        if (shouldAddToBatch)
          batch.push(span);
      }
    }
    this.spans = [];
    if (batch.length === 0) {
      return;
    }
    return batch;
  }
};

// node_modules/@bugsnag/core-performance/dist/delivery.js
var TracePayloadEncoder = class {
  constructor(clock, configuration, resourceAttributeSource) {
    this.clock = clock;
    this.configuration = configuration;
    this.resourceAttributeSource = resourceAttributeSource;
  }
  async encode(spans) {
    const resourceAttributes = await this.resourceAttributeSource(this.configuration);
    const jsonSpans = Array(spans.length);
    for (let i = 0; i < spans.length; ++i) {
      jsonSpans[i] = spanToJson(spans[i], this.clock);
    }
    const deliveryPayload = {
      resourceSpans: [
        {
          resource: { attributes: resourceAttributes.toJson() },
          scopeSpans: [{ spans: jsonSpans }]
        }
      ]
    };
    return {
      body: deliveryPayload,
      headers: {
        "Bugsnag-Api-Key": this.configuration.apiKey,
        "Content-Type": "application/json",
        // Do not set 'Bugsnag-Span-Sampling' if the SDK is configured with samplingProbability
        ...this.configuration.samplingProbability !== void 0 ? {} : { "Bugsnag-Span-Sampling": this.generateSamplingHeader(spans) }
      }
    };
  }
  generateSamplingHeader(spans) {
    if (spans.length === 0) {
      return "1:0";
    }
    const spanCounts = /* @__PURE__ */ Object.create(null);
    for (const span of spans) {
      const existingValue = spanCounts[span.samplingProbability.raw] || 0;
      spanCounts[span.samplingProbability.raw] = existingValue + 1;
    }
    const rawProbabilities = Object.keys(spanCounts);
    const pairs = Array(rawProbabilities.length);
    for (let i = 0; i < rawProbabilities.length; ++i) {
      const rawProbability = rawProbabilities[i];
      pairs[i] = `${rawProbability}:${spanCounts[rawProbability]}`;
    }
    return pairs.join(";");
  }
};
var retryCodes = /* @__PURE__ */ new Set([402, 407, 408, 429]);
function responseStateFromStatusCode(statusCode) {
  if (statusCode >= 200 && statusCode < 300) {
    return "success";
  }
  if (statusCode >= 400 && statusCode < 500 && !retryCodes.has(statusCode)) {
    return "failure-discard";
  }
  return "failure-retryable";
}

// node_modules/@bugsnag/core-performance/dist/fixed-probability-manager.js
var FixedProbabilityManager = class _FixedProbabilityManager {
  static async create(sampler, samplingProbability) {
    sampler.probability = samplingProbability;
    return new _FixedProbabilityManager(sampler, samplingProbability);
  }
  constructor(sampler, samplingProbability) {
    this.sampler = sampler;
    this.samplingProbability = samplingProbability;
  }
  setProbability(newProbability) {
    return Promise.resolve();
  }
  ensureFreshProbability() {
    return Promise.resolve();
  }
};

// node_modules/@bugsnag/core-performance/dist/probability-fetcher.js
var RETRY_MILLISECONDS = 30 * 1e3;
var ProbabilityFetcher = class {
  constructor(delivery, apiKey) {
    this.delivery = delivery;
    this.payload = {
      body: { resourceSpans: [] },
      headers: {
        "Bugsnag-Api-Key": apiKey,
        "Content-Type": "application/json",
        "Bugsnag-Span-Sampling": "1.0:0"
      }
    };
  }
  async getNewProbability() {
    while (true) {
      const response = await this.delivery.send(this.payload);
      if (response.samplingProbability !== void 0) {
        return response.samplingProbability;
      }
      await this.timeBetweenRetries();
    }
  }
  timeBetweenRetries() {
    return new Promise((resolve) => {
      setTimeout(resolve, RETRY_MILLISECONDS);
    });
  }
};

// node_modules/@bugsnag/core-performance/dist/probability-manager.js
var PROBABILITY_REFRESH_MILLISECONDS = 24 * 60 * 60 * 1e3;
var ProbabilityManager = class _ProbabilityManager {
  static async create(persistence, sampler, probabilityFetcher) {
    const persistedProbability = await persistence.load("bugsnag-sampling-probability");
    let initialProbabilityTime;
    if (persistedProbability === void 0) {
      sampler.probability = 1;
      initialProbabilityTime = 0;
    } else if (persistedProbability.time < Date.now() - PROBABILITY_REFRESH_MILLISECONDS) {
      sampler.probability = persistedProbability.value;
      initialProbabilityTime = persistedProbability.time;
    } else {
      sampler.probability = persistedProbability.value;
      initialProbabilityTime = persistedProbability.time;
    }
    return new _ProbabilityManager(persistence, sampler, probabilityFetcher, initialProbabilityTime);
  }
  constructor(persistence, sampler, probabilityFetcher, initialProbabilityTime) {
    this.outstandingFreshnessCheck = void 0;
    this.persistence = persistence;
    this.sampler = sampler;
    this.probabilityFetcher = probabilityFetcher;
    this.lastProbabilityTime = initialProbabilityTime;
    this.ensureFreshProbability();
  }
  setProbability(newProbability) {
    this.lastProbabilityTime = Date.now();
    this.sampler.probability = newProbability;
    return this.persistence.save("bugsnag-sampling-probability", {
      value: newProbability,
      time: this.lastProbabilityTime
    });
  }
  /**
   * Ensure that the current probability value is fresh, i.e. it is less than 24
   * hours old
   *
   * If the probability value is stale then this method will fetch a fresh one
   *
   * This method is idempotent; calling it while there is already an outstanding
   * probability request will not create a second request
   */
  ensureFreshProbability() {
    if (this.outstandingFreshnessCheck) {
      return this.outstandingFreshnessCheck;
    }
    if (Date.now() - this.lastProbabilityTime >= PROBABILITY_REFRESH_MILLISECONDS) {
      this.outstandingFreshnessCheck = this.probabilityFetcher.getNewProbability().then((probability) => {
        this.setProbability(probability);
        this.outstandingFreshnessCheck = void 0;
      });
      return this.outstandingFreshnessCheck;
    }
    return Promise.resolve();
  }
};

// node_modules/@bugsnag/core-performance/dist/processor.js
var BufferingProcessor = class {
  constructor() {
    this.spans = [];
  }
  add(span) {
    this.spans.push(span);
  }
};

// node_modules/@bugsnag/core-performance/dist/sampler.js
function scaleProbabilityToMatchSamplingRate(probability) {
  return Math.floor(probability * 4294967295);
}
var Sampler = class {
  constructor(initialProbability) {
    this._probability = initialProbability;
    this.scaledProbability = scaleProbabilityToMatchSamplingRate(initialProbability);
  }
  /**
   * The global probability value: a number between 0 & 1
   */
  get probability() {
    return this._probability;
  }
  set probability(probability) {
    this._probability = probability;
    this.scaledProbability = scaleProbabilityToMatchSamplingRate(probability);
  }
  /**
   * The probability value for spans: a number between 0 & 2^32 - 1
   *
   * This is necessary because span sampling rates are generated as unsigned 32
   * bit integers. We scale the global probability value to match that range, so
   * that we can use a simple calculation in 'sample'
   *
   * @see scaleProbabilityToMatchSamplingRate
   */
  get spanProbability() {
    return {
      raw: this._probability,
      scaled: this.scaledProbability
    };
  }
  sample(span) {
    return span.samplingRate <= span.samplingProbability.scaled;
  }
  shouldSample(samplingRate) {
    return samplingRate <= this.spanProbability.scaled;
  }
};

// node_modules/@bugsnag/core-performance/dist/span-context.js
function spanContextEquals(span1, span2) {
  if (span1 === span2)
    return true;
  if (span1 !== void 0 && span2 !== void 0) {
    return span1.id === span2.id && span1.traceId === span2.traceId;
  }
  return false;
}
var DefaultSpanContextStorage = class {
  constructor(backgroundingListener, contextStack = []) {
    this.isInForeground = true;
    this.onBackgroundStateChange = (state) => {
      this.isInForeground = state === "in-foreground";
      this.contextStack.length = 0;
    };
    this.contextStack = contextStack;
    backgroundingListener.onStateChange(this.onBackgroundStateChange);
  }
  *[Symbol.iterator]() {
    for (let i = this.contextStack.length - 1; i >= 0; --i) {
      yield this.contextStack[i];
    }
  }
  push(context) {
    if (context.isValid() && this.isInForeground) {
      this.contextStack.push(context);
    }
  }
  pop(context) {
    if (spanContextEquals(context, this.current)) {
      this.contextStack.pop();
    }
    this.removeClosedContexts();
  }
  get first() {
    this.removeClosedContexts();
    return this.contextStack.length > 0 ? this.contextStack[0] : void 0;
  }
  get current() {
    this.removeClosedContexts();
    return this.contextStack.length > 0 ? this.contextStack[this.contextStack.length - 1] : void 0;
  }
  removeClosedContexts() {
    while (this.contextStack.length > 0 && this.contextStack[this.contextStack.length - 1].isValid() === false) {
      this.contextStack.pop();
    }
  }
};

// node_modules/@bugsnag/core-performance/dist/time.js
function timeToNumber(clock, time) {
  if (isNumber(time)) {
    return time;
  }
  if (time instanceof Date) {
    return clock.convert(time);
  }
  return clock.now();
}

// node_modules/@bugsnag/core-performance/dist/span-factory.js
var DISCARD_END_TIME = -1;
var SpanFactory = class {
  constructor(processor, sampler, idGenerator2, spanAttributesSource, clock, backgroundingListener, logger, spanContextStorage) {
    this.spanAttributeLimits = defaultSpanAttributeLimits;
    this.openSpans = /* @__PURE__ */ new WeakSet();
    this.isInForeground = true;
    this.onBackgroundStateChange = (state) => {
      this.isInForeground = state === "in-foreground";
      this.openSpans = /* @__PURE__ */ new WeakSet();
    };
    this.processor = processor;
    this.sampler = sampler;
    this.idGenerator = idGenerator2;
    this.spanAttributesSource = spanAttributesSource;
    this.clock = clock;
    this.logger = logger;
    this.spanContextStorage = spanContextStorage;
    backgroundingListener.onStateChange(this.onBackgroundStateChange);
  }
  startSpan(name, options) {
    options.parentContext = isParentContext(options.parentContext) || options.parentContext === null ? options.parentContext : this.spanContextStorage.current;
    const attributes = new SpanAttributes(/* @__PURE__ */ new Map(), this.spanAttributeLimits, name, this.logger);
    if (typeof options.isFirstClass === "boolean") {
      attributes.set("bugsnag.span.first_class", options.isFirstClass);
    }
    const span = this.createSpanInternal(name, options, attributes);
    if (this.isInForeground) {
      this.openSpans.add(span);
      if (options.makeCurrentContext !== false) {
        this.spanContextStorage.push(span);
      }
    }
    return span;
  }
  createSpanInternal(name, options, attributes) {
    const safeStartTime = timeToNumber(this.clock, options.startTime);
    const spanId = this.idGenerator.generate(64);
    const parentSpanId = options.parentContext ? options.parentContext.id : void 0;
    const traceId = options.parentContext ? options.parentContext.traceId : this.idGenerator.generate(128);
    return new SpanInternal(spanId, traceId, name, safeStartTime, attributes, this.clock, parentSpanId);
  }
  startNetworkSpan(options) {
    const spanName = `[HTTP/${options.method.toUpperCase()}]`;
    const cleanOptions = this.validateSpanOptions(spanName, options);
    const spanInternal = this.startSpan(cleanOptions.name, { ...cleanOptions.options, makeCurrentContext: false });
    spanInternal.setAttribute("bugsnag.span.category", "network");
    spanInternal.setAttribute("http.method", options.method);
    spanInternal.setAttribute("http.url", options.url);
    return spanInternal;
  }
  configure(configuration) {
    this.logger = configuration.logger;
    this.spanAttributeLimits = {
      attributeArrayLengthLimit: configuration.attributeArrayLengthLimit,
      attributeCountLimit: configuration.attributeCountLimit,
      attributeStringValueLimit: configuration.attributeStringValueLimit
    };
    this.onSpanEndCallbacks = configuration.onSpanEnd;
  }
  reprocessEarlySpans(batchProcessor) {
    for (const span of this.processor.spans) {
      batchProcessor.add(span);
    }
    this.processor = batchProcessor;
  }
  endSpan(span, endTime, additionalAttributes) {
    this.spanContextStorage.pop(span);
    const untracked = !this.openSpans.delete(span);
    const isValidSpan = span.isValid();
    if (untracked && !isValidSpan) {
      this.logger.warn("Attempted to end a Span which is no longer valid.");
    }
    if (untracked || !isValidSpan || endTime === DISCARD_END_TIME) {
      this.discardSpan(span);
      return;
    }
    for (const [key, value] of Object.entries(additionalAttributes || {})) {
      span.setAttribute(key, value);
    }
    this.spanAttributesSource.requestAttributes(span);
    this.sendForProcessing(span, endTime);
  }
  discardSpan(span) {
    span.end(DISCARD_END_TIME, this.sampler.spanProbability);
  }
  sendForProcessing(span, endTime) {
    const spanEnded = span.end(endTime, this.sampler.spanProbability);
    if (this.sampler.sample(spanEnded)) {
      this.processor.add(spanEnded);
    }
  }
  toPublicApi(span) {
    return {
      get id() {
        return span.id;
      },
      get traceId() {
        return span.traceId;
      },
      get samplingRate() {
        return span.samplingRate;
      },
      get name() {
        return span.name;
      },
      isValid: () => span.isValid(),
      setAttribute: (name, value) => {
        span.setCustomAttribute(name, value);
      },
      end: (endTime) => {
        const safeEndTime = timeToNumber(this.clock, endTime);
        this.endSpan(span, safeEndTime);
      }
    };
  }
  validateSpanOptions(name, options, schema2 = coreSpanOptionSchema) {
    let warnings = "";
    const cleanOptions = {};
    if (typeof name !== "string") {
      warnings += `
  - name should be a string, got ${typeof name}`;
      name = String(name);
    }
    if (options !== void 0 && !isObject(options)) {
      warnings += "\n  - options is not an object";
    } else {
      const spanOptions = options || {};
      for (const option of Object.keys(schema2)) {
        if (Object.prototype.hasOwnProperty.call(spanOptions, option) && spanOptions[option] !== void 0) {
          if (schema2[option].validate(spanOptions[option])) {
            cleanOptions[option] = spanOptions[option];
          } else {
            warnings += `
  - ${option} ${schema2[option].message}, got ${typeof spanOptions[option]}`;
            cleanOptions[option] = schema2[option].getDefaultValue(spanOptions[option]);
          }
        } else {
          cleanOptions[option] = schema2[option].getDefaultValue(spanOptions[option]);
        }
      }
    }
    if (warnings.length > 0) {
      this.logger.warn(`Invalid span options${warnings}`);
    }
    return { name, options: cleanOptions };
  }
};

// node_modules/@bugsnag/core-performance/dist/core.js
function createClient(options) {
  const bufferingProcessor = new BufferingProcessor();
  const spanContextStorage = options.spanContextStorage || new DefaultSpanContextStorage(options.backgroundingListener);
  let logger = options.schema.logger.defaultValue;
  let appState = "starting";
  const sampler = new Sampler(1);
  const SpanFactoryClass = options.spanFactory || SpanFactory;
  const spanFactory = new SpanFactoryClass(bufferingProcessor, sampler, options.idGenerator, options.spanAttributesSource, options.clock, options.backgroundingListener, logger, spanContextStorage);
  const setAppState = (state) => {
    appState = state;
  };
  const plugins = options.plugins(spanFactory, spanContextStorage, setAppState, appState);
  return {
    start: (config) => {
      const configuration = validateConfig(config, options.schema);
      if (configuration.endpoint === schema.endpoint.defaultValue) {
        configuration.endpoint = configuration.endpoint.replace("https://", `https://${configuration.apiKey}.`);
      }
      if (configuration.bugsnag && typeof configuration.bugsnag.Event.prototype.setTraceCorrelation === "function" && configuration.bugsnag.Client) {
        const originalNotify = configuration.bugsnag.Client.prototype._notify;
        configuration.bugsnag.Client.prototype._notify = function(...args) {
          const currentSpanContext = spanContextStorage.current;
          if (currentSpanContext && typeof args[0].setTraceCorrelation === "function") {
            args[0].setTraceCorrelation(currentSpanContext.traceId, currentSpanContext.id);
          }
          originalNotify.apply(this, args);
        };
      }
      const delivery = options.deliveryFactory(configuration.endpoint);
      options.spanAttributesSource.configure(configuration);
      spanFactory.configure(configuration);
      const probabilityManagerPromise = configuration.samplingProbability === void 0 ? ProbabilityManager.create(options.persistence, sampler, new ProbabilityFetcher(delivery, configuration.apiKey)) : FixedProbabilityManager.create(sampler, configuration.samplingProbability);
      probabilityManagerPromise.then((manager) => {
        const batchProcessor = new BatchProcessor(delivery, configuration, options.retryQueueFactory(delivery, configuration.retryQueueMaxSize), sampler, manager, new TracePayloadEncoder(options.clock, configuration, options.resourceAttributesSource));
        spanFactory.reprocessEarlySpans(batchProcessor);
        options.backgroundingListener.onStateChange((state) => {
          batchProcessor.flush();
          if (state === "in-foreground") {
            manager.ensureFreshProbability();
          }
        });
        logger = configuration.logger;
      });
      for (const plugin of configuration.plugins) {
        plugins.push(plugin);
      }
      for (const plugin of plugins) {
        plugin.configure(configuration, spanFactory, setAppState, appState);
      }
    },
    startSpan: (name, spanOptions) => {
      const cleanOptions = spanFactory.validateSpanOptions(name, spanOptions);
      const span = spanFactory.startSpan(cleanOptions.name, cleanOptions.options);
      span.setAttribute("bugsnag.span.category", "custom");
      return spanFactory.toPublicApi(span);
    },
    startNetworkSpan: (networkSpanOptions) => {
      const spanInternal = spanFactory.startNetworkSpan(networkSpanOptions);
      const span = spanFactory.toPublicApi(spanInternal);
      const networkSpan = {
        ...span,
        end: (endOptions) => {
          spanFactory.endSpan(spanInternal, timeToNumber(options.clock, endOptions.endTime), { "http.status_code": endOptions.status });
        }
      };
      return networkSpan;
    },
    getPlugin: (Constructor) => {
      for (const plugin of plugins) {
        if (plugin instanceof Constructor) {
          return plugin;
        }
      }
    },
    get currentSpanContext() {
      return spanContextStorage.current;
    },
    get appState() {
      return appState;
    },
    ...options.platformExtensions && options.platformExtensions(spanFactory, spanContextStorage)
  };
}
function createNoopClient() {
  const noop = () => {
  };
  return {
    start: noop,
    startSpan: () => ({ id: "", traceId: "", end: noop, isValid: () => false }),
    currentSpanContext: void 0
  };
}

// node_modules/@bugsnag/cuid/lib/pad.mjs
function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}

// node_modules/@bugsnag/cuid/lib/fingerprint.browser.mjs
var env = typeof window === "object" ? window : self;
var globalCount = 0;
for (prop in env) {
  if (Object.hasOwnProperty.call(env, prop)) globalCount++;
}
var prop;
var mimeTypesLength = navigator.mimeTypes ? navigator.mimeTypes.length : 0;
var clientId = pad((mimeTypesLength + navigator.userAgent.length).toString(36) + globalCount.toString(36), 4);
function fingerprint() {
  return clientId;
}

// node_modules/@bugsnag/cuid/lib/is-cuid.mjs
function isCuid(value) {
  return typeof value === "string" && /^c[a-z0-9]{20,32}$/.test(value);
}

// node_modules/@bugsnag/cuid/lib/cuid.mjs
function createCuid(fingerprint2) {
  const blockSize = 4, base = 36, discreteValues = Math.pow(base, blockSize);
  let c = 0;
  function randomBlock() {
    return pad((Math.random() * discreteValues << 0).toString(base), blockSize);
  }
  function safeCounter() {
    c = c < discreteValues ? c : 0;
    c++;
    return c - 1;
  }
  function cuid2() {
    var letter = "c", timestamp = (/* @__PURE__ */ new Date()).getTime().toString(base), counter = pad(safeCounter().toString(base), blockSize), print = fingerprint2(), random = randomBlock() + randomBlock();
    return letter + timestamp + counter + print + random;
  }
  cuid2.fingerprint = fingerprint2;
  cuid2.isCuid = isCuid;
  return cuid2;
}

// node_modules/@bugsnag/cuid/index.esm.mjs
var cuid = createCuid(fingerprint);
var index_esm_default = cuid;

// node_modules/@bugsnag/core-performance/dist/persistence.js
var { isCuid: isCuid2 } = index_esm_default;
var InMemoryPersistence = class {
  constructor() {
    this.persistedItems = /* @__PURE__ */ new Map();
  }
  async load(key) {
    return this.persistedItems.get(key);
  }
  async save(key, value) {
    this.persistedItems.set(key, value);
  }
};
function toPersistedPayload(key, raw) {
  switch (key) {
    case "bugsnag-sampling-probability": {
      const json = JSON.parse(raw);
      return isPersistedProbability(json) ? json : void 0;
    }
    case "bugsnag-anonymous-id":
      return isCuid2(raw) ? raw : void 0;
  }
}

// node_modules/@bugsnag/core-performance/dist/retry-queue.js
var msInDay = 24 * 60 * 6e4;
var InMemoryQueue = class {
  constructor(delivery, retryQueueMaxSize) {
    this.delivery = delivery;
    this.retryQueueMaxSize = retryQueueMaxSize;
    this.requestQueue = Promise.resolve();
    this.payloads = [];
  }
  add(payload, time) {
    this.payloads.push({ payload, time });
    let spanCount = this.payloads.reduce((count, { payload: payload2 }) => count + countSpansInPayload(payload2), 0);
    while (spanCount > this.retryQueueMaxSize) {
      const payload2 = this.payloads.shift();
      if (!payload2) {
        break;
      }
      spanCount -= countSpansInPayload(payload2.payload);
    }
  }
  async flush() {
    if (this.payloads.length === 0)
      return;
    const payloads = this.payloads;
    this.payloads = [];
    this.requestQueue = this.requestQueue.then(async () => {
      for (const { payload, time } of payloads) {
        if (Date.now() >= time + msInDay)
          continue;
        try {
          const { state } = await this.delivery.send(payload);
          switch (state) {
            case "success":
            case "failure-discard":
              break;
            case "failure-retryable":
              this.add(payload, time);
              break;
            default:
              state;
          }
        } catch (err) {
        }
      }
    });
    await this.requestQueue;
  }
};
function countSpansInPayload(payload) {
  let count = 0;
  for (let i = 0; i < payload.body.resourceSpans.length; ++i) {
    const scopeSpans = payload.body.resourceSpans[i].scopeSpans;
    for (let j = 0; j < scopeSpans.length; ++j) {
      count += scopeSpans[j].spans.length;
    }
  }
  return count;
}

// node_modules/@bugsnag/delivery-fetch-performance/dist/delivery.js
function samplingProbabilityFromHeaders(headers) {
  const value = headers.get("Bugsnag-Sampling-Probability");
  if (typeof value !== "string") {
    return void 0;
  }
  const asNumber = Number.parseFloat(value);
  if (Number.isNaN(asNumber) || asNumber < 0 || asNumber > 1) {
    return void 0;
  }
  return asNumber;
}
function createFetchDeliveryFactory(fetch, clock, backgroundingListener) {
  let keepalive = false;
  if (backgroundingListener) {
    backgroundingListener.onStateChange((state) => {
      keepalive = state === "in-background";
    });
  }
  return function fetchDeliveryFactory(endpoint) {
    return {
      async send(payload) {
        const body = JSON.stringify(payload.body);
        payload.headers["Bugsnag-Sent-At"] = clock.date().toISOString();
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            keepalive,
            body,
            headers: payload.headers
          });
          return {
            state: responseStateFromStatusCode(response.status),
            samplingProbability: samplingProbabilityFromHeaders(response.headers)
          };
        } catch (err) {
          if (body.length > 1e6) {
            return { state: "failure-discard" };
          }
          return { state: "failure-retryable" };
        }
      }
    };
  };
}

// node_modules/@bugsnag/request-tracker-performance/dist/network-request-callback.js
function defaultNetworkRequestCallback(networkRequestInfo) {
  return networkRequestInfo;
}
function isNetworkRequestCallback(value) {
  return typeof value === "function";
}

// node_modules/@bugsnag/request-tracker-performance/dist/request-tracker.js
var RequestTracker = class {
  constructor() {
    this.callbacks = [];
  }
  onStart(startCallback) {
    this.callbacks.push(startCallback);
  }
  start(context) {
    const results = [];
    for (const startCallback of this.callbacks) {
      const result = startCallback(context);
      if (result)
        results.push(result);
    }
    return {
      onRequestEnd: (endContext) => {
        for (const result of results) {
          if (result && result.onRequestEnd) {
            result.onRequestEnd(endContext);
          }
        }
      },
      extraRequestHeaders: results.map((result) => {
        if (result && result.extraRequestHeaders) {
          return result.extraRequestHeaders;
        }
        return void 0;
      }).filter(isDefined)
    };
  }
};
function isDefined(argument) {
  return argument !== void 0;
}

// node_modules/@bugsnag/request-tracker-performance/dist/url-helpers.js
function getAbsoluteUrl(url, baseUrl) {
  if (url.indexOf("https://") === 0 || url.indexOf("http://") === 0)
    return url;
  try {
    const absoluteUrl = new URL(url, baseUrl).href;
    if (!url.endsWith("/") && absoluteUrl.endsWith("/")) {
      return absoluteUrl.slice(0, -1);
    }
    return absoluteUrl;
  } catch (_a) {
    return url;
  }
}

// node_modules/@bugsnag/request-tracker-performance/dist/request-tracker-fetch.js
function createStartContext(startTime2, input, init, baseUrl) {
  const inputIsRequest = isRequest(input);
  const url = inputIsRequest ? input.url : String(input);
  const method = !!init && init.method || inputIsRequest && input.method || "GET";
  return { url: getAbsoluteUrl(url, baseUrl), method, startTime: startTime2, type: "fetch" };
}
function isRequest(input) {
  return !!input && typeof input === "object" && !(input instanceof URL);
}
function isHeadersInstance(input) {
  return !!input && typeof input === "object" && input instanceof Headers;
}
function createFetchRequestTracker(global, clock) {
  const requestTracker = new RequestTracker();
  const originalFetch = global.fetch;
  global.fetch = function fetch(input, init) {
    const startContext = createStartContext(clock.now(), input, init, global.document && global.document.baseURI);
    const { onRequestEnd, extraRequestHeaders } = requestTracker.start(startContext);
    const modifiedParams = mergeRequestHeaders(input, init, extraRequestHeaders);
    return originalFetch.call(this, modifiedParams[0], modifiedParams[1]).then((response) => {
      onRequestEnd({ status: response.status, endTime: clock.now(), state: "success" });
      return response;
    }).catch((error) => {
      onRequestEnd({ error, endTime: clock.now(), state: "error" });
      throw error;
    });
  };
  return requestTracker;
}
function mergeRequestHeaders(input, init, extraRequestHeaders) {
  if (!extraRequestHeaders)
    return [input, init];
  const extraHeaders = extraRequestHeaders.reduce((headers, current) => ({ ...headers, ...current }), {});
  if (isRequest(input) && (!init || !init.headers)) {
    mergeInputRequestHeaders(extraHeaders, input);
  } else {
    init = mergeInitRequestHeaders(extraHeaders, init);
  }
  return [input, init];
}
function mergeInputRequestHeaders(extraRequestHeaders, input) {
  for (const [name, value] of Object.entries(extraRequestHeaders)) {
    if (!input.headers.has(name)) {
      input.headers.set(name, value);
    }
  }
}
function mergeInitRequestHeaders(extraRequestHeaders, init) {
  if (!init)
    init = {};
  if (isHeadersInstance(init.headers)) {
    for (const [name, value] of Object.entries(extraRequestHeaders)) {
      if (!init.headers.has(name)) {
        init.headers.set(name, value);
      }
    }
    return init;
  } else {
    return { ...init, headers: { ...extraRequestHeaders, ...init.headers } };
  }
}

// node_modules/@bugsnag/request-tracker-performance/dist/request-tracker-xhr.js
function createXmlHttpRequestTracker(xhr, clock, document2) {
  const requestTracker = new RequestTracker();
  const trackedRequests = /* @__PURE__ */ new WeakMap();
  const requestHandlers = /* @__PURE__ */ new WeakMap();
  const originalOpen = xhr.prototype.open;
  xhr.prototype.open = function open(method, url, ...rest) {
    trackedRequests.set(this, { method, url: getAbsoluteUrl(String(url), document2 && document2.baseURI) });
    originalOpen.call(this, method, url, ...rest);
  };
  const originalSend = xhr.prototype.send;
  xhr.prototype.send = function send(body) {
    const requestData = trackedRequests.get(this);
    if (requestData) {
      const existingHandler = requestHandlers.get(this);
      if (existingHandler)
        this.removeEventListener("readystatechange", existingHandler);
      const { onRequestEnd, extraRequestHeaders } = requestTracker.start({
        type: "xmlhttprequest",
        method: requestData.method,
        url: requestData.url,
        startTime: clock.now()
      });
      if (extraRequestHeaders) {
        for (const extraHeaders of extraRequestHeaders) {
          for (const [name, value] of Object.entries(extraHeaders)) {
            this.setRequestHeader(name, value);
          }
        }
      }
      const onReadyStateChange = (evt) => {
        if (this.readyState === xhr.DONE && onRequestEnd) {
          const endContext = this.status > 0 ? { endTime: clock.now(), status: this.status, state: "success" } : { endTime: clock.now(), state: "error" };
          onRequestEnd(endContext);
        }
      };
      this.addEventListener("readystatechange", onReadyStateChange);
      requestHandlers.set(this, onReadyStateChange);
    }
    originalSend.call(this, body);
  };
  return requestTracker;
}

// node_modules/@bugsnag/browser-performance/dist/send-page-attributes.js
var defaultSendPageAttributes = {
  referrer: true,
  title: true,
  url: true
};
function getPermittedAttributes(sendPageAttributes) {
  return {
    ...defaultSendPageAttributes,
    ...sendPageAttributes
  };
}
function isSendPageAttributes(obj) {
  const allowedTypes = ["undefined", "boolean"];
  const keys = Object.keys(defaultSendPageAttributes);
  return isObject(obj) && keys.every((key) => allowedTypes.includes(typeof obj[key]));
}

// node_modules/@bugsnag/browser-performance/dist/auto-instrumentation/page-load-phase-spans.js
function shouldOmitSpan(startTime2, endTime) {
  return startTime2 === void 0 || endTime === void 0 || startTime2 === 0 && endTime === 0;
}
var instrumentPageLoadPhaseSpans = (spanFactory, performance2, route, parentContext2) => {
  function createPageLoadPhaseSpan(phase, startTime2, endTime) {
    if (shouldOmitSpan(startTime2, endTime))
      return;
    const span = spanFactory.startSpan(`[PageLoadPhase/${phase}]${route}`, {
      startTime: startTime2,
      parentContext: parentContext2,
      makeCurrentContext: false
    });
    span.setAttribute("bugsnag.span.category", "page_load_phase");
    span.setAttribute("bugsnag.phase", phase);
    spanFactory.endSpan(span, endTime);
  }
  const entries = performance2.getEntriesByType("navigation");
  const entry = Array.isArray(entries) && entries[0];
  if (entry) {
    createPageLoadPhaseSpan("Unload", entry.unloadEventStart, entry.unloadEventEnd);
    createPageLoadPhaseSpan("Redirect", entry.redirectStart, entry.redirectEnd);
    createPageLoadPhaseSpan("LoadFromCache", entry.fetchStart, entry.domainLookupStart);
    createPageLoadPhaseSpan("DNSLookup", entry.domainLookupStart, entry.domainLookupEnd);
    const TCPHandshakeEnd = entry.secureConnectionStart || entry.connectEnd;
    createPageLoadPhaseSpan("TCPHandshake", entry.connectStart, TCPHandshakeEnd);
    createPageLoadPhaseSpan("TLS", entry.secureConnectionStart, entry.connectEnd);
    createPageLoadPhaseSpan("HTTPRequest", entry.requestStart, entry.responseStart);
    createPageLoadPhaseSpan("HTTPResponse", entry.responseStart, entry.responseEnd);
    createPageLoadPhaseSpan("DomContentLoadedEvent", entry.domContentLoadedEventStart, entry.domContentLoadedEventEnd);
    createPageLoadPhaseSpan("LoadEvent", entry.loadEventStart, entry.loadEventEnd);
  }
};

// node_modules/@bugsnag/browser-performance/dist/default-routing-provider.js
var defaultRouteResolver = (url) => url.pathname || "/";
var createNoopRoutingProvider = () => {
  return class NoopRoutingProvider {
    constructor(resolveRoute = defaultRouteResolver) {
      this.resolveRoute = resolveRoute;
    }
    listenForRouteChanges(startRouteChangeSpan) {
    }
  };
};
var createDefaultRoutingProvider = (onSettle2, location) => {
  return class DefaultRoutingProvider {
    constructor(resolveRoute = defaultRouteResolver) {
      this.resolveRoute = resolveRoute;
    }
    listenForRouteChanges(startRouteChangeSpan) {
      addEventListener("popstate", (ev) => {
        const url = new URL(location.href);
        const span = startRouteChangeSpan(url, "popstate");
        onSettle2((endTime) => {
          span.end(endTime);
        });
      });
      const originalPushState = history.pushState;
      history.pushState = function(...args) {
        const url = args[2];
        if (url) {
          const absoluteURL = new URL(getAbsoluteUrl(url.toString(), document.baseURI));
          const span = startRouteChangeSpan(absoluteURL, "pushState");
          onSettle2((endTime) => {
            span.end(endTime);
          });
        }
        originalPushState.apply(this, args);
      };
    }
  };
};

// node_modules/@bugsnag/browser-performance/dist/auto-instrumentation/full-page-load-plugin.js
var FullPageLoadPlugin = class {
  constructor(document2, location, spanFactory, webVitals, onSettle2, backgroundingListener, performance2, setAppState, appState) {
    this.wasBackgrounded = false;
    this.document = document2;
    this.location = location;
    this.spanFactory = spanFactory;
    this.webVitals = webVitals;
    this.onSettle = onSettle2;
    this.performance = performance2;
    this.setAppState = setAppState;
    this.appState = appState;
    backgroundingListener.onStateChange((state) => {
      if (!this.wasBackgrounded && state === "in-background") {
        this.wasBackgrounded = true;
      }
    });
  }
  configure(configuration) {
    if (!configuration.autoInstrumentFullPageLoads || this.wasBackgrounded) {
      return;
    }
    let parentContext2 = null;
    const traceparentMetaTag = document.querySelector('meta[name="traceparent"]');
    if (traceparentMetaTag !== null && traceparentMetaTag.getAttribute("content")) {
      const traceparent = traceparentMetaTag.getAttribute("content");
      const [, traceId, parentSpanId] = traceparent.split("-");
      parentContext2 = {
        traceId,
        id: parentSpanId
      };
    }
    const span = this.spanFactory.startSpan("[FullPageLoad]", { startTime: 0, parentContext: parentContext2 });
    const permittedAttributes = getPermittedAttributes(configuration.sendPageAttributes);
    const url = new URL(this.location.href);
    this.onSettle((endTime) => {
      if (this.wasBackgrounded)
        return;
      const route = configuration.routingProvider.resolveRoute(url) || defaultRouteResolver(url);
      span.name += route;
      instrumentPageLoadPhaseSpans(this.spanFactory, this.performance, route, span);
      span.setAttribute("bugsnag.span.category", "full_page_load");
      span.setAttribute("bugsnag.browser.page.route", route);
      if (permittedAttributes.referrer)
        span.setAttribute("bugsnag.browser.page.referrer", this.document.referrer);
      if (permittedAttributes.title)
        span.setAttribute("bugsnag.browser.page.title", this.document.title);
      if (permittedAttributes.url)
        span.setAttribute("bugsnag.browser.page.url", url.toString());
      this.webVitals.attachTo(span);
      this.spanFactory.endSpan(span, endTime);
      if (this.appState === "starting") {
        this.setAppState("ready");
      }
    });
  }
};

// node_modules/@bugsnag/browser-performance/dist/auto-instrumentation/network-request-plugin.js
var permittedPrefixes = ["http://", "https://", "/", "./", "../"];
var NetworkRequestPlugin = class {
  constructor(spanFactory, spanContextStorage, fetchTracker, xhrTracker) {
    this.spanFactory = spanFactory;
    this.spanContextStorage = spanContextStorage;
    this.fetchTracker = fetchTracker;
    this.xhrTracker = xhrTracker;
    this.configEndpoint = "";
    this.networkRequestCallback = defaultNetworkRequestCallback;
    this.logger = { debug: console.debug, warn: console.warn, info: console.info, error: console.error };
    this.trackRequest = (startContext) => {
      if (!this.shouldTrackRequest(startContext))
        return;
      const shouldPropagateTraceContextByDefault = false;
      const defaultRequestInfo = {
        url: startContext.url,
        type: startContext.type,
        propagateTraceContext: shouldPropagateTraceContextByDefault
      };
      const networkRequestInfo = this.networkRequestCallback(defaultRequestInfo);
      if (!networkRequestInfo) {
        return {
          onRequestEnd: void 0,
          extraRequestHeaders: void 0
        };
      }
      if (networkRequestInfo.propagateTraceContext === void 0) {
        networkRequestInfo.propagateTraceContext = shouldPropagateTraceContextByDefault;
      }
      if (!networkRequestInfo.url) {
        return {
          onRequestEnd: void 0,
          // propagate trace context if requested using span context
          extraRequestHeaders: networkRequestInfo.propagateTraceContext ? this.getExtraRequestHeaders() : void 0
        };
      }
      if (typeof networkRequestInfo.url !== "string") {
        this.logger.warn(`expected url to be a string following network request callback, got ${typeof networkRequestInfo.url}`);
        return;
      }
      const span = this.spanFactory.startNetworkSpan({
        method: startContext.method,
        startTime: startContext.startTime,
        url: networkRequestInfo.url
      });
      return {
        onRequestEnd: (endContext) => {
          if (endContext.state === "success") {
            this.spanFactory.endSpan(span, endContext.endTime, { "http.status_code": endContext.status });
          }
        },
        // propagate trace context using network span
        extraRequestHeaders: networkRequestInfo.propagateTraceContext ? this.getExtraRequestHeaders(span) : void 0
      };
    };
  }
  configure(configuration) {
    this.logger = configuration.logger;
    if (configuration.autoInstrumentNetworkRequests) {
      this.configEndpoint = configuration.endpoint;
      this.xhrTracker.onStart(this.trackRequest);
      this.fetchTracker.onStart(this.trackRequest);
      this.networkRequestCallback = configuration.networkRequestCallback;
    }
  }
  shouldTrackRequest(startContext) {
    return startContext.url !== this.configEndpoint && permittedPrefixes.some((prefix) => startContext.url.startsWith(prefix));
  }
  getExtraRequestHeaders(span) {
    const extraRequestHeaders = {};
    if (span) {
      const traceId = span.traceId;
      const parentSpanId = span.id;
      const sampled = this.spanFactory.sampler.shouldSample(span.samplingRate);
      extraRequestHeaders.traceparent = buildTraceparentHeader(traceId, parentSpanId, sampled);
      extraRequestHeaders.tracestate = buildTracestateHeader(traceId);
    } else if (this.spanContextStorage.current) {
      const currentSpanContext = this.spanContextStorage.current;
      const traceId = currentSpanContext.traceId;
      const parentSpanId = currentSpanContext.id;
      const sampled = this.spanFactory.sampler.shouldSample(currentSpanContext.samplingRate);
      extraRequestHeaders.traceparent = buildTraceparentHeader(traceId, parentSpanId, sampled);
      extraRequestHeaders.tracestate = buildTracestateHeader(traceId);
    }
    return extraRequestHeaders;
  }
};
function buildTraceparentHeader(traceId, parentSpanId, sampled) {
  return `00-${traceId}-${parentSpanId}-${sampled ? "01" : "00"}`;
}
function buildTracestateHeader(traceId) {
  return `sb=v:1;r32:${traceIdToSamplingRate(traceId)}`;
}

// node_modules/@bugsnag/browser-performance/dist/auto-instrumentation/resource-load-plugin.js
function getHttpVersion(protocol) {
  switch (protocol) {
    case "":
      return void 0;
    case "http/1.0":
      return "1.0";
    case "http/1.1":
      return "1.1";
    case "h2":
    case "h2c":
      return "2.0";
    case "h3":
      return "3.0";
    case "spdy/1":
    case "spdy/2":
    case "spdy/3":
      return "SPDY";
    default:
      return protocol;
  }
}
function resourceLoadSupported(PerformanceObserverClass) {
  return PerformanceObserverClass && Array.isArray(PerformanceObserverClass.supportedEntryTypes) && PerformanceObserverClass.supportedEntryTypes.includes("resource");
}
var ResourceLoadPlugin = class {
  constructor(spanFactory, spanContextStorage, PerformanceObserverClass) {
    this.spanFactory = spanFactory;
    this.spanContextStorage = spanContextStorage;
    this.PerformanceObserverClass = PerformanceObserverClass;
  }
  configure(configuration) {
    if (!resourceLoadSupported(this.PerformanceObserverClass))
      return;
    const observer = new this.PerformanceObserverClass((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (entry.initiatorType === "fetch" || entry.initiatorType === "xmlhttprequest") {
          continue;
        }
        const parentContext2 = this.spanContextStorage.first;
        if (parentContext2) {
          const networkRequestInfo = configuration.networkRequestCallback({ url: entry.name, type: entry.initiatorType });
          if (!networkRequestInfo)
            return;
          if (typeof networkRequestInfo.url !== "string") {
            configuration.logger.warn(`expected url to be a string following network request callback, got ${typeof networkRequestInfo.url}`);
            return;
          }
          let name = "";
          try {
            const url = new URL(networkRequestInfo.url);
            url.search = "";
            name = url.href;
          } catch (err) {
            configuration.logger.warn(`Unable to parse URL returned from networkRequestCallback: ${networkRequestInfo.url}`);
            return;
          }
          const span = this.spanFactory.startSpan(`[ResourceLoad]${name}`, {
            parentContext: parentContext2,
            startTime: entry.startTime,
            makeCurrentContext: false
          });
          span.setAttribute("bugsnag.span.category", "resource_load");
          span.setAttribute("http.url", networkRequestInfo.url);
          const httpFlavor = getHttpVersion(entry.nextHopProtocol);
          if (httpFlavor) {
            span.setAttribute("http.flavor", httpFlavor);
          }
          if (entry.encodedBodySize && entry.decodedBodySize) {
            span.setAttribute("http.response_content_length", entry.encodedBodySize);
            span.setAttribute("http.response_content_length_uncompressed", entry.decodedBodySize);
          }
          if (entry.responseStatus) {
            span.setAttribute("http.status_code", entry.responseStatus);
          }
          this.spanFactory.endSpan(span, entry.responseEnd);
        }
      }
    });
    try {
      observer.observe({ type: "resource", buffered: true });
    } catch (err) {
      configuration.logger.warn("Unable to get previous resource loads as buffered observer not supported, only showing resource loads from this point on");
      observer.observe({ entryTypes: ["resource"] });
    }
  }
};

// node_modules/@bugsnag/browser-performance/dist/auto-instrumentation/route-change-plugin.js
var { startTime, parentContext, makeCurrentContext } = coreSpanOptionSchema;
var routeChangeSpanOptionSchema = {
  startTime,
  parentContext,
  makeCurrentContext,
  trigger: {
    getDefaultValue: (value) => String(value),
    message: "should be a string",
    validate: isString
  }
};
var RouteChangePlugin = class {
  constructor(spanFactory, location, document2, setAppState) {
    this.spanFactory = spanFactory;
    this.location = location;
    this.document = document2;
    this.setAppState = setAppState;
  }
  configure(configuration) {
    if (!configuration.autoInstrumentRouteChanges)
      return;
    const previousUrl = new URL(this.location.href);
    let previousRoute = configuration.routingProvider.resolveRoute(previousUrl) || defaultRouteResolver(previousUrl);
    const permittedAttributes = getPermittedAttributes(configuration.sendPageAttributes);
    configuration.routingProvider.listenForRouteChanges((url, trigger, options) => {
      let absoluteUrl;
      if (url instanceof URL) {
        absoluteUrl = url;
      } else {
        try {
          const stringUrl = String(url);
          absoluteUrl = new URL(stringUrl);
        } catch (err) {
          configuration.logger.warn("Invalid span options\n  - url should be a URL");
          return {
            id: "",
            name: "",
            traceId: "",
            samplingRate: 0,
            isValid: () => false,
            setAttribute: () => {
            },
            end: () => {
            }
          };
        }
      }
      this.setAppState("navigating");
      const routeChangeSpanOptions = {
        ...options,
        trigger
      };
      const cleanOptions = this.spanFactory.validateSpanOptions("[RouteChange]", routeChangeSpanOptions, routeChangeSpanOptionSchema);
      const route = configuration.routingProvider.resolveRoute(absoluteUrl) || defaultRouteResolver(absoluteUrl);
      cleanOptions.name += route;
      const span = this.spanFactory.startSpan(cleanOptions.name, cleanOptions.options);
      span.setAttribute("bugsnag.span.category", "route_change");
      span.setAttribute("bugsnag.browser.page.route", route);
      span.setAttribute("bugsnag.browser.page.previous_route", previousRoute);
      span.setAttribute("bugsnag.browser.page.route_change.trigger", cleanOptions.options.trigger);
      if (permittedAttributes.url)
        span.setAttribute("bugsnag.browser.page.url", url.toString());
      previousRoute = route;
      return {
        get id() {
          return span.id;
        },
        get traceId() {
          return span.traceId;
        },
        get samplingRate() {
          return span.samplingRate;
        },
        get name() {
          return span.name;
        },
        isValid: span.isValid,
        setAttribute: span.setAttribute,
        end: (endTimeOrOptions) => {
          const options2 = isObject(endTimeOrOptions) ? endTimeOrOptions : { endTime: endTimeOrOptions };
          if (permittedAttributes.title) {
            span.setAttribute("bugsnag.browser.page.title", this.document.title);
          }
          if (options2.url) {
            const urlObject = ensureUrl(options2.url);
            const route2 = configuration.routingProvider.resolveRoute(urlObject) || defaultRouteResolver(urlObject);
            span.name = `[RouteChange]${route2}`;
            span.setAttribute("bugsnag.browser.page.route", route2);
            previousRoute = route2;
            if (permittedAttributes.url) {
              span.setAttribute("bugsnag.browser.page.url", urlObject.toString());
            }
          }
          this.spanFactory.toPublicApi(span).end(options2.endTime);
          this.setAppState("ready");
        }
      };
    });
  }
};
function ensureUrl(url) {
  if (typeof url === "string") {
    return new URL(url);
  }
  return url;
}

// node_modules/@bugsnag/browser-performance/dist/backgrounding-listener.js
function createBrowserBackgroundingListener(window2) {
  const callbacks = [];
  let state = window2.document.visibilityState === "hidden" ? "in-background" : "in-foreground";
  const backgroundingListener = {
    onStateChange(backgroundingListenerCallback) {
      callbacks.push(backgroundingListenerCallback);
      if (state === "in-background") {
        backgroundingListenerCallback(state);
      }
    }
  };
  const backgroundStateChanged = (newState) => {
    if (state === newState)
      return;
    state = newState;
    for (const callback of callbacks) {
      callback(state);
    }
  };
  window2.document.addEventListener("visibilitychange", function() {
    const newState = window2.document.visibilityState === "hidden" ? "in-background" : "in-foreground";
    backgroundStateChanged(newState);
  });
  window2.addEventListener("pagehide", function() {
    backgroundStateChanged("in-background");
  });
  window2.addEventListener("pageshow", function() {
    backgroundStateChanged("in-foreground");
  });
  return backgroundingListener;
}

// node_modules/@bugsnag/browser-performance/dist/clock.js
var MAX_CLOCK_DRIFT_MS = 3e5;
function recalculateTimeOrigin(timeOrigin, performance2) {
  if (Math.abs(Date.now() - (timeOrigin + performance2.now())) > MAX_CLOCK_DRIFT_MS) {
    return Date.now() - performance2.now();
  }
  return timeOrigin;
}
function createClock(performance2, backgroundingListener) {
  const initialTimeOrigin = performance2.timeOrigin === void 0 ? performance2.timing.navigationStart : performance2.timeOrigin;
  let calculatedTimeOrigin = recalculateTimeOrigin(initialTimeOrigin, performance2);
  backgroundingListener.onStateChange((state) => {
    if (state === "in-foreground") {
      calculatedTimeOrigin = recalculateTimeOrigin(calculatedTimeOrigin, performance2);
    }
  });
  return {
    now: () => performance2.now(),
    date: () => new Date(calculatedTimeOrigin + performance2.now()),
    convert: (date) => date.getTime() - calculatedTimeOrigin,
    // convert milliseconds since timeOrigin to full timestamp
    toUnixTimestampNanoseconds: (time) => millisecondsToNanoseconds(calculatedTimeOrigin + time).toString()
  };
}

// node_modules/@bugsnag/browser-performance/dist/routing-provider.js
var isRoutingProvider = (value) => isObject(value) && typeof value.resolveRoute === "function" && typeof value.listenForRouteChanges === "function";

// node_modules/@bugsnag/browser-performance/dist/config.js
function createSchema(hostname, defaultRoutingProvider) {
  return {
    ...schema,
    releaseStage: {
      ...schema.releaseStage,
      defaultValue: hostname === "localhost" ? "development" : "production"
    },
    autoInstrumentFullPageLoads: {
      defaultValue: true,
      message: "should be true|false",
      validate: isBoolean
    },
    autoInstrumentNetworkRequests: {
      defaultValue: true,
      message: "should be true|false",
      validate: isBoolean
    },
    autoInstrumentRouteChanges: {
      defaultValue: true,
      message: "should be true|false",
      validate: isBoolean
    },
    generateAnonymousId: {
      defaultValue: true,
      message: "should be true|false",
      validate: isBoolean
    },
    routingProvider: {
      defaultValue: defaultRoutingProvider,
      message: "should be a routing provider",
      validate: isRoutingProvider
    },
    settleIgnoreUrls: {
      defaultValue: [],
      message: "should be an array of string|RegExp",
      validate: isStringOrRegExpArray
    },
    networkRequestCallback: {
      defaultValue: defaultNetworkRequestCallback,
      message: "should be a function",
      validate: isNetworkRequestCallback
    },
    sendPageAttributes: {
      defaultValue: defaultSendPageAttributes,
      message: "should be an object",
      validate: isSendPageAttributes
    },
    serviceName: {
      defaultValue: "unknown_service",
      message: "should be a string",
      validate: isStringWithLength
    }
  };
}

// node_modules/@bugsnag/browser-performance/dist/id-generator.js
function toHex(value) {
  const hex = value.toString(16);
  if (hex.length === 1) {
    return "0" + hex;
  }
  return hex;
}
var idGenerator = {
  generate(bits) {
    const bytes = new Uint8Array(bits / 8);
    const randomValues = window.crypto.getRandomValues(bytes);
    return Array.from(randomValues).map(toHex).join("");
  }
};

// node_modules/@bugsnag/browser-performance/dist/on-settle/settler.js
var Settler = class {
  constructor(clock) {
    this.settled = false;
    this.callbacks = /* @__PURE__ */ new Set();
    this.clock = clock;
  }
  subscribe(callback) {
    this.callbacks.add(callback);
    if (this.isSettled()) {
      callback(this.clock.now());
    }
  }
  unsubscribe(callback) {
    this.callbacks.delete(callback);
  }
  isSettled() {
    return this.settled;
  }
  settle(settledTime) {
    this.settled = true;
    for (const callback of this.callbacks) {
      callback(settledTime);
    }
  }
};

// node_modules/@bugsnag/browser-performance/dist/on-settle/dom-mutation-settler.js
var DomMutationSettler = class extends Settler {
  constructor(clock, target) {
    super(clock);
    this.timeout = void 0;
    const observer = new MutationObserver(() => {
      this.restart();
    });
    observer.observe(target, {
      subtree: true,
      childList: true,
      characterData: true
      // we don't track attribute changes as they may or may not be user visible
      // so we assume they won't affect the page appearing settled to the user
    });
    this.restart();
  }
  restart() {
    clearTimeout(this.timeout);
    this.settled = false;
    const settledTime = this.clock.now();
    this.timeout = setTimeout(() => {
      this.settle(settledTime);
    }, 100);
  }
};

// node_modules/@bugsnag/browser-performance/dist/on-settle/load-event-end-settler.js
function isPerformanceNavigationTiming(entry) {
  return !!entry && entry.entryType === "navigation";
}
var LoadEventEndSettler = class extends Settler {
  constructor(clock, addEventListener2, performance2, document2) {
    super(clock);
    if (document2.readyState === "complete") {
      setTimeout(() => {
        this.settleUsingPerformance(performance2);
      }, 0);
    } else {
      addEventListener2("load", () => {
        setTimeout(() => {
          this.settleUsingPerformance(performance2);
        }, 0);
      });
    }
  }
  settleUsingPerformance(performance2) {
    const now = this.clock.now();
    const entry = typeof performance2.getEntriesByType === "function" ? performance2.getEntriesByType("navigation")[0] : void 0;
    let settledTime = 0;
    if (isPerformanceNavigationTiming(entry)) {
      settledTime = entry.loadEventEnd;
    } else if (performance2.timing) {
      settledTime = performance2.timing.loadEventEnd - performance2.timing.navigationStart;
    }
    if (settledTime <= 0 || settledTime > now) {
      settledTime = now;
    }
    this.settle(settledTime);
  }
};

// node_modules/@bugsnag/browser-performance/dist/on-settle/request-settler.js
var RequestSettler = class extends Settler {
  constructor(clock, requestTracker) {
    super(clock);
    this.timeout = void 0;
    this.urlsToIgnore = [];
    this.outstandingRequests = 0;
    this.settled = true;
    requestTracker.onStart(this.onRequestStart.bind(this));
  }
  setUrlsToIgnore(urlsToIgnore) {
    this.urlsToIgnore = urlsToIgnore;
  }
  onRequestStart(startContext) {
    if (this.shouldIgnoreUrl(startContext.url))
      return;
    clearTimeout(this.timeout);
    this.settled = false;
    ++this.outstandingRequests;
    return {
      onRequestEnd: (endContext) => {
        if (--this.outstandingRequests === 0) {
          const settledTime = this.clock.now();
          this.timeout = setTimeout(() => {
            this.settle(settledTime);
          }, 100);
        }
      }
    };
  }
  shouldIgnoreUrl(url) {
    return this.urlsToIgnore.some((regexp) => regexp.test(url));
  }
};

// node_modules/@bugsnag/browser-performance/dist/on-settle/settler-aggregate.js
var SettlerAggregate = class extends Settler {
  constructor(clock, settlers) {
    super(clock);
    this.settlers = settlers;
    for (const settler of settlers) {
      settler.subscribe((settledTime) => {
        if (this.settlersAreSettled()) {
          this.settle(settledTime);
        } else {
          this.settled = false;
        }
      });
    }
  }
  isSettled() {
    return super.isSettled() && this.settlersAreSettled();
  }
  settlersAreSettled() {
    for (const settler of this.settlers) {
      if (!settler.isSettled()) {
        return false;
      }
    }
    return true;
  }
};

// node_modules/@bugsnag/browser-performance/dist/on-settle/index.js
var TIMEOUT_MILLISECONDS = 60 * 1e3;
function createNoopOnSettle() {
  const noop = () => {
  };
  noop.configure = () => {
  };
  return noop;
}
function createOnSettle(clock, window2, fetchRequestTracker, xhrRequestTracker, performance2) {
  const domMutationSettler = new DomMutationSettler(clock, window2.document);
  const fetchRequestSettler = new RequestSettler(clock, fetchRequestTracker);
  const xhrRequestSettler = new RequestSettler(clock, xhrRequestTracker);
  const loadEventEndSettler = new LoadEventEndSettler(clock, window2.addEventListener, performance2, window2.document);
  const settler = new SettlerAggregate(clock, [
    domMutationSettler,
    loadEventEndSettler,
    fetchRequestSettler,
    xhrRequestSettler
  ]);
  function onSettlePlugin(callback) {
    const onSettle2 = (settledTime2) => {
      clearTimeout(timeout);
      settler.unsubscribe(onSettle2);
      callback(settledTime2);
    };
    const timeout = setTimeout(() => {
      const settledTime2 = clock.now();
      settler.unsubscribe(onSettle2);
      callback(settledTime2);
    }, TIMEOUT_MILLISECONDS);
    const cooldown = settler.isSettled() ? 100 : 0;
    const settledTime = clock.now();
    setTimeout(() => {
      if (settler.isSettled()) {
        onSettle2(settledTime);
      } else {
        settler.subscribe(onSettle2);
      }
    }, cooldown);
  }
  onSettlePlugin.configure = function(configuration) {
    const settleIgnoreUrls = configuration.settleIgnoreUrls.map((url) => typeof url === "string" ? RegExp(url) : url).concat(RegExp(configuration.endpoint));
    fetchRequestSettler.setUrlsToIgnore(settleIgnoreUrls);
    xhrRequestSettler.setUrlsToIgnore(settleIgnoreUrls);
  };
  return onSettlePlugin;
}

// node_modules/@bugsnag/browser-performance/dist/persistence.js
function makeBrowserPersistence(window2) {
  try {
    if (window2.localStorage) {
      return new BrowserPersistence(window2.localStorage);
    }
  } catch (_a) {
  }
  return new InMemoryPersistence();
}
function toString(key, value) {
  switch (key) {
    case "bugsnag-sampling-probability":
      return JSON.stringify(value);
    case "bugsnag-anonymous-id":
      return value;
    default:
      return key;
  }
}
var BrowserPersistence = class {
  constructor(localStorage) {
    this.storage = localStorage;
  }
  async load(key) {
    try {
      const raw = this.storage.getItem(key);
      if (raw) {
        return toPersistedPayload(key, raw);
      }
    } catch (_a) {
    }
  }
  async save(key, value) {
    try {
      this.storage.setItem(key, toString(key, value));
    } catch (_a) {
    }
  }
};

// node_modules/@bugsnag/browser-performance/dist/resource-attributes-source.js
function createResourceAttributesSource(navigator2, persistence) {
  let getDeviceId;
  let deviceId;
  return function resourceAttributesSource(config) {
    const attributes = new ResourceAttributes(config.releaseStage, config.appVersion, config.serviceName, "bugsnag.performance.browser", "2.12.0", config.logger);
    attributes.set("browser.user_agent", navigator2.userAgent);
    if (navigator2.userAgentData) {
      attributes.set("browser.platform", navigator2.userAgentData.platform);
      attributes.set("browser.mobile", navigator2.userAgentData.mobile);
    }
    if (config.generateAnonymousId) {
      if (!getDeviceId) {
        getDeviceId = persistence.load("bugsnag-anonymous-id").then((maybeAnonymousId) => {
          const anonymousId = maybeAnonymousId || index_esm_default();
          if (!maybeAnonymousId) {
            persistence.save("bugsnag-anonymous-id", anonymousId);
          }
          deviceId = anonymousId;
          return deviceId;
        });
      }
      if (deviceId) {
        attributes.set("device.id", deviceId);
      } else {
        return getDeviceId.then((deviceId2) => {
          attributes.set("device.id", deviceId2);
          return attributes;
        });
      }
    }
    return Promise.resolve(attributes);
  };
}

// node_modules/@bugsnag/browser-performance/dist/span-attributes-source.js
var createSpanAttributesSource = (document2) => {
  const defaultAttributes = {
    url: {
      name: "bugsnag.browser.page.url",
      getValue: () => document2.location.href,
      permitted: false
    },
    title: {
      name: "bugsnag.browser.page.title",
      getValue: () => document2.title,
      permitted: false
    }
  };
  return {
    configure(configuration) {
      defaultAttributes.title.permitted = configuration.sendPageAttributes.title || false;
      defaultAttributes.url.permitted = configuration.sendPageAttributes.url || false;
    },
    requestAttributes(span) {
      for (const attribute of Object.values(defaultAttributes)) {
        if (attribute.permitted) {
          span.setAttribute(attribute.name, attribute.getValue());
        }
      }
    }
  };
};

// node_modules/@bugsnag/browser-performance/dist/web-vitals.js
var WebVitals = class {
  constructor(performance2, clock, PerformanceObserverClass) {
    this.performance = performance2;
    this.clock = clock;
    this.observers = [];
    if (PerformanceObserverClass && Array.isArray(PerformanceObserverClass.supportedEntryTypes)) {
      const supportedEntryTypes = PerformanceObserverClass.supportedEntryTypes;
      if (supportedEntryTypes.includes("largest-contentful-paint")) {
        this.observeLargestContentfulPaint(PerformanceObserverClass);
      }
      if (supportedEntryTypes.includes("layout-shift")) {
        this.observeLayoutShift(PerformanceObserverClass);
      }
    }
  }
  attachTo(span) {
    const firstContentfulPaint = this.firstContentfulPaint();
    if (firstContentfulPaint) {
      span.addEvent("fcp", firstContentfulPaint);
    }
    const timeToFirstByte = this.timeToFirstByte();
    if (timeToFirstByte) {
      span.addEvent("ttfb", timeToFirstByte);
    }
    const firstInputDelay = this.firstInputDelay();
    if (firstInputDelay) {
      span.addEvent("fid_start", firstInputDelay.start);
      span.addEvent("fid_end", firstInputDelay.end);
    }
    if (this.cumulativeLayoutShift) {
      span.setAttribute("bugsnag.metrics.cls", this.cumulativeLayoutShift);
    }
    if (this.largestContentfulPaint) {
      span.addEvent("lcp", this.largestContentfulPaint);
    }
    for (const observer of this.observers) {
      observer.disconnect();
    }
  }
  firstContentfulPaint() {
    const entries = this.performance.getEntriesByName("first-contentful-paint", "paint");
    const entry = Array.isArray(entries) && entries[0];
    if (entry) {
      return entry.startTime;
    }
  }
  timeToFirstByte() {
    const entries = this.performance.getEntriesByType("navigation");
    const entry = Array.isArray(entries) && entries[0];
    let responseStart;
    if (entry) {
      responseStart = entry.responseStart;
    } else {
      responseStart = this.performance.timing.responseStart - this.performance.timing.navigationStart;
    }
    if (responseStart > 0 && responseStart <= this.clock.now()) {
      return responseStart;
    }
  }
  firstInputDelay() {
    const entries = this.performance.getEntriesByType("first-input");
    const entry = Array.isArray(entries) && entries[0];
    if (entry) {
      return {
        start: entry.startTime,
        end: entry.processingStart
      };
    }
  }
  observeLargestContentfulPaint(PerformanceObserverClass) {
    const observer = new PerformanceObserverClass((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        this.largestContentfulPaint = entries[entries.length - 1].startTime;
      }
    });
    observer.observe({ type: "largest-contentful-paint", buffered: true });
    this.observers.push(observer);
  }
  observeLayoutShift(PerformanceObserverClass) {
    let session;
    const observer = new PerformanceObserverClass((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) {
          continue;
        }
        if (session && entry.startTime - session.previousStartTime < 1e3 && entry.startTime - session.firstStartTime < 5e3) {
          session.value += entry.value;
          session.previousStartTime = entry.startTime;
        } else {
          session = {
            value: entry.value,
            firstStartTime: entry.startTime,
            previousStartTime: entry.startTime
          };
        }
      }
      if (session && (this.cumulativeLayoutShift === void 0 || session.value > this.cumulativeLayoutShift)) {
        this.cumulativeLayoutShift = session.value;
      }
    });
    observer.observe({ type: "layout-shift", buffered: true });
    this.observers.push(observer);
  }
};

// node_modules/@bugsnag/browser-performance/dist/browser.js
var onSettle;
var DefaultRoutingProvider;
var BugsnagPerformance;
if (typeof window === "undefined" || typeof document === "undefined") {
  onSettle = createNoopOnSettle();
  DefaultRoutingProvider = createNoopRoutingProvider();
  BugsnagPerformance = createNoopClient();
} else {
  const backgroundingListener = createBrowserBackgroundingListener(window);
  const spanAttributesSource = createSpanAttributesSource(document);
  const clock = createClock(performance, backgroundingListener);
  const persistence = makeBrowserPersistence(window);
  const resourceAttributesSource = createResourceAttributesSource(navigator, persistence);
  const fetchRequestTracker = createFetchRequestTracker(window, clock);
  const xhrRequestTracker = createXmlHttpRequestTracker(XMLHttpRequest, clock, document);
  const webVitals = new WebVitals(performance, clock, window.PerformanceObserver);
  onSettle = createOnSettle(clock, window, fetchRequestTracker, xhrRequestTracker, performance);
  DefaultRoutingProvider = createDefaultRoutingProvider(onSettle, window.location);
  BugsnagPerformance = createClient({
    backgroundingListener,
    clock,
    resourceAttributesSource,
    spanAttributesSource,
    deliveryFactory: createFetchDeliveryFactory(window.fetch, clock, backgroundingListener),
    idGenerator,
    schema: createSchema(window.location.hostname, new DefaultRoutingProvider()),
    plugins: (spanFactory, spanContextStorage, setAppState, appState) => [
      onSettle,
      new FullPageLoadPlugin(document, window.location, spanFactory, webVitals, onSettle, backgroundingListener, performance, setAppState, appState),
      // ResourceLoadPlugin should always come after FullPageLoad plugin, as it should use that
      // span context as the parent of it's spans
      new ResourceLoadPlugin(spanFactory, spanContextStorage, window.PerformanceObserver),
      new NetworkRequestPlugin(spanFactory, spanContextStorage, fetchRequestTracker, xhrRequestTracker),
      new RouteChangePlugin(spanFactory, window.location, document, setAppState)
    ],
    persistence,
    retryQueueFactory: (delivery, retryQueueMaxSize) => new InMemoryQueue(delivery, retryQueueMaxSize)
  });
}
var BugsnagPerformance$1 = BugsnagPerformance;
export {
  DefaultRoutingProvider,
  BugsnagPerformance$1 as default,
  onSettle
};
//# sourceMappingURL=@bugsnag_browser-performance.js.map
