var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/json/builder.js
var require_builder = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/json/builder.js"(exports, module2) {
    var util2 = require_util();
    function JsonBuilder() {
    }
    JsonBuilder.prototype.build = function(value, shape) {
      return JSON.stringify(translate(value, shape));
    };
    function translate(value, shape) {
      if (!shape || value === void 0 || value === null)
        return void 0;
      switch (shape.type) {
        case "structure":
          return translateStructure(value, shape);
        case "map":
          return translateMap(value, shape);
        case "list":
          return translateList(value, shape);
        default:
          return translateScalar(value, shape);
      }
    }
    function translateStructure(structure, shape) {
      if (shape.isDocument) {
        return structure;
      }
      var struct = {};
      util2.each(structure, function(name, value) {
        var memberShape = shape.members[name];
        if (memberShape) {
          if (memberShape.location !== "body")
            return;
          var locationName = memberShape.isLocationName ? memberShape.name : name;
          var result = translate(value, memberShape);
          if (result !== void 0)
            struct[locationName] = result;
        }
      });
      return struct;
    }
    function translateList(list, shape) {
      var out = [];
      util2.arrayEach(list, function(value) {
        var result = translate(value, shape.member);
        if (result !== void 0)
          out.push(result);
      });
      return out;
    }
    function translateMap(map, shape) {
      var out = {};
      util2.each(map, function(key, value) {
        var result = translate(value, shape.value);
        if (result !== void 0)
          out[key] = result;
      });
      return out;
    }
    function translateScalar(value, shape) {
      return shape.toWireFormat(value);
    }
    module2.exports = JsonBuilder;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/json/parser.js
var require_parser = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/json/parser.js"(exports, module2) {
    var util2 = require_util();
    function JsonParser() {
    }
    JsonParser.prototype.parse = function(value, shape) {
      return translate(JSON.parse(value), shape);
    };
    function translate(value, shape) {
      if (!shape || value === void 0)
        return void 0;
      switch (shape.type) {
        case "structure":
          return translateStructure(value, shape);
        case "map":
          return translateMap(value, shape);
        case "list":
          return translateList(value, shape);
        default:
          return translateScalar(value, shape);
      }
    }
    function translateStructure(structure, shape) {
      if (structure == null)
        return void 0;
      if (shape.isDocument)
        return structure;
      var struct = {};
      var shapeMembers = shape.members;
      util2.each(shapeMembers, function(name, memberShape) {
        var locationName = memberShape.isLocationName ? memberShape.name : name;
        if (Object.prototype.hasOwnProperty.call(structure, locationName)) {
          var value = structure[locationName];
          var result = translate(value, memberShape);
          if (result !== void 0)
            struct[name] = result;
        }
      });
      return struct;
    }
    function translateList(list, shape) {
      if (list == null)
        return void 0;
      var out = [];
      util2.arrayEach(list, function(value) {
        var result = translate(value, shape.member);
        if (result === void 0)
          out.push(null);
        else
          out.push(result);
      });
      return out;
    }
    function translateMap(map, shape) {
      if (map == null)
        return void 0;
      var out = {};
      util2.each(map, function(key, value) {
        var result = translate(value, shape.value);
        if (result === void 0)
          out[key] = null;
        else
          out[key] = result;
      });
      return out;
    }
    function translateScalar(value, shape) {
      return shape.toType(value);
    }
    module2.exports = JsonParser;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/protocol/helpers.js
var require_helpers = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/protocol/helpers.js"(exports, module2) {
    var util2 = require_util();
    var AWS2 = require_core();
    function populateHostPrefix(request) {
      var enabled = request.service.config.hostPrefixEnabled;
      if (!enabled)
        return request;
      var operationModel = request.service.api.operations[request.operation];
      if (hasEndpointDiscover(request))
        return request;
      if (operationModel.endpoint && operationModel.endpoint.hostPrefix) {
        var hostPrefixNotation = operationModel.endpoint.hostPrefix;
        var hostPrefix = expandHostPrefix(hostPrefixNotation, request.params, operationModel.input);
        prependEndpointPrefix(request.httpRequest.endpoint, hostPrefix);
        validateHostname(request.httpRequest.endpoint.hostname);
      }
      return request;
    }
    function hasEndpointDiscover(request) {
      var api = request.service.api;
      var operationModel = api.operations[request.operation];
      var isEndpointOperation = api.endpointOperation && api.endpointOperation === util2.string.lowerFirst(operationModel.name);
      return operationModel.endpointDiscoveryRequired !== "NULL" || isEndpointOperation === true;
    }
    function expandHostPrefix(hostPrefixNotation, params, shape) {
      util2.each(shape.members, function(name, member) {
        if (member.hostLabel === true) {
          if (typeof params[name] !== "string" || params[name] === "") {
            throw util2.error(new Error(), {
              message: "Parameter " + name + " should be a non-empty string.",
              code: "InvalidParameter"
            });
          }
          var regex = new RegExp("\\{" + name + "\\}", "g");
          hostPrefixNotation = hostPrefixNotation.replace(regex, params[name]);
        }
      });
      return hostPrefixNotation;
    }
    function prependEndpointPrefix(endpoint, prefix) {
      if (endpoint.host) {
        endpoint.host = prefix + endpoint.host;
      }
      if (endpoint.hostname) {
        endpoint.hostname = prefix + endpoint.hostname;
      }
    }
    function validateHostname(hostname) {
      var labels = hostname.split(".");
      var hostPattern = /^[a-zA-Z0-9]{1}$|^[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9]$/;
      util2.arrayEach(labels, function(label) {
        if (!label.length || label.length < 1 || label.length > 63) {
          throw util2.error(new Error(), {
            code: "ValidationError",
            message: "Hostname label length should be between 1 to 63 characters, inclusive."
          });
        }
        if (!hostPattern.test(label)) {
          throw AWS2.util.error(
            new Error(),
            { code: "ValidationError", message: label + " is not hostname compatible." }
          );
        }
      });
    }
    module2.exports = {
      populateHostPrefix
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/protocol/json.js
var require_json = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/protocol/json.js"(exports, module2) {
    var util2 = require_util();
    var JsonBuilder = require_builder();
    var JsonParser = require_parser();
    var populateHostPrefix = require_helpers().populateHostPrefix;
    function buildRequest(req) {
      var httpRequest = req.httpRequest;
      var api = req.service.api;
      var target = api.targetPrefix + "." + api.operations[req.operation].name;
      var version = api.jsonVersion || "1.0";
      var input = api.operations[req.operation].input;
      var builder = new JsonBuilder();
      if (version === 1)
        version = "1.0";
      httpRequest.body = builder.build(req.params || {}, input);
      httpRequest.headers["Content-Type"] = "application/x-amz-json-" + version;
      httpRequest.headers["X-Amz-Target"] = target;
      populateHostPrefix(req);
    }
    function extractError(resp) {
      var error = {};
      var httpResponse = resp.httpResponse;
      error.code = httpResponse.headers["x-amzn-errortype"] || "UnknownError";
      if (typeof error.code === "string") {
        error.code = error.code.split(":")[0];
      }
      if (httpResponse.body.length > 0) {
        try {
          var e = JSON.parse(httpResponse.body.toString());
          var code = e.__type || e.code || e.Code;
          if (code) {
            error.code = code.split("#").pop();
          }
          if (error.code === "RequestEntityTooLarge") {
            error.message = "Request body must be less than 1 MB";
          } else {
            error.message = e.message || e.Message || null;
          }
        } catch (e2) {
          error.statusCode = httpResponse.statusCode;
          error.message = httpResponse.statusMessage;
        }
      } else {
        error.statusCode = httpResponse.statusCode;
        error.message = httpResponse.statusCode.toString();
      }
      resp.error = util2.error(new Error(), error);
    }
    function extractData(resp) {
      var body = resp.httpResponse.body.toString() || "{}";
      if (resp.request.service.config.convertResponseTypes === false) {
        resp.data = JSON.parse(body);
      } else {
        var operation = resp.request.service.api.operations[resp.request.operation];
        var shape = operation.output || {};
        var parser = new JsonParser();
        resp.data = parser.parse(body, shape);
      }
    }
    module2.exports = {
      buildRequest,
      extractError,
      extractData
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/query/query_param_serializer.js
var require_query_param_serializer = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/query/query_param_serializer.js"(exports, module2) {
    var util2 = require_util();
    function QueryParamSerializer() {
    }
    QueryParamSerializer.prototype.serialize = function(params, shape, fn) {
      serializeStructure("", params, shape, fn);
    };
    function ucfirst(shape) {
      if (shape.isQueryName || shape.api.protocol !== "ec2") {
        return shape.name;
      } else {
        return shape.name[0].toUpperCase() + shape.name.substr(1);
      }
    }
    function serializeStructure(prefix, struct, rules, fn) {
      util2.each(rules.members, function(name, member) {
        var value = struct[name];
        if (value === null || value === void 0)
          return;
        var memberName = ucfirst(member);
        memberName = prefix ? prefix + "." + memberName : memberName;
        serializeMember(memberName, value, member, fn);
      });
    }
    function serializeMap(name, map, rules, fn) {
      var i = 1;
      util2.each(map, function(key, value) {
        var prefix = rules.flattened ? "." : ".entry.";
        var position = prefix + i++ + ".";
        var keyName = position + (rules.key.name || "key");
        var valueName = position + (rules.value.name || "value");
        serializeMember(name + keyName, key, rules.key, fn);
        serializeMember(name + valueName, value, rules.value, fn);
      });
    }
    function serializeList(name, list, rules, fn) {
      var memberRules = rules.member || {};
      if (list.length === 0) {
        fn.call(this, name, null);
        return;
      }
      util2.arrayEach(list, function(v, n) {
        var suffix = "." + (n + 1);
        if (rules.api.protocol === "ec2") {
          suffix = suffix + "";
        } else if (rules.flattened) {
          if (memberRules.name) {
            var parts = name.split(".");
            parts.pop();
            parts.push(ucfirst(memberRules));
            name = parts.join(".");
          }
        } else {
          suffix = "." + (memberRules.name ? memberRules.name : "member") + suffix;
        }
        serializeMember(name + suffix, v, memberRules, fn);
      });
    }
    function serializeMember(name, value, rules, fn) {
      if (value === null || value === void 0)
        return;
      if (rules.type === "structure") {
        serializeStructure(name, value, rules, fn);
      } else if (rules.type === "list") {
        serializeList(name, value, rules, fn);
      } else if (rules.type === "map") {
        serializeMap(name, value, rules, fn);
      } else {
        fn(name, rules.toWireFormat(value).toString());
      }
    }
    module2.exports = QueryParamSerializer;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/model/collection.js
var require_collection = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/model/collection.js"(exports, module2) {
    var memoizedProperty = require_util().memoizedProperty;
    function memoize(name, value, factory, nameTr) {
      memoizedProperty(this, nameTr(name), function() {
        return factory(name, value);
      });
    }
    function Collection(iterable, options, factory, nameTr, callback) {
      nameTr = nameTr || String;
      var self = this;
      for (var id in iterable) {
        if (Object.prototype.hasOwnProperty.call(iterable, id)) {
          memoize.call(self, id, iterable[id], factory, nameTr);
          if (callback)
            callback(id, iterable[id]);
        }
      }
    }
    module2.exports = Collection;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/model/shape.js
var require_shape = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/model/shape.js"(exports, module2) {
    var Collection = require_collection();
    var util2 = require_util();
    function property(obj, name, value) {
      if (value !== null && value !== void 0) {
        util2.property.apply(this, arguments);
      }
    }
    function memoizedProperty(obj, name) {
      if (!obj.constructor.prototype[name]) {
        util2.memoizedProperty.apply(this, arguments);
      }
    }
    function Shape(shape, options, memberName) {
      options = options || {};
      property(this, "shape", shape.shape);
      property(this, "api", options.api, false);
      property(this, "type", shape.type);
      property(this, "enum", shape.enum);
      property(this, "min", shape.min);
      property(this, "max", shape.max);
      property(this, "pattern", shape.pattern);
      property(this, "location", shape.location || this.location || "body");
      property(this, "name", this.name || shape.xmlName || shape.queryName || shape.locationName || memberName);
      property(this, "isStreaming", shape.streaming || this.isStreaming || false);
      property(this, "requiresLength", shape.requiresLength, false);
      property(this, "isComposite", shape.isComposite || false);
      property(this, "isShape", true, false);
      property(this, "isQueryName", Boolean(shape.queryName), false);
      property(this, "isLocationName", Boolean(shape.locationName), false);
      property(this, "isIdempotent", shape.idempotencyToken === true);
      property(this, "isJsonValue", shape.jsonvalue === true);
      property(this, "isSensitive", shape.sensitive === true || shape.prototype && shape.prototype.sensitive === true);
      property(this, "isEventStream", Boolean(shape.eventstream), false);
      property(this, "isEvent", Boolean(shape.event), false);
      property(this, "isEventPayload", Boolean(shape.eventpayload), false);
      property(this, "isEventHeader", Boolean(shape.eventheader), false);
      property(this, "isTimestampFormatSet", Boolean(shape.timestampFormat) || shape.prototype && shape.prototype.isTimestampFormatSet === true, false);
      property(this, "endpointDiscoveryId", Boolean(shape.endpointdiscoveryid), false);
      property(this, "hostLabel", Boolean(shape.hostLabel), false);
      if (options.documentation) {
        property(this, "documentation", shape.documentation);
        property(this, "documentationUrl", shape.documentationUrl);
      }
      if (shape.xmlAttribute) {
        property(this, "isXmlAttribute", shape.xmlAttribute || false);
      }
      property(this, "defaultValue", null);
      this.toWireFormat = function(value) {
        if (value === null || value === void 0)
          return "";
        return value;
      };
      this.toType = function(value) {
        return value;
      };
    }
    Shape.normalizedTypes = {
      character: "string",
      double: "float",
      long: "integer",
      short: "integer",
      biginteger: "integer",
      bigdecimal: "float",
      blob: "binary"
    };
    Shape.types = {
      "structure": StructureShape,
      "list": ListShape,
      "map": MapShape,
      "boolean": BooleanShape,
      "timestamp": TimestampShape,
      "float": FloatShape,
      "integer": IntegerShape,
      "string": StringShape,
      "base64": Base64Shape,
      "binary": BinaryShape
    };
    Shape.resolve = function resolve(shape, options) {
      if (shape.shape) {
        var refShape = options.api.shapes[shape.shape];
        if (!refShape) {
          throw new Error("Cannot find shape reference: " + shape.shape);
        }
        return refShape;
      } else {
        return null;
      }
    };
    Shape.create = function create(shape, options, memberName) {
      if (shape.isShape)
        return shape;
      var refShape = Shape.resolve(shape, options);
      if (refShape) {
        var filteredKeys = Object.keys(shape);
        if (!options.documentation) {
          filteredKeys = filteredKeys.filter(function(name) {
            return !name.match(/documentation/);
          });
        }
        var InlineShape = function() {
          refShape.constructor.call(this, shape, options, memberName);
        };
        InlineShape.prototype = refShape;
        return new InlineShape();
      } else {
        if (!shape.type) {
          if (shape.members)
            shape.type = "structure";
          else if (shape.member)
            shape.type = "list";
          else if (shape.key)
            shape.type = "map";
          else
            shape.type = "string";
        }
        var origType = shape.type;
        if (Shape.normalizedTypes[shape.type]) {
          shape.type = Shape.normalizedTypes[shape.type];
        }
        if (Shape.types[shape.type]) {
          return new Shape.types[shape.type](shape, options, memberName);
        } else {
          throw new Error("Unrecognized shape type: " + origType);
        }
      }
    };
    function CompositeShape(shape) {
      Shape.apply(this, arguments);
      property(this, "isComposite", true);
      if (shape.flattened) {
        property(this, "flattened", shape.flattened || false);
      }
    }
    function StructureShape(shape, options) {
      var self = this;
      var requiredMap = null, firstInit = !this.isShape;
      CompositeShape.apply(this, arguments);
      if (firstInit) {
        property(this, "defaultValue", function() {
          return {};
        });
        property(this, "members", {});
        property(this, "memberNames", []);
        property(this, "required", []);
        property(this, "isRequired", function() {
          return false;
        });
        property(this, "isDocument", Boolean(shape.document));
      }
      if (shape.members) {
        property(this, "members", new Collection(shape.members, options, function(name, member) {
          return Shape.create(member, options, name);
        }));
        memoizedProperty(this, "memberNames", function() {
          return shape.xmlOrder || Object.keys(shape.members);
        });
        if (shape.event) {
          memoizedProperty(this, "eventPayloadMemberName", function() {
            var members = self.members;
            var memberNames = self.memberNames;
            for (var i = 0, iLen = memberNames.length; i < iLen; i++) {
              if (members[memberNames[i]].isEventPayload) {
                return memberNames[i];
              }
            }
          });
          memoizedProperty(this, "eventHeaderMemberNames", function() {
            var members = self.members;
            var memberNames = self.memberNames;
            var eventHeaderMemberNames = [];
            for (var i = 0, iLen = memberNames.length; i < iLen; i++) {
              if (members[memberNames[i]].isEventHeader) {
                eventHeaderMemberNames.push(memberNames[i]);
              }
            }
            return eventHeaderMemberNames;
          });
        }
      }
      if (shape.required) {
        property(this, "required", shape.required);
        property(this, "isRequired", function(name) {
          if (!requiredMap) {
            requiredMap = {};
            for (var i = 0; i < shape.required.length; i++) {
              requiredMap[shape.required[i]] = true;
            }
          }
          return requiredMap[name];
        }, false, true);
      }
      property(this, "resultWrapper", shape.resultWrapper || null);
      if (shape.payload) {
        property(this, "payload", shape.payload);
      }
      if (typeof shape.xmlNamespace === "string") {
        property(this, "xmlNamespaceUri", shape.xmlNamespace);
      } else if (typeof shape.xmlNamespace === "object") {
        property(this, "xmlNamespacePrefix", shape.xmlNamespace.prefix);
        property(this, "xmlNamespaceUri", shape.xmlNamespace.uri);
      }
    }
    function ListShape(shape, options) {
      var self = this, firstInit = !this.isShape;
      CompositeShape.apply(this, arguments);
      if (firstInit) {
        property(this, "defaultValue", function() {
          return [];
        });
      }
      if (shape.member) {
        memoizedProperty(this, "member", function() {
          return Shape.create(shape.member, options);
        });
      }
      if (this.flattened) {
        var oldName = this.name;
        memoizedProperty(this, "name", function() {
          return self.member.name || oldName;
        });
      }
    }
    function MapShape(shape, options) {
      var firstInit = !this.isShape;
      CompositeShape.apply(this, arguments);
      if (firstInit) {
        property(this, "defaultValue", function() {
          return {};
        });
        property(this, "key", Shape.create({ type: "string" }, options));
        property(this, "value", Shape.create({ type: "string" }, options));
      }
      if (shape.key) {
        memoizedProperty(this, "key", function() {
          return Shape.create(shape.key, options);
        });
      }
      if (shape.value) {
        memoizedProperty(this, "value", function() {
          return Shape.create(shape.value, options);
        });
      }
    }
    function TimestampShape(shape) {
      var self = this;
      Shape.apply(this, arguments);
      if (shape.timestampFormat) {
        property(this, "timestampFormat", shape.timestampFormat);
      } else if (self.isTimestampFormatSet && this.timestampFormat) {
        property(this, "timestampFormat", this.timestampFormat);
      } else if (this.location === "header") {
        property(this, "timestampFormat", "rfc822");
      } else if (this.location === "querystring") {
        property(this, "timestampFormat", "iso8601");
      } else if (this.api) {
        switch (this.api.protocol) {
          case "json":
          case "rest-json":
            property(this, "timestampFormat", "unixTimestamp");
            break;
          case "rest-xml":
          case "query":
          case "ec2":
            property(this, "timestampFormat", "iso8601");
            break;
        }
      }
      this.toType = function(value) {
        if (value === null || value === void 0)
          return null;
        if (typeof value.toUTCString === "function")
          return value;
        return typeof value === "string" || typeof value === "number" ? util2.date.parseTimestamp(value) : null;
      };
      this.toWireFormat = function(value) {
        return util2.date.format(value, self.timestampFormat);
      };
    }
    function StringShape() {
      Shape.apply(this, arguments);
      var nullLessProtocols = ["rest-xml", "query", "ec2"];
      this.toType = function(value) {
        value = this.api && nullLessProtocols.indexOf(this.api.protocol) > -1 ? value || "" : value;
        if (this.isJsonValue) {
          return JSON.parse(value);
        }
        return value && typeof value.toString === "function" ? value.toString() : value;
      };
      this.toWireFormat = function(value) {
        return this.isJsonValue ? JSON.stringify(value) : value;
      };
    }
    function FloatShape() {
      Shape.apply(this, arguments);
      this.toType = function(value) {
        if (value === null || value === void 0)
          return null;
        return parseFloat(value);
      };
      this.toWireFormat = this.toType;
    }
    function IntegerShape() {
      Shape.apply(this, arguments);
      this.toType = function(value) {
        if (value === null || value === void 0)
          return null;
        return parseInt(value, 10);
      };
      this.toWireFormat = this.toType;
    }
    function BinaryShape() {
      Shape.apply(this, arguments);
      this.toType = function(value) {
        var buf = util2.base64.decode(value);
        if (this.isSensitive && util2.isNode() && typeof util2.Buffer.alloc === "function") {
          var secureBuf = util2.Buffer.alloc(buf.length, buf);
          buf.fill(0);
          buf = secureBuf;
        }
        return buf;
      };
      this.toWireFormat = util2.base64.encode;
    }
    function Base64Shape() {
      BinaryShape.apply(this, arguments);
    }
    function BooleanShape() {
      Shape.apply(this, arguments);
      this.toType = function(value) {
        if (typeof value === "boolean")
          return value;
        if (value === null || value === void 0)
          return null;
        return value === "true";
      };
    }
    Shape.shapes = {
      StructureShape,
      ListShape,
      MapShape,
      StringShape,
      BooleanShape,
      Base64Shape
    };
    module2.exports = Shape;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/protocol/query.js
var require_query = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/protocol/query.js"(exports, module2) {
    var AWS2 = require_core();
    var util2 = require_util();
    var QueryParamSerializer = require_query_param_serializer();
    var Shape = require_shape();
    var populateHostPrefix = require_helpers().populateHostPrefix;
    function buildRequest(req) {
      var operation = req.service.api.operations[req.operation];
      var httpRequest = req.httpRequest;
      httpRequest.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
      httpRequest.params = {
        Version: req.service.api.apiVersion,
        Action: operation.name
      };
      var builder = new QueryParamSerializer();
      builder.serialize(req.params, operation.input, function(name, value) {
        httpRequest.params[name] = value;
      });
      httpRequest.body = util2.queryParamsToString(httpRequest.params);
      populateHostPrefix(req);
    }
    function extractError(resp) {
      var data, body = resp.httpResponse.body.toString();
      if (body.match("<UnknownOperationException")) {
        data = {
          Code: "UnknownOperation",
          Message: "Unknown operation " + resp.request.operation
        };
      } else {
        try {
          data = new AWS2.XML.Parser().parse(body);
        } catch (e) {
          data = {
            Code: resp.httpResponse.statusCode,
            Message: resp.httpResponse.statusMessage
          };
        }
      }
      if (data.requestId && !resp.requestId)
        resp.requestId = data.requestId;
      if (data.Errors)
        data = data.Errors;
      if (data.Error)
        data = data.Error;
      if (data.Code) {
        resp.error = util2.error(new Error(), {
          code: data.Code,
          message: data.Message
        });
      } else {
        resp.error = util2.error(new Error(), {
          code: resp.httpResponse.statusCode,
          message: null
        });
      }
    }
    function extractData(resp) {
      var req = resp.request;
      var operation = req.service.api.operations[req.operation];
      var shape = operation.output || {};
      var origRules = shape;
      if (origRules.resultWrapper) {
        var tmp = Shape.create({ type: "structure" });
        tmp.members[origRules.resultWrapper] = shape;
        tmp.memberNames = [origRules.resultWrapper];
        util2.property(shape, "name", shape.resultWrapper);
        shape = tmp;
      }
      var parser = new AWS2.XML.Parser();
      if (shape && shape.members && !shape.members._XAMZRequestId) {
        var requestIdShape = Shape.create(
          { type: "string" },
          { api: { protocol: "query" } },
          "requestId"
        );
        shape.members._XAMZRequestId = requestIdShape;
      }
      var data = parser.parse(resp.httpResponse.body.toString(), shape);
      resp.requestId = data._XAMZRequestId || data.requestId;
      if (data._XAMZRequestId)
        delete data._XAMZRequestId;
      if (origRules.resultWrapper) {
        if (data[origRules.resultWrapper]) {
          util2.update(data, data[origRules.resultWrapper]);
          delete data[origRules.resultWrapper];
        }
      }
      resp.data = data;
    }
    module2.exports = {
      buildRequest,
      extractError,
      extractData
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/protocol/rest.js
var require_rest = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/protocol/rest.js"(exports, module2) {
    var util2 = require_util();
    var populateHostPrefix = require_helpers().populateHostPrefix;
    function populateMethod(req) {
      req.httpRequest.method = req.service.api.operations[req.operation].httpMethod;
    }
    function generateURI(endpointPath, operationPath, input, params) {
      var uri = [endpointPath, operationPath].join("/");
      uri = uri.replace(/\/+/g, "/");
      var queryString = {}, queryStringSet = false;
      util2.each(input.members, function(name, member) {
        var paramValue = params[name];
        if (paramValue === null || paramValue === void 0)
          return;
        if (member.location === "uri") {
          var regex = new RegExp("\\{" + member.name + "(\\+)?\\}");
          uri = uri.replace(regex, function(_, plus) {
            var fn = plus ? util2.uriEscapePath : util2.uriEscape;
            return fn(String(paramValue));
          });
        } else if (member.location === "querystring") {
          queryStringSet = true;
          if (member.type === "list") {
            queryString[member.name] = paramValue.map(function(val) {
              return util2.uriEscape(member.member.toWireFormat(val).toString());
            });
          } else if (member.type === "map") {
            util2.each(paramValue, function(key, value) {
              if (Array.isArray(value)) {
                queryString[key] = value.map(function(val) {
                  return util2.uriEscape(String(val));
                });
              } else {
                queryString[key] = util2.uriEscape(String(value));
              }
            });
          } else {
            queryString[member.name] = util2.uriEscape(member.toWireFormat(paramValue).toString());
          }
        }
      });
      if (queryStringSet) {
        uri += uri.indexOf("?") >= 0 ? "&" : "?";
        var parts = [];
        util2.arrayEach(Object.keys(queryString).sort(), function(key) {
          if (!Array.isArray(queryString[key])) {
            queryString[key] = [queryString[key]];
          }
          for (var i = 0; i < queryString[key].length; i++) {
            parts.push(util2.uriEscape(String(key)) + "=" + queryString[key][i]);
          }
        });
        uri += parts.join("&");
      }
      return uri;
    }
    function populateURI(req) {
      var operation = req.service.api.operations[req.operation];
      var input = operation.input;
      var uri = generateURI(req.httpRequest.endpoint.path, operation.httpPath, input, req.params);
      req.httpRequest.path = uri;
    }
    function populateHeaders(req) {
      var operation = req.service.api.operations[req.operation];
      util2.each(operation.input.members, function(name, member) {
        var value = req.params[name];
        if (value === null || value === void 0)
          return;
        if (member.location === "headers" && member.type === "map") {
          util2.each(value, function(key, memberValue) {
            req.httpRequest.headers[member.name + key] = memberValue;
          });
        } else if (member.location === "header") {
          value = member.toWireFormat(value).toString();
          if (member.isJsonValue) {
            value = util2.base64.encode(value);
          }
          req.httpRequest.headers[member.name] = value;
        }
      });
    }
    function buildRequest(req) {
      populateMethod(req);
      populateURI(req);
      populateHeaders(req);
      populateHostPrefix(req);
    }
    function extractError() {
    }
    function extractData(resp) {
      var req = resp.request;
      var data = {};
      var r = resp.httpResponse;
      var operation = req.service.api.operations[req.operation];
      var output = operation.output;
      var headers = {};
      util2.each(r.headers, function(k, v) {
        headers[k.toLowerCase()] = v;
      });
      util2.each(output.members, function(name, member) {
        var header = (member.name || name).toLowerCase();
        if (member.location === "headers" && member.type === "map") {
          data[name] = {};
          var location = member.isLocationName ? member.name : "";
          var pattern = new RegExp("^" + location + "(.+)", "i");
          util2.each(r.headers, function(k, v) {
            var result = k.match(pattern);
            if (result !== null) {
              data[name][result[1]] = v;
            }
          });
        } else if (member.location === "header") {
          if (headers[header] !== void 0) {
            var value = member.isJsonValue ? util2.base64.decode(headers[header]) : headers[header];
            data[name] = member.toType(value);
          }
        } else if (member.location === "statusCode") {
          data[name] = parseInt(r.statusCode, 10);
        }
      });
      resp.data = data;
    }
    module2.exports = {
      buildRequest,
      extractError,
      extractData,
      generateURI
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/protocol/rest_json.js
var require_rest_json = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/protocol/rest_json.js"(exports, module2) {
    var util2 = require_util();
    var Rest = require_rest();
    var Json = require_json();
    var JsonBuilder = require_builder();
    var JsonParser = require_parser();
    var METHODS_WITHOUT_BODY = ["GET", "HEAD", "DELETE"];
    function unsetContentLength(req) {
      var payloadMember = util2.getRequestPayloadShape(req);
      if (payloadMember === void 0 && METHODS_WITHOUT_BODY.indexOf(req.httpRequest.method) >= 0) {
        delete req.httpRequest.headers["Content-Length"];
      }
    }
    function populateBody(req) {
      var builder = new JsonBuilder();
      var input = req.service.api.operations[req.operation].input;
      if (input.payload) {
        var params = {};
        var payloadShape = input.members[input.payload];
        params = req.params[input.payload];
        if (payloadShape.type === "structure") {
          req.httpRequest.body = builder.build(params || {}, payloadShape);
          applyContentTypeHeader(req);
        } else if (params !== void 0) {
          req.httpRequest.body = params;
          if (payloadShape.type === "binary" || payloadShape.isStreaming) {
            applyContentTypeHeader(req, true);
          }
        }
      } else {
        req.httpRequest.body = builder.build(req.params, input);
        applyContentTypeHeader(req);
      }
    }
    function applyContentTypeHeader(req, isBinary) {
      if (!req.httpRequest.headers["Content-Type"]) {
        var type = isBinary ? "binary/octet-stream" : "application/json";
        req.httpRequest.headers["Content-Type"] = type;
      }
    }
    function buildRequest(req) {
      Rest.buildRequest(req);
      if (METHODS_WITHOUT_BODY.indexOf(req.httpRequest.method) < 0) {
        populateBody(req);
      }
    }
    function extractError(resp) {
      Json.extractError(resp);
    }
    function extractData(resp) {
      Rest.extractData(resp);
      var req = resp.request;
      var operation = req.service.api.operations[req.operation];
      var rules = req.service.api.operations[req.operation].output || {};
      var parser;
      var hasEventOutput = operation.hasEventOutput;
      if (rules.payload) {
        var payloadMember = rules.members[rules.payload];
        var body = resp.httpResponse.body;
        if (payloadMember.isEventStream) {
          parser = new JsonParser();
          resp.data[payload] = util2.createEventStream(
            AWS.HttpClient.streamsApiVersion === 2 ? resp.httpResponse.stream : body,
            parser,
            payloadMember
          );
        } else if (payloadMember.type === "structure" || payloadMember.type === "list") {
          var parser = new JsonParser();
          resp.data[rules.payload] = parser.parse(body, payloadMember);
        } else if (payloadMember.type === "binary" || payloadMember.isStreaming) {
          resp.data[rules.payload] = body;
        } else {
          resp.data[rules.payload] = payloadMember.toType(body);
        }
      } else {
        var data = resp.data;
        Json.extractData(resp);
        resp.data = util2.merge(data, resp.data);
      }
    }
    module2.exports = {
      buildRequest,
      extractError,
      extractData,
      unsetContentLength
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/protocol/rest_xml.js
var require_rest_xml = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/protocol/rest_xml.js"(exports, module2) {
    var AWS2 = require_core();
    var util2 = require_util();
    var Rest = require_rest();
    function populateBody(req) {
      var input = req.service.api.operations[req.operation].input;
      var builder = new AWS2.XML.Builder();
      var params = req.params;
      var payload2 = input.payload;
      if (payload2) {
        var payloadMember = input.members[payload2];
        params = params[payload2];
        if (params === void 0)
          return;
        if (payloadMember.type === "structure") {
          var rootElement = payloadMember.name;
          req.httpRequest.body = builder.toXML(params, payloadMember, rootElement, true);
        } else {
          req.httpRequest.body = params;
        }
      } else {
        req.httpRequest.body = builder.toXML(params, input, input.name || input.shape || util2.string.upperFirst(req.operation) + "Request");
      }
    }
    function buildRequest(req) {
      Rest.buildRequest(req);
      if (["GET", "HEAD"].indexOf(req.httpRequest.method) < 0) {
        populateBody(req);
      }
    }
    function extractError(resp) {
      Rest.extractError(resp);
      var data;
      try {
        data = new AWS2.XML.Parser().parse(resp.httpResponse.body.toString());
      } catch (e) {
        data = {
          Code: resp.httpResponse.statusCode,
          Message: resp.httpResponse.statusMessage
        };
      }
      if (data.Errors)
        data = data.Errors;
      if (data.Error)
        data = data.Error;
      if (data.Code) {
        resp.error = util2.error(new Error(), {
          code: data.Code,
          message: data.Message
        });
      } else {
        resp.error = util2.error(new Error(), {
          code: resp.httpResponse.statusCode,
          message: null
        });
      }
    }
    function extractData(resp) {
      Rest.extractData(resp);
      var parser;
      var req = resp.request;
      var body = resp.httpResponse.body;
      var operation = req.service.api.operations[req.operation];
      var output = operation.output;
      var hasEventOutput = operation.hasEventOutput;
      var payload2 = output.payload;
      if (payload2) {
        var payloadMember = output.members[payload2];
        if (payloadMember.isEventStream) {
          parser = new AWS2.XML.Parser();
          resp.data[payload2] = util2.createEventStream(
            AWS2.HttpClient.streamsApiVersion === 2 ? resp.httpResponse.stream : resp.httpResponse.body,
            parser,
            payloadMember
          );
        } else if (payloadMember.type === "structure") {
          parser = new AWS2.XML.Parser();
          resp.data[payload2] = parser.parse(body.toString(), payloadMember);
        } else if (payloadMember.type === "binary" || payloadMember.isStreaming) {
          resp.data[payload2] = body;
        } else {
          resp.data[payload2] = payloadMember.toType(body);
        }
      } else if (body.length > 0) {
        parser = new AWS2.XML.Parser();
        var data = parser.parse(body.toString(), output);
        util2.update(resp.data, data);
      }
    }
    module2.exports = {
      buildRequest,
      extractError,
      extractData
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/xml/escape-attribute.js
var require_escape_attribute = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/xml/escape-attribute.js"(exports, module2) {
    function escapeAttribute(value) {
      return value.replace(/&/g, "&amp;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    module2.exports = {
      escapeAttribute
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/xml/xml-node.js
var require_xml_node = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/xml/xml-node.js"(exports, module2) {
    var escapeAttribute = require_escape_attribute().escapeAttribute;
    function XmlNode(name, children) {
      if (children === void 0) {
        children = [];
      }
      this.name = name;
      this.children = children;
      this.attributes = {};
    }
    XmlNode.prototype.addAttribute = function(name, value) {
      this.attributes[name] = value;
      return this;
    };
    XmlNode.prototype.addChildNode = function(child) {
      this.children.push(child);
      return this;
    };
    XmlNode.prototype.removeAttribute = function(name) {
      delete this.attributes[name];
      return this;
    };
    XmlNode.prototype.toString = function() {
      var hasChildren = Boolean(this.children.length);
      var xmlText = "<" + this.name;
      var attributes = this.attributes;
      for (var i = 0, attributeNames = Object.keys(attributes); i < attributeNames.length; i++) {
        var attributeName = attributeNames[i];
        var attribute = attributes[attributeName];
        if (typeof attribute !== "undefined" && attribute !== null) {
          xmlText += " " + attributeName + '="' + escapeAttribute("" + attribute) + '"';
        }
      }
      return xmlText += !hasChildren ? "/>" : ">" + this.children.map(function(c) {
        return c.toString();
      }).join("") + "</" + this.name + ">";
    };
    module2.exports = {
      XmlNode
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/xml/escape-element.js
var require_escape_element = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/xml/escape-element.js"(exports, module2) {
    function escapeElement(value) {
      return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#x0D;").replace(/\n/g, "&#x0A;").replace(/\u0085/g, "&#x85;").replace(/\u2028/, "&#x2028;");
    }
    module2.exports = {
      escapeElement
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/xml/xml-text.js
var require_xml_text = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/xml/xml-text.js"(exports, module2) {
    var escapeElement = require_escape_element().escapeElement;
    function XmlText(value) {
      this.value = value;
    }
    XmlText.prototype.toString = function() {
      return escapeElement("" + this.value);
    };
    module2.exports = {
      XmlText
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/xml/builder.js
var require_builder2 = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/xml/builder.js"(exports, module2) {
    var util2 = require_util();
    var XmlNode = require_xml_node().XmlNode;
    var XmlText = require_xml_text().XmlText;
    function XmlBuilder() {
    }
    XmlBuilder.prototype.toXML = function(params, shape, rootElement, noEmpty) {
      var xml = new XmlNode(rootElement);
      applyNamespaces(xml, shape, true);
      serialize(xml, params, shape);
      return xml.children.length > 0 || noEmpty ? xml.toString() : "";
    };
    function serialize(xml, value, shape) {
      switch (shape.type) {
        case "structure":
          return serializeStructure(xml, value, shape);
        case "map":
          return serializeMap(xml, value, shape);
        case "list":
          return serializeList(xml, value, shape);
        default:
          return serializeScalar(xml, value, shape);
      }
    }
    function serializeStructure(xml, params, shape) {
      util2.arrayEach(shape.memberNames, function(memberName) {
        var memberShape = shape.members[memberName];
        if (memberShape.location !== "body")
          return;
        var value = params[memberName];
        var name = memberShape.name;
        if (value !== void 0 && value !== null) {
          if (memberShape.isXmlAttribute) {
            xml.addAttribute(name, value);
          } else if (memberShape.flattened) {
            serialize(xml, value, memberShape);
          } else {
            var element = new XmlNode(name);
            xml.addChildNode(element);
            applyNamespaces(element, memberShape);
            serialize(element, value, memberShape);
          }
        }
      });
    }
    function serializeMap(xml, map, shape) {
      var xmlKey = shape.key.name || "key";
      var xmlValue = shape.value.name || "value";
      util2.each(map, function(key, value) {
        var entry = new XmlNode(shape.flattened ? shape.name : "entry");
        xml.addChildNode(entry);
        var entryKey = new XmlNode(xmlKey);
        var entryValue = new XmlNode(xmlValue);
        entry.addChildNode(entryKey);
        entry.addChildNode(entryValue);
        serialize(entryKey, key, shape.key);
        serialize(entryValue, value, shape.value);
      });
    }
    function serializeList(xml, list, shape) {
      if (shape.flattened) {
        util2.arrayEach(list, function(value) {
          var name = shape.member.name || shape.name;
          var element = new XmlNode(name);
          xml.addChildNode(element);
          serialize(element, value, shape.member);
        });
      } else {
        util2.arrayEach(list, function(value) {
          var name = shape.member.name || "member";
          var element = new XmlNode(name);
          xml.addChildNode(element);
          serialize(element, value, shape.member);
        });
      }
    }
    function serializeScalar(xml, value, shape) {
      xml.addChildNode(
        new XmlText(shape.toWireFormat(value))
      );
    }
    function applyNamespaces(xml, shape, isRoot) {
      var uri, prefix = "xmlns";
      if (shape.xmlNamespaceUri) {
        uri = shape.xmlNamespaceUri;
        if (shape.xmlNamespacePrefix)
          prefix += ":" + shape.xmlNamespacePrefix;
      } else if (isRoot && shape.api.xmlNamespaceUri) {
        uri = shape.api.xmlNamespaceUri;
      }
      if (uri)
        xml.addAttribute(prefix, uri);
    }
    module2.exports = XmlBuilder;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/model/operation.js
var require_operation = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/model/operation.js"(exports, module2) {
    var Shape = require_shape();
    var util2 = require_util();
    var property = util2.property;
    var memoizedProperty = util2.memoizedProperty;
    function Operation(name, operation, options) {
      var self = this;
      options = options || {};
      property(this, "name", operation.name || name);
      property(this, "api", options.api, false);
      operation.http = operation.http || {};
      property(this, "endpoint", operation.endpoint);
      property(this, "httpMethod", operation.http.method || "POST");
      property(this, "httpPath", operation.http.requestUri || "/");
      property(this, "authtype", operation.authtype || "");
      property(
        this,
        "endpointDiscoveryRequired",
        operation.endpointdiscovery ? operation.endpointdiscovery.required ? "REQUIRED" : "OPTIONAL" : "NULL"
      );
      var httpChecksumRequired = operation.httpChecksumRequired || operation.httpChecksum && operation.httpChecksum.requestChecksumRequired;
      property(this, "httpChecksumRequired", httpChecksumRequired, false);
      memoizedProperty(this, "input", function() {
        if (!operation.input) {
          return new Shape.create({ type: "structure" }, options);
        }
        return Shape.create(operation.input, options);
      });
      memoizedProperty(this, "output", function() {
        if (!operation.output) {
          return new Shape.create({ type: "structure" }, options);
        }
        return Shape.create(operation.output, options);
      });
      memoizedProperty(this, "errors", function() {
        var list = [];
        if (!operation.errors)
          return null;
        for (var i = 0; i < operation.errors.length; i++) {
          list.push(Shape.create(operation.errors[i], options));
        }
        return list;
      });
      memoizedProperty(this, "paginator", function() {
        return options.api.paginators[name];
      });
      if (options.documentation) {
        property(this, "documentation", operation.documentation);
        property(this, "documentationUrl", operation.documentationUrl);
      }
      memoizedProperty(this, "idempotentMembers", function() {
        var idempotentMembers = [];
        var input = self.input;
        var members = input.members;
        if (!input.members) {
          return idempotentMembers;
        }
        for (var name2 in members) {
          if (!members.hasOwnProperty(name2)) {
            continue;
          }
          if (members[name2].isIdempotent === true) {
            idempotentMembers.push(name2);
          }
        }
        return idempotentMembers;
      });
      memoizedProperty(this, "hasEventOutput", function() {
        var output = self.output;
        return hasEventStream(output);
      });
    }
    function hasEventStream(topLevelShape) {
      var members = topLevelShape.members;
      var payload2 = topLevelShape.payload;
      if (!topLevelShape.members) {
        return false;
      }
      if (payload2) {
        var payloadMember = members[payload2];
        return payloadMember.isEventStream;
      }
      for (var name in members) {
        if (!members.hasOwnProperty(name)) {
          if (members[name].isEventStream === true) {
            return true;
          }
        }
      }
      return false;
    }
    module2.exports = Operation;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/model/paginator.js
var require_paginator = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/model/paginator.js"(exports, module2) {
    var property = require_util().property;
    function Paginator(name, paginator) {
      property(this, "inputToken", paginator.input_token);
      property(this, "limitKey", paginator.limit_key);
      property(this, "moreResults", paginator.more_results);
      property(this, "outputToken", paginator.output_token);
      property(this, "resultKey", paginator.result_key);
    }
    module2.exports = Paginator;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/model/resource_waiter.js
var require_resource_waiter = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/model/resource_waiter.js"(exports, module2) {
    var util2 = require_util();
    var property = util2.property;
    function ResourceWaiter(name, waiter, options) {
      options = options || {};
      property(this, "name", name);
      property(this, "api", options.api, false);
      if (waiter.operation) {
        property(this, "operation", util2.string.lowerFirst(waiter.operation));
      }
      var self = this;
      var keys = [
        "type",
        "description",
        "delay",
        "maxAttempts",
        "acceptors"
      ];
      keys.forEach(function(key) {
        var value = waiter[key];
        if (value) {
          property(self, key, value);
        }
      });
    }
    module2.exports = ResourceWaiter;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/metadata.json
var require_metadata = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/metadata.json"(exports, module2) {
    module2.exports = {
      acm: {
        name: "ACM",
        cors: true
      },
      apigateway: {
        name: "APIGateway",
        cors: true
      },
      applicationautoscaling: {
        prefix: "application-autoscaling",
        name: "ApplicationAutoScaling",
        cors: true
      },
      appstream: {
        name: "AppStream"
      },
      autoscaling: {
        name: "AutoScaling",
        cors: true
      },
      batch: {
        name: "Batch"
      },
      budgets: {
        name: "Budgets"
      },
      clouddirectory: {
        name: "CloudDirectory",
        versions: [
          "2016-05-10*"
        ]
      },
      cloudformation: {
        name: "CloudFormation",
        cors: true
      },
      cloudfront: {
        name: "CloudFront",
        versions: [
          "2013-05-12*",
          "2013-11-11*",
          "2014-05-31*",
          "2014-10-21*",
          "2014-11-06*",
          "2015-04-17*",
          "2015-07-27*",
          "2015-09-17*",
          "2016-01-13*",
          "2016-01-28*",
          "2016-08-01*",
          "2016-08-20*",
          "2016-09-07*",
          "2016-09-29*",
          "2016-11-25*",
          "2017-03-25*",
          "2017-10-30*",
          "2018-06-18*",
          "2018-11-05*",
          "2019-03-26*"
        ],
        cors: true
      },
      cloudhsm: {
        name: "CloudHSM",
        cors: true
      },
      cloudsearch: {
        name: "CloudSearch"
      },
      cloudsearchdomain: {
        name: "CloudSearchDomain"
      },
      cloudtrail: {
        name: "CloudTrail",
        cors: true
      },
      cloudwatch: {
        prefix: "monitoring",
        name: "CloudWatch",
        cors: true
      },
      cloudwatchevents: {
        prefix: "events",
        name: "CloudWatchEvents",
        versions: [
          "2014-02-03*"
        ],
        cors: true
      },
      cloudwatchlogs: {
        prefix: "logs",
        name: "CloudWatchLogs",
        cors: true
      },
      codebuild: {
        name: "CodeBuild",
        cors: true
      },
      codecommit: {
        name: "CodeCommit",
        cors: true
      },
      codedeploy: {
        name: "CodeDeploy",
        cors: true
      },
      codepipeline: {
        name: "CodePipeline",
        cors: true
      },
      cognitoidentity: {
        prefix: "cognito-identity",
        name: "CognitoIdentity",
        cors: true
      },
      cognitoidentityserviceprovider: {
        prefix: "cognito-idp",
        name: "CognitoIdentityServiceProvider",
        cors: true
      },
      cognitosync: {
        prefix: "cognito-sync",
        name: "CognitoSync",
        cors: true
      },
      configservice: {
        prefix: "config",
        name: "ConfigService",
        cors: true
      },
      cur: {
        name: "CUR",
        cors: true
      },
      datapipeline: {
        name: "DataPipeline"
      },
      devicefarm: {
        name: "DeviceFarm",
        cors: true
      },
      directconnect: {
        name: "DirectConnect",
        cors: true
      },
      directoryservice: {
        prefix: "ds",
        name: "DirectoryService"
      },
      discovery: {
        name: "Discovery"
      },
      dms: {
        name: "DMS"
      },
      dynamodb: {
        name: "DynamoDB",
        cors: true
      },
      dynamodbstreams: {
        prefix: "streams.dynamodb",
        name: "DynamoDBStreams",
        cors: true
      },
      ec2: {
        name: "EC2",
        versions: [
          "2013-06-15*",
          "2013-10-15*",
          "2014-02-01*",
          "2014-05-01*",
          "2014-06-15*",
          "2014-09-01*",
          "2014-10-01*",
          "2015-03-01*",
          "2015-04-15*",
          "2015-10-01*",
          "2016-04-01*",
          "2016-09-15*"
        ],
        cors: true
      },
      ecr: {
        name: "ECR",
        cors: true
      },
      ecs: {
        name: "ECS",
        cors: true
      },
      efs: {
        prefix: "elasticfilesystem",
        name: "EFS",
        cors: true
      },
      elasticache: {
        name: "ElastiCache",
        versions: [
          "2012-11-15*",
          "2014-03-24*",
          "2014-07-15*",
          "2014-09-30*"
        ],
        cors: true
      },
      elasticbeanstalk: {
        name: "ElasticBeanstalk",
        cors: true
      },
      elb: {
        prefix: "elasticloadbalancing",
        name: "ELB",
        cors: true
      },
      elbv2: {
        prefix: "elasticloadbalancingv2",
        name: "ELBv2",
        cors: true
      },
      emr: {
        prefix: "elasticmapreduce",
        name: "EMR",
        cors: true
      },
      es: {
        name: "ES"
      },
      elastictranscoder: {
        name: "ElasticTranscoder",
        cors: true
      },
      firehose: {
        name: "Firehose",
        cors: true
      },
      gamelift: {
        name: "GameLift",
        cors: true
      },
      glacier: {
        name: "Glacier"
      },
      health: {
        name: "Health"
      },
      iam: {
        name: "IAM",
        cors: true
      },
      importexport: {
        name: "ImportExport"
      },
      inspector: {
        name: "Inspector",
        versions: [
          "2015-08-18*"
        ],
        cors: true
      },
      iot: {
        name: "Iot",
        cors: true
      },
      iotdata: {
        prefix: "iot-data",
        name: "IotData",
        cors: true
      },
      kinesis: {
        name: "Kinesis",
        cors: true
      },
      kinesisanalytics: {
        name: "KinesisAnalytics"
      },
      kms: {
        name: "KMS",
        cors: true
      },
      lambda: {
        name: "Lambda",
        cors: true
      },
      lexruntime: {
        prefix: "runtime.lex",
        name: "LexRuntime",
        cors: true
      },
      lightsail: {
        name: "Lightsail"
      },
      machinelearning: {
        name: "MachineLearning",
        cors: true
      },
      marketplacecommerceanalytics: {
        name: "MarketplaceCommerceAnalytics",
        cors: true
      },
      marketplacemetering: {
        prefix: "meteringmarketplace",
        name: "MarketplaceMetering"
      },
      mturk: {
        prefix: "mturk-requester",
        name: "MTurk",
        cors: true
      },
      mobileanalytics: {
        name: "MobileAnalytics",
        cors: true
      },
      opsworks: {
        name: "OpsWorks",
        cors: true
      },
      opsworkscm: {
        name: "OpsWorksCM"
      },
      organizations: {
        name: "Organizations"
      },
      pinpoint: {
        name: "Pinpoint"
      },
      polly: {
        name: "Polly",
        cors: true
      },
      rds: {
        name: "RDS",
        versions: [
          "2014-09-01*"
        ],
        cors: true
      },
      redshift: {
        name: "Redshift",
        cors: true
      },
      rekognition: {
        name: "Rekognition",
        cors: true
      },
      resourcegroupstaggingapi: {
        name: "ResourceGroupsTaggingAPI"
      },
      route53: {
        name: "Route53",
        cors: true
      },
      route53domains: {
        name: "Route53Domains",
        cors: true
      },
      s3: {
        name: "S3",
        dualstackAvailable: true,
        cors: true
      },
      s3control: {
        name: "S3Control",
        dualstackAvailable: true,
        xmlNoDefaultLists: true
      },
      servicecatalog: {
        name: "ServiceCatalog",
        cors: true
      },
      ses: {
        prefix: "email",
        name: "SES",
        cors: true
      },
      shield: {
        name: "Shield"
      },
      simpledb: {
        prefix: "sdb",
        name: "SimpleDB"
      },
      sms: {
        name: "SMS"
      },
      snowball: {
        name: "Snowball"
      },
      sns: {
        name: "SNS",
        cors: true
      },
      sqs: {
        name: "SQS",
        cors: true
      },
      ssm: {
        name: "SSM",
        cors: true
      },
      storagegateway: {
        name: "StorageGateway",
        cors: true
      },
      stepfunctions: {
        prefix: "states",
        name: "StepFunctions"
      },
      sts: {
        name: "STS",
        cors: true
      },
      support: {
        name: "Support"
      },
      swf: {
        name: "SWF"
      },
      xray: {
        name: "XRay",
        cors: true
      },
      waf: {
        name: "WAF",
        cors: true
      },
      wafregional: {
        prefix: "waf-regional",
        name: "WAFRegional"
      },
      workdocs: {
        name: "WorkDocs",
        cors: true
      },
      workspaces: {
        name: "WorkSpaces"
      },
      codestar: {
        name: "CodeStar"
      },
      lexmodelbuildingservice: {
        prefix: "lex-models",
        name: "LexModelBuildingService",
        cors: true
      },
      marketplaceentitlementservice: {
        prefix: "entitlement.marketplace",
        name: "MarketplaceEntitlementService"
      },
      athena: {
        name: "Athena",
        cors: true
      },
      greengrass: {
        name: "Greengrass"
      },
      dax: {
        name: "DAX"
      },
      migrationhub: {
        prefix: "AWSMigrationHub",
        name: "MigrationHub"
      },
      cloudhsmv2: {
        name: "CloudHSMV2",
        cors: true
      },
      glue: {
        name: "Glue"
      },
      mobile: {
        name: "Mobile"
      },
      pricing: {
        name: "Pricing",
        cors: true
      },
      costexplorer: {
        prefix: "ce",
        name: "CostExplorer",
        cors: true
      },
      mediaconvert: {
        name: "MediaConvert"
      },
      medialive: {
        name: "MediaLive"
      },
      mediapackage: {
        name: "MediaPackage"
      },
      mediastore: {
        name: "MediaStore"
      },
      mediastoredata: {
        prefix: "mediastore-data",
        name: "MediaStoreData",
        cors: true
      },
      appsync: {
        name: "AppSync"
      },
      guardduty: {
        name: "GuardDuty"
      },
      mq: {
        name: "MQ"
      },
      comprehend: {
        name: "Comprehend",
        cors: true
      },
      iotjobsdataplane: {
        prefix: "iot-jobs-data",
        name: "IoTJobsDataPlane"
      },
      kinesisvideoarchivedmedia: {
        prefix: "kinesis-video-archived-media",
        name: "KinesisVideoArchivedMedia",
        cors: true
      },
      kinesisvideomedia: {
        prefix: "kinesis-video-media",
        name: "KinesisVideoMedia",
        cors: true
      },
      kinesisvideo: {
        name: "KinesisVideo",
        cors: true
      },
      sagemakerruntime: {
        prefix: "runtime.sagemaker",
        name: "SageMakerRuntime"
      },
      sagemaker: {
        name: "SageMaker"
      },
      translate: {
        name: "Translate",
        cors: true
      },
      resourcegroups: {
        prefix: "resource-groups",
        name: "ResourceGroups",
        cors: true
      },
      alexaforbusiness: {
        name: "AlexaForBusiness"
      },
      cloud9: {
        name: "Cloud9"
      },
      serverlessapplicationrepository: {
        prefix: "serverlessrepo",
        name: "ServerlessApplicationRepository"
      },
      servicediscovery: {
        name: "ServiceDiscovery"
      },
      workmail: {
        name: "WorkMail"
      },
      autoscalingplans: {
        prefix: "autoscaling-plans",
        name: "AutoScalingPlans"
      },
      transcribeservice: {
        prefix: "transcribe",
        name: "TranscribeService"
      },
      connect: {
        name: "Connect",
        cors: true
      },
      acmpca: {
        prefix: "acm-pca",
        name: "ACMPCA"
      },
      fms: {
        name: "FMS"
      },
      secretsmanager: {
        name: "SecretsManager",
        cors: true
      },
      iotanalytics: {
        name: "IoTAnalytics",
        cors: true
      },
      iot1clickdevicesservice: {
        prefix: "iot1click-devices",
        name: "IoT1ClickDevicesService"
      },
      iot1clickprojects: {
        prefix: "iot1click-projects",
        name: "IoT1ClickProjects"
      },
      pi: {
        name: "PI"
      },
      neptune: {
        name: "Neptune"
      },
      mediatailor: {
        name: "MediaTailor"
      },
      eks: {
        name: "EKS"
      },
      macie: {
        name: "Macie"
      },
      dlm: {
        name: "DLM"
      },
      signer: {
        name: "Signer"
      },
      chime: {
        name: "Chime"
      },
      pinpointemail: {
        prefix: "pinpoint-email",
        name: "PinpointEmail"
      },
      ram: {
        name: "RAM"
      },
      route53resolver: {
        name: "Route53Resolver"
      },
      pinpointsmsvoice: {
        prefix: "sms-voice",
        name: "PinpointSMSVoice"
      },
      quicksight: {
        name: "QuickSight"
      },
      rdsdataservice: {
        prefix: "rds-data",
        name: "RDSDataService"
      },
      amplify: {
        name: "Amplify"
      },
      datasync: {
        name: "DataSync"
      },
      robomaker: {
        name: "RoboMaker"
      },
      transfer: {
        name: "Transfer"
      },
      globalaccelerator: {
        name: "GlobalAccelerator"
      },
      comprehendmedical: {
        name: "ComprehendMedical",
        cors: true
      },
      kinesisanalyticsv2: {
        name: "KinesisAnalyticsV2"
      },
      mediaconnect: {
        name: "MediaConnect"
      },
      fsx: {
        name: "FSx"
      },
      securityhub: {
        name: "SecurityHub"
      },
      appmesh: {
        name: "AppMesh",
        versions: [
          "2018-10-01*"
        ]
      },
      licensemanager: {
        prefix: "license-manager",
        name: "LicenseManager"
      },
      kafka: {
        name: "Kafka"
      },
      apigatewaymanagementapi: {
        name: "ApiGatewayManagementApi"
      },
      apigatewayv2: {
        name: "ApiGatewayV2"
      },
      docdb: {
        name: "DocDB"
      },
      backup: {
        name: "Backup"
      },
      worklink: {
        name: "WorkLink"
      },
      textract: {
        name: "Textract"
      },
      managedblockchain: {
        name: "ManagedBlockchain"
      },
      mediapackagevod: {
        prefix: "mediapackage-vod",
        name: "MediaPackageVod"
      },
      groundstation: {
        name: "GroundStation"
      },
      iotthingsgraph: {
        name: "IoTThingsGraph"
      },
      iotevents: {
        name: "IoTEvents"
      },
      ioteventsdata: {
        prefix: "iotevents-data",
        name: "IoTEventsData"
      },
      personalize: {
        name: "Personalize",
        cors: true
      },
      personalizeevents: {
        prefix: "personalize-events",
        name: "PersonalizeEvents",
        cors: true
      },
      personalizeruntime: {
        prefix: "personalize-runtime",
        name: "PersonalizeRuntime",
        cors: true
      },
      applicationinsights: {
        prefix: "application-insights",
        name: "ApplicationInsights"
      },
      servicequotas: {
        prefix: "service-quotas",
        name: "ServiceQuotas"
      },
      ec2instanceconnect: {
        prefix: "ec2-instance-connect",
        name: "EC2InstanceConnect"
      },
      eventbridge: {
        name: "EventBridge"
      },
      lakeformation: {
        name: "LakeFormation"
      },
      forecastservice: {
        prefix: "forecast",
        name: "ForecastService",
        cors: true
      },
      forecastqueryservice: {
        prefix: "forecastquery",
        name: "ForecastQueryService",
        cors: true
      },
      qldb: {
        name: "QLDB"
      },
      qldbsession: {
        prefix: "qldb-session",
        name: "QLDBSession"
      },
      workmailmessageflow: {
        name: "WorkMailMessageFlow"
      },
      codestarnotifications: {
        prefix: "codestar-notifications",
        name: "CodeStarNotifications"
      },
      savingsplans: {
        name: "SavingsPlans"
      },
      sso: {
        name: "SSO"
      },
      ssooidc: {
        prefix: "sso-oidc",
        name: "SSOOIDC"
      },
      marketplacecatalog: {
        prefix: "marketplace-catalog",
        name: "MarketplaceCatalog",
        cors: true
      },
      dataexchange: {
        name: "DataExchange"
      },
      sesv2: {
        name: "SESV2"
      },
      migrationhubconfig: {
        prefix: "migrationhub-config",
        name: "MigrationHubConfig"
      },
      connectparticipant: {
        name: "ConnectParticipant"
      },
      appconfig: {
        name: "AppConfig"
      },
      iotsecuretunneling: {
        name: "IoTSecureTunneling"
      },
      wafv2: {
        name: "WAFV2"
      },
      elasticinference: {
        prefix: "elastic-inference",
        name: "ElasticInference"
      },
      imagebuilder: {
        name: "Imagebuilder"
      },
      schemas: {
        name: "Schemas"
      },
      accessanalyzer: {
        name: "AccessAnalyzer"
      },
      codegurureviewer: {
        prefix: "codeguru-reviewer",
        name: "CodeGuruReviewer"
      },
      codeguruprofiler: {
        name: "CodeGuruProfiler"
      },
      computeoptimizer: {
        prefix: "compute-optimizer",
        name: "ComputeOptimizer"
      },
      frauddetector: {
        name: "FraudDetector"
      },
      kendra: {
        name: "Kendra"
      },
      networkmanager: {
        name: "NetworkManager"
      },
      outposts: {
        name: "Outposts"
      },
      augmentedairuntime: {
        prefix: "sagemaker-a2i-runtime",
        name: "AugmentedAIRuntime"
      },
      ebs: {
        name: "EBS"
      },
      kinesisvideosignalingchannels: {
        prefix: "kinesis-video-signaling",
        name: "KinesisVideoSignalingChannels",
        cors: true
      },
      detective: {
        name: "Detective"
      },
      codestarconnections: {
        prefix: "codestar-connections",
        name: "CodeStarconnections"
      },
      synthetics: {
        name: "Synthetics"
      },
      iotsitewise: {
        name: "IoTSiteWise"
      },
      macie2: {
        name: "Macie2"
      },
      codeartifact: {
        name: "CodeArtifact"
      },
      honeycode: {
        name: "Honeycode"
      },
      ivs: {
        name: "IVS"
      },
      braket: {
        name: "Braket"
      },
      identitystore: {
        name: "IdentityStore"
      },
      appflow: {
        name: "Appflow"
      },
      redshiftdata: {
        prefix: "redshift-data",
        name: "RedshiftData"
      },
      ssoadmin: {
        prefix: "sso-admin",
        name: "SSOAdmin"
      },
      timestreamquery: {
        prefix: "timestream-query",
        name: "TimestreamQuery"
      },
      timestreamwrite: {
        prefix: "timestream-write",
        name: "TimestreamWrite"
      },
      s3outposts: {
        name: "S3Outposts"
      },
      databrew: {
        name: "DataBrew"
      },
      servicecatalogappregistry: {
        prefix: "servicecatalog-appregistry",
        name: "ServiceCatalogAppRegistry"
      },
      networkfirewall: {
        prefix: "network-firewall",
        name: "NetworkFirewall"
      },
      mwaa: {
        name: "MWAA"
      },
      amplifybackend: {
        name: "AmplifyBackend"
      },
      appintegrations: {
        name: "AppIntegrations"
      },
      connectcontactlens: {
        prefix: "connect-contact-lens",
        name: "ConnectContactLens"
      },
      devopsguru: {
        prefix: "devops-guru",
        name: "DevOpsGuru"
      },
      ecrpublic: {
        prefix: "ecr-public",
        name: "ECRPUBLIC"
      },
      lookoutvision: {
        name: "LookoutVision"
      },
      sagemakerfeaturestoreruntime: {
        prefix: "sagemaker-featurestore-runtime",
        name: "SageMakerFeatureStoreRuntime"
      },
      customerprofiles: {
        prefix: "customer-profiles",
        name: "CustomerProfiles"
      },
      auditmanager: {
        name: "AuditManager"
      },
      emrcontainers: {
        prefix: "emr-containers",
        name: "EMRcontainers"
      },
      healthlake: {
        name: "HealthLake"
      },
      sagemakeredge: {
        prefix: "sagemaker-edge",
        name: "SagemakerEdge"
      },
      amp: {
        name: "Amp"
      },
      greengrassv2: {
        name: "GreengrassV2"
      },
      iotdeviceadvisor: {
        name: "IotDeviceAdvisor"
      },
      iotfleethub: {
        name: "IoTFleetHub"
      },
      iotwireless: {
        name: "IoTWireless"
      },
      location: {
        name: "Location",
        cors: true
      },
      wellarchitected: {
        name: "WellArchitected"
      },
      lexmodelsv2: {
        prefix: "models.lex.v2",
        name: "LexModelsV2"
      },
      lexruntimev2: {
        prefix: "runtime.lex.v2",
        name: "LexRuntimeV2",
        cors: true
      },
      fis: {
        name: "Fis"
      },
      lookoutmetrics: {
        name: "LookoutMetrics"
      },
      mgn: {
        name: "Mgn"
      },
      lookoutequipment: {
        name: "LookoutEquipment"
      },
      nimble: {
        name: "Nimble"
      },
      finspace: {
        name: "Finspace"
      },
      finspacedata: {
        prefix: "finspace-data",
        name: "Finspacedata"
      },
      ssmcontacts: {
        prefix: "ssm-contacts",
        name: "SSMContacts"
      },
      ssmincidents: {
        prefix: "ssm-incidents",
        name: "SSMIncidents"
      },
      applicationcostprofiler: {
        name: "ApplicationCostProfiler"
      },
      apprunner: {
        name: "AppRunner"
      },
      proton: {
        name: "Proton"
      },
      route53recoverycluster: {
        prefix: "route53-recovery-cluster",
        name: "Route53RecoveryCluster"
      },
      route53recoverycontrolconfig: {
        prefix: "route53-recovery-control-config",
        name: "Route53RecoveryControlConfig"
      },
      route53recoveryreadiness: {
        prefix: "route53-recovery-readiness",
        name: "Route53RecoveryReadiness"
      },
      chimesdkidentity: {
        prefix: "chime-sdk-identity",
        name: "ChimeSDKIdentity"
      },
      chimesdkmessaging: {
        prefix: "chime-sdk-messaging",
        name: "ChimeSDKMessaging"
      },
      snowdevicemanagement: {
        prefix: "snow-device-management",
        name: "SnowDeviceManagement"
      },
      memorydb: {
        name: "MemoryDB"
      },
      opensearch: {
        name: "OpenSearch"
      },
      kafkaconnect: {
        name: "KafkaConnect"
      },
      voiceid: {
        prefix: "voice-id",
        name: "VoiceID"
      },
      wisdom: {
        name: "Wisdom"
      },
      account: {
        name: "Account"
      },
      cloudcontrol: {
        name: "CloudControl"
      },
      grafana: {
        name: "Grafana"
      },
      panorama: {
        name: "Panorama"
      },
      chimesdkmeetings: {
        prefix: "chime-sdk-meetings",
        name: "ChimeSDKMeetings"
      },
      resiliencehub: {
        name: "Resiliencehub"
      },
      migrationhubstrategy: {
        name: "MigrationHubStrategy"
      },
      appconfigdata: {
        name: "AppConfigData"
      },
      drs: {
        name: "Drs"
      },
      migrationhubrefactorspaces: {
        prefix: "migration-hub-refactor-spaces",
        name: "MigrationHubRefactorSpaces"
      },
      evidently: {
        name: "Evidently"
      },
      inspector2: {
        name: "Inspector2"
      },
      rbin: {
        name: "Rbin"
      },
      rum: {
        name: "RUM"
      },
      backupgateway: {
        prefix: "backup-gateway",
        name: "BackupGateway"
      },
      iottwinmaker: {
        name: "IoTTwinMaker"
      },
      workspacesweb: {
        prefix: "workspaces-web",
        name: "WorkSpacesWeb"
      },
      amplifyuibuilder: {
        name: "AmplifyUIBuilder"
      },
      keyspaces: {
        name: "Keyspaces"
      },
      billingconductor: {
        name: "Billingconductor"
      },
      gamesparks: {
        name: "GameSparks"
      },
      pinpointsmsvoicev2: {
        prefix: "pinpoint-sms-voice-v2",
        name: "PinpointSMSVoiceV2"
      },
      ivschat: {
        name: "Ivschat"
      },
      chimesdkmediapipelines: {
        prefix: "chime-sdk-media-pipelines",
        name: "ChimeSDKMediaPipelines"
      },
      emrserverless: {
        prefix: "emr-serverless",
        name: "EMRServerless"
      },
      m2: {
        name: "M2"
      },
      connectcampaigns: {
        name: "ConnectCampaigns"
      },
      redshiftserverless: {
        prefix: "redshift-serverless",
        name: "RedshiftServerless"
      },
      rolesanywhere: {
        name: "RolesAnywhere"
      },
      licensemanagerusersubscriptions: {
        prefix: "license-manager-user-subscriptions",
        name: "LicenseManagerUserSubscriptions"
      },
      backupstorage: {
        name: "BackupStorage"
      },
      privatenetworks: {
        name: "PrivateNetworks"
      },
      supportapp: {
        prefix: "support-app",
        name: "SupportApp"
      },
      controltower: {
        name: "ControlTower"
      },
      iotfleetwise: {
        name: "IoTFleetWise"
      },
      migrationhuborchestrator: {
        name: "MigrationHubOrchestrator"
      },
      connectcases: {
        name: "ConnectCases"
      },
      resourceexplorer2: {
        prefix: "resource-explorer-2",
        name: "ResourceExplorer2"
      },
      scheduler: {
        name: "Scheduler"
      },
      chimesdkvoice: {
        prefix: "chime-sdk-voice",
        name: "ChimeSDKVoice"
      },
      iotroborunner: {
        prefix: "iot-roborunner",
        name: "IoTRoboRunner"
      },
      ssmsap: {
        prefix: "ssm-sap",
        name: "SsmSap"
      },
      oam: {
        name: "OAM"
      },
      arczonalshift: {
        prefix: "arc-zonal-shift",
        name: "ARCZonalShift"
      },
      omics: {
        name: "Omics"
      },
      opensearchserverless: {
        name: "OpenSearchServerless"
      },
      securitylake: {
        name: "SecurityLake"
      },
      simspaceweaver: {
        name: "SimSpaceWeaver"
      },
      docdbelastic: {
        prefix: "docdb-elastic",
        name: "DocDBElastic"
      },
      sagemakergeospatial: {
        prefix: "sagemaker-geospatial",
        name: "SageMakerGeospatial"
      },
      codecatalyst: {
        name: "CodeCatalyst"
      },
      pipes: {
        name: "Pipes"
      },
      sagemakermetrics: {
        prefix: "sagemaker-metrics",
        name: "SageMakerMetrics"
      },
      kinesisvideowebrtcstorage: {
        prefix: "kinesis-video-webrtc-storage",
        name: "KinesisVideoWebRTCStorage"
      },
      licensemanagerlinuxsubscriptions: {
        prefix: "license-manager-linux-subscriptions",
        name: "LicenseManagerLinuxSubscriptions"
      },
      kendraranking: {
        prefix: "kendra-ranking",
        name: "KendraRanking"
      },
      cleanrooms: {
        name: "CleanRooms"
      },
      cloudtraildata: {
        prefix: "cloudtrail-data",
        name: "CloudTrailData"
      }
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/model/api.js
var require_api = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/model/api.js"(exports, module2) {
    var Collection = require_collection();
    var Operation = require_operation();
    var Shape = require_shape();
    var Paginator = require_paginator();
    var ResourceWaiter = require_resource_waiter();
    var metadata = require_metadata();
    var util2 = require_util();
    var property = util2.property;
    var memoizedProperty = util2.memoizedProperty;
    function Api(api, options) {
      var self = this;
      api = api || {};
      options = options || {};
      options.api = this;
      api.metadata = api.metadata || {};
      var serviceIdentifier = options.serviceIdentifier;
      delete options.serviceIdentifier;
      property(this, "isApi", true, false);
      property(this, "apiVersion", api.metadata.apiVersion);
      property(this, "endpointPrefix", api.metadata.endpointPrefix);
      property(this, "signingName", api.metadata.signingName);
      property(this, "globalEndpoint", api.metadata.globalEndpoint);
      property(this, "signatureVersion", api.metadata.signatureVersion);
      property(this, "jsonVersion", api.metadata.jsonVersion);
      property(this, "targetPrefix", api.metadata.targetPrefix);
      property(this, "protocol", api.metadata.protocol);
      property(this, "timestampFormat", api.metadata.timestampFormat);
      property(this, "xmlNamespaceUri", api.metadata.xmlNamespace);
      property(this, "abbreviation", api.metadata.serviceAbbreviation);
      property(this, "fullName", api.metadata.serviceFullName);
      property(this, "serviceId", api.metadata.serviceId);
      if (serviceIdentifier && metadata[serviceIdentifier]) {
        property(this, "xmlNoDefaultLists", metadata[serviceIdentifier].xmlNoDefaultLists, false);
      }
      memoizedProperty(this, "className", function() {
        var name = api.metadata.serviceAbbreviation || api.metadata.serviceFullName;
        if (!name)
          return null;
        name = name.replace(/^Amazon|AWS\s*|\(.*|\s+|\W+/g, "");
        if (name === "ElasticLoadBalancing")
          name = "ELB";
        return name;
      });
      function addEndpointOperation(name, operation) {
        if (operation.endpointoperation === true) {
          property(self, "endpointOperation", util2.string.lowerFirst(name));
        }
        if (operation.endpointdiscovery && !self.hasRequiredEndpointDiscovery) {
          property(
            self,
            "hasRequiredEndpointDiscovery",
            operation.endpointdiscovery.required === true
          );
        }
      }
      property(this, "operations", new Collection(api.operations, options, function(name, operation) {
        return new Operation(name, operation, options);
      }, util2.string.lowerFirst, addEndpointOperation));
      property(this, "shapes", new Collection(api.shapes, options, function(name, shape) {
        return Shape.create(shape, options);
      }));
      property(this, "paginators", new Collection(api.paginators, options, function(name, paginator) {
        return new Paginator(name, paginator, options);
      }));
      property(this, "waiters", new Collection(api.waiters, options, function(name, waiter) {
        return new ResourceWaiter(name, waiter, options);
      }, util2.string.lowerFirst));
      if (options.documentation) {
        property(this, "documentation", api.documentation);
        property(this, "documentationUrl", api.documentationUrl);
      }
      property(this, "awsQueryCompatible", api.metadata.awsQueryCompatible);
    }
    module2.exports = Api;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/api_loader.js
var require_api_loader = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/api_loader.js"(exports, module2) {
    function apiLoader(svc, version) {
      if (!apiLoader.services.hasOwnProperty(svc)) {
        throw new Error("InvalidService: Failed to load api for " + svc);
      }
      return apiLoader.services[svc][version];
    }
    apiLoader.services = {};
    module2.exports = apiLoader;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/vendor/endpoint-cache/utils/LRU.js
var require_LRU = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/vendor/endpoint-cache/utils/LRU.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LinkedListNode = (
      /** @class */
      function() {
        function LinkedListNode2(key, value) {
          this.key = key;
          this.value = value;
        }
        return LinkedListNode2;
      }()
    );
    var LRUCache = (
      /** @class */
      function() {
        function LRUCache2(size) {
          this.nodeMap = {};
          this.size = 0;
          if (typeof size !== "number" || size < 1) {
            throw new Error("Cache size can only be positive number");
          }
          this.sizeLimit = size;
        }
        Object.defineProperty(LRUCache2.prototype, "length", {
          get: function() {
            return this.size;
          },
          enumerable: true,
          configurable: true
        });
        LRUCache2.prototype.prependToList = function(node) {
          if (!this.headerNode) {
            this.tailNode = node;
          } else {
            this.headerNode.prev = node;
            node.next = this.headerNode;
          }
          this.headerNode = node;
          this.size++;
        };
        LRUCache2.prototype.removeFromTail = function() {
          if (!this.tailNode) {
            return void 0;
          }
          var node = this.tailNode;
          var prevNode = node.prev;
          if (prevNode) {
            prevNode.next = void 0;
          }
          node.prev = void 0;
          this.tailNode = prevNode;
          this.size--;
          return node;
        };
        LRUCache2.prototype.detachFromList = function(node) {
          if (this.headerNode === node) {
            this.headerNode = node.next;
          }
          if (this.tailNode === node) {
            this.tailNode = node.prev;
          }
          if (node.prev) {
            node.prev.next = node.next;
          }
          if (node.next) {
            node.next.prev = node.prev;
          }
          node.next = void 0;
          node.prev = void 0;
          this.size--;
        };
        LRUCache2.prototype.get = function(key) {
          if (this.nodeMap[key]) {
            var node = this.nodeMap[key];
            this.detachFromList(node);
            this.prependToList(node);
            return node.value;
          }
        };
        LRUCache2.prototype.remove = function(key) {
          if (this.nodeMap[key]) {
            var node = this.nodeMap[key];
            this.detachFromList(node);
            delete this.nodeMap[key];
          }
        };
        LRUCache2.prototype.put = function(key, value) {
          if (this.nodeMap[key]) {
            this.remove(key);
          } else if (this.size === this.sizeLimit) {
            var tailNode = this.removeFromTail();
            var key_1 = tailNode.key;
            delete this.nodeMap[key_1];
          }
          var newNode = new LinkedListNode(key, value);
          this.nodeMap[key] = newNode;
          this.prependToList(newNode);
        };
        LRUCache2.prototype.empty = function() {
          var keys = Object.keys(this.nodeMap);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var node = this.nodeMap[key];
            this.detachFromList(node);
            delete this.nodeMap[key];
          }
        };
        return LRUCache2;
      }()
    );
    exports.LRUCache = LRUCache;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/vendor/endpoint-cache/index.js
var require_endpoint_cache = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/vendor/endpoint-cache/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LRU_1 = require_LRU();
    var CACHE_SIZE = 1e3;
    var EndpointCache = (
      /** @class */
      function() {
        function EndpointCache2(maxSize) {
          if (maxSize === void 0) {
            maxSize = CACHE_SIZE;
          }
          this.maxSize = maxSize;
          this.cache = new LRU_1.LRUCache(maxSize);
        }
        ;
        Object.defineProperty(EndpointCache2.prototype, "size", {
          get: function() {
            return this.cache.length;
          },
          enumerable: true,
          configurable: true
        });
        EndpointCache2.prototype.put = function(key, value) {
          var keyString = typeof key !== "string" ? EndpointCache2.getKeyString(key) : key;
          var endpointRecord = this.populateValue(value);
          this.cache.put(keyString, endpointRecord);
        };
        EndpointCache2.prototype.get = function(key) {
          var keyString = typeof key !== "string" ? EndpointCache2.getKeyString(key) : key;
          var now = Date.now();
          var records = this.cache.get(keyString);
          if (records) {
            for (var i = records.length - 1; i >= 0; i--) {
              var record = records[i];
              if (record.Expire < now) {
                records.splice(i, 1);
              }
            }
            if (records.length === 0) {
              this.cache.remove(keyString);
              return void 0;
            }
          }
          return records;
        };
        EndpointCache2.getKeyString = function(key) {
          var identifiers = [];
          var identifierNames = Object.keys(key).sort();
          for (var i = 0; i < identifierNames.length; i++) {
            var identifierName = identifierNames[i];
            if (key[identifierName] === void 0)
              continue;
            identifiers.push(key[identifierName]);
          }
          return identifiers.join(" ");
        };
        EndpointCache2.prototype.populateValue = function(endpoints) {
          var now = Date.now();
          return endpoints.map(function(endpoint) {
            return {
              Address: endpoint.Address || "",
              Expire: now + (endpoint.CachePeriodInMinutes || 1) * 60 * 1e3
            };
          });
        };
        EndpointCache2.prototype.empty = function() {
          this.cache.empty();
        };
        EndpointCache2.prototype.remove = function(key) {
          var keyString = typeof key !== "string" ? EndpointCache2.getKeyString(key) : key;
          this.cache.remove(keyString);
        };
        return EndpointCache2;
      }()
    );
    exports.EndpointCache = EndpointCache;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/sequential_executor.js
var require_sequential_executor = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/sequential_executor.js"(exports, module2) {
    var AWS2 = require_core();
    AWS2.SequentialExecutor = AWS2.util.inherit({
      constructor: function SequentialExecutor() {
        this._events = {};
      },
      /**
       * @api private
       */
      listeners: function listeners(eventName) {
        return this._events[eventName] ? this._events[eventName].slice(0) : [];
      },
      on: function on(eventName, listener, toHead) {
        if (this._events[eventName]) {
          toHead ? this._events[eventName].unshift(listener) : this._events[eventName].push(listener);
        } else {
          this._events[eventName] = [listener];
        }
        return this;
      },
      onAsync: function onAsync(eventName, listener, toHead) {
        listener._isAsync = true;
        return this.on(eventName, listener, toHead);
      },
      removeListener: function removeListener(eventName, listener) {
        var listeners = this._events[eventName];
        if (listeners) {
          var length = listeners.length;
          var position = -1;
          for (var i = 0; i < length; ++i) {
            if (listeners[i] === listener) {
              position = i;
            }
          }
          if (position > -1) {
            listeners.splice(position, 1);
          }
        }
        return this;
      },
      removeAllListeners: function removeAllListeners(eventName) {
        if (eventName) {
          delete this._events[eventName];
        } else {
          this._events = {};
        }
        return this;
      },
      /**
       * @api private
       */
      emit: function emit(eventName, eventArgs, doneCallback) {
        if (!doneCallback)
          doneCallback = function() {
          };
        var listeners = this.listeners(eventName);
        var count = listeners.length;
        this.callListeners(listeners, eventArgs, doneCallback);
        return count > 0;
      },
      /**
       * @api private
       */
      callListeners: function callListeners(listeners, args, doneCallback, prevError) {
        var self = this;
        var error = prevError || null;
        function callNextListener(err) {
          if (err) {
            error = AWS2.util.error(error || new Error(), err);
            if (self._haltHandlersOnError) {
              return doneCallback.call(self, error);
            }
          }
          self.callListeners(listeners, args, doneCallback, error);
        }
        while (listeners.length > 0) {
          var listener = listeners.shift();
          if (listener._isAsync) {
            listener.apply(self, args.concat([callNextListener]));
            return;
          } else {
            try {
              listener.apply(self, args);
            } catch (err) {
              error = AWS2.util.error(error || new Error(), err);
            }
            if (error && self._haltHandlersOnError) {
              doneCallback.call(self, error);
              return;
            }
          }
        }
        doneCallback.call(self, error);
      },
      /**
       * Adds or copies a set of listeners from another list of
       * listeners or SequentialExecutor object.
       *
       * @param listeners [map<String,Array<Function>>, AWS.SequentialExecutor]
       *   a list of events and callbacks, or an event emitter object
       *   containing listeners to add to this emitter object.
       * @return [AWS.SequentialExecutor] the emitter object, for chaining.
       * @example Adding listeners from a map of listeners
       *   emitter.addListeners({
       *     event1: [function() { ... }, function() { ... }],
       *     event2: [function() { ... }]
       *   });
       *   emitter.emit('event1'); // emitter has event1
       *   emitter.emit('event2'); // emitter has event2
       * @example Adding listeners from another emitter object
       *   var emitter1 = new AWS.SequentialExecutor();
       *   emitter1.on('event1', function() { ... });
       *   emitter1.on('event2', function() { ... });
       *   var emitter2 = new AWS.SequentialExecutor();
       *   emitter2.addListeners(emitter1);
       *   emitter2.emit('event1'); // emitter2 has event1
       *   emitter2.emit('event2'); // emitter2 has event2
       */
      addListeners: function addListeners(listeners) {
        var self = this;
        if (listeners._events)
          listeners = listeners._events;
        AWS2.util.each(listeners, function(event, callbacks) {
          if (typeof callbacks === "function")
            callbacks = [callbacks];
          AWS2.util.arrayEach(callbacks, function(callback) {
            self.on(event, callback);
          });
        });
        return self;
      },
      /**
       * Registers an event with {on} and saves the callback handle function
       * as a property on the emitter object using a given `name`.
       *
       * @param name [String] the property name to set on this object containing
       *   the callback function handle so that the listener can be removed in
       *   the future.
       * @param (see on)
       * @return (see on)
       * @example Adding a named listener DATA_CALLBACK
       *   var listener = function() { doSomething(); };
       *   emitter.addNamedListener('DATA_CALLBACK', 'data', listener);
       *
       *   // the following prints: true
       *   console.log(emitter.DATA_CALLBACK == listener);
       */
      addNamedListener: function addNamedListener(name, eventName, callback, toHead) {
        this[name] = callback;
        this.addListener(eventName, callback, toHead);
        return this;
      },
      /**
       * @api private
       */
      addNamedAsyncListener: function addNamedAsyncListener(name, eventName, callback, toHead) {
        callback._isAsync = true;
        return this.addNamedListener(name, eventName, callback, toHead);
      },
      /**
       * Helper method to add a set of named listeners using
       * {addNamedListener}. The callback contains a parameter
       * with a handle to the `addNamedListener` method.
       *
       * @callback callback function(add)
       *   The callback function is called immediately in order to provide
       *   the `add` function to the block. This simplifies the addition of
       *   a large group of named listeners.
       *   @param add [Function] the {addNamedListener} function to call
       *     when registering listeners.
       * @example Adding a set of named listeners
       *   emitter.addNamedListeners(function(add) {
       *     add('DATA_CALLBACK', 'data', function() { ... });
       *     add('OTHER', 'otherEvent', function() { ... });
       *     add('LAST', 'lastEvent', function() { ... });
       *   });
       *
       *   // these properties are now set:
       *   emitter.DATA_CALLBACK;
       *   emitter.OTHER;
       *   emitter.LAST;
       */
      addNamedListeners: function addNamedListeners(callback) {
        var self = this;
        callback(
          function() {
            self.addNamedListener.apply(self, arguments);
          },
          function() {
            self.addNamedAsyncListener.apply(self, arguments);
          }
        );
        return this;
      }
    });
    AWS2.SequentialExecutor.prototype.addListener = AWS2.SequentialExecutor.prototype.on;
    module2.exports = AWS2.SequentialExecutor;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/region_config_data.json
var require_region_config_data = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/region_config_data.json"(exports, module2) {
    module2.exports = {
      rules: {
        "*/*": {
          endpoint: "{service}.{region}.amazonaws.com"
        },
        "cn-*/*": {
          endpoint: "{service}.{region}.amazonaws.com.cn"
        },
        "us-iso-*/*": "usIso",
        "us-isob-*/*": "usIsob",
        "*/budgets": "globalSSL",
        "*/cloudfront": "globalSSL",
        "*/sts": "globalSSL",
        "*/importexport": {
          endpoint: "{service}.amazonaws.com",
          signatureVersion: "v2",
          globalEndpoint: true
        },
        "*/route53": "globalSSL",
        "cn-*/route53": {
          endpoint: "{service}.amazonaws.com.cn",
          globalEndpoint: true,
          signingRegion: "cn-northwest-1"
        },
        "us-gov-*/route53": "globalGovCloud",
        "us-iso-*/route53": {
          endpoint: "{service}.c2s.ic.gov",
          globalEndpoint: true,
          signingRegion: "us-iso-east-1"
        },
        "us-isob-*/route53": {
          endpoint: "{service}.sc2s.sgov.gov",
          globalEndpoint: true,
          signingRegion: "us-isob-east-1"
        },
        "*/waf": "globalSSL",
        "*/iam": "globalSSL",
        "cn-*/iam": {
          endpoint: "{service}.cn-north-1.amazonaws.com.cn",
          globalEndpoint: true,
          signingRegion: "cn-north-1"
        },
        "us-gov-*/iam": "globalGovCloud",
        "us-gov-*/sts": {
          endpoint: "{service}.{region}.amazonaws.com"
        },
        "us-gov-west-1/s3": "s3signature",
        "us-west-1/s3": "s3signature",
        "us-west-2/s3": "s3signature",
        "eu-west-1/s3": "s3signature",
        "ap-southeast-1/s3": "s3signature",
        "ap-southeast-2/s3": "s3signature",
        "ap-northeast-1/s3": "s3signature",
        "sa-east-1/s3": "s3signature",
        "us-east-1/s3": {
          endpoint: "{service}.amazonaws.com",
          signatureVersion: "s3"
        },
        "us-east-1/sdb": {
          endpoint: "{service}.amazonaws.com",
          signatureVersion: "v2"
        },
        "*/sdb": {
          endpoint: "{service}.{region}.amazonaws.com",
          signatureVersion: "v2"
        },
        "*/resource-explorer-2": "dualstackByDefault",
        "*/kendra-ranking": "dualstackByDefault",
        "*/codecatalyst": "globalDualstackByDefault"
      },
      fipsRules: {
        "*/*": "fipsStandard",
        "us-gov-*/*": "fipsStandard",
        "us-iso-*/*": {
          endpoint: "{service}-fips.{region}.c2s.ic.gov"
        },
        "us-iso-*/dms": "usIso",
        "us-isob-*/*": {
          endpoint: "{service}-fips.{region}.sc2s.sgov.gov"
        },
        "us-isob-*/dms": "usIsob",
        "cn-*/*": {
          endpoint: "{service}-fips.{region}.amazonaws.com.cn"
        },
        "*/api.ecr": "fips.api.ecr",
        "*/api.sagemaker": "fips.api.sagemaker",
        "*/batch": "fipsDotPrefix",
        "*/eks": "fipsDotPrefix",
        "*/models.lex": "fips.models.lex",
        "*/runtime.lex": "fips.runtime.lex",
        "*/runtime.sagemaker": {
          endpoint: "runtime-fips.sagemaker.{region}.amazonaws.com"
        },
        "*/iam": "fipsWithoutRegion",
        "*/route53": "fipsWithoutRegion",
        "*/transcribe": "fipsDotPrefix",
        "*/waf": "fipsWithoutRegion",
        "us-gov-*/transcribe": "fipsDotPrefix",
        "us-gov-*/api.ecr": "fips.api.ecr",
        "us-gov-*/api.sagemaker": "fips.api.sagemaker",
        "us-gov-*/models.lex": "fips.models.lex",
        "us-gov-*/runtime.lex": "fips.runtime.lex",
        "us-gov-*/acm-pca": "fipsWithServiceOnly",
        "us-gov-*/batch": "fipsWithServiceOnly",
        "us-gov-*/cloudformation": "fipsWithServiceOnly",
        "us-gov-*/config": "fipsWithServiceOnly",
        "us-gov-*/eks": "fipsWithServiceOnly",
        "us-gov-*/elasticmapreduce": "fipsWithServiceOnly",
        "us-gov-*/identitystore": "fipsWithServiceOnly",
        "us-gov-*/dynamodb": "fipsWithServiceOnly",
        "us-gov-*/elasticloadbalancing": "fipsWithServiceOnly",
        "us-gov-*/guardduty": "fipsWithServiceOnly",
        "us-gov-*/monitoring": "fipsWithServiceOnly",
        "us-gov-*/resource-groups": "fipsWithServiceOnly",
        "us-gov-*/runtime.sagemaker": "fipsWithServiceOnly",
        "us-gov-*/servicecatalog-appregistry": "fipsWithServiceOnly",
        "us-gov-*/servicequotas": "fipsWithServiceOnly",
        "us-gov-*/ssm": "fipsWithServiceOnly",
        "us-gov-*/sts": "fipsWithServiceOnly",
        "us-gov-*/support": "fipsWithServiceOnly",
        "us-gov-west-1/states": "fipsWithServiceOnly",
        "us-iso-east-1/elasticfilesystem": {
          endpoint: "elasticfilesystem-fips.{region}.c2s.ic.gov"
        },
        "us-gov-west-1/organizations": "fipsWithServiceOnly",
        "us-gov-west-1/route53": {
          endpoint: "route53.us-gov.amazonaws.com"
        },
        "*/resource-explorer-2": "fipsDualstackByDefault",
        "*/kendra-ranking": "dualstackByDefault",
        "*/codecatalyst": "fipsGlobalDualstackByDefault"
      },
      dualstackRules: {
        "*/*": {
          endpoint: "{service}.{region}.api.aws"
        },
        "cn-*/*": {
          endpoint: "{service}.{region}.api.amazonwebservices.com.cn"
        },
        "*/s3": "dualstackLegacy",
        "cn-*/s3": "dualstackLegacyCn",
        "*/s3-control": "dualstackLegacy",
        "cn-*/s3-control": "dualstackLegacyCn",
        "ap-south-1/ec2": "dualstackLegacyEc2",
        "eu-west-1/ec2": "dualstackLegacyEc2",
        "sa-east-1/ec2": "dualstackLegacyEc2",
        "us-east-1/ec2": "dualstackLegacyEc2",
        "us-east-2/ec2": "dualstackLegacyEc2",
        "us-west-2/ec2": "dualstackLegacyEc2"
      },
      dualstackFipsRules: {
        "*/*": {
          endpoint: "{service}-fips.{region}.api.aws"
        },
        "cn-*/*": {
          endpoint: "{service}-fips.{region}.api.amazonwebservices.com.cn"
        },
        "*/s3": "dualstackFipsLegacy",
        "cn-*/s3": "dualstackFipsLegacyCn",
        "*/s3-control": "dualstackFipsLegacy",
        "cn-*/s3-control": "dualstackFipsLegacyCn"
      },
      patterns: {
        globalSSL: {
          endpoint: "https://{service}.amazonaws.com",
          globalEndpoint: true,
          signingRegion: "us-east-1"
        },
        globalGovCloud: {
          endpoint: "{service}.us-gov.amazonaws.com",
          globalEndpoint: true,
          signingRegion: "us-gov-west-1"
        },
        s3signature: {
          endpoint: "{service}.{region}.amazonaws.com",
          signatureVersion: "s3"
        },
        usIso: {
          endpoint: "{service}.{region}.c2s.ic.gov"
        },
        usIsob: {
          endpoint: "{service}.{region}.sc2s.sgov.gov"
        },
        fipsStandard: {
          endpoint: "{service}-fips.{region}.amazonaws.com"
        },
        fipsDotPrefix: {
          endpoint: "fips.{service}.{region}.amazonaws.com"
        },
        fipsWithoutRegion: {
          endpoint: "{service}-fips.amazonaws.com"
        },
        "fips.api.ecr": {
          endpoint: "ecr-fips.{region}.amazonaws.com"
        },
        "fips.api.sagemaker": {
          endpoint: "api-fips.sagemaker.{region}.amazonaws.com"
        },
        "fips.models.lex": {
          endpoint: "models-fips.lex.{region}.amazonaws.com"
        },
        "fips.runtime.lex": {
          endpoint: "runtime-fips.lex.{region}.amazonaws.com"
        },
        fipsWithServiceOnly: {
          endpoint: "{service}.{region}.amazonaws.com"
        },
        dualstackLegacy: {
          endpoint: "{service}.dualstack.{region}.amazonaws.com"
        },
        dualstackLegacyCn: {
          endpoint: "{service}.dualstack.{region}.amazonaws.com.cn"
        },
        dualstackFipsLegacy: {
          endpoint: "{service}-fips.dualstack.{region}.amazonaws.com"
        },
        dualstackFipsLegacyCn: {
          endpoint: "{service}-fips.dualstack.{region}.amazonaws.com.cn"
        },
        dualstackLegacyEc2: {
          endpoint: "api.ec2.{region}.aws"
        },
        dualstackByDefault: {
          endpoint: "{service}.{region}.api.aws"
        },
        fipsDualstackByDefault: {
          endpoint: "{service}-fips.{region}.api.aws"
        },
        globalDualstackByDefault: {
          endpoint: "{service}.global.api.aws"
        },
        fipsGlobalDualstackByDefault: {
          endpoint: "{service}-fips.global.api.aws"
        }
      }
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/region_config.js
var require_region_config = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/region_config.js"(exports, module2) {
    var util2 = require_util();
    var regionConfig = require_region_config_data();
    function generateRegionPrefix(region) {
      if (!region)
        return null;
      var parts = region.split("-");
      if (parts.length < 3)
        return null;
      return parts.slice(0, parts.length - 2).join("-") + "-*";
    }
    function derivedKeys(service) {
      var region = service.config.region;
      var regionPrefix = generateRegionPrefix(region);
      var endpointPrefix = service.api.endpointPrefix;
      return [
        [region, endpointPrefix],
        [regionPrefix, endpointPrefix],
        [region, "*"],
        [regionPrefix, "*"],
        ["*", endpointPrefix],
        ["*", "*"]
      ].map(function(item) {
        return item[0] && item[1] ? item.join("/") : null;
      });
    }
    function applyConfig(service, config) {
      util2.each(config, function(key, value) {
        if (key === "globalEndpoint")
          return;
        if (service.config[key] === void 0 || service.config[key] === null) {
          service.config[key] = value;
        }
      });
    }
    function configureEndpoint(service) {
      var keys = derivedKeys(service);
      var useFipsEndpoint = service.config.useFipsEndpoint;
      var useDualstackEndpoint = service.config.useDualstackEndpoint;
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!key)
          continue;
        var rules = useFipsEndpoint ? useDualstackEndpoint ? regionConfig.dualstackFipsRules : regionConfig.fipsRules : useDualstackEndpoint ? regionConfig.dualstackRules : regionConfig.rules;
        if (Object.prototype.hasOwnProperty.call(rules, key)) {
          var config = rules[key];
          if (typeof config === "string") {
            config = regionConfig.patterns[config];
          }
          service.isGlobalEndpoint = !!config.globalEndpoint;
          if (config.signingRegion) {
            service.signingRegion = config.signingRegion;
          }
          if (!config.signatureVersion) {
            config.signatureVersion = "v4";
          }
          var useBearer = (service.api && service.api.signatureVersion) === "bearer";
          applyConfig(service, Object.assign(
            {},
            config,
            { signatureVersion: useBearer ? "bearer" : config.signatureVersion }
          ));
          return;
        }
      }
    }
    function getEndpointSuffix(region) {
      var regionRegexes = {
        "^(us|eu|ap|sa|ca|me)\\-\\w+\\-\\d+$": "amazonaws.com",
        "^cn\\-\\w+\\-\\d+$": "amazonaws.com.cn",
        "^us\\-gov\\-\\w+\\-\\d+$": "amazonaws.com",
        "^us\\-iso\\-\\w+\\-\\d+$": "c2s.ic.gov",
        "^us\\-isob\\-\\w+\\-\\d+$": "sc2s.sgov.gov"
      };
      var defaultSuffix = "amazonaws.com";
      var regexes = Object.keys(regionRegexes);
      for (var i = 0; i < regexes.length; i++) {
        var regionPattern = RegExp(regexes[i]);
        var dnsSuffix = regionRegexes[regexes[i]];
        if (regionPattern.test(region))
          return dnsSuffix;
      }
      return defaultSuffix;
    }
    module2.exports = {
      configureEndpoint,
      getEndpointSuffix
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/region/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/region/utils.js"(exports, module2) {
    function isFipsRegion(region) {
      return typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));
    }
    function isGlobalRegion(region) {
      return typeof region === "string" && ["aws-global", "aws-us-gov-global"].includes(region);
    }
    function getRealRegion(region) {
      return ["fips-aws-global", "aws-fips", "aws-global"].includes(region) ? "us-east-1" : ["fips-aws-us-gov-global", "aws-us-gov-global"].includes(region) ? "us-gov-west-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "");
    }
    module2.exports = {
      isFipsRegion,
      isGlobalRegion,
      getRealRegion
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/service.js
var require_service = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/service.js"(exports, module2) {
    var AWS2 = require_core();
    var Api = require_api();
    var regionConfig = require_region_config();
    var inherit = AWS2.util.inherit;
    var clientCount = 0;
    var region_utils = require_utils();
    AWS2.Service = inherit({
      /**
       * Create a new service object with a configuration object
       *
       * @param config [map] a map of configuration options
       */
      constructor: function Service(config) {
        if (!this.loadServiceClass) {
          throw AWS2.util.error(
            new Error(),
            "Service must be constructed with `new' operator"
          );
        }
        if (config) {
          if (config.region) {
            var region = config.region;
            if (region_utils.isFipsRegion(region)) {
              config.region = region_utils.getRealRegion(region);
              config.useFipsEndpoint = true;
            }
            if (region_utils.isGlobalRegion(region)) {
              config.region = region_utils.getRealRegion(region);
            }
          }
          if (typeof config.useDualstack === "boolean" && typeof config.useDualstackEndpoint !== "boolean") {
            config.useDualstackEndpoint = config.useDualstack;
          }
        }
        var ServiceClass = this.loadServiceClass(config || {});
        if (ServiceClass) {
          var originalConfig = AWS2.util.copy(config);
          var svc = new ServiceClass(config);
          Object.defineProperty(svc, "_originalConfig", {
            get: function() {
              return originalConfig;
            },
            enumerable: false,
            configurable: true
          });
          svc._clientId = ++clientCount;
          return svc;
        }
        this.initialize(config);
      },
      /**
       * @api private
       */
      initialize: function initialize(config) {
        var svcConfig = AWS2.config[this.serviceIdentifier];
        this.config = new AWS2.Config(AWS2.config);
        if (svcConfig)
          this.config.update(svcConfig, true);
        if (config)
          this.config.update(config, true);
        this.validateService();
        if (!this.config.endpoint)
          regionConfig.configureEndpoint(this);
        this.config.endpoint = this.endpointFromTemplate(this.config.endpoint);
        this.setEndpoint(this.config.endpoint);
        AWS2.SequentialExecutor.call(this);
        AWS2.Service.addDefaultMonitoringListeners(this);
        if ((this.config.clientSideMonitoring || AWS2.Service._clientSideMonitoring) && this.publisher) {
          var publisher = this.publisher;
          this.addNamedListener("PUBLISH_API_CALL", "apiCall", function PUBLISH_API_CALL(event) {
            process.nextTick(function() {
              publisher.eventHandler(event);
            });
          });
          this.addNamedListener("PUBLISH_API_ATTEMPT", "apiCallAttempt", function PUBLISH_API_ATTEMPT(event) {
            process.nextTick(function() {
              publisher.eventHandler(event);
            });
          });
        }
      },
      /**
       * @api private
       */
      validateService: function validateService() {
      },
      /**
       * @api private
       */
      loadServiceClass: function loadServiceClass(serviceConfig) {
        var config = serviceConfig;
        if (!AWS2.util.isEmpty(this.api)) {
          return null;
        } else if (config.apiConfig) {
          return AWS2.Service.defineServiceApi(this.constructor, config.apiConfig);
        } else if (!this.constructor.services) {
          return null;
        } else {
          config = new AWS2.Config(AWS2.config);
          config.update(serviceConfig, true);
          var version = config.apiVersions[this.constructor.serviceIdentifier];
          version = version || config.apiVersion;
          return this.getLatestServiceClass(version);
        }
      },
      /**
       * @api private
       */
      getLatestServiceClass: function getLatestServiceClass(version) {
        version = this.getLatestServiceVersion(version);
        if (this.constructor.services[version] === null) {
          AWS2.Service.defineServiceApi(this.constructor, version);
        }
        return this.constructor.services[version];
      },
      /**
       * @api private
       */
      getLatestServiceVersion: function getLatestServiceVersion(version) {
        if (!this.constructor.services || this.constructor.services.length === 0) {
          throw new Error("No services defined on " + this.constructor.serviceIdentifier);
        }
        if (!version) {
          version = "latest";
        } else if (AWS2.util.isType(version, Date)) {
          version = AWS2.util.date.iso8601(version).split("T")[0];
        }
        if (Object.hasOwnProperty(this.constructor.services, version)) {
          return version;
        }
        var keys = Object.keys(this.constructor.services).sort();
        var selectedVersion = null;
        for (var i = keys.length - 1; i >= 0; i--) {
          if (keys[i][keys[i].length - 1] !== "*") {
            selectedVersion = keys[i];
          }
          if (keys[i].substr(0, 10) <= version) {
            return selectedVersion;
          }
        }
        throw new Error("Could not find " + this.constructor.serviceIdentifier + " API to satisfy version constraint `" + version + "'");
      },
      /**
       * @api private
       */
      api: {},
      /**
       * @api private
       */
      defaultRetryCount: 3,
      /**
       * @api private
       */
      customizeRequests: function customizeRequests(callback) {
        if (!callback) {
          this.customRequestHandler = null;
        } else if (typeof callback === "function") {
          this.customRequestHandler = callback;
        } else {
          throw new Error("Invalid callback type '" + typeof callback + "' provided in customizeRequests");
        }
      },
      /**
       * Calls an operation on a service with the given input parameters.
       *
       * @param operation [String] the name of the operation to call on the service.
       * @param params [map] a map of input options for the operation
       * @callback callback function(err, data)
       *   If a callback is supplied, it is called when a response is returned
       *   from the service.
       *   @param err [Error] the error object returned from the request.
       *     Set to `null` if the request is successful.
       *   @param data [Object] the de-serialized data returned from
       *     the request. Set to `null` if a request error occurs.
       */
      makeRequest: function makeRequest(operation, params, callback) {
        if (typeof params === "function") {
          callback = params;
          params = null;
        }
        params = params || {};
        if (this.config.params) {
          var rules = this.api.operations[operation];
          if (rules) {
            params = AWS2.util.copy(params);
            AWS2.util.each(this.config.params, function(key, value) {
              if (rules.input.members[key]) {
                if (params[key] === void 0 || params[key] === null) {
                  params[key] = value;
                }
              }
            });
          }
        }
        var request = new AWS2.Request(this, operation, params);
        this.addAllRequestListeners(request);
        this.attachMonitoringEmitter(request);
        if (callback)
          request.send(callback);
        return request;
      },
      /**
       * Calls an operation on a service with the given input parameters, without
       * any authentication data. This method is useful for "public" API operations.
       *
       * @param operation [String] the name of the operation to call on the service.
       * @param params [map] a map of input options for the operation
       * @callback callback function(err, data)
       *   If a callback is supplied, it is called when a response is returned
       *   from the service.
       *   @param err [Error] the error object returned from the request.
       *     Set to `null` if the request is successful.
       *   @param data [Object] the de-serialized data returned from
       *     the request. Set to `null` if a request error occurs.
       */
      makeUnauthenticatedRequest: function makeUnauthenticatedRequest(operation, params, callback) {
        if (typeof params === "function") {
          callback = params;
          params = {};
        }
        var request = this.makeRequest(operation, params).toUnauthenticated();
        return callback ? request.send(callback) : request;
      },
      /**
       * Waits for a given state
       *
       * @param state [String] the state on the service to wait for
       * @param params [map] a map of parameters to pass with each request
       * @option params $waiter [map] a map of configuration options for the waiter
       * @option params $waiter.delay [Number] The number of seconds to wait between
       *                                       requests
       * @option params $waiter.maxAttempts [Number] The maximum number of requests
       *                                             to send while waiting
       * @callback callback function(err, data)
       *   If a callback is supplied, it is called when a response is returned
       *   from the service.
       *   @param err [Error] the error object returned from the request.
       *     Set to `null` if the request is successful.
       *   @param data [Object] the de-serialized data returned from
       *     the request. Set to `null` if a request error occurs.
       */
      waitFor: function waitFor(state, params, callback) {
        var waiter = new AWS2.ResourceWaiter(this, state);
        return waiter.wait(params, callback);
      },
      /**
       * @api private
       */
      addAllRequestListeners: function addAllRequestListeners(request) {
        var list = [
          AWS2.events,
          AWS2.EventListeners.Core,
          this.serviceInterface(),
          AWS2.EventListeners.CorePost
        ];
        for (var i = 0; i < list.length; i++) {
          if (list[i])
            request.addListeners(list[i]);
        }
        if (!this.config.paramValidation) {
          request.removeListener(
            "validate",
            AWS2.EventListeners.Core.VALIDATE_PARAMETERS
          );
        }
        if (this.config.logger) {
          request.addListeners(AWS2.EventListeners.Logger);
        }
        this.setupRequestListeners(request);
        if (typeof this.constructor.prototype.customRequestHandler === "function") {
          this.constructor.prototype.customRequestHandler(request);
        }
        if (Object.prototype.hasOwnProperty.call(this, "customRequestHandler") && typeof this.customRequestHandler === "function") {
          this.customRequestHandler(request);
        }
      },
      /**
       * Event recording metrics for a whole API call.
       * @returns {object} a subset of api call metrics
       * @api private
       */
      apiCallEvent: function apiCallEvent(request) {
        var api = request.service.api.operations[request.operation];
        var monitoringEvent = {
          Type: "ApiCall",
          Api: api ? api.name : request.operation,
          Version: 1,
          Service: request.service.api.serviceId || request.service.api.endpointPrefix,
          Region: request.httpRequest.region,
          MaxRetriesExceeded: 0,
          UserAgent: request.httpRequest.getUserAgent()
        };
        var response2 = request.response;
        if (response2.httpResponse.statusCode) {
          monitoringEvent.FinalHttpStatusCode = response2.httpResponse.statusCode;
        }
        if (response2.error) {
          var error = response2.error;
          var statusCode = response2.httpResponse.statusCode;
          if (statusCode > 299) {
            if (error.code)
              monitoringEvent.FinalAwsException = error.code;
            if (error.message)
              monitoringEvent.FinalAwsExceptionMessage = error.message;
          } else {
            if (error.code || error.name)
              monitoringEvent.FinalSdkException = error.code || error.name;
            if (error.message)
              monitoringEvent.FinalSdkExceptionMessage = error.message;
          }
        }
        return monitoringEvent;
      },
      /**
       * Event recording metrics for an API call attempt.
       * @returns {object} a subset of api call attempt metrics
       * @api private
       */
      apiAttemptEvent: function apiAttemptEvent(request) {
        var api = request.service.api.operations[request.operation];
        var monitoringEvent = {
          Type: "ApiCallAttempt",
          Api: api ? api.name : request.operation,
          Version: 1,
          Service: request.service.api.serviceId || request.service.api.endpointPrefix,
          Fqdn: request.httpRequest.endpoint.hostname,
          UserAgent: request.httpRequest.getUserAgent()
        };
        var response2 = request.response;
        if (response2.httpResponse.statusCode) {
          monitoringEvent.HttpStatusCode = response2.httpResponse.statusCode;
        }
        if (!request._unAuthenticated && request.service.config.credentials && request.service.config.credentials.accessKeyId) {
          monitoringEvent.AccessKey = request.service.config.credentials.accessKeyId;
        }
        if (!response2.httpResponse.headers)
          return monitoringEvent;
        if (request.httpRequest.headers["x-amz-security-token"]) {
          monitoringEvent.SessionToken = request.httpRequest.headers["x-amz-security-token"];
        }
        if (response2.httpResponse.headers["x-amzn-requestid"]) {
          monitoringEvent.XAmznRequestId = response2.httpResponse.headers["x-amzn-requestid"];
        }
        if (response2.httpResponse.headers["x-amz-request-id"]) {
          monitoringEvent.XAmzRequestId = response2.httpResponse.headers["x-amz-request-id"];
        }
        if (response2.httpResponse.headers["x-amz-id-2"]) {
          monitoringEvent.XAmzId2 = response2.httpResponse.headers["x-amz-id-2"];
        }
        return monitoringEvent;
      },
      /**
       * Add metrics of failed request.
       * @api private
       */
      attemptFailEvent: function attemptFailEvent(request) {
        var monitoringEvent = this.apiAttemptEvent(request);
        var response2 = request.response;
        var error = response2.error;
        if (response2.httpResponse.statusCode > 299) {
          if (error.code)
            monitoringEvent.AwsException = error.code;
          if (error.message)
            monitoringEvent.AwsExceptionMessage = error.message;
        } else {
          if (error.code || error.name)
            monitoringEvent.SdkException = error.code || error.name;
          if (error.message)
            monitoringEvent.SdkExceptionMessage = error.message;
        }
        return monitoringEvent;
      },
      /**
       * Attach listeners to request object to fetch metrics of each request
       * and emit data object through \'ApiCall\' and \'ApiCallAttempt\' events.
       * @api private
       */
      attachMonitoringEmitter: function attachMonitoringEmitter(request) {
        var attemptTimestamp;
        var attemptStartRealTime;
        var attemptLatency;
        var callStartRealTime;
        var attemptCount = 0;
        var region;
        var callTimestamp;
        var self = this;
        var addToHead = true;
        request.on("validate", function() {
          callStartRealTime = AWS2.util.realClock.now();
          callTimestamp = Date.now();
        }, addToHead);
        request.on("sign", function() {
          attemptStartRealTime = AWS2.util.realClock.now();
          attemptTimestamp = Date.now();
          region = request.httpRequest.region;
          attemptCount++;
        }, addToHead);
        request.on("validateResponse", function() {
          attemptLatency = Math.round(AWS2.util.realClock.now() - attemptStartRealTime);
        });
        request.addNamedListener("API_CALL_ATTEMPT", "success", function API_CALL_ATTEMPT() {
          var apiAttemptEvent = self.apiAttemptEvent(request);
          apiAttemptEvent.Timestamp = attemptTimestamp;
          apiAttemptEvent.AttemptLatency = attemptLatency >= 0 ? attemptLatency : 0;
          apiAttemptEvent.Region = region;
          self.emit("apiCallAttempt", [apiAttemptEvent]);
        });
        request.addNamedListener("API_CALL_ATTEMPT_RETRY", "retry", function API_CALL_ATTEMPT_RETRY() {
          var apiAttemptEvent = self.attemptFailEvent(request);
          apiAttemptEvent.Timestamp = attemptTimestamp;
          attemptLatency = attemptLatency || Math.round(AWS2.util.realClock.now() - attemptStartRealTime);
          apiAttemptEvent.AttemptLatency = attemptLatency >= 0 ? attemptLatency : 0;
          apiAttemptEvent.Region = region;
          self.emit("apiCallAttempt", [apiAttemptEvent]);
        });
        request.addNamedListener("API_CALL", "complete", function API_CALL() {
          var apiCallEvent = self.apiCallEvent(request);
          apiCallEvent.AttemptCount = attemptCount;
          if (apiCallEvent.AttemptCount <= 0)
            return;
          apiCallEvent.Timestamp = callTimestamp;
          var latency = Math.round(AWS2.util.realClock.now() - callStartRealTime);
          apiCallEvent.Latency = latency >= 0 ? latency : 0;
          var response2 = request.response;
          if (response2.error && response2.error.retryable && typeof response2.retryCount === "number" && typeof response2.maxRetries === "number" && response2.retryCount >= response2.maxRetries) {
            apiCallEvent.MaxRetriesExceeded = 1;
          }
          self.emit("apiCall", [apiCallEvent]);
        });
      },
      /**
       * Override this method to setup any custom request listeners for each
       * new request to the service.
       *
       * @method_abstract This is an abstract method.
       */
      setupRequestListeners: function setupRequestListeners(request) {
      },
      /**
       * Gets the signing name for a given request
       * @api private
       */
      getSigningName: function getSigningName() {
        return this.api.signingName || this.api.endpointPrefix;
      },
      /**
       * Gets the signer class for a given request
       * @api private
       */
      getSignerClass: function getSignerClass(request) {
        var version;
        var operation = null;
        var authtype = "";
        if (request) {
          var operations = request.service.api.operations || {};
          operation = operations[request.operation] || null;
          authtype = operation ? operation.authtype : "";
        }
        if (this.config.signatureVersion) {
          version = this.config.signatureVersion;
        } else if (authtype === "v4" || authtype === "v4-unsigned-body") {
          version = "v4";
        } else if (authtype === "bearer") {
          version = "bearer";
        } else {
          version = this.api.signatureVersion;
        }
        return AWS2.Signers.RequestSigner.getVersion(version);
      },
      /**
       * @api private
       */
      serviceInterface: function serviceInterface() {
        switch (this.api.protocol) {
          case "ec2":
            return AWS2.EventListeners.Query;
          case "query":
            return AWS2.EventListeners.Query;
          case "json":
            return AWS2.EventListeners.Json;
          case "rest-json":
            return AWS2.EventListeners.RestJson;
          case "rest-xml":
            return AWS2.EventListeners.RestXml;
        }
        if (this.api.protocol) {
          throw new Error("Invalid service `protocol' " + this.api.protocol + " in API config");
        }
      },
      /**
       * @api private
       */
      successfulResponse: function successfulResponse(resp) {
        return resp.httpResponse.statusCode < 300;
      },
      /**
       * How many times a failed request should be retried before giving up.
       * the defaultRetryCount can be overriden by service classes.
       *
       * @api private
       */
      numRetries: function numRetries() {
        if (this.config.maxRetries !== void 0) {
          return this.config.maxRetries;
        } else {
          return this.defaultRetryCount;
        }
      },
      /**
       * @api private
       */
      retryDelays: function retryDelays(retryCount, err) {
        return AWS2.util.calculateRetryDelay(retryCount, this.config.retryDelayOptions, err);
      },
      /**
       * @api private
       */
      retryableError: function retryableError(error) {
        if (this.timeoutError(error))
          return true;
        if (this.networkingError(error))
          return true;
        if (this.expiredCredentialsError(error))
          return true;
        if (this.throttledError(error))
          return true;
        if (error.statusCode >= 500)
          return true;
        return false;
      },
      /**
       * @api private
       */
      networkingError: function networkingError(error) {
        return error.code === "NetworkingError";
      },
      /**
       * @api private
       */
      timeoutError: function timeoutError(error) {
        return error.code === "TimeoutError";
      },
      /**
       * @api private
       */
      expiredCredentialsError: function expiredCredentialsError(error) {
        return error.code === "ExpiredTokenException";
      },
      /**
       * @api private
       */
      clockSkewError: function clockSkewError(error) {
        switch (error.code) {
          case "RequestTimeTooSkewed":
          case "RequestExpired":
          case "InvalidSignatureException":
          case "SignatureDoesNotMatch":
          case "AuthFailure":
          case "RequestInTheFuture":
            return true;
          default:
            return false;
        }
      },
      /**
       * @api private
       */
      getSkewCorrectedDate: function getSkewCorrectedDate() {
        return new Date(Date.now() + this.config.systemClockOffset);
      },
      /**
       * @api private
       */
      applyClockOffset: function applyClockOffset(newServerTime) {
        if (newServerTime) {
          this.config.systemClockOffset = newServerTime - Date.now();
        }
      },
      /**
       * @api private
       */
      isClockSkewed: function isClockSkewed(newServerTime) {
        if (newServerTime) {
          return Math.abs(this.getSkewCorrectedDate().getTime() - newServerTime) >= 3e5;
        }
      },
      /**
       * @api private
       */
      throttledError: function throttledError(error) {
        if (error.statusCode === 429)
          return true;
        switch (error.code) {
          case "ProvisionedThroughputExceededException":
          case "Throttling":
          case "ThrottlingException":
          case "RequestLimitExceeded":
          case "RequestThrottled":
          case "RequestThrottledException":
          case "TooManyRequestsException":
          case "TransactionInProgressException":
          case "EC2ThrottledException":
            return true;
          default:
            return false;
        }
      },
      /**
       * @api private
       */
      endpointFromTemplate: function endpointFromTemplate(endpoint) {
        if (typeof endpoint !== "string")
          return endpoint;
        var e = endpoint;
        e = e.replace(/\{service\}/g, this.api.endpointPrefix);
        e = e.replace(/\{region\}/g, this.config.region);
        e = e.replace(/\{scheme\}/g, this.config.sslEnabled ? "https" : "http");
        return e;
      },
      /**
       * @api private
       */
      setEndpoint: function setEndpoint(endpoint) {
        this.endpoint = new AWS2.Endpoint(endpoint, this.config);
      },
      /**
       * @api private
       */
      paginationConfig: function paginationConfig(operation, throwException) {
        var paginator = this.api.operations[operation].paginator;
        if (!paginator) {
          if (throwException) {
            var e = new Error();
            throw AWS2.util.error(e, "No pagination configuration for " + operation);
          }
          return null;
        }
        return paginator;
      }
    });
    AWS2.util.update(AWS2.Service, {
      /**
       * Adds one method for each operation described in the api configuration
       *
       * @api private
       */
      defineMethods: function defineMethods(svc) {
        AWS2.util.each(svc.prototype.api.operations, function iterator(method) {
          if (svc.prototype[method])
            return;
          var operation = svc.prototype.api.operations[method];
          if (operation.authtype === "none") {
            svc.prototype[method] = function(params, callback) {
              return this.makeUnauthenticatedRequest(method, params, callback);
            };
          } else {
            svc.prototype[method] = function(params, callback) {
              return this.makeRequest(method, params, callback);
            };
          }
        });
      },
      /**
       * Defines a new Service class using a service identifier and list of versions
       * including an optional set of features (functions) to apply to the class
       * prototype.
       *
       * @param serviceIdentifier [String] the identifier for the service
       * @param versions [Array<String>] a list of versions that work with this
       *   service
       * @param features [Object] an object to attach to the prototype
       * @return [Class<Service>] the service class defined by this function.
       */
      defineService: function defineService(serviceIdentifier, versions, features) {
        AWS2.Service._serviceMap[serviceIdentifier] = true;
        if (!Array.isArray(versions)) {
          features = versions;
          versions = [];
        }
        var svc = inherit(AWS2.Service, features || {});
        if (typeof serviceIdentifier === "string") {
          AWS2.Service.addVersions(svc, versions);
          var identifier = svc.serviceIdentifier || serviceIdentifier;
          svc.serviceIdentifier = identifier;
        } else {
          svc.prototype.api = serviceIdentifier;
          AWS2.Service.defineMethods(svc);
        }
        AWS2.SequentialExecutor.call(this.prototype);
        if (!this.prototype.publisher && AWS2.util.clientSideMonitoring) {
          var Publisher = AWS2.util.clientSideMonitoring.Publisher;
          var configProvider = AWS2.util.clientSideMonitoring.configProvider;
          var publisherConfig = configProvider();
          this.prototype.publisher = new Publisher(publisherConfig);
          if (publisherConfig.enabled) {
            AWS2.Service._clientSideMonitoring = true;
          }
        }
        AWS2.SequentialExecutor.call(svc.prototype);
        AWS2.Service.addDefaultMonitoringListeners(svc.prototype);
        return svc;
      },
      /**
       * @api private
       */
      addVersions: function addVersions(svc, versions) {
        if (!Array.isArray(versions))
          versions = [versions];
        svc.services = svc.services || {};
        for (var i = 0; i < versions.length; i++) {
          if (svc.services[versions[i]] === void 0) {
            svc.services[versions[i]] = null;
          }
        }
        svc.apiVersions = Object.keys(svc.services).sort();
      },
      /**
       * @api private
       */
      defineServiceApi: function defineServiceApi(superclass, version, apiConfig) {
        var svc = inherit(superclass, {
          serviceIdentifier: superclass.serviceIdentifier
        });
        function setApi(api) {
          if (api.isApi) {
            svc.prototype.api = api;
          } else {
            svc.prototype.api = new Api(api, {
              serviceIdentifier: superclass.serviceIdentifier
            });
          }
        }
        if (typeof version === "string") {
          if (apiConfig) {
            setApi(apiConfig);
          } else {
            try {
              setApi(AWS2.apiLoader(superclass.serviceIdentifier, version));
            } catch (err) {
              throw AWS2.util.error(err, {
                message: "Could not find API configuration " + superclass.serviceIdentifier + "-" + version
              });
            }
          }
          if (!Object.prototype.hasOwnProperty.call(superclass.services, version)) {
            superclass.apiVersions = superclass.apiVersions.concat(version).sort();
          }
          superclass.services[version] = svc;
        } else {
          setApi(version);
        }
        AWS2.Service.defineMethods(svc);
        return svc;
      },
      /**
       * @api private
       */
      hasService: function(identifier) {
        return Object.prototype.hasOwnProperty.call(AWS2.Service._serviceMap, identifier);
      },
      /**
       * @param attachOn attach default monitoring listeners to object
       *
       * Each monitoring event should be emitted from service client to service constructor prototype and then
       * to global service prototype like bubbling up. These default monitoring events listener will transfer
       * the monitoring events to the upper layer.
       * @api private
       */
      addDefaultMonitoringListeners: function addDefaultMonitoringListeners(attachOn) {
        attachOn.addNamedListener("MONITOR_EVENTS_BUBBLE", "apiCallAttempt", function EVENTS_BUBBLE(event) {
          var baseClass = Object.getPrototypeOf(attachOn);
          if (baseClass._events)
            baseClass.emit("apiCallAttempt", [event]);
        });
        attachOn.addNamedListener("CALL_EVENTS_BUBBLE", "apiCall", function CALL_EVENTS_BUBBLE(event) {
          var baseClass = Object.getPrototypeOf(attachOn);
          if (baseClass._events)
            baseClass.emit("apiCall", [event]);
        });
      },
      /**
       * @api private
       */
      _serviceMap: {}
    });
    AWS2.util.mixin(AWS2.Service, AWS2.SequentialExecutor);
    module2.exports = AWS2.Service;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials.js
var require_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials.js"() {
    var AWS2 = require_core();
    AWS2.Credentials = AWS2.util.inherit({
      /**
       * A credentials object can be created using positional arguments or an options
       * hash.
       *
       * @overload AWS.Credentials(accessKeyId, secretAccessKey, sessionToken=null)
       *   Creates a Credentials object with a given set of credential information
       *   as positional arguments.
       *   @param accessKeyId [String] the AWS access key ID
       *   @param secretAccessKey [String] the AWS secret access key
       *   @param sessionToken [String] the optional AWS session token
       *   @example Create a credentials object with AWS credentials
       *     var creds = new AWS.Credentials('akid', 'secret', 'session');
       * @overload AWS.Credentials(options)
       *   Creates a Credentials object with a given set of credential information
       *   as an options hash.
       *   @option options accessKeyId [String] the AWS access key ID
       *   @option options secretAccessKey [String] the AWS secret access key
       *   @option options sessionToken [String] the optional AWS session token
       *   @example Create a credentials object with AWS credentials
       *     var creds = new AWS.Credentials({
       *       accessKeyId: 'akid', secretAccessKey: 'secret', sessionToken: 'session'
       *     });
       */
      constructor: function Credentials() {
        AWS2.util.hideProperties(this, ["secretAccessKey"]);
        this.expired = false;
        this.expireTime = null;
        this.refreshCallbacks = [];
        if (arguments.length === 1 && typeof arguments[0] === "object") {
          var creds = arguments[0].credentials || arguments[0];
          this.accessKeyId = creds.accessKeyId;
          this.secretAccessKey = creds.secretAccessKey;
          this.sessionToken = creds.sessionToken;
        } else {
          this.accessKeyId = arguments[0];
          this.secretAccessKey = arguments[1];
          this.sessionToken = arguments[2];
        }
      },
      /**
       * @return [Integer] the number of seconds before {expireTime} during which
       *   the credentials will be considered expired.
       */
      expiryWindow: 15,
      /**
       * @return [Boolean] whether the credentials object should call {refresh}
       * @note Subclasses should override this method to provide custom refresh
       *   logic.
       */
      needsRefresh: function needsRefresh() {
        var currentTime = AWS2.util.date.getDate().getTime();
        var adjustedTime = new Date(currentTime + this.expiryWindow * 1e3);
        if (this.expireTime && adjustedTime > this.expireTime) {
          return true;
        } else {
          return this.expired || !this.accessKeyId || !this.secretAccessKey;
        }
      },
      /**
       * Gets the existing credentials, refreshing them if they are not yet loaded
       * or have expired. Users should call this method before using {refresh},
       * as this will not attempt to reload credentials when they are already
       * loaded into the object.
       *
       * @callback callback function(err)
       *   When this callback is called with no error, it means either credentials
       *   do not need to be refreshed or refreshed credentials information has
       *   been loaded into the object (as the `accessKeyId`, `secretAccessKey`,
       *   and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       */
      get: function get(callback) {
        var self = this;
        if (this.needsRefresh()) {
          this.refresh(function(err) {
            if (!err)
              self.expired = false;
            if (callback)
              callback(err);
          });
        } else if (callback) {
          callback();
        }
      },
      /**
       * @!method  getPromise()
       *   Returns a 'thenable' promise.
       *   Gets the existing credentials, refreshing them if they are not yet loaded
       *   or have expired. Users should call this method before using {refresh},
       *   as this will not attempt to reload credentials when they are already
       *   loaded into the object.
       *
       *   Two callbacks can be provided to the `then` method on the returned promise.
       *   The first callback will be called if the promise is fulfilled, and the second
       *   callback will be called if the promise is rejected.
       *   @callback fulfilledCallback function()
       *     Called if the promise is fulfilled. When this callback is called, it
       *     means either credentials do not need to be refreshed or refreshed
       *     credentials information has been loaded into the object (as the
       *     `accessKeyId`, `secretAccessKey`, and `sessionToken` properties).
       *   @callback rejectedCallback function(err)
       *     Called if the promise is rejected.
       *     @param err [Error] if an error occurred, this value will be filled
       *   @return [Promise] A promise that represents the state of the `get` call.
       *   @example Calling the `getPromise` method.
       *     var promise = credProvider.getPromise();
       *     promise.then(function() { ... }, function(err) { ... });
       */
      /**
       * @!method  refreshPromise()
       *   Returns a 'thenable' promise.
       *   Refreshes the credentials. Users should call {get} before attempting
       *   to forcibly refresh credentials.
       *
       *   Two callbacks can be provided to the `then` method on the returned promise.
       *   The first callback will be called if the promise is fulfilled, and the second
       *   callback will be called if the promise is rejected.
       *   @callback fulfilledCallback function()
       *     Called if the promise is fulfilled. When this callback is called, it
       *     means refreshed credentials information has been loaded into the object
       *     (as the `accessKeyId`, `secretAccessKey`, and `sessionToken` properties).
       *   @callback rejectedCallback function(err)
       *     Called if the promise is rejected.
       *     @param err [Error] if an error occurred, this value will be filled
       *   @return [Promise] A promise that represents the state of the `refresh` call.
       *   @example Calling the `refreshPromise` method.
       *     var promise = credProvider.refreshPromise();
       *     promise.then(function() { ... }, function(err) { ... });
       */
      /**
       * Refreshes the credentials. Users should call {get} before attempting
       * to forcibly refresh credentials.
       *
       * @callback callback function(err)
       *   When this callback is called with no error, it means refreshed
       *   credentials information has been loaded into the object (as the
       *   `accessKeyId`, `secretAccessKey`, and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @note Subclasses should override this class to reset the
       *   {accessKeyId}, {secretAccessKey} and optional {sessionToken}
       *   on the credentials object and then call the callback with
       *   any error information.
       * @see get
       */
      refresh: function refresh(callback) {
        this.expired = false;
        callback();
      },
      /**
       * @api private
       * @param callback
       */
      coalesceRefresh: function coalesceRefresh(callback, sync) {
        var self = this;
        if (self.refreshCallbacks.push(callback) === 1) {
          self.load(function onLoad(err) {
            AWS2.util.arrayEach(self.refreshCallbacks, function(callback2) {
              if (sync) {
                callback2(err);
              } else {
                AWS2.util.defer(function() {
                  callback2(err);
                });
              }
            });
            self.refreshCallbacks.length = 0;
          });
        }
      },
      /**
       * @api private
       * @param callback
       */
      load: function load(callback) {
        callback();
      }
    });
    AWS2.Credentials.addPromisesToClass = function addPromisesToClass(PromiseDependency) {
      this.prototype.getPromise = AWS2.util.promisifyMethod("get", PromiseDependency);
      this.prototype.refreshPromise = AWS2.util.promisifyMethod("refresh", PromiseDependency);
    };
    AWS2.Credentials.deletePromisesFromClass = function deletePromisesFromClass() {
      delete this.prototype.getPromise;
      delete this.prototype.refreshPromise;
    };
    AWS2.util.addPromises(AWS2.Credentials);
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/credential_provider_chain.js
var require_credential_provider_chain = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/credential_provider_chain.js"() {
    var AWS2 = require_core();
    AWS2.CredentialProviderChain = AWS2.util.inherit(AWS2.Credentials, {
      /**
       * Creates a new CredentialProviderChain with a default set of providers
       * specified by {defaultProviders}.
       */
      constructor: function CredentialProviderChain(providers) {
        if (providers) {
          this.providers = providers;
        } else {
          this.providers = AWS2.CredentialProviderChain.defaultProviders.slice(0);
        }
        this.resolveCallbacks = [];
      },
      /**
       * @!method  resolvePromise()
       *   Returns a 'thenable' promise.
       *   Resolves the provider chain by searching for the first set of
       *   credentials in {providers}.
       *
       *   Two callbacks can be provided to the `then` method on the returned promise.
       *   The first callback will be called if the promise is fulfilled, and the second
       *   callback will be called if the promise is rejected.
       *   @callback fulfilledCallback function(credentials)
       *     Called if the promise is fulfilled and the provider resolves the chain
       *     to a credentials object
       *     @param credentials [AWS.Credentials] the credentials object resolved
       *       by the provider chain.
       *   @callback rejectedCallback function(error)
       *     Called if the promise is rejected.
       *     @param err [Error] the error object returned if no credentials are found.
       *   @return [Promise] A promise that represents the state of the `resolve` method call.
       *   @example Calling the `resolvePromise` method.
       *     var promise = chain.resolvePromise();
       *     promise.then(function(credentials) { ... }, function(err) { ... });
       */
      /**
       * Resolves the provider chain by searching for the first set of
       * credentials in {providers}.
       *
       * @callback callback function(err, credentials)
       *   Called when the provider resolves the chain to a credentials object
       *   or null if no credentials can be found.
       *
       *   @param err [Error] the error object returned if no credentials are
       *     found.
       *   @param credentials [AWS.Credentials] the credentials object resolved
       *     by the provider chain.
       * @return [AWS.CredentialProviderChain] the provider, for chaining.
       */
      resolve: function resolve(callback) {
        var self = this;
        if (self.providers.length === 0) {
          callback(new Error("No providers"));
          return self;
        }
        if (self.resolveCallbacks.push(callback) === 1) {
          let resolveNext2 = function(err, creds) {
            if (!err && creds || index === providers.length) {
              AWS2.util.arrayEach(self.resolveCallbacks, function(callback2) {
                callback2(err, creds);
              });
              self.resolveCallbacks.length = 0;
              return;
            }
            var provider = providers[index++];
            if (typeof provider === "function") {
              creds = provider.call();
            } else {
              creds = provider;
            }
            if (creds.get) {
              creds.get(function(getErr) {
                resolveNext2(getErr, getErr ? null : creds);
              });
            } else {
              resolveNext2(null, creds);
            }
          };
          var resolveNext = resolveNext2;
          var index = 0;
          var providers = self.providers.slice(0);
          resolveNext2();
        }
        return self;
      }
    });
    AWS2.CredentialProviderChain.defaultProviders = [];
    AWS2.CredentialProviderChain.addPromisesToClass = function addPromisesToClass(PromiseDependency) {
      this.prototype.resolvePromise = AWS2.util.promisifyMethod("resolve", PromiseDependency);
    };
    AWS2.CredentialProviderChain.deletePromisesFromClass = function deletePromisesFromClass() {
      delete this.prototype.resolvePromise;
    };
    AWS2.util.addPromises(AWS2.CredentialProviderChain);
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/config.js
var require_config = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/config.js"() {
    var AWS2 = require_core();
    require_credentials();
    require_credential_provider_chain();
    var PromisesDependency;
    AWS2.Config = AWS2.util.inherit({
      /**
       * @!endgroup
       */
      /**
       * Creates a new configuration object. This is the object that passes
       * option data along to service requests, including credentials, security,
       * region information, and some service specific settings.
       *
       * @example Creating a new configuration object with credentials and region
       *   var config = new AWS.Config({
       *     accessKeyId: 'AKID', secretAccessKey: 'SECRET', region: 'us-west-2'
       *   });
       * @option options accessKeyId [String] your AWS access key ID.
       * @option options secretAccessKey [String] your AWS secret access key.
       * @option options sessionToken [AWS.Credentials] the optional AWS
       *   session token to sign requests with.
       * @option options credentials [AWS.Credentials] the AWS credentials
       *   to sign requests with. You can either specify this object, or
       *   specify the accessKeyId and secretAccessKey options directly.
       * @option options credentialProvider [AWS.CredentialProviderChain] the
       *   provider chain used to resolve credentials if no static `credentials`
       *   property is set.
       * @option options region [String] the region to send service requests to.
       *   See {region} for more information.
       * @option options maxRetries [Integer] the maximum amount of retries to
       *   attempt with a request. See {maxRetries} for more information.
       * @option options maxRedirects [Integer] the maximum amount of redirects to
       *   follow with a request. See {maxRedirects} for more information.
       * @option options sslEnabled [Boolean] whether to enable SSL for
       *   requests.
       * @option options paramValidation [Boolean|map] whether input parameters
       *   should be validated against the operation description before sending
       *   the request. Defaults to true. Pass a map to enable any of the
       *   following specific validation features:
       *
       *   * **min** [Boolean] &mdash; Validates that a value meets the min
       *     constraint. This is enabled by default when paramValidation is set
       *     to `true`.
       *   * **max** [Boolean] &mdash; Validates that a value meets the max
       *     constraint.
       *   * **pattern** [Boolean] &mdash; Validates that a string value matches a
       *     regular expression.
       *   * **enum** [Boolean] &mdash; Validates that a string value matches one
       *     of the allowable enum values.
       * @option options computeChecksums [Boolean] whether to compute checksums
       *   for payload bodies when the service accepts it (currently supported
       *   in S3 only)
       * @option options convertResponseTypes [Boolean] whether types are converted
       *     when parsing response data. Currently only supported for JSON based
       *     services. Turning this off may improve performance on large response
       *     payloads. Defaults to `true`.
       * @option options correctClockSkew [Boolean] whether to apply a clock skew
       *     correction and retry requests that fail because of an skewed client
       *     clock. Defaults to `false`.
       * @option options s3ForcePathStyle [Boolean] whether to force path
       *   style URLs for S3 objects.
       * @option options s3BucketEndpoint [Boolean] whether the provided endpoint
       *   addresses an individual bucket (false if it addresses the root API
       *   endpoint). Note that setting this configuration option requires an
       *   `endpoint` to be provided explicitly to the service constructor.
       * @option options s3DisableBodySigning [Boolean] whether S3 body signing
       *   should be disabled when using signature version `v4`. Body signing
       *   can only be disabled when using https. Defaults to `true`.
       * @option options s3UsEast1RegionalEndpoint ['legacy'|'regional'] when region
       *   is set to 'us-east-1', whether to send s3 request to global endpoints or
       *   'us-east-1' regional endpoints. This config is only applicable to S3 client.
       *   Defaults to `legacy`
       * @option options s3UseArnRegion [Boolean] whether to override the request region
       *   with the region inferred from requested resource's ARN. Only available for S3 buckets
       *   Defaults to `true`
       *
       * @option options retryDelayOptions [map] A set of options to configure
       *   the retry delay on retryable errors. Currently supported options are:
       *
       *   * **base** [Integer] &mdash; The base number of milliseconds to use in the
       *     exponential backoff for operation retries. Defaults to 100 ms for all
       *     services except DynamoDB, where it defaults to 50ms.
       *   * **customBackoff ** [function] &mdash; A custom function that accepts a
       *     retry count and error and returns the amount of time to delay in
       *     milliseconds. If the result is a non-zero negative value, no further
       *     retry attempts will be made. The `base` option will be ignored if this
       *     option is supplied. The function is only called for retryable errors.
       * @option options httpOptions [map] A set of options to pass to the low-level
       *   HTTP request. Currently supported options are:
       *
       *   * **proxy** [String] &mdash; the URL to proxy requests through
       *   * **agent** [http.Agent, https.Agent] &mdash; the Agent object to perform
       *     HTTP requests with. Used for connection pooling. Defaults to the global
       *     agent (`http.globalAgent`) for non-SSL connections. Note that for
       *     SSL connections, a special Agent object is used in order to enable
       *     peer certificate verification. This feature is only available in the
       *     Node.js environment.
       *   * **connectTimeout** [Integer] &mdash; Sets the socket to timeout after
       *     failing to establish a connection with the server after
       *     `connectTimeout` milliseconds. This timeout has no effect once a socket
       *     connection has been established.
       *   * **timeout** [Integer] &mdash; Sets the socket to timeout after timeout
       *     milliseconds of inactivity on the socket. Defaults to two minutes
       *     (120000).
       *   * **xhrAsync** [Boolean] &mdash; Whether the SDK will send asynchronous
       *     HTTP requests. Used in the browser environment only. Set to false to
       *     send requests synchronously. Defaults to true (async on).
       *   * **xhrWithCredentials** [Boolean] &mdash; Sets the "withCredentials"
       *     property of an XMLHttpRequest object. Used in the browser environment
       *     only. Defaults to false.
       * @option options apiVersion [String, Date] a String in YYYY-MM-DD format
       *   (or a date) that represents the latest possible API version that can be
       *   used in all services (unless overridden by `apiVersions`). Specify
       *   'latest' to use the latest possible version.
       * @option options apiVersions [map<String, String|Date>] a map of service
       *   identifiers (the lowercase service class name) with the API version to
       *   use when instantiating a service. Specify 'latest' for each individual
       *   that can use the latest available version.
       * @option options logger [#write,#log] an object that responds to .write()
       *   (like a stream) or .log() (like the console object) in order to log
       *   information about requests
       * @option options systemClockOffset [Number] an offset value in milliseconds
       *   to apply to all signing times. Use this to compensate for clock skew
       *   when your system may be out of sync with the service time. Note that
       *   this configuration option can only be applied to the global `AWS.config`
       *   object and cannot be overridden in service-specific configuration.
       *   Defaults to 0 milliseconds.
       * @option options signatureVersion [String] the signature version to sign
       *   requests with (overriding the API configuration). Possible values are:
       *   'v2', 'v3', 'v4'.
       * @option options signatureCache [Boolean] whether the signature to sign
       *   requests with (overriding the API configuration) is cached. Only applies
       *   to the signature version 'v4'. Defaults to `true`.
       * @option options dynamoDbCrc32 [Boolean] whether to validate the CRC32
       *   checksum of HTTP response bodies returned by DynamoDB. Default: `true`.
       * @option options useAccelerateEndpoint [Boolean] Whether to use the
       *   S3 Transfer Acceleration endpoint with the S3 service. Default: `false`.
       * @option options clientSideMonitoring [Boolean] whether to collect and
       *   publish this client's performance metrics of all its API requests.
       * @option options endpointDiscoveryEnabled [Boolean|undefined] whether to
       *   call operations with endpoints given by service dynamically. Setting this
       * config to `true` will enable endpoint discovery for all applicable operations.
       *   Setting it to `false` will explicitly disable endpoint discovery even though
       *   operations that require endpoint discovery will presumably fail. Leaving it
       *   to `undefined` means SDK will only do endpoint discovery when it's required.
       *   Defaults to `undefined`
       * @option options endpointCacheSize [Number] the size of the global cache storing
       *   endpoints from endpoint discovery operations. Once endpoint cache is created,
       *   updating this setting cannot change existing cache size.
       *   Defaults to 1000
       * @option options hostPrefixEnabled [Boolean] whether to marshal request
       *   parameters to the prefix of hostname.
       *   Defaults to `true`.
       * @option options stsRegionalEndpoints ['legacy'|'regional'] whether to send sts request
       *   to global endpoints or regional endpoints.
       *   Defaults to 'legacy'.
       * @option options useFipsEndpoint [Boolean] Enables FIPS compatible endpoints.
       *   Defaults to `false`.
       * @option options useDualstackEndpoint [Boolean] Enables IPv6 dualstack endpoint.
       *   Defaults to `false`.
       */
      constructor: function Config(options) {
        if (options === void 0)
          options = {};
        options = this.extractCredentials(options);
        AWS2.util.each.call(this, this.keys, function(key, value) {
          this.set(key, options[key], value);
        });
      },
      /**
       * @!group Managing Credentials
       */
      /**
       * Loads credentials from the configuration object. This is used internally
       * by the SDK to ensure that refreshable {Credentials} objects are properly
       * refreshed and loaded when sending a request. If you want to ensure that
       * your credentials are loaded prior to a request, you can use this method
       * directly to provide accurate credential data stored in the object.
       *
       * @note If you configure the SDK with static or environment credentials,
       *   the credential data should already be present in {credentials} attribute.
       *   This method is primarily necessary to load credentials from asynchronous
       *   sources, or sources that can refresh credentials periodically.
       * @example Getting your access key
       *   AWS.config.getCredentials(function(err) {
       *     if (err) console.log(err.stack); // credentials not loaded
       *     else console.log("Access Key:", AWS.config.credentials.accessKeyId);
       *   })
       * @callback callback function(err)
       *   Called when the {credentials} have been properly set on the configuration
       *   object.
       *
       *   @param err [Error] if this is set, credentials were not successfully
       *     loaded and this error provides information why.
       * @see credentials
       * @see Credentials
       */
      getCredentials: function getCredentials(callback) {
        var self = this;
        function finish(err) {
          callback(err, err ? null : self.credentials);
        }
        function credError(msg, err) {
          return new AWS2.util.error(err || new Error(), {
            code: "CredentialsError",
            message: msg,
            name: "CredentialsError"
          });
        }
        function getAsyncCredentials() {
          self.credentials.get(function(err) {
            if (err) {
              var msg = "Could not load credentials from " + self.credentials.constructor.name;
              err = credError(msg, err);
            }
            finish(err);
          });
        }
        function getStaticCredentials() {
          var err = null;
          if (!self.credentials.accessKeyId || !self.credentials.secretAccessKey) {
            err = credError("Missing credentials");
          }
          finish(err);
        }
        if (self.credentials) {
          if (typeof self.credentials.get === "function") {
            getAsyncCredentials();
          } else {
            getStaticCredentials();
          }
        } else if (self.credentialProvider) {
          self.credentialProvider.resolve(function(err, creds) {
            if (err) {
              err = credError("Could not load credentials from any providers", err);
            }
            self.credentials = creds;
            finish(err);
          });
        } else {
          finish(credError("No credentials to load"));
        }
      },
      /**
       * Loads token from the configuration object. This is used internally
       * by the SDK to ensure that refreshable {Token} objects are properly
       * refreshed and loaded when sending a request. If you want to ensure that
       * your token is loaded prior to a request, you can use this method
       * directly to provide accurate token data stored in the object.
       *
       * @note If you configure the SDK with static token, the token data should
       *   already be present in {token} attribute. This method is primarily necessary
       *   to load token from asynchronous sources, or sources that can refresh
       *   token periodically.
       * @example Getting your access token
       *   AWS.config.getToken(function(err) {
       *     if (err) console.log(err.stack); // token not loaded
       *     else console.log("Token:", AWS.config.token.token);
       *   })
       * @callback callback function(err)
       *   Called when the {token} have been properly set on the configuration object.
       *
       *   @param err [Error] if this is set, token was not successfully loaded and
       *     this error provides information why.
       * @see token
       */
      getToken: function getToken(callback) {
        var self = this;
        function finish(err) {
          callback(err, err ? null : self.token);
        }
        function tokenError(msg, err) {
          return new AWS2.util.error(err || new Error(), {
            code: "TokenError",
            message: msg,
            name: "TokenError"
          });
        }
        function getAsyncToken() {
          self.token.get(function(err) {
            if (err) {
              var msg = "Could not load token from " + self.token.constructor.name;
              err = tokenError(msg, err);
            }
            finish(err);
          });
        }
        function getStaticToken() {
          var err = null;
          if (!self.token.token) {
            err = tokenError("Missing token");
          }
          finish(err);
        }
        if (self.token) {
          if (typeof self.token.get === "function") {
            getAsyncToken();
          } else {
            getStaticToken();
          }
        } else if (self.tokenProvider) {
          self.tokenProvider.resolve(function(err, token) {
            if (err) {
              err = tokenError("Could not load token from any providers", err);
            }
            self.token = token;
            finish(err);
          });
        } else {
          finish(tokenError("No token to load"));
        }
      },
      /**
       * @!group Loading and Setting Configuration Options
       */
      /**
       * @overload update(options, allowUnknownKeys = false)
       *   Updates the current configuration object with new options.
       *
       *   @example Update maxRetries property of a configuration object
       *     config.update({maxRetries: 10});
       *   @param [Object] options a map of option keys and values.
       *   @param [Boolean] allowUnknownKeys whether unknown keys can be set on
       *     the configuration object. Defaults to `false`.
       *   @see constructor
       */
      update: function update(options, allowUnknownKeys) {
        allowUnknownKeys = allowUnknownKeys || false;
        options = this.extractCredentials(options);
        AWS2.util.each.call(this, options, function(key, value) {
          if (allowUnknownKeys || Object.prototype.hasOwnProperty.call(this.keys, key) || AWS2.Service.hasService(key)) {
            this.set(key, value);
          }
        });
      },
      /**
       * Loads configuration data from a JSON file into this config object.
       * @note Loading configuration will reset all existing configuration
       *   on the object.
       * @!macro nobrowser
       * @param path [String] the path relative to your process's current
       *    working directory to load configuration from.
       * @return [AWS.Config] the same configuration object
       */
      loadFromPath: function loadFromPath(path) {
        this.clear();
        var options = JSON.parse(AWS2.util.readFileSync(path));
        var fileSystemCreds = new AWS2.FileSystemCredentials(path);
        var chain = new AWS2.CredentialProviderChain();
        chain.providers.unshift(fileSystemCreds);
        chain.resolve(function(err, creds) {
          if (err)
            throw err;
          else
            options.credentials = creds;
        });
        this.constructor(options);
        return this;
      },
      /**
       * Clears configuration data on this object
       *
       * @api private
       */
      clear: function clear() {
        AWS2.util.each.call(this, this.keys, function(key) {
          delete this[key];
        });
        this.set("credentials", void 0);
        this.set("credentialProvider", void 0);
      },
      /**
       * Sets a property on the configuration object, allowing for a
       * default value
       * @api private
       */
      set: function set(property, value, defaultValue) {
        if (value === void 0) {
          if (defaultValue === void 0) {
            defaultValue = this.keys[property];
          }
          if (typeof defaultValue === "function") {
            this[property] = defaultValue.call(this);
          } else {
            this[property] = defaultValue;
          }
        } else if (property === "httpOptions" && this[property]) {
          this[property] = AWS2.util.merge(this[property], value);
        } else {
          this[property] = value;
        }
      },
      /**
       * All of the keys with their default values.
       *
       * @constant
       * @api private
       */
      keys: {
        credentials: null,
        credentialProvider: null,
        region: null,
        logger: null,
        apiVersions: {},
        apiVersion: null,
        endpoint: void 0,
        httpOptions: {
          timeout: 12e4
        },
        maxRetries: void 0,
        maxRedirects: 10,
        paramValidation: true,
        sslEnabled: true,
        s3ForcePathStyle: false,
        s3BucketEndpoint: false,
        s3DisableBodySigning: true,
        s3UsEast1RegionalEndpoint: "legacy",
        s3UseArnRegion: void 0,
        computeChecksums: true,
        convertResponseTypes: true,
        correctClockSkew: false,
        customUserAgent: null,
        dynamoDbCrc32: true,
        systemClockOffset: 0,
        signatureVersion: null,
        signatureCache: true,
        retryDelayOptions: {},
        useAccelerateEndpoint: false,
        clientSideMonitoring: false,
        endpointDiscoveryEnabled: void 0,
        endpointCacheSize: 1e3,
        hostPrefixEnabled: true,
        stsRegionalEndpoints: "legacy",
        useFipsEndpoint: false,
        useDualstackEndpoint: false,
        token: null
      },
      /**
       * Extracts accessKeyId, secretAccessKey and sessionToken
       * from a configuration hash.
       *
       * @api private
       */
      extractCredentials: function extractCredentials(options) {
        if (options.accessKeyId && options.secretAccessKey) {
          options = AWS2.util.copy(options);
          options.credentials = new AWS2.Credentials(options);
        }
        return options;
      },
      /**
       * Sets the promise dependency the SDK will use wherever Promises are returned.
       * Passing `null` will force the SDK to use native Promises if they are available.
       * If native Promises are not available, passing `null` will have no effect.
       * @param [Constructor] dep A reference to a Promise constructor
       */
      setPromisesDependency: function setPromisesDependency(dep) {
        PromisesDependency = dep;
        if (dep === null && typeof Promise === "function") {
          PromisesDependency = Promise;
        }
        var constructors = [AWS2.Request, AWS2.Credentials, AWS2.CredentialProviderChain];
        if (AWS2.S3) {
          constructors.push(AWS2.S3);
          if (AWS2.S3.ManagedUpload) {
            constructors.push(AWS2.S3.ManagedUpload);
          }
        }
        AWS2.util.addPromises(constructors, PromisesDependency);
      },
      /**
       * Gets the promise dependency set by `AWS.config.setPromisesDependency`.
       */
      getPromisesDependency: function getPromisesDependency() {
        return PromisesDependency;
      }
    });
    AWS2.config = new AWS2.Config();
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/http.js
var require_http = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/http.js"() {
    var AWS2 = require_core();
    var inherit = AWS2.util.inherit;
    AWS2.Endpoint = inherit({
      /**
       * @overload Endpoint(endpoint)
       *   Constructs a new endpoint given an endpoint URL. If the
       *   URL omits a protocol (http or https), the default protocol
       *   set in the global {AWS.config} will be used.
       *   @param endpoint [String] the URL to construct an endpoint from
       */
      constructor: function Endpoint(endpoint, config) {
        AWS2.util.hideProperties(this, ["slashes", "auth", "hash", "search", "query"]);
        if (typeof endpoint === "undefined" || endpoint === null) {
          throw new Error("Invalid endpoint: " + endpoint);
        } else if (typeof endpoint !== "string") {
          return AWS2.util.copy(endpoint);
        }
        if (!endpoint.match(/^http/)) {
          var useSSL = config && config.sslEnabled !== void 0 ? config.sslEnabled : AWS2.config.sslEnabled;
          endpoint = (useSSL ? "https" : "http") + "://" + endpoint;
        }
        AWS2.util.update(this, AWS2.util.urlParse(endpoint));
        if (this.port) {
          this.port = parseInt(this.port, 10);
        } else {
          this.port = this.protocol === "https:" ? 443 : 80;
        }
      }
    });
    AWS2.HttpRequest = inherit({
      /**
       * @api private
       */
      constructor: function HttpRequest(endpoint, region) {
        endpoint = new AWS2.Endpoint(endpoint);
        this.method = "POST";
        this.path = endpoint.path || "/";
        this.headers = {};
        this.body = "";
        this.endpoint = endpoint;
        this.region = region;
        this._userAgent = "";
        this.setUserAgent();
      },
      /**
       * @api private
       */
      setUserAgent: function setUserAgent() {
        this._userAgent = this.headers[this.getUserAgentHeaderName()] = AWS2.util.userAgent();
      },
      getUserAgentHeaderName: function getUserAgentHeaderName() {
        var prefix = AWS2.util.isBrowser() ? "X-Amz-" : "";
        return prefix + "User-Agent";
      },
      /**
       * @api private
       */
      appendToUserAgent: function appendToUserAgent(agentPartial) {
        if (typeof agentPartial === "string" && agentPartial) {
          this._userAgent += " " + agentPartial;
        }
        this.headers[this.getUserAgentHeaderName()] = this._userAgent;
      },
      /**
       * @api private
       */
      getUserAgent: function getUserAgent() {
        return this._userAgent;
      },
      /**
       * @return [String] the part of the {path} excluding the
       *   query string
       */
      pathname: function pathname() {
        return this.path.split("?", 1)[0];
      },
      /**
       * @return [String] the query string portion of the {path}
       */
      search: function search() {
        var query = this.path.split("?", 2)[1];
        if (query) {
          query = AWS2.util.queryStringParse(query);
          return AWS2.util.queryParamsToString(query);
        }
        return "";
      },
      /**
       * @api private
       * update httpRequest endpoint with endpoint string
       */
      updateEndpoint: function updateEndpoint(endpointStr) {
        var newEndpoint = new AWS2.Endpoint(endpointStr);
        this.endpoint = newEndpoint;
        this.path = newEndpoint.path || "/";
        if (this.headers["Host"]) {
          this.headers["Host"] = newEndpoint.host;
        }
      }
    });
    AWS2.HttpResponse = inherit({
      /**
       * @api private
       */
      constructor: function HttpResponse() {
        this.statusCode = void 0;
        this.headers = {};
        this.body = void 0;
        this.streaming = false;
        this.stream = null;
      },
      /**
       * Disables buffering on the HTTP response and returns the stream for reading.
       * @return [Stream, XMLHttpRequest, null] the underlying stream object.
       *   Use this object to directly read data off of the stream.
       * @note This object is only available after the {AWS.Request~httpHeaders}
       *   event has fired. This method must be called prior to
       *   {AWS.Request~httpData}.
       * @example Taking control of a stream
       *   request.on('httpHeaders', function(statusCode, headers) {
       *     if (statusCode < 300) {
       *       if (headers.etag === 'xyz') {
       *         // pipe the stream, disabling buffering
       *         var stream = this.response.httpResponse.createUnbufferedStream();
       *         stream.pipe(process.stdout);
       *       } else { // abort this request and set a better error message
       *         this.abort();
       *         this.response.error = new Error('Invalid ETag');
       *       }
       *     }
       *   }).send(console.log);
       */
      createUnbufferedStream: function createUnbufferedStream() {
        this.streaming = true;
        return this.stream;
      }
    });
    AWS2.HttpClient = inherit({});
    AWS2.HttpClient.getInstance = function getInstance() {
      if (this.singleton === void 0) {
        this.singleton = new this();
      }
      return this.singleton;
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/discover_endpoint.js
var require_discover_endpoint = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/discover_endpoint.js"(exports, module2) {
    var AWS2 = require_core();
    var util2 = require_util();
    var endpointDiscoveryEnabledEnvs = ["AWS_ENABLE_ENDPOINT_DISCOVERY", "AWS_ENDPOINT_DISCOVERY_ENABLED"];
    function getCacheKey(request) {
      var service = request.service;
      var api = service.api || {};
      var operations = api.operations;
      var identifiers = {};
      if (service.config.region) {
        identifiers.region = service.config.region;
      }
      if (api.serviceId) {
        identifiers.serviceId = api.serviceId;
      }
      if (service.config.credentials.accessKeyId) {
        identifiers.accessKeyId = service.config.credentials.accessKeyId;
      }
      return identifiers;
    }
    function marshallCustomIdentifiersHelper(result, params, shape) {
      if (!shape || params === void 0 || params === null)
        return;
      if (shape.type === "structure" && shape.required && shape.required.length > 0) {
        util2.arrayEach(shape.required, function(name) {
          var memberShape = shape.members[name];
          if (memberShape.endpointDiscoveryId === true) {
            var locationName = memberShape.isLocationName ? memberShape.name : name;
            result[locationName] = String(params[name]);
          } else {
            marshallCustomIdentifiersHelper(result, params[name], memberShape);
          }
        });
      }
    }
    function marshallCustomIdentifiers(request, shape) {
      var identifiers = {};
      marshallCustomIdentifiersHelper(identifiers, request.params, shape);
      return identifiers;
    }
    function optionalDiscoverEndpoint(request) {
      var service = request.service;
      var api = service.api;
      var operationModel = api.operations ? api.operations[request.operation] : void 0;
      var inputShape = operationModel ? operationModel.input : void 0;
      var identifiers = marshallCustomIdentifiers(request, inputShape);
      var cacheKey = getCacheKey(request);
      if (Object.keys(identifiers).length > 0) {
        cacheKey = util2.update(cacheKey, identifiers);
        if (operationModel)
          cacheKey.operation = operationModel.name;
      }
      var endpoints = AWS2.endpointCache.get(cacheKey);
      if (endpoints && endpoints.length === 1 && endpoints[0].Address === "") {
        return;
      } else if (endpoints && endpoints.length > 0) {
        request.httpRequest.updateEndpoint(endpoints[0].Address);
      } else {
        var endpointRequest = service.makeRequest(api.endpointOperation, {
          Operation: operationModel.name,
          Identifiers: identifiers
        });
        addApiVersionHeader(endpointRequest);
        endpointRequest.removeListener("validate", AWS2.EventListeners.Core.VALIDATE_PARAMETERS);
        endpointRequest.removeListener("retry", AWS2.EventListeners.Core.RETRY_CHECK);
        AWS2.endpointCache.put(cacheKey, [{
          Address: "",
          CachePeriodInMinutes: 1
        }]);
        endpointRequest.send(function(err, data) {
          if (data && data.Endpoints) {
            AWS2.endpointCache.put(cacheKey, data.Endpoints);
          } else if (err) {
            AWS2.endpointCache.put(cacheKey, [{
              Address: "",
              CachePeriodInMinutes: 1
              //not to make more endpoint operation in next 1 minute
            }]);
          }
        });
      }
    }
    var requestQueue = {};
    function requiredDiscoverEndpoint(request, done) {
      var service = request.service;
      var api = service.api;
      var operationModel = api.operations ? api.operations[request.operation] : void 0;
      var inputShape = operationModel ? operationModel.input : void 0;
      var identifiers = marshallCustomIdentifiers(request, inputShape);
      var cacheKey = getCacheKey(request);
      if (Object.keys(identifiers).length > 0) {
        cacheKey = util2.update(cacheKey, identifiers);
        if (operationModel)
          cacheKey.operation = operationModel.name;
      }
      var cacheKeyStr = AWS2.EndpointCache.getKeyString(cacheKey);
      var endpoints = AWS2.endpointCache.get(cacheKeyStr);
      if (endpoints && endpoints.length === 1 && endpoints[0].Address === "") {
        if (!requestQueue[cacheKeyStr])
          requestQueue[cacheKeyStr] = [];
        requestQueue[cacheKeyStr].push({ request, callback: done });
        return;
      } else if (endpoints && endpoints.length > 0) {
        request.httpRequest.updateEndpoint(endpoints[0].Address);
        done();
      } else {
        var endpointRequest = service.makeRequest(api.endpointOperation, {
          Operation: operationModel.name,
          Identifiers: identifiers
        });
        endpointRequest.removeListener("validate", AWS2.EventListeners.Core.VALIDATE_PARAMETERS);
        addApiVersionHeader(endpointRequest);
        AWS2.endpointCache.put(cacheKeyStr, [{
          Address: "",
          CachePeriodInMinutes: 60
          //long-live cache
        }]);
        endpointRequest.send(function(err, data) {
          if (err) {
            request.response.error = util2.error(err, { retryable: false });
            AWS2.endpointCache.remove(cacheKey);
            if (requestQueue[cacheKeyStr]) {
              var pendingRequests = requestQueue[cacheKeyStr];
              util2.arrayEach(pendingRequests, function(requestContext) {
                requestContext.request.response.error = util2.error(err, { retryable: false });
                requestContext.callback();
              });
              delete requestQueue[cacheKeyStr];
            }
          } else if (data) {
            AWS2.endpointCache.put(cacheKeyStr, data.Endpoints);
            request.httpRequest.updateEndpoint(data.Endpoints[0].Address);
            if (requestQueue[cacheKeyStr]) {
              var pendingRequests = requestQueue[cacheKeyStr];
              util2.arrayEach(pendingRequests, function(requestContext) {
                requestContext.request.httpRequest.updateEndpoint(data.Endpoints[0].Address);
                requestContext.callback();
              });
              delete requestQueue[cacheKeyStr];
            }
          }
          done();
        });
      }
    }
    function addApiVersionHeader(endpointRequest) {
      var api = endpointRequest.service.api;
      var apiVersion = api.apiVersion;
      if (apiVersion && !endpointRequest.httpRequest.headers["x-amz-api-version"]) {
        endpointRequest.httpRequest.headers["x-amz-api-version"] = apiVersion;
      }
    }
    function invalidateCachedEndpoints(response2) {
      var error = response2.error;
      var httpResponse = response2.httpResponse;
      if (error && (error.code === "InvalidEndpointException" || httpResponse.statusCode === 421)) {
        var request = response2.request;
        var operations = request.service.api.operations || {};
        var inputShape = operations[request.operation] ? operations[request.operation].input : void 0;
        var identifiers = marshallCustomIdentifiers(request, inputShape);
        var cacheKey = getCacheKey(request);
        if (Object.keys(identifiers).length > 0) {
          cacheKey = util2.update(cacheKey, identifiers);
          if (operations[request.operation])
            cacheKey.operation = operations[request.operation].name;
        }
        AWS2.endpointCache.remove(cacheKey);
      }
    }
    function hasCustomEndpoint(client) {
      if (client._originalConfig && client._originalConfig.endpoint && client._originalConfig.endpointDiscoveryEnabled === true) {
        throw util2.error(new Error(), {
          code: "ConfigurationException",
          message: "Custom endpoint is supplied; endpointDiscoveryEnabled must not be true."
        });
      }
      ;
      var svcConfig = AWS2.config[client.serviceIdentifier] || {};
      return Boolean(AWS2.config.endpoint || svcConfig.endpoint || client._originalConfig && client._originalConfig.endpoint);
    }
    function isFalsy(value) {
      return ["false", "0"].indexOf(value) >= 0;
    }
    function resolveEndpointDiscoveryConfig(request) {
      var service = request.service || {};
      if (service.config.endpointDiscoveryEnabled !== void 0) {
        return service.config.endpointDiscoveryEnabled;
      }
      if (util2.isBrowser())
        return void 0;
      for (var i = 0; i < endpointDiscoveryEnabledEnvs.length; i++) {
        var env = endpointDiscoveryEnabledEnvs[i];
        if (Object.prototype.hasOwnProperty.call(process.env, env)) {
          if (process.env[env] === "" || process.env[env] === void 0) {
            throw util2.error(new Error(), {
              code: "ConfigurationException",
              message: "environmental variable " + env + " cannot be set to nothing"
            });
          }
          return !isFalsy(process.env[env]);
        }
      }
      var configFile = {};
      try {
        configFile = AWS2.util.iniLoader ? AWS2.util.iniLoader.loadFrom({
          isConfig: true,
          filename: process.env[AWS2.util.sharedConfigFileEnv]
        }) : {};
      } catch (e) {
      }
      var sharedFileConfig = configFile[process.env.AWS_PROFILE || AWS2.util.defaultProfile] || {};
      if (Object.prototype.hasOwnProperty.call(sharedFileConfig, "endpoint_discovery_enabled")) {
        if (sharedFileConfig.endpoint_discovery_enabled === void 0) {
          throw util2.error(new Error(), {
            code: "ConfigurationException",
            message: "config file entry 'endpoint_discovery_enabled' cannot be set to nothing"
          });
        }
        return !isFalsy(sharedFileConfig.endpoint_discovery_enabled);
      }
      return void 0;
    }
    function discoverEndpoint(request, done) {
      var service = request.service || {};
      if (hasCustomEndpoint(service) || request.isPresigned())
        return done();
      var operations = service.api.operations || {};
      var operationModel = operations[request.operation];
      var isEndpointDiscoveryRequired = operationModel ? operationModel.endpointDiscoveryRequired : "NULL";
      var isEnabled = resolveEndpointDiscoveryConfig(request);
      var hasRequiredEndpointDiscovery = service.api.hasRequiredEndpointDiscovery;
      if (isEnabled || hasRequiredEndpointDiscovery) {
        request.httpRequest.appendToUserAgent("endpoint-discovery");
      }
      switch (isEndpointDiscoveryRequired) {
        case "OPTIONAL":
          if (isEnabled || hasRequiredEndpointDiscovery) {
            optionalDiscoverEndpoint(request);
            request.addNamedListener("INVALIDATE_CACHED_ENDPOINTS", "extractError", invalidateCachedEndpoints);
          }
          done();
          break;
        case "REQUIRED":
          if (isEnabled === false) {
            request.response.error = util2.error(new Error(), {
              code: "ConfigurationException",
              message: "Endpoint Discovery is disabled but " + service.api.className + "." + request.operation + "() requires it. Please check your configurations."
            });
            done();
            break;
          }
          request.addNamedListener("INVALIDATE_CACHED_ENDPOINTS", "extractError", invalidateCachedEndpoints);
          requiredDiscoverEndpoint(request, done);
          break;
        case "NULL":
        default:
          done();
          break;
      }
    }
    module2.exports = {
      discoverEndpoint,
      requiredDiscoverEndpoint,
      optionalDiscoverEndpoint,
      marshallCustomIdentifiers,
      getCacheKey,
      invalidateCachedEndpoint: invalidateCachedEndpoints
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event_listeners.js
var require_event_listeners = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event_listeners.js"() {
    var AWS2 = require_core();
    var SequentialExecutor = require_sequential_executor();
    var DISCOVER_ENDPOINT = require_discover_endpoint().discoverEndpoint;
    AWS2.EventListeners = {
      /**
       * @!attribute VALIDATE_CREDENTIALS
       *   A request listener that validates whether the request is being
       *   sent with credentials.
       *   Handles the {AWS.Request~validate 'validate' Request event}
       *   @example Sending a request without validating credentials
       *     var listener = AWS.EventListeners.Core.VALIDATE_CREDENTIALS;
       *     request.removeListener('validate', listener);
       *   @readonly
       *   @return [Function]
       * @!attribute VALIDATE_REGION
       *   A request listener that validates whether the region is set
       *   for a request.
       *   Handles the {AWS.Request~validate 'validate' Request event}
       *   @example Sending a request without validating region configuration
       *     var listener = AWS.EventListeners.Core.VALIDATE_REGION;
       *     request.removeListener('validate', listener);
       *   @readonly
       *   @return [Function]
       * @!attribute VALIDATE_PARAMETERS
       *   A request listener that validates input parameters in a request.
       *   Handles the {AWS.Request~validate 'validate' Request event}
       *   @example Sending a request without validating parameters
       *     var listener = AWS.EventListeners.Core.VALIDATE_PARAMETERS;
       *     request.removeListener('validate', listener);
       *   @example Disable parameter validation globally
       *     AWS.EventListeners.Core.removeListener('validate',
       *       AWS.EventListeners.Core.VALIDATE_REGION);
       *   @readonly
       *   @return [Function]
       * @!attribute SEND
       *   A request listener that initiates the HTTP connection for a
       *   request being sent. Handles the {AWS.Request~send 'send' Request event}
       *   @example Replacing the HTTP handler
       *     var listener = AWS.EventListeners.Core.SEND;
       *     request.removeListener('send', listener);
       *     request.on('send', function(response) {
       *       customHandler.send(response);
       *     });
       *   @return [Function]
       *   @readonly
       * @!attribute HTTP_DATA
       *   A request listener that reads data from the HTTP connection in order
       *   to build the response data.
       *   Handles the {AWS.Request~httpData 'httpData' Request event}.
       *   Remove this handler if you are overriding the 'httpData' event and
       *   do not want extra data processing and buffering overhead.
       *   @example Disabling default data processing
       *     var listener = AWS.EventListeners.Core.HTTP_DATA;
       *     request.removeListener('httpData', listener);
       *   @return [Function]
       *   @readonly
       */
      Core: {}
      /* doc hack */
    };
    function getOperationAuthtype(req) {
      if (!req.service.api.operations) {
        return "";
      }
      var operation = req.service.api.operations[req.operation];
      return operation ? operation.authtype : "";
    }
    function getIdentityType(req) {
      var service = req.service;
      if (service.config.signatureVersion) {
        return service.config.signatureVersion;
      }
      if (service.api.signatureVersion) {
        return service.api.signatureVersion;
      }
      return getOperationAuthtype(req);
    }
    AWS2.EventListeners = {
      Core: new SequentialExecutor().addNamedListeners(function(add, addAsync) {
        addAsync(
          "VALIDATE_CREDENTIALS",
          "validate",
          function VALIDATE_CREDENTIALS(req, done) {
            if (!req.service.api.signatureVersion && !req.service.config.signatureVersion)
              return done();
            var identityType = getIdentityType(req);
            if (identityType === "bearer") {
              req.service.config.getToken(function(err) {
                if (err) {
                  req.response.error = AWS2.util.error(err, { code: "TokenError" });
                }
                done();
              });
              return;
            }
            req.service.config.getCredentials(function(err) {
              if (err) {
                req.response.error = AWS2.util.error(
                  err,
                  {
                    code: "CredentialsError",
                    message: "Missing credentials in config, if using AWS_CONFIG_FILE, set AWS_SDK_LOAD_CONFIG=1"
                  }
                );
              }
              done();
            });
          }
        );
        add("VALIDATE_REGION", "validate", function VALIDATE_REGION(req) {
          if (!req.service.isGlobalEndpoint) {
            var dnsHostRegex = new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/);
            if (!req.service.config.region) {
              req.response.error = AWS2.util.error(
                new Error(),
                { code: "ConfigError", message: "Missing region in config" }
              );
            } else if (!dnsHostRegex.test(req.service.config.region)) {
              req.response.error = AWS2.util.error(
                new Error(),
                { code: "ConfigError", message: "Invalid region in config" }
              );
            }
          }
        });
        add("BUILD_IDEMPOTENCY_TOKENS", "validate", function BUILD_IDEMPOTENCY_TOKENS(req) {
          if (!req.service.api.operations) {
            return;
          }
          var operation = req.service.api.operations[req.operation];
          if (!operation) {
            return;
          }
          var idempotentMembers = operation.idempotentMembers;
          if (!idempotentMembers.length) {
            return;
          }
          var params = AWS2.util.copy(req.params);
          for (var i = 0, iLen = idempotentMembers.length; i < iLen; i++) {
            if (!params[idempotentMembers[i]]) {
              params[idempotentMembers[i]] = AWS2.util.uuid.v4();
            }
          }
          req.params = params;
        });
        add("VALIDATE_PARAMETERS", "validate", function VALIDATE_PARAMETERS(req) {
          if (!req.service.api.operations) {
            return;
          }
          var rules = req.service.api.operations[req.operation].input;
          var validation = req.service.config.paramValidation;
          new AWS2.ParamValidator(validation).validate(rules, req.params);
        });
        add("COMPUTE_CHECKSUM", "afterBuild", function COMPUTE_CHECKSUM(req) {
          if (!req.service.api.operations) {
            return;
          }
          var operation = req.service.api.operations[req.operation];
          if (!operation) {
            return;
          }
          var body = req.httpRequest.body;
          var isNonStreamingPayload = body && (AWS2.util.Buffer.isBuffer(body) || typeof body === "string");
          var headers = req.httpRequest.headers;
          if (operation.httpChecksumRequired && req.service.config.computeChecksums && isNonStreamingPayload && !headers["Content-MD5"]) {
            var md5 = AWS2.util.crypto.md5(body, "base64");
            headers["Content-MD5"] = md5;
          }
        });
        addAsync("COMPUTE_SHA256", "afterBuild", function COMPUTE_SHA256(req, done) {
          req.haltHandlersOnError();
          if (!req.service.api.operations) {
            return;
          }
          var operation = req.service.api.operations[req.operation];
          var authtype = operation ? operation.authtype : "";
          if (!req.service.api.signatureVersion && !authtype && !req.service.config.signatureVersion)
            return done();
          if (req.service.getSignerClass(req) === AWS2.Signers.V4) {
            var body = req.httpRequest.body || "";
            if (authtype.indexOf("unsigned-body") >= 0) {
              req.httpRequest.headers["X-Amz-Content-Sha256"] = "UNSIGNED-PAYLOAD";
              return done();
            }
            AWS2.util.computeSha256(body, function(err, sha) {
              if (err) {
                done(err);
              } else {
                req.httpRequest.headers["X-Amz-Content-Sha256"] = sha;
                done();
              }
            });
          } else {
            done();
          }
        });
        add("SET_CONTENT_LENGTH", "afterBuild", function SET_CONTENT_LENGTH(req) {
          var authtype = getOperationAuthtype(req);
          var payloadMember = AWS2.util.getRequestPayloadShape(req);
          if (req.httpRequest.headers["Content-Length"] === void 0) {
            try {
              var length = AWS2.util.string.byteLength(req.httpRequest.body);
              req.httpRequest.headers["Content-Length"] = length;
            } catch (err) {
              if (payloadMember && payloadMember.isStreaming) {
                if (payloadMember.requiresLength) {
                  throw err;
                } else if (authtype.indexOf("unsigned-body") >= 0) {
                  req.httpRequest.headers["Transfer-Encoding"] = "chunked";
                  return;
                } else {
                  throw err;
                }
              }
              throw err;
            }
          }
        });
        add("SET_HTTP_HOST", "afterBuild", function SET_HTTP_HOST(req) {
          req.httpRequest.headers["Host"] = req.httpRequest.endpoint.host;
        });
        add("SET_TRACE_ID", "afterBuild", function SET_TRACE_ID(req) {
          var traceIdHeaderName = "X-Amzn-Trace-Id";
          if (AWS2.util.isNode() && !Object.hasOwnProperty.call(req.httpRequest.headers, traceIdHeaderName)) {
            var ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
            var ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
            var functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
            var traceId = process.env[ENV_TRACE_ID];
            if (typeof functionName === "string" && functionName.length > 0 && typeof traceId === "string" && traceId.length > 0) {
              req.httpRequest.headers[traceIdHeaderName] = traceId;
            }
          }
        });
        add("RESTART", "restart", function RESTART() {
          var err = this.response.error;
          if (!err || !err.retryable)
            return;
          this.httpRequest = new AWS2.HttpRequest(
            this.service.endpoint,
            this.service.region
          );
          if (this.response.retryCount < this.service.config.maxRetries) {
            this.response.retryCount++;
          } else {
            this.response.error = null;
          }
        });
        var addToHead = true;
        addAsync("DISCOVER_ENDPOINT", "sign", DISCOVER_ENDPOINT, addToHead);
        addAsync("SIGN", "sign", function SIGN(req, done) {
          var service = req.service;
          var identityType = getIdentityType(req);
          if (!identityType || identityType.length === 0)
            return done();
          if (identityType === "bearer") {
            service.config.getToken(function(err, token) {
              if (err) {
                req.response.error = err;
                return done();
              }
              try {
                var SignerClass = service.getSignerClass(req);
                var signer = new SignerClass(req.httpRequest);
                signer.addAuthorization(token);
              } catch (e) {
                req.response.error = e;
              }
              done();
            });
          } else {
            service.config.getCredentials(function(err, credentials) {
              if (err) {
                req.response.error = err;
                return done();
              }
              try {
                var date = service.getSkewCorrectedDate();
                var SignerClass = service.getSignerClass(req);
                var operations = req.service.api.operations || {};
                var operation = operations[req.operation];
                var signer = new SignerClass(
                  req.httpRequest,
                  service.getSigningName(req),
                  {
                    signatureCache: service.config.signatureCache,
                    operation,
                    signatureVersion: service.api.signatureVersion
                  }
                );
                signer.setServiceClientId(service._clientId);
                delete req.httpRequest.headers["Authorization"];
                delete req.httpRequest.headers["Date"];
                delete req.httpRequest.headers["X-Amz-Date"];
                signer.addAuthorization(credentials, date);
                req.signedAt = date;
              } catch (e) {
                req.response.error = e;
              }
              done();
            });
          }
        });
        add("VALIDATE_RESPONSE", "validateResponse", function VALIDATE_RESPONSE(resp) {
          if (this.service.successfulResponse(resp, this)) {
            resp.data = {};
            resp.error = null;
          } else {
            resp.data = null;
            resp.error = AWS2.util.error(
              new Error(),
              { code: "UnknownError", message: "An unknown error occurred." }
            );
          }
        });
        add("ERROR", "error", function ERROR(err, resp) {
          var awsQueryCompatible = resp.request.service.api.awsQueryCompatible;
          if (awsQueryCompatible) {
            var headers = resp.httpResponse.headers;
            var queryErrorCode = headers ? headers["x-amzn-query-error"] : void 0;
            if (queryErrorCode && queryErrorCode.includes(";")) {
              resp.error.code = queryErrorCode.split(";")[0];
            }
          }
        }, true);
        addAsync("SEND", "send", function SEND(resp, done) {
          resp.httpResponse._abortCallback = done;
          resp.error = null;
          resp.data = null;
          function callback(httpResp) {
            resp.httpResponse.stream = httpResp;
            var stream = resp.request.httpRequest.stream;
            var service = resp.request.service;
            var api = service.api;
            var operationName = resp.request.operation;
            var operation = api.operations[operationName] || {};
            httpResp.on("headers", function onHeaders(statusCode, headers, statusMessage) {
              resp.request.emit(
                "httpHeaders",
                [statusCode, headers, resp, statusMessage]
              );
              if (!resp.httpResponse.streaming) {
                if (AWS2.HttpClient.streamsApiVersion === 2) {
                  if (operation.hasEventOutput && service.successfulResponse(resp)) {
                    resp.request.emit("httpDone");
                    done();
                    return;
                  }
                  httpResp.on("readable", function onReadable() {
                    var data = httpResp.read();
                    if (data !== null) {
                      resp.request.emit("httpData", [data, resp]);
                    }
                  });
                } else {
                  httpResp.on("data", function onData(data) {
                    resp.request.emit("httpData", [data, resp]);
                  });
                }
              }
            });
            httpResp.on("end", function onEnd() {
              if (!stream || !stream.didCallback) {
                if (AWS2.HttpClient.streamsApiVersion === 2 && (operation.hasEventOutput && service.successfulResponse(resp))) {
                  return;
                }
                resp.request.emit("httpDone");
                done();
              }
            });
          }
          function progress(httpResp) {
            httpResp.on("sendProgress", function onSendProgress(value) {
              resp.request.emit("httpUploadProgress", [value, resp]);
            });
            httpResp.on("receiveProgress", function onReceiveProgress(value) {
              resp.request.emit("httpDownloadProgress", [value, resp]);
            });
          }
          function error(err) {
            if (err.code !== "RequestAbortedError") {
              var errCode = err.code === "TimeoutError" ? err.code : "NetworkingError";
              err = AWS2.util.error(err, {
                code: errCode,
                region: resp.request.httpRequest.region,
                hostname: resp.request.httpRequest.endpoint.hostname,
                retryable: true
              });
            }
            resp.error = err;
            resp.request.emit("httpError", [resp.error, resp], function() {
              done();
            });
          }
          function executeSend() {
            var http = AWS2.HttpClient.getInstance();
            var httpOptions = resp.request.service.config.httpOptions || {};
            try {
              var stream = http.handleRequest(
                resp.request.httpRequest,
                httpOptions,
                callback,
                error
              );
              progress(stream);
            } catch (err) {
              error(err);
            }
          }
          var timeDiff = (resp.request.service.getSkewCorrectedDate() - this.signedAt) / 1e3;
          if (timeDiff >= 60 * 10) {
            this.emit("sign", [this], function(err) {
              if (err)
                done(err);
              else
                executeSend();
            });
          } else {
            executeSend();
          }
        });
        add(
          "HTTP_HEADERS",
          "httpHeaders",
          function HTTP_HEADERS(statusCode, headers, resp, statusMessage) {
            resp.httpResponse.statusCode = statusCode;
            resp.httpResponse.statusMessage = statusMessage;
            resp.httpResponse.headers = headers;
            resp.httpResponse.body = AWS2.util.buffer.toBuffer("");
            resp.httpResponse.buffers = [];
            resp.httpResponse.numBytes = 0;
            var dateHeader = headers.date || headers.Date;
            var service = resp.request.service;
            if (dateHeader) {
              var serverTime = Date.parse(dateHeader);
              if (service.config.correctClockSkew && service.isClockSkewed(serverTime)) {
                service.applyClockOffset(serverTime);
              }
            }
          }
        );
        add("HTTP_DATA", "httpData", function HTTP_DATA(chunk, resp) {
          if (chunk) {
            if (AWS2.util.isNode()) {
              resp.httpResponse.numBytes += chunk.length;
              var total = resp.httpResponse.headers["content-length"];
              var progress = { loaded: resp.httpResponse.numBytes, total };
              resp.request.emit("httpDownloadProgress", [progress, resp]);
            }
            resp.httpResponse.buffers.push(AWS2.util.buffer.toBuffer(chunk));
          }
        });
        add("HTTP_DONE", "httpDone", function HTTP_DONE(resp) {
          if (resp.httpResponse.buffers && resp.httpResponse.buffers.length > 0) {
            var body = AWS2.util.buffer.concat(resp.httpResponse.buffers);
            resp.httpResponse.body = body;
          }
          delete resp.httpResponse.numBytes;
          delete resp.httpResponse.buffers;
        });
        add("FINALIZE_ERROR", "retry", function FINALIZE_ERROR(resp) {
          if (resp.httpResponse.statusCode) {
            resp.error.statusCode = resp.httpResponse.statusCode;
            if (resp.error.retryable === void 0) {
              resp.error.retryable = this.service.retryableError(resp.error, this);
            }
          }
        });
        add("INVALIDATE_CREDENTIALS", "retry", function INVALIDATE_CREDENTIALS(resp) {
          if (!resp.error)
            return;
          switch (resp.error.code) {
            case "RequestExpired":
            case "ExpiredTokenException":
            case "ExpiredToken":
              resp.error.retryable = true;
              resp.request.service.config.credentials.expired = true;
          }
        });
        add("EXPIRED_SIGNATURE", "retry", function EXPIRED_SIGNATURE(resp) {
          var err = resp.error;
          if (!err)
            return;
          if (typeof err.code === "string" && typeof err.message === "string") {
            if (err.code.match(/Signature/) && err.message.match(/expired/)) {
              resp.error.retryable = true;
            }
          }
        });
        add("CLOCK_SKEWED", "retry", function CLOCK_SKEWED(resp) {
          if (!resp.error)
            return;
          if (this.service.clockSkewError(resp.error) && this.service.config.correctClockSkew) {
            resp.error.retryable = true;
          }
        });
        add("REDIRECT", "retry", function REDIRECT(resp) {
          if (resp.error && resp.error.statusCode >= 300 && resp.error.statusCode < 400 && resp.httpResponse.headers["location"]) {
            this.httpRequest.endpoint = new AWS2.Endpoint(resp.httpResponse.headers["location"]);
            this.httpRequest.headers["Host"] = this.httpRequest.endpoint.host;
            resp.error.redirect = true;
            resp.error.retryable = true;
          }
        });
        add("RETRY_CHECK", "retry", function RETRY_CHECK(resp) {
          if (resp.error) {
            if (resp.error.redirect && resp.redirectCount < resp.maxRedirects) {
              resp.error.retryDelay = 0;
            } else if (resp.retryCount < resp.maxRetries) {
              resp.error.retryDelay = this.service.retryDelays(resp.retryCount, resp.error) || 0;
            }
          }
        });
        addAsync("RESET_RETRY_STATE", "afterRetry", function RESET_RETRY_STATE(resp, done) {
          var delay, willRetry = false;
          if (resp.error) {
            delay = resp.error.retryDelay || 0;
            if (resp.error.retryable && resp.retryCount < resp.maxRetries) {
              resp.retryCount++;
              willRetry = true;
            } else if (resp.error.redirect && resp.redirectCount < resp.maxRedirects) {
              resp.redirectCount++;
              willRetry = true;
            }
          }
          if (willRetry && delay >= 0) {
            resp.error = null;
            setTimeout(done, delay);
          } else {
            done();
          }
        });
      }),
      CorePost: new SequentialExecutor().addNamedListeners(function(add) {
        add("EXTRACT_REQUEST_ID", "extractData", AWS2.util.extractRequestId);
        add("EXTRACT_REQUEST_ID", "extractError", AWS2.util.extractRequestId);
        add("ENOTFOUND_ERROR", "httpError", function ENOTFOUND_ERROR(err) {
          function isDNSError(err2) {
            return err2.errno === "ENOTFOUND" || typeof err2.errno === "number" && typeof AWS2.util.getSystemErrorName === "function" && ["EAI_NONAME", "EAI_NODATA"].indexOf(AWS2.util.getSystemErrorName(err2.errno) >= 0);
          }
          if (err.code === "NetworkingError" && isDNSError(err)) {
            var message = "Inaccessible host: `" + err.hostname + "' at port `" + err.port + "'. This service may not be available in the `" + err.region + "' region.";
            this.response.error = AWS2.util.error(new Error(message), {
              code: "UnknownEndpoint",
              region: err.region,
              hostname: err.hostname,
              retryable: true,
              originalError: err
            });
          }
        });
      }),
      Logger: new SequentialExecutor().addNamedListeners(function(add) {
        add("LOG_REQUEST", "complete", function LOG_REQUEST(resp) {
          var req = resp.request;
          var logger = req.service.config.logger;
          if (!logger)
            return;
          function filterSensitiveLog(inputShape, shape) {
            if (!shape) {
              return shape;
            }
            if (inputShape.isSensitive) {
              return "***SensitiveInformation***";
            }
            switch (inputShape.type) {
              case "structure":
                var struct = {};
                AWS2.util.each(shape, function(subShapeName, subShape) {
                  if (Object.prototype.hasOwnProperty.call(inputShape.members, subShapeName)) {
                    struct[subShapeName] = filterSensitiveLog(inputShape.members[subShapeName], subShape);
                  } else {
                    struct[subShapeName] = subShape;
                  }
                });
                return struct;
              case "list":
                var list = [];
                AWS2.util.arrayEach(shape, function(subShape, index) {
                  list.push(filterSensitiveLog(inputShape.member, subShape));
                });
                return list;
              case "map":
                var map = {};
                AWS2.util.each(shape, function(key, value) {
                  map[key] = filterSensitiveLog(inputShape.value, value);
                });
                return map;
              default:
                return shape;
            }
          }
          function buildMessage() {
            var time = resp.request.service.getSkewCorrectedDate().getTime();
            var delta = (time - req.startTime.getTime()) / 1e3;
            var ansi = logger.isTTY ? true : false;
            var status = resp.httpResponse.statusCode;
            var censoredParams = req.params;
            if (req.service.api.operations && req.service.api.operations[req.operation] && req.service.api.operations[req.operation].input) {
              var inputShape = req.service.api.operations[req.operation].input;
              censoredParams = filterSensitiveLog(inputShape, req.params);
            }
            var params = require("util").inspect(censoredParams, true, null);
            var message = "";
            if (ansi)
              message += "\x1B[33m";
            message += "[AWS " + req.service.serviceIdentifier + " " + status;
            message += " " + delta.toString() + "s " + resp.retryCount + " retries]";
            if (ansi)
              message += "\x1B[0;1m";
            message += " " + AWS2.util.string.lowerFirst(req.operation);
            message += "(" + params + ")";
            if (ansi)
              message += "\x1B[0m";
            return message;
          }
          var line = buildMessage();
          if (typeof logger.log === "function") {
            logger.log(line);
          } else if (typeof logger.write === "function") {
            logger.write(line + "\n");
          }
        });
      }),
      Json: new SequentialExecutor().addNamedListeners(function(add) {
        var svc = require_json();
        add("BUILD", "build", svc.buildRequest);
        add("EXTRACT_DATA", "extractData", svc.extractData);
        add("EXTRACT_ERROR", "extractError", svc.extractError);
      }),
      Rest: new SequentialExecutor().addNamedListeners(function(add) {
        var svc = require_rest();
        add("BUILD", "build", svc.buildRequest);
        add("EXTRACT_DATA", "extractData", svc.extractData);
        add("EXTRACT_ERROR", "extractError", svc.extractError);
      }),
      RestJson: new SequentialExecutor().addNamedListeners(function(add) {
        var svc = require_rest_json();
        add("BUILD", "build", svc.buildRequest);
        add("EXTRACT_DATA", "extractData", svc.extractData);
        add("EXTRACT_ERROR", "extractError", svc.extractError);
        add("UNSET_CONTENT_LENGTH", "afterBuild", svc.unsetContentLength);
      }),
      RestXml: new SequentialExecutor().addNamedListeners(function(add) {
        var svc = require_rest_xml();
        add("BUILD", "build", svc.buildRequest);
        add("EXTRACT_DATA", "extractData", svc.extractData);
        add("EXTRACT_ERROR", "extractError", svc.extractError);
      }),
      Query: new SequentialExecutor().addNamedListeners(function(add) {
        var svc = require_query();
        add("BUILD", "build", svc.buildRequest);
        add("EXTRACT_DATA", "extractData", svc.extractData);
        add("EXTRACT_ERROR", "extractError", svc.extractError);
      })
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/state_machine.js
var require_state_machine = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/state_machine.js"(exports, module2) {
    function AcceptorStateMachine(states, state) {
      this.currentState = state || null;
      this.states = states || {};
    }
    AcceptorStateMachine.prototype.runTo = function runTo(finalState, done, bindObject, inputError) {
      if (typeof finalState === "function") {
        inputError = bindObject;
        bindObject = done;
        done = finalState;
        finalState = null;
      }
      var self = this;
      var state = self.states[self.currentState];
      state.fn.call(bindObject || self, inputError, function(err) {
        if (err) {
          if (state.fail)
            self.currentState = state.fail;
          else
            return done ? done.call(bindObject, err) : null;
        } else {
          if (state.accept)
            self.currentState = state.accept;
          else
            return done ? done.call(bindObject) : null;
        }
        if (self.currentState === finalState) {
          return done ? done.call(bindObject, err) : null;
        }
        self.runTo(finalState, done, bindObject, err);
      });
    };
    AcceptorStateMachine.prototype.addState = function addState(name, acceptState, failState, fn) {
      if (typeof acceptState === "function") {
        fn = acceptState;
        acceptState = null;
        failState = null;
      } else if (typeof failState === "function") {
        fn = failState;
        failState = null;
      }
      if (!this.currentState)
        this.currentState = name;
      this.states[name] = { accept: acceptState, fail: failState, fn };
      return this;
    };
    module2.exports = AcceptorStateMachine;
  }
});

// node_modules/.pnpm/jmespath@0.16.0/node_modules/jmespath/jmespath.js
var require_jmespath = __commonJS({
  "node_modules/.pnpm/jmespath@0.16.0/node_modules/jmespath/jmespath.js"(exports) {
    (function(exports2) {
      "use strict";
      function isArray(obj) {
        if (obj !== null) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        } else {
          return false;
        }
      }
      function isObject(obj) {
        if (obj !== null) {
          return Object.prototype.toString.call(obj) === "[object Object]";
        } else {
          return false;
        }
      }
      function strictDeepEqual(first, second) {
        if (first === second) {
          return true;
        }
        var firstType = Object.prototype.toString.call(first);
        if (firstType !== Object.prototype.toString.call(second)) {
          return false;
        }
        if (isArray(first) === true) {
          if (first.length !== second.length) {
            return false;
          }
          for (var i = 0; i < first.length; i++) {
            if (strictDeepEqual(first[i], second[i]) === false) {
              return false;
            }
          }
          return true;
        }
        if (isObject(first) === true) {
          var keysSeen = {};
          for (var key in first) {
            if (hasOwnProperty.call(first, key)) {
              if (strictDeepEqual(first[key], second[key]) === false) {
                return false;
              }
              keysSeen[key] = true;
            }
          }
          for (var key2 in second) {
            if (hasOwnProperty.call(second, key2)) {
              if (keysSeen[key2] !== true) {
                return false;
              }
            }
          }
          return true;
        }
        return false;
      }
      function isFalse(obj) {
        if (obj === "" || obj === false || obj === null) {
          return true;
        } else if (isArray(obj) && obj.length === 0) {
          return true;
        } else if (isObject(obj)) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              return false;
            }
          }
          return true;
        } else {
          return false;
        }
      }
      function objValues(obj) {
        var keys = Object.keys(obj);
        var values = [];
        for (var i = 0; i < keys.length; i++) {
          values.push(obj[keys[i]]);
        }
        return values;
      }
      function merge(a, b) {
        var merged = {};
        for (var key in a) {
          merged[key] = a[key];
        }
        for (var key2 in b) {
          merged[key2] = b[key2];
        }
        return merged;
      }
      var trimLeft;
      if (typeof String.prototype.trimLeft === "function") {
        trimLeft = function(str) {
          return str.trimLeft();
        };
      } else {
        trimLeft = function(str) {
          return str.match(/^\s*(.*)/)[1];
        };
      }
      var TYPE_NUMBER = 0;
      var TYPE_ANY = 1;
      var TYPE_STRING = 2;
      var TYPE_ARRAY = 3;
      var TYPE_OBJECT = 4;
      var TYPE_BOOLEAN = 5;
      var TYPE_EXPREF = 6;
      var TYPE_NULL = 7;
      var TYPE_ARRAY_NUMBER = 8;
      var TYPE_ARRAY_STRING = 9;
      var TYPE_NAME_TABLE = {
        0: "number",
        1: "any",
        2: "string",
        3: "array",
        4: "object",
        5: "boolean",
        6: "expression",
        7: "null",
        8: "Array<number>",
        9: "Array<string>"
      };
      var TOK_EOF = "EOF";
      var TOK_UNQUOTEDIDENTIFIER = "UnquotedIdentifier";
      var TOK_QUOTEDIDENTIFIER = "QuotedIdentifier";
      var TOK_RBRACKET = "Rbracket";
      var TOK_RPAREN = "Rparen";
      var TOK_COMMA = "Comma";
      var TOK_COLON = "Colon";
      var TOK_RBRACE = "Rbrace";
      var TOK_NUMBER = "Number";
      var TOK_CURRENT = "Current";
      var TOK_EXPREF = "Expref";
      var TOK_PIPE = "Pipe";
      var TOK_OR = "Or";
      var TOK_AND = "And";
      var TOK_EQ = "EQ";
      var TOK_GT = "GT";
      var TOK_LT = "LT";
      var TOK_GTE = "GTE";
      var TOK_LTE = "LTE";
      var TOK_NE = "NE";
      var TOK_FLATTEN = "Flatten";
      var TOK_STAR = "Star";
      var TOK_FILTER = "Filter";
      var TOK_DOT = "Dot";
      var TOK_NOT = "Not";
      var TOK_LBRACE = "Lbrace";
      var TOK_LBRACKET = "Lbracket";
      var TOK_LPAREN = "Lparen";
      var TOK_LITERAL = "Literal";
      var basicTokens = {
        ".": TOK_DOT,
        "*": TOK_STAR,
        ",": TOK_COMMA,
        ":": TOK_COLON,
        "{": TOK_LBRACE,
        "}": TOK_RBRACE,
        "]": TOK_RBRACKET,
        "(": TOK_LPAREN,
        ")": TOK_RPAREN,
        "@": TOK_CURRENT
      };
      var operatorStartToken = {
        "<": true,
        ">": true,
        "=": true,
        "!": true
      };
      var skipChars = {
        " ": true,
        "	": true,
        "\n": true
      };
      function isAlpha(ch) {
        return ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch === "_";
      }
      function isNum(ch) {
        return ch >= "0" && ch <= "9" || ch === "-";
      }
      function isAlphaNum(ch) {
        return ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch >= "0" && ch <= "9" || ch === "_";
      }
      function Lexer() {
      }
      Lexer.prototype = {
        tokenize: function(stream) {
          var tokens = [];
          this._current = 0;
          var start;
          var identifier;
          var token;
          while (this._current < stream.length) {
            if (isAlpha(stream[this._current])) {
              start = this._current;
              identifier = this._consumeUnquotedIdentifier(stream);
              tokens.push({
                type: TOK_UNQUOTEDIDENTIFIER,
                value: identifier,
                start
              });
            } else if (basicTokens[stream[this._current]] !== void 0) {
              tokens.push({
                type: basicTokens[stream[this._current]],
                value: stream[this._current],
                start: this._current
              });
              this._current++;
            } else if (isNum(stream[this._current])) {
              token = this._consumeNumber(stream);
              tokens.push(token);
            } else if (stream[this._current] === "[") {
              token = this._consumeLBracket(stream);
              tokens.push(token);
            } else if (stream[this._current] === '"') {
              start = this._current;
              identifier = this._consumeQuotedIdentifier(stream);
              tokens.push({
                type: TOK_QUOTEDIDENTIFIER,
                value: identifier,
                start
              });
            } else if (stream[this._current] === "'") {
              start = this._current;
              identifier = this._consumeRawStringLiteral(stream);
              tokens.push({
                type: TOK_LITERAL,
                value: identifier,
                start
              });
            } else if (stream[this._current] === "`") {
              start = this._current;
              var literal = this._consumeLiteral(stream);
              tokens.push({
                type: TOK_LITERAL,
                value: literal,
                start
              });
            } else if (operatorStartToken[stream[this._current]] !== void 0) {
              tokens.push(this._consumeOperator(stream));
            } else if (skipChars[stream[this._current]] !== void 0) {
              this._current++;
            } else if (stream[this._current] === "&") {
              start = this._current;
              this._current++;
              if (stream[this._current] === "&") {
                this._current++;
                tokens.push({ type: TOK_AND, value: "&&", start });
              } else {
                tokens.push({ type: TOK_EXPREF, value: "&", start });
              }
            } else if (stream[this._current] === "|") {
              start = this._current;
              this._current++;
              if (stream[this._current] === "|") {
                this._current++;
                tokens.push({ type: TOK_OR, value: "||", start });
              } else {
                tokens.push({ type: TOK_PIPE, value: "|", start });
              }
            } else {
              var error = new Error("Unknown character:" + stream[this._current]);
              error.name = "LexerError";
              throw error;
            }
          }
          return tokens;
        },
        _consumeUnquotedIdentifier: function(stream) {
          var start = this._current;
          this._current++;
          while (this._current < stream.length && isAlphaNum(stream[this._current])) {
            this._current++;
          }
          return stream.slice(start, this._current);
        },
        _consumeQuotedIdentifier: function(stream) {
          var start = this._current;
          this._current++;
          var maxLength = stream.length;
          while (stream[this._current] !== '"' && this._current < maxLength) {
            var current = this._current;
            if (stream[current] === "\\" && (stream[current + 1] === "\\" || stream[current + 1] === '"')) {
              current += 2;
            } else {
              current++;
            }
            this._current = current;
          }
          this._current++;
          return JSON.parse(stream.slice(start, this._current));
        },
        _consumeRawStringLiteral: function(stream) {
          var start = this._current;
          this._current++;
          var maxLength = stream.length;
          while (stream[this._current] !== "'" && this._current < maxLength) {
            var current = this._current;
            if (stream[current] === "\\" && (stream[current + 1] === "\\" || stream[current + 1] === "'")) {
              current += 2;
            } else {
              current++;
            }
            this._current = current;
          }
          this._current++;
          var literal = stream.slice(start + 1, this._current - 1);
          return literal.replace("\\'", "'");
        },
        _consumeNumber: function(stream) {
          var start = this._current;
          this._current++;
          var maxLength = stream.length;
          while (isNum(stream[this._current]) && this._current < maxLength) {
            this._current++;
          }
          var value = parseInt(stream.slice(start, this._current));
          return { type: TOK_NUMBER, value, start };
        },
        _consumeLBracket: function(stream) {
          var start = this._current;
          this._current++;
          if (stream[this._current] === "?") {
            this._current++;
            return { type: TOK_FILTER, value: "[?", start };
          } else if (stream[this._current] === "]") {
            this._current++;
            return { type: TOK_FLATTEN, value: "[]", start };
          } else {
            return { type: TOK_LBRACKET, value: "[", start };
          }
        },
        _consumeOperator: function(stream) {
          var start = this._current;
          var startingChar = stream[start];
          this._current++;
          if (startingChar === "!") {
            if (stream[this._current] === "=") {
              this._current++;
              return { type: TOK_NE, value: "!=", start };
            } else {
              return { type: TOK_NOT, value: "!", start };
            }
          } else if (startingChar === "<") {
            if (stream[this._current] === "=") {
              this._current++;
              return { type: TOK_LTE, value: "<=", start };
            } else {
              return { type: TOK_LT, value: "<", start };
            }
          } else if (startingChar === ">") {
            if (stream[this._current] === "=") {
              this._current++;
              return { type: TOK_GTE, value: ">=", start };
            } else {
              return { type: TOK_GT, value: ">", start };
            }
          } else if (startingChar === "=") {
            if (stream[this._current] === "=") {
              this._current++;
              return { type: TOK_EQ, value: "==", start };
            }
          }
        },
        _consumeLiteral: function(stream) {
          this._current++;
          var start = this._current;
          var maxLength = stream.length;
          var literal;
          while (stream[this._current] !== "`" && this._current < maxLength) {
            var current = this._current;
            if (stream[current] === "\\" && (stream[current + 1] === "\\" || stream[current + 1] === "`")) {
              current += 2;
            } else {
              current++;
            }
            this._current = current;
          }
          var literalString = trimLeft(stream.slice(start, this._current));
          literalString = literalString.replace("\\`", "`");
          if (this._looksLikeJSON(literalString)) {
            literal = JSON.parse(literalString);
          } else {
            literal = JSON.parse('"' + literalString + '"');
          }
          this._current++;
          return literal;
        },
        _looksLikeJSON: function(literalString) {
          var startingChars = '[{"';
          var jsonLiterals = ["true", "false", "null"];
          var numberLooking = "-0123456789";
          if (literalString === "") {
            return false;
          } else if (startingChars.indexOf(literalString[0]) >= 0) {
            return true;
          } else if (jsonLiterals.indexOf(literalString) >= 0) {
            return true;
          } else if (numberLooking.indexOf(literalString[0]) >= 0) {
            try {
              JSON.parse(literalString);
              return true;
            } catch (ex) {
              return false;
            }
          } else {
            return false;
          }
        }
      };
      var bindingPower = {};
      bindingPower[TOK_EOF] = 0;
      bindingPower[TOK_UNQUOTEDIDENTIFIER] = 0;
      bindingPower[TOK_QUOTEDIDENTIFIER] = 0;
      bindingPower[TOK_RBRACKET] = 0;
      bindingPower[TOK_RPAREN] = 0;
      bindingPower[TOK_COMMA] = 0;
      bindingPower[TOK_RBRACE] = 0;
      bindingPower[TOK_NUMBER] = 0;
      bindingPower[TOK_CURRENT] = 0;
      bindingPower[TOK_EXPREF] = 0;
      bindingPower[TOK_PIPE] = 1;
      bindingPower[TOK_OR] = 2;
      bindingPower[TOK_AND] = 3;
      bindingPower[TOK_EQ] = 5;
      bindingPower[TOK_GT] = 5;
      bindingPower[TOK_LT] = 5;
      bindingPower[TOK_GTE] = 5;
      bindingPower[TOK_LTE] = 5;
      bindingPower[TOK_NE] = 5;
      bindingPower[TOK_FLATTEN] = 9;
      bindingPower[TOK_STAR] = 20;
      bindingPower[TOK_FILTER] = 21;
      bindingPower[TOK_DOT] = 40;
      bindingPower[TOK_NOT] = 45;
      bindingPower[TOK_LBRACE] = 50;
      bindingPower[TOK_LBRACKET] = 55;
      bindingPower[TOK_LPAREN] = 60;
      function Parser() {
      }
      Parser.prototype = {
        parse: function(expression) {
          this._loadTokens(expression);
          this.index = 0;
          var ast = this.expression(0);
          if (this._lookahead(0) !== TOK_EOF) {
            var t = this._lookaheadToken(0);
            var error = new Error(
              "Unexpected token type: " + t.type + ", value: " + t.value
            );
            error.name = "ParserError";
            throw error;
          }
          return ast;
        },
        _loadTokens: function(expression) {
          var lexer = new Lexer();
          var tokens = lexer.tokenize(expression);
          tokens.push({ type: TOK_EOF, value: "", start: expression.length });
          this.tokens = tokens;
        },
        expression: function(rbp) {
          var leftToken = this._lookaheadToken(0);
          this._advance();
          var left = this.nud(leftToken);
          var currentToken = this._lookahead(0);
          while (rbp < bindingPower[currentToken]) {
            this._advance();
            left = this.led(currentToken, left);
            currentToken = this._lookahead(0);
          }
          return left;
        },
        _lookahead: function(number) {
          return this.tokens[this.index + number].type;
        },
        _lookaheadToken: function(number) {
          return this.tokens[this.index + number];
        },
        _advance: function() {
          this.index++;
        },
        nud: function(token) {
          var left;
          var right;
          var expression;
          switch (token.type) {
            case TOK_LITERAL:
              return { type: "Literal", value: token.value };
            case TOK_UNQUOTEDIDENTIFIER:
              return { type: "Field", name: token.value };
            case TOK_QUOTEDIDENTIFIER:
              var node = { type: "Field", name: token.value };
              if (this._lookahead(0) === TOK_LPAREN) {
                throw new Error("Quoted identifier not allowed for function names.");
              }
              return node;
            case TOK_NOT:
              right = this.expression(bindingPower.Not);
              return { type: "NotExpression", children: [right] };
            case TOK_STAR:
              left = { type: "Identity" };
              right = null;
              if (this._lookahead(0) === TOK_RBRACKET) {
                right = { type: "Identity" };
              } else {
                right = this._parseProjectionRHS(bindingPower.Star);
              }
              return { type: "ValueProjection", children: [left, right] };
            case TOK_FILTER:
              return this.led(token.type, { type: "Identity" });
            case TOK_LBRACE:
              return this._parseMultiselectHash();
            case TOK_FLATTEN:
              left = { type: TOK_FLATTEN, children: [{ type: "Identity" }] };
              right = this._parseProjectionRHS(bindingPower.Flatten);
              return { type: "Projection", children: [left, right] };
            case TOK_LBRACKET:
              if (this._lookahead(0) === TOK_NUMBER || this._lookahead(0) === TOK_COLON) {
                right = this._parseIndexExpression();
                return this._projectIfSlice({ type: "Identity" }, right);
              } else if (this._lookahead(0) === TOK_STAR && this._lookahead(1) === TOK_RBRACKET) {
                this._advance();
                this._advance();
                right = this._parseProjectionRHS(bindingPower.Star);
                return {
                  type: "Projection",
                  children: [{ type: "Identity" }, right]
                };
              }
              return this._parseMultiselectList();
            case TOK_CURRENT:
              return { type: TOK_CURRENT };
            case TOK_EXPREF:
              expression = this.expression(bindingPower.Expref);
              return { type: "ExpressionReference", children: [expression] };
            case TOK_LPAREN:
              var args = [];
              while (this._lookahead(0) !== TOK_RPAREN) {
                if (this._lookahead(0) === TOK_CURRENT) {
                  expression = { type: TOK_CURRENT };
                  this._advance();
                } else {
                  expression = this.expression(0);
                }
                args.push(expression);
              }
              this._match(TOK_RPAREN);
              return args[0];
            default:
              this._errorToken(token);
          }
        },
        led: function(tokenName, left) {
          var right;
          switch (tokenName) {
            case TOK_DOT:
              var rbp = bindingPower.Dot;
              if (this._lookahead(0) !== TOK_STAR) {
                right = this._parseDotRHS(rbp);
                return { type: "Subexpression", children: [left, right] };
              }
              this._advance();
              right = this._parseProjectionRHS(rbp);
              return { type: "ValueProjection", children: [left, right] };
            case TOK_PIPE:
              right = this.expression(bindingPower.Pipe);
              return { type: TOK_PIPE, children: [left, right] };
            case TOK_OR:
              right = this.expression(bindingPower.Or);
              return { type: "OrExpression", children: [left, right] };
            case TOK_AND:
              right = this.expression(bindingPower.And);
              return { type: "AndExpression", children: [left, right] };
            case TOK_LPAREN:
              var name = left.name;
              var args = [];
              var expression, node;
              while (this._lookahead(0) !== TOK_RPAREN) {
                if (this._lookahead(0) === TOK_CURRENT) {
                  expression = { type: TOK_CURRENT };
                  this._advance();
                } else {
                  expression = this.expression(0);
                }
                if (this._lookahead(0) === TOK_COMMA) {
                  this._match(TOK_COMMA);
                }
                args.push(expression);
              }
              this._match(TOK_RPAREN);
              node = { type: "Function", name, children: args };
              return node;
            case TOK_FILTER:
              var condition = this.expression(0);
              this._match(TOK_RBRACKET);
              if (this._lookahead(0) === TOK_FLATTEN) {
                right = { type: "Identity" };
              } else {
                right = this._parseProjectionRHS(bindingPower.Filter);
              }
              return { type: "FilterProjection", children: [left, right, condition] };
            case TOK_FLATTEN:
              var leftNode = { type: TOK_FLATTEN, children: [left] };
              var rightNode = this._parseProjectionRHS(bindingPower.Flatten);
              return { type: "Projection", children: [leftNode, rightNode] };
            case TOK_EQ:
            case TOK_NE:
            case TOK_GT:
            case TOK_GTE:
            case TOK_LT:
            case TOK_LTE:
              return this._parseComparator(left, tokenName);
            case TOK_LBRACKET:
              var token = this._lookaheadToken(0);
              if (token.type === TOK_NUMBER || token.type === TOK_COLON) {
                right = this._parseIndexExpression();
                return this._projectIfSlice(left, right);
              }
              this._match(TOK_STAR);
              this._match(TOK_RBRACKET);
              right = this._parseProjectionRHS(bindingPower.Star);
              return { type: "Projection", children: [left, right] };
            default:
              this._errorToken(this._lookaheadToken(0));
          }
        },
        _match: function(tokenType) {
          if (this._lookahead(0) === tokenType) {
            this._advance();
          } else {
            var t = this._lookaheadToken(0);
            var error = new Error("Expected " + tokenType + ", got: " + t.type);
            error.name = "ParserError";
            throw error;
          }
        },
        _errorToken: function(token) {
          var error = new Error("Invalid token (" + token.type + '): "' + token.value + '"');
          error.name = "ParserError";
          throw error;
        },
        _parseIndexExpression: function() {
          if (this._lookahead(0) === TOK_COLON || this._lookahead(1) === TOK_COLON) {
            return this._parseSliceExpression();
          } else {
            var node = {
              type: "Index",
              value: this._lookaheadToken(0).value
            };
            this._advance();
            this._match(TOK_RBRACKET);
            return node;
          }
        },
        _projectIfSlice: function(left, right) {
          var indexExpr = { type: "IndexExpression", children: [left, right] };
          if (right.type === "Slice") {
            return {
              type: "Projection",
              children: [indexExpr, this._parseProjectionRHS(bindingPower.Star)]
            };
          } else {
            return indexExpr;
          }
        },
        _parseSliceExpression: function() {
          var parts = [null, null, null];
          var index = 0;
          var currentToken = this._lookahead(0);
          while (currentToken !== TOK_RBRACKET && index < 3) {
            if (currentToken === TOK_COLON) {
              index++;
              this._advance();
            } else if (currentToken === TOK_NUMBER) {
              parts[index] = this._lookaheadToken(0).value;
              this._advance();
            } else {
              var t = this._lookahead(0);
              var error = new Error("Syntax error, unexpected token: " + t.value + "(" + t.type + ")");
              error.name = "Parsererror";
              throw error;
            }
            currentToken = this._lookahead(0);
          }
          this._match(TOK_RBRACKET);
          return {
            type: "Slice",
            children: parts
          };
        },
        _parseComparator: function(left, comparator) {
          var right = this.expression(bindingPower[comparator]);
          return { type: "Comparator", name: comparator, children: [left, right] };
        },
        _parseDotRHS: function(rbp) {
          var lookahead = this._lookahead(0);
          var exprTokens = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER, TOK_STAR];
          if (exprTokens.indexOf(lookahead) >= 0) {
            return this.expression(rbp);
          } else if (lookahead === TOK_LBRACKET) {
            this._match(TOK_LBRACKET);
            return this._parseMultiselectList();
          } else if (lookahead === TOK_LBRACE) {
            this._match(TOK_LBRACE);
            return this._parseMultiselectHash();
          }
        },
        _parseProjectionRHS: function(rbp) {
          var right;
          if (bindingPower[this._lookahead(0)] < 10) {
            right = { type: "Identity" };
          } else if (this._lookahead(0) === TOK_LBRACKET) {
            right = this.expression(rbp);
          } else if (this._lookahead(0) === TOK_FILTER) {
            right = this.expression(rbp);
          } else if (this._lookahead(0) === TOK_DOT) {
            this._match(TOK_DOT);
            right = this._parseDotRHS(rbp);
          } else {
            var t = this._lookaheadToken(0);
            var error = new Error("Sytanx error, unexpected token: " + t.value + "(" + t.type + ")");
            error.name = "ParserError";
            throw error;
          }
          return right;
        },
        _parseMultiselectList: function() {
          var expressions = [];
          while (this._lookahead(0) !== TOK_RBRACKET) {
            var expression = this.expression(0);
            expressions.push(expression);
            if (this._lookahead(0) === TOK_COMMA) {
              this._match(TOK_COMMA);
              if (this._lookahead(0) === TOK_RBRACKET) {
                throw new Error("Unexpected token Rbracket");
              }
            }
          }
          this._match(TOK_RBRACKET);
          return { type: "MultiSelectList", children: expressions };
        },
        _parseMultiselectHash: function() {
          var pairs = [];
          var identifierTypes = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER];
          var keyToken, keyName, value, node;
          for (; ; ) {
            keyToken = this._lookaheadToken(0);
            if (identifierTypes.indexOf(keyToken.type) < 0) {
              throw new Error("Expecting an identifier token, got: " + keyToken.type);
            }
            keyName = keyToken.value;
            this._advance();
            this._match(TOK_COLON);
            value = this.expression(0);
            node = { type: "KeyValuePair", name: keyName, value };
            pairs.push(node);
            if (this._lookahead(0) === TOK_COMMA) {
              this._match(TOK_COMMA);
            } else if (this._lookahead(0) === TOK_RBRACE) {
              this._match(TOK_RBRACE);
              break;
            }
          }
          return { type: "MultiSelectHash", children: pairs };
        }
      };
      function TreeInterpreter(runtime) {
        this.runtime = runtime;
      }
      TreeInterpreter.prototype = {
        search: function(node, value) {
          return this.visit(node, value);
        },
        visit: function(node, value) {
          var matched, current, result, first, second, field, left, right, collected, i;
          switch (node.type) {
            case "Field":
              if (value !== null && isObject(value)) {
                field = value[node.name];
                if (field === void 0) {
                  return null;
                } else {
                  return field;
                }
              }
              return null;
            case "Subexpression":
              result = this.visit(node.children[0], value);
              for (i = 1; i < node.children.length; i++) {
                result = this.visit(node.children[1], result);
                if (result === null) {
                  return null;
                }
              }
              return result;
            case "IndexExpression":
              left = this.visit(node.children[0], value);
              right = this.visit(node.children[1], left);
              return right;
            case "Index":
              if (!isArray(value)) {
                return null;
              }
              var index = node.value;
              if (index < 0) {
                index = value.length + index;
              }
              result = value[index];
              if (result === void 0) {
                result = null;
              }
              return result;
            case "Slice":
              if (!isArray(value)) {
                return null;
              }
              var sliceParams = node.children.slice(0);
              var computed = this.computeSliceParams(value.length, sliceParams);
              var start = computed[0];
              var stop = computed[1];
              var step = computed[2];
              result = [];
              if (step > 0) {
                for (i = start; i < stop; i += step) {
                  result.push(value[i]);
                }
              } else {
                for (i = start; i > stop; i += step) {
                  result.push(value[i]);
                }
              }
              return result;
            case "Projection":
              var base = this.visit(node.children[0], value);
              if (!isArray(base)) {
                return null;
              }
              collected = [];
              for (i = 0; i < base.length; i++) {
                current = this.visit(node.children[1], base[i]);
                if (current !== null) {
                  collected.push(current);
                }
              }
              return collected;
            case "ValueProjection":
              base = this.visit(node.children[0], value);
              if (!isObject(base)) {
                return null;
              }
              collected = [];
              var values = objValues(base);
              for (i = 0; i < values.length; i++) {
                current = this.visit(node.children[1], values[i]);
                if (current !== null) {
                  collected.push(current);
                }
              }
              return collected;
            case "FilterProjection":
              base = this.visit(node.children[0], value);
              if (!isArray(base)) {
                return null;
              }
              var filtered = [];
              var finalResults = [];
              for (i = 0; i < base.length; i++) {
                matched = this.visit(node.children[2], base[i]);
                if (!isFalse(matched)) {
                  filtered.push(base[i]);
                }
              }
              for (var j = 0; j < filtered.length; j++) {
                current = this.visit(node.children[1], filtered[j]);
                if (current !== null) {
                  finalResults.push(current);
                }
              }
              return finalResults;
            case "Comparator":
              first = this.visit(node.children[0], value);
              second = this.visit(node.children[1], value);
              switch (node.name) {
                case TOK_EQ:
                  result = strictDeepEqual(first, second);
                  break;
                case TOK_NE:
                  result = !strictDeepEqual(first, second);
                  break;
                case TOK_GT:
                  result = first > second;
                  break;
                case TOK_GTE:
                  result = first >= second;
                  break;
                case TOK_LT:
                  result = first < second;
                  break;
                case TOK_LTE:
                  result = first <= second;
                  break;
                default:
                  throw new Error("Unknown comparator: " + node.name);
              }
              return result;
            case TOK_FLATTEN:
              var original = this.visit(node.children[0], value);
              if (!isArray(original)) {
                return null;
              }
              var merged = [];
              for (i = 0; i < original.length; i++) {
                current = original[i];
                if (isArray(current)) {
                  merged.push.apply(merged, current);
                } else {
                  merged.push(current);
                }
              }
              return merged;
            case "Identity":
              return value;
            case "MultiSelectList":
              if (value === null) {
                return null;
              }
              collected = [];
              for (i = 0; i < node.children.length; i++) {
                collected.push(this.visit(node.children[i], value));
              }
              return collected;
            case "MultiSelectHash":
              if (value === null) {
                return null;
              }
              collected = {};
              var child;
              for (i = 0; i < node.children.length; i++) {
                child = node.children[i];
                collected[child.name] = this.visit(child.value, value);
              }
              return collected;
            case "OrExpression":
              matched = this.visit(node.children[0], value);
              if (isFalse(matched)) {
                matched = this.visit(node.children[1], value);
              }
              return matched;
            case "AndExpression":
              first = this.visit(node.children[0], value);
              if (isFalse(first) === true) {
                return first;
              }
              return this.visit(node.children[1], value);
            case "NotExpression":
              first = this.visit(node.children[0], value);
              return isFalse(first);
            case "Literal":
              return node.value;
            case TOK_PIPE:
              left = this.visit(node.children[0], value);
              return this.visit(node.children[1], left);
            case TOK_CURRENT:
              return value;
            case "Function":
              var resolvedArgs = [];
              for (i = 0; i < node.children.length; i++) {
                resolvedArgs.push(this.visit(node.children[i], value));
              }
              return this.runtime.callFunction(node.name, resolvedArgs);
            case "ExpressionReference":
              var refNode = node.children[0];
              refNode.jmespathType = TOK_EXPREF;
              return refNode;
            default:
              throw new Error("Unknown node type: " + node.type);
          }
        },
        computeSliceParams: function(arrayLength, sliceParams) {
          var start = sliceParams[0];
          var stop = sliceParams[1];
          var step = sliceParams[2];
          var computed = [null, null, null];
          if (step === null) {
            step = 1;
          } else if (step === 0) {
            var error = new Error("Invalid slice, step cannot be 0");
            error.name = "RuntimeError";
            throw error;
          }
          var stepValueNegative = step < 0 ? true : false;
          if (start === null) {
            start = stepValueNegative ? arrayLength - 1 : 0;
          } else {
            start = this.capSliceRange(arrayLength, start, step);
          }
          if (stop === null) {
            stop = stepValueNegative ? -1 : arrayLength;
          } else {
            stop = this.capSliceRange(arrayLength, stop, step);
          }
          computed[0] = start;
          computed[1] = stop;
          computed[2] = step;
          return computed;
        },
        capSliceRange: function(arrayLength, actualValue, step) {
          if (actualValue < 0) {
            actualValue += arrayLength;
            if (actualValue < 0) {
              actualValue = step < 0 ? -1 : 0;
            }
          } else if (actualValue >= arrayLength) {
            actualValue = step < 0 ? arrayLength - 1 : arrayLength;
          }
          return actualValue;
        }
      };
      function Runtime(interpreter) {
        this._interpreter = interpreter;
        this.functionTable = {
          // name: [function, <signature>]
          // The <signature> can be:
          //
          // {
          //   args: [[type1, type2], [type1, type2]],
          //   variadic: true|false
          // }
          //
          // Each arg in the arg list is a list of valid types
          // (if the function is overloaded and supports multiple
          // types.  If the type is "any" then no type checking
          // occurs on the argument.  Variadic is optional
          // and if not provided is assumed to be false.
          abs: { _func: this._functionAbs, _signature: [{ types: [TYPE_NUMBER] }] },
          avg: { _func: this._functionAvg, _signature: [{ types: [TYPE_ARRAY_NUMBER] }] },
          ceil: { _func: this._functionCeil, _signature: [{ types: [TYPE_NUMBER] }] },
          contains: {
            _func: this._functionContains,
            _signature: [
              { types: [TYPE_STRING, TYPE_ARRAY] },
              { types: [TYPE_ANY] }
            ]
          },
          "ends_with": {
            _func: this._functionEndsWith,
            _signature: [{ types: [TYPE_STRING] }, { types: [TYPE_STRING] }]
          },
          floor: { _func: this._functionFloor, _signature: [{ types: [TYPE_NUMBER] }] },
          length: {
            _func: this._functionLength,
            _signature: [{ types: [TYPE_STRING, TYPE_ARRAY, TYPE_OBJECT] }]
          },
          map: {
            _func: this._functionMap,
            _signature: [{ types: [TYPE_EXPREF] }, { types: [TYPE_ARRAY] }]
          },
          max: {
            _func: this._functionMax,
            _signature: [{ types: [TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING] }]
          },
          "merge": {
            _func: this._functionMerge,
            _signature: [{ types: [TYPE_OBJECT], variadic: true }]
          },
          "max_by": {
            _func: this._functionMaxBy,
            _signature: [{ types: [TYPE_ARRAY] }, { types: [TYPE_EXPREF] }]
          },
          sum: { _func: this._functionSum, _signature: [{ types: [TYPE_ARRAY_NUMBER] }] },
          "starts_with": {
            _func: this._functionStartsWith,
            _signature: [{ types: [TYPE_STRING] }, { types: [TYPE_STRING] }]
          },
          min: {
            _func: this._functionMin,
            _signature: [{ types: [TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING] }]
          },
          "min_by": {
            _func: this._functionMinBy,
            _signature: [{ types: [TYPE_ARRAY] }, { types: [TYPE_EXPREF] }]
          },
          type: { _func: this._functionType, _signature: [{ types: [TYPE_ANY] }] },
          keys: { _func: this._functionKeys, _signature: [{ types: [TYPE_OBJECT] }] },
          values: { _func: this._functionValues, _signature: [{ types: [TYPE_OBJECT] }] },
          sort: { _func: this._functionSort, _signature: [{ types: [TYPE_ARRAY_STRING, TYPE_ARRAY_NUMBER] }] },
          "sort_by": {
            _func: this._functionSortBy,
            _signature: [{ types: [TYPE_ARRAY] }, { types: [TYPE_EXPREF] }]
          },
          join: {
            _func: this._functionJoin,
            _signature: [
              { types: [TYPE_STRING] },
              { types: [TYPE_ARRAY_STRING] }
            ]
          },
          reverse: {
            _func: this._functionReverse,
            _signature: [{ types: [TYPE_STRING, TYPE_ARRAY] }]
          },
          "to_array": { _func: this._functionToArray, _signature: [{ types: [TYPE_ANY] }] },
          "to_string": { _func: this._functionToString, _signature: [{ types: [TYPE_ANY] }] },
          "to_number": { _func: this._functionToNumber, _signature: [{ types: [TYPE_ANY] }] },
          "not_null": {
            _func: this._functionNotNull,
            _signature: [{ types: [TYPE_ANY], variadic: true }]
          }
        };
      }
      Runtime.prototype = {
        callFunction: function(name, resolvedArgs) {
          var functionEntry = this.functionTable[name];
          if (functionEntry === void 0) {
            throw new Error("Unknown function: " + name + "()");
          }
          this._validateArgs(name, resolvedArgs, functionEntry._signature);
          return functionEntry._func.call(this, resolvedArgs);
        },
        _validateArgs: function(name, args, signature) {
          var pluralized;
          if (signature[signature.length - 1].variadic) {
            if (args.length < signature.length) {
              pluralized = signature.length === 1 ? " argument" : " arguments";
              throw new Error("ArgumentError: " + name + "() takes at least" + signature.length + pluralized + " but received " + args.length);
            }
          } else if (args.length !== signature.length) {
            pluralized = signature.length === 1 ? " argument" : " arguments";
            throw new Error("ArgumentError: " + name + "() takes " + signature.length + pluralized + " but received " + args.length);
          }
          var currentSpec;
          var actualType;
          var typeMatched;
          for (var i = 0; i < signature.length; i++) {
            typeMatched = false;
            currentSpec = signature[i].types;
            actualType = this._getTypeName(args[i]);
            for (var j = 0; j < currentSpec.length; j++) {
              if (this._typeMatches(actualType, currentSpec[j], args[i])) {
                typeMatched = true;
                break;
              }
            }
            if (!typeMatched) {
              var expected = currentSpec.map(function(typeIdentifier) {
                return TYPE_NAME_TABLE[typeIdentifier];
              }).join(",");
              throw new Error("TypeError: " + name + "() expected argument " + (i + 1) + " to be type " + expected + " but received type " + TYPE_NAME_TABLE[actualType] + " instead.");
            }
          }
        },
        _typeMatches: function(actual, expected, argValue) {
          if (expected === TYPE_ANY) {
            return true;
          }
          if (expected === TYPE_ARRAY_STRING || expected === TYPE_ARRAY_NUMBER || expected === TYPE_ARRAY) {
            if (expected === TYPE_ARRAY) {
              return actual === TYPE_ARRAY;
            } else if (actual === TYPE_ARRAY) {
              var subtype;
              if (expected === TYPE_ARRAY_NUMBER) {
                subtype = TYPE_NUMBER;
              } else if (expected === TYPE_ARRAY_STRING) {
                subtype = TYPE_STRING;
              }
              for (var i = 0; i < argValue.length; i++) {
                if (!this._typeMatches(
                  this._getTypeName(argValue[i]),
                  subtype,
                  argValue[i]
                )) {
                  return false;
                }
              }
              return true;
            }
          } else {
            return actual === expected;
          }
        },
        _getTypeName: function(obj) {
          switch (Object.prototype.toString.call(obj)) {
            case "[object String]":
              return TYPE_STRING;
            case "[object Number]":
              return TYPE_NUMBER;
            case "[object Array]":
              return TYPE_ARRAY;
            case "[object Boolean]":
              return TYPE_BOOLEAN;
            case "[object Null]":
              return TYPE_NULL;
            case "[object Object]":
              if (obj.jmespathType === TOK_EXPREF) {
                return TYPE_EXPREF;
              } else {
                return TYPE_OBJECT;
              }
          }
        },
        _functionStartsWith: function(resolvedArgs) {
          return resolvedArgs[0].lastIndexOf(resolvedArgs[1]) === 0;
        },
        _functionEndsWith: function(resolvedArgs) {
          var searchStr = resolvedArgs[0];
          var suffix = resolvedArgs[1];
          return searchStr.indexOf(suffix, searchStr.length - suffix.length) !== -1;
        },
        _functionReverse: function(resolvedArgs) {
          var typeName = this._getTypeName(resolvedArgs[0]);
          if (typeName === TYPE_STRING) {
            var originalStr = resolvedArgs[0];
            var reversedStr = "";
            for (var i = originalStr.length - 1; i >= 0; i--) {
              reversedStr += originalStr[i];
            }
            return reversedStr;
          } else {
            var reversedArray = resolvedArgs[0].slice(0);
            reversedArray.reverse();
            return reversedArray;
          }
        },
        _functionAbs: function(resolvedArgs) {
          return Math.abs(resolvedArgs[0]);
        },
        _functionCeil: function(resolvedArgs) {
          return Math.ceil(resolvedArgs[0]);
        },
        _functionAvg: function(resolvedArgs) {
          var sum = 0;
          var inputArray = resolvedArgs[0];
          for (var i = 0; i < inputArray.length; i++) {
            sum += inputArray[i];
          }
          return sum / inputArray.length;
        },
        _functionContains: function(resolvedArgs) {
          return resolvedArgs[0].indexOf(resolvedArgs[1]) >= 0;
        },
        _functionFloor: function(resolvedArgs) {
          return Math.floor(resolvedArgs[0]);
        },
        _functionLength: function(resolvedArgs) {
          if (!isObject(resolvedArgs[0])) {
            return resolvedArgs[0].length;
          } else {
            return Object.keys(resolvedArgs[0]).length;
          }
        },
        _functionMap: function(resolvedArgs) {
          var mapped = [];
          var interpreter = this._interpreter;
          var exprefNode = resolvedArgs[0];
          var elements = resolvedArgs[1];
          for (var i = 0; i < elements.length; i++) {
            mapped.push(interpreter.visit(exprefNode, elements[i]));
          }
          return mapped;
        },
        _functionMerge: function(resolvedArgs) {
          var merged = {};
          for (var i = 0; i < resolvedArgs.length; i++) {
            var current = resolvedArgs[i];
            for (var key in current) {
              merged[key] = current[key];
            }
          }
          return merged;
        },
        _functionMax: function(resolvedArgs) {
          if (resolvedArgs[0].length > 0) {
            var typeName = this._getTypeName(resolvedArgs[0][0]);
            if (typeName === TYPE_NUMBER) {
              return Math.max.apply(Math, resolvedArgs[0]);
            } else {
              var elements = resolvedArgs[0];
              var maxElement = elements[0];
              for (var i = 1; i < elements.length; i++) {
                if (maxElement.localeCompare(elements[i]) < 0) {
                  maxElement = elements[i];
                }
              }
              return maxElement;
            }
          } else {
            return null;
          }
        },
        _functionMin: function(resolvedArgs) {
          if (resolvedArgs[0].length > 0) {
            var typeName = this._getTypeName(resolvedArgs[0][0]);
            if (typeName === TYPE_NUMBER) {
              return Math.min.apply(Math, resolvedArgs[0]);
            } else {
              var elements = resolvedArgs[0];
              var minElement = elements[0];
              for (var i = 1; i < elements.length; i++) {
                if (elements[i].localeCompare(minElement) < 0) {
                  minElement = elements[i];
                }
              }
              return minElement;
            }
          } else {
            return null;
          }
        },
        _functionSum: function(resolvedArgs) {
          var sum = 0;
          var listToSum = resolvedArgs[0];
          for (var i = 0; i < listToSum.length; i++) {
            sum += listToSum[i];
          }
          return sum;
        },
        _functionType: function(resolvedArgs) {
          switch (this._getTypeName(resolvedArgs[0])) {
            case TYPE_NUMBER:
              return "number";
            case TYPE_STRING:
              return "string";
            case TYPE_ARRAY:
              return "array";
            case TYPE_OBJECT:
              return "object";
            case TYPE_BOOLEAN:
              return "boolean";
            case TYPE_EXPREF:
              return "expref";
            case TYPE_NULL:
              return "null";
          }
        },
        _functionKeys: function(resolvedArgs) {
          return Object.keys(resolvedArgs[0]);
        },
        _functionValues: function(resolvedArgs) {
          var obj = resolvedArgs[0];
          var keys = Object.keys(obj);
          var values = [];
          for (var i = 0; i < keys.length; i++) {
            values.push(obj[keys[i]]);
          }
          return values;
        },
        _functionJoin: function(resolvedArgs) {
          var joinChar = resolvedArgs[0];
          var listJoin = resolvedArgs[1];
          return listJoin.join(joinChar);
        },
        _functionToArray: function(resolvedArgs) {
          if (this._getTypeName(resolvedArgs[0]) === TYPE_ARRAY) {
            return resolvedArgs[0];
          } else {
            return [resolvedArgs[0]];
          }
        },
        _functionToString: function(resolvedArgs) {
          if (this._getTypeName(resolvedArgs[0]) === TYPE_STRING) {
            return resolvedArgs[0];
          } else {
            return JSON.stringify(resolvedArgs[0]);
          }
        },
        _functionToNumber: function(resolvedArgs) {
          var typeName = this._getTypeName(resolvedArgs[0]);
          var convertedValue;
          if (typeName === TYPE_NUMBER) {
            return resolvedArgs[0];
          } else if (typeName === TYPE_STRING) {
            convertedValue = +resolvedArgs[0];
            if (!isNaN(convertedValue)) {
              return convertedValue;
            }
          }
          return null;
        },
        _functionNotNull: function(resolvedArgs) {
          for (var i = 0; i < resolvedArgs.length; i++) {
            if (this._getTypeName(resolvedArgs[i]) !== TYPE_NULL) {
              return resolvedArgs[i];
            }
          }
          return null;
        },
        _functionSort: function(resolvedArgs) {
          var sortedArray = resolvedArgs[0].slice(0);
          sortedArray.sort();
          return sortedArray;
        },
        _functionSortBy: function(resolvedArgs) {
          var sortedArray = resolvedArgs[0].slice(0);
          if (sortedArray.length === 0) {
            return sortedArray;
          }
          var interpreter = this._interpreter;
          var exprefNode = resolvedArgs[1];
          var requiredType = this._getTypeName(
            interpreter.visit(exprefNode, sortedArray[0])
          );
          if ([TYPE_NUMBER, TYPE_STRING].indexOf(requiredType) < 0) {
            throw new Error("TypeError");
          }
          var that = this;
          var decorated = [];
          for (var i = 0; i < sortedArray.length; i++) {
            decorated.push([i, sortedArray[i]]);
          }
          decorated.sort(function(a, b) {
            var exprA = interpreter.visit(exprefNode, a[1]);
            var exprB = interpreter.visit(exprefNode, b[1]);
            if (that._getTypeName(exprA) !== requiredType) {
              throw new Error(
                "TypeError: expected " + requiredType + ", received " + that._getTypeName(exprA)
              );
            } else if (that._getTypeName(exprB) !== requiredType) {
              throw new Error(
                "TypeError: expected " + requiredType + ", received " + that._getTypeName(exprB)
              );
            }
            if (exprA > exprB) {
              return 1;
            } else if (exprA < exprB) {
              return -1;
            } else {
              return a[0] - b[0];
            }
          });
          for (var j = 0; j < decorated.length; j++) {
            sortedArray[j] = decorated[j][1];
          }
          return sortedArray;
        },
        _functionMaxBy: function(resolvedArgs) {
          var exprefNode = resolvedArgs[1];
          var resolvedArray = resolvedArgs[0];
          var keyFunction = this.createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
          var maxNumber = -Infinity;
          var maxRecord;
          var current;
          for (var i = 0; i < resolvedArray.length; i++) {
            current = keyFunction(resolvedArray[i]);
            if (current > maxNumber) {
              maxNumber = current;
              maxRecord = resolvedArray[i];
            }
          }
          return maxRecord;
        },
        _functionMinBy: function(resolvedArgs) {
          var exprefNode = resolvedArgs[1];
          var resolvedArray = resolvedArgs[0];
          var keyFunction = this.createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
          var minNumber = Infinity;
          var minRecord;
          var current;
          for (var i = 0; i < resolvedArray.length; i++) {
            current = keyFunction(resolvedArray[i]);
            if (current < minNumber) {
              minNumber = current;
              minRecord = resolvedArray[i];
            }
          }
          return minRecord;
        },
        createKeyFunction: function(exprefNode, allowedTypes) {
          var that = this;
          var interpreter = this._interpreter;
          var keyFunc = function(x) {
            var current = interpreter.visit(exprefNode, x);
            if (allowedTypes.indexOf(that._getTypeName(current)) < 0) {
              var msg = "TypeError: expected one of " + allowedTypes + ", received " + that._getTypeName(current);
              throw new Error(msg);
            }
            return current;
          };
          return keyFunc;
        }
      };
      function compile(stream) {
        var parser = new Parser();
        var ast = parser.parse(stream);
        return ast;
      }
      function tokenize(stream) {
        var lexer = new Lexer();
        return lexer.tokenize(stream);
      }
      function search(data, expression) {
        var parser = new Parser();
        var runtime = new Runtime();
        var interpreter = new TreeInterpreter(runtime);
        runtime._interpreter = interpreter;
        var node = parser.parse(expression);
        return interpreter.search(node, data);
      }
      exports2.tokenize = tokenize;
      exports2.compile = compile;
      exports2.search = search;
      exports2.strictDeepEqual = strictDeepEqual;
    })(typeof exports === "undefined" ? exports.jmespath = {} : exports);
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/request.js
var require_request = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/request.js"() {
    var AWS2 = require_core();
    var AcceptorStateMachine = require_state_machine();
    var inherit = AWS2.util.inherit;
    var domain = AWS2.util.domain;
    var jmespath = require_jmespath();
    var hardErrorStates = { success: 1, error: 1, complete: 1 };
    function isTerminalState(machine) {
      return Object.prototype.hasOwnProperty.call(hardErrorStates, machine._asm.currentState);
    }
    var fsm = new AcceptorStateMachine();
    fsm.setupStates = function() {
      var transition = function(_, done) {
        var self = this;
        self._haltHandlersOnError = false;
        self.emit(self._asm.currentState, function(err) {
          if (err) {
            if (isTerminalState(self)) {
              if (domain && self.domain instanceof domain.Domain) {
                err.domainEmitter = self;
                err.domain = self.domain;
                err.domainThrown = false;
                self.domain.emit("error", err);
              } else {
                throw err;
              }
            } else {
              self.response.error = err;
              done(err);
            }
          } else {
            done(self.response.error);
          }
        });
      };
      this.addState("validate", "build", "error", transition);
      this.addState("build", "afterBuild", "restart", transition);
      this.addState("afterBuild", "sign", "restart", transition);
      this.addState("sign", "send", "retry", transition);
      this.addState("retry", "afterRetry", "afterRetry", transition);
      this.addState("afterRetry", "sign", "error", transition);
      this.addState("send", "validateResponse", "retry", transition);
      this.addState("validateResponse", "extractData", "extractError", transition);
      this.addState("extractError", "extractData", "retry", transition);
      this.addState("extractData", "success", "retry", transition);
      this.addState("restart", "build", "error", transition);
      this.addState("success", "complete", "complete", transition);
      this.addState("error", "complete", "complete", transition);
      this.addState("complete", null, null, transition);
    };
    fsm.setupStates();
    AWS2.Request = inherit({
      /**
       * Creates a request for an operation on a given service with
       * a set of input parameters.
       *
       * @param service [AWS.Service] the service to perform the operation on
       * @param operation [String] the operation to perform on the service
       * @param params [Object] parameters to send to the operation.
       *   See the operation's documentation for the format of the
       *   parameters.
       */
      constructor: function Request(service, operation, params) {
        var endpoint = service.endpoint;
        var region = service.config.region;
        var customUserAgent = service.config.customUserAgent;
        if (service.signingRegion) {
          region = service.signingRegion;
        } else if (service.isGlobalEndpoint) {
          region = "us-east-1";
        }
        this.domain = domain && domain.active;
        this.service = service;
        this.operation = operation;
        this.params = params || {};
        this.httpRequest = new AWS2.HttpRequest(endpoint, region);
        this.httpRequest.appendToUserAgent(customUserAgent);
        this.startTime = service.getSkewCorrectedDate();
        this.response = new AWS2.Response(this);
        this._asm = new AcceptorStateMachine(fsm.states, "validate");
        this._haltHandlersOnError = false;
        AWS2.SequentialExecutor.call(this);
        this.emit = this.emitEvent;
      },
      /**
       * @!group Sending a Request
       */
      /**
       * @overload send(callback = null)
       *   Sends the request object.
       *
       *   @callback callback function(err, data)
       *     If a callback is supplied, it is called when a response is returned
       *     from the service.
       *     @context [AWS.Request] the request object being sent.
       *     @param err [Error] the error object returned from the request.
       *       Set to `null` if the request is successful.
       *     @param data [Object] the de-serialized data returned from
       *       the request. Set to `null` if a request error occurs.
       *   @example Sending a request with a callback
       *     request = s3.putObject({Bucket: 'bucket', Key: 'key'});
       *     request.send(function(err, data) { console.log(err, data); });
       *   @example Sending a request with no callback (using event handlers)
       *     request = s3.putObject({Bucket: 'bucket', Key: 'key'});
       *     request.on('complete', function(response) { ... }); // register a callback
       *     request.send();
       */
      send: function send(callback) {
        if (callback) {
          this.httpRequest.appendToUserAgent("callback");
          this.on("complete", function(resp) {
            callback.call(resp, resp.error, resp.data);
          });
        }
        this.runTo();
        return this.response;
      },
      /**
       * @!method  promise()
       *   Sends the request and returns a 'thenable' promise.
       *
       *   Two callbacks can be provided to the `then` method on the returned promise.
       *   The first callback will be called if the promise is fulfilled, and the second
       *   callback will be called if the promise is rejected.
       *   @callback fulfilledCallback function(data)
       *     Called if the promise is fulfilled.
       *     @param data [Object] the de-serialized data returned from the request.
       *   @callback rejectedCallback function(error)
       *     Called if the promise is rejected.
       *     @param error [Error] the error object returned from the request.
       *   @return [Promise] A promise that represents the state of the request.
       *   @example Sending a request using promises.
       *     var request = s3.putObject({Bucket: 'bucket', Key: 'key'});
       *     var result = request.promise();
       *     result.then(function(data) { ... }, function(error) { ... });
       */
      /**
       * @api private
       */
      build: function build(callback) {
        return this.runTo("send", callback);
      },
      /**
       * @api private
       */
      runTo: function runTo(state, done) {
        this._asm.runTo(state, done, this);
        return this;
      },
      /**
       * Aborts a request, emitting the error and complete events.
       *
       * @!macro nobrowser
       * @example Aborting a request after sending
       *   var params = {
       *     Bucket: 'bucket', Key: 'key',
       *     Body: Buffer.alloc(1024 * 1024 * 5) // 5MB payload
       *   };
       *   var request = s3.putObject(params);
       *   request.send(function (err, data) {
       *     if (err) console.log("Error:", err.code, err.message);
       *     else console.log(data);
       *   });
       *
       *   // abort request in 1 second
       *   setTimeout(request.abort.bind(request), 1000);
       *
       *   // prints "Error: RequestAbortedError Request aborted by user"
       * @return [AWS.Request] the same request object, for chaining.
       * @since v1.4.0
       */
      abort: function abort() {
        this.removeAllListeners("validateResponse");
        this.removeAllListeners("extractError");
        this.on("validateResponse", function addAbortedError(resp) {
          resp.error = AWS2.util.error(new Error("Request aborted by user"), {
            code: "RequestAbortedError",
            retryable: false
          });
        });
        if (this.httpRequest.stream && !this.httpRequest.stream.didCallback) {
          this.httpRequest.stream.abort();
          if (this.httpRequest._abortCallback) {
            this.httpRequest._abortCallback();
          } else {
            this.removeAllListeners("send");
          }
        }
        return this;
      },
      /**
       * Iterates over each page of results given a pageable request, calling
       * the provided callback with each page of data. After all pages have been
       * retrieved, the callback is called with `null` data.
       *
       * @note This operation can generate multiple requests to a service.
       * @example Iterating over multiple pages of objects in an S3 bucket
       *   var pages = 1;
       *   s3.listObjects().eachPage(function(err, data) {
       *     if (err) return;
       *     console.log("Page", pages++);
       *     console.log(data);
       *   });
       * @example Iterating over multiple pages with an asynchronous callback
       *   s3.listObjects(params).eachPage(function(err, data, done) {
       *     doSomethingAsyncAndOrExpensive(function() {
       *       // The next page of results isn't fetched until done is called
       *       done();
       *     });
       *   });
       * @callback callback function(err, data, [doneCallback])
       *   Called with each page of resulting data from the request. If the
       *   optional `doneCallback` is provided in the function, it must be called
       *   when the callback is complete.
       *
       *   @param err [Error] an error object, if an error occurred.
       *   @param data [Object] a single page of response data. If there is no
       *     more data, this object will be `null`.
       *   @param doneCallback [Function] an optional done callback. If this
       *     argument is defined in the function declaration, it should be called
       *     when the next page is ready to be retrieved. This is useful for
       *     controlling serial pagination across asynchronous operations.
       *   @return [Boolean] if the callback returns `false`, pagination will
       *     stop.
       *
       * @see AWS.Request.eachItem
       * @see AWS.Response.nextPage
       * @since v1.4.0
       */
      eachPage: function eachPage(callback) {
        callback = AWS2.util.fn.makeAsync(callback, 3);
        function wrappedCallback(response2) {
          callback.call(response2, response2.error, response2.data, function(result) {
            if (result === false)
              return;
            if (response2.hasNextPage()) {
              response2.nextPage().on("complete", wrappedCallback).send();
            } else {
              callback.call(response2, null, null, AWS2.util.fn.noop);
            }
          });
        }
        this.on("complete", wrappedCallback).send();
      },
      /**
       * Enumerates over individual items of a request, paging the responses if
       * necessary.
       *
       * @api experimental
       * @since v1.4.0
       */
      eachItem: function eachItem(callback) {
        var self = this;
        function wrappedCallback(err, data) {
          if (err)
            return callback(err, null);
          if (data === null)
            return callback(null, null);
          var config = self.service.paginationConfig(self.operation);
          var resultKey = config.resultKey;
          if (Array.isArray(resultKey))
            resultKey = resultKey[0];
          var items = jmespath.search(data, resultKey);
          var continueIteration = true;
          AWS2.util.arrayEach(items, function(item) {
            continueIteration = callback(null, item);
            if (continueIteration === false) {
              return AWS2.util.abort;
            }
          });
          return continueIteration;
        }
        this.eachPage(wrappedCallback);
      },
      /**
       * @return [Boolean] whether the operation can return multiple pages of
       *   response data.
       * @see AWS.Response.eachPage
       * @since v1.4.0
       */
      isPageable: function isPageable() {
        return this.service.paginationConfig(this.operation) ? true : false;
      },
      /**
       * Sends the request and converts the request object into a readable stream
       * that can be read from or piped into a writable stream.
       *
       * @note The data read from a readable stream contains only
       *   the raw HTTP body contents.
       * @example Manually reading from a stream
       *   request.createReadStream().on('data', function(data) {
       *     console.log("Got data:", data.toString());
       *   });
       * @example Piping a request body into a file
       *   var out = fs.createWriteStream('/path/to/outfile.jpg');
       *   s3.service.getObject(params).createReadStream().pipe(out);
       * @return [Stream] the readable stream object that can be piped
       *   or read from (by registering 'data' event listeners).
       * @!macro nobrowser
       */
      createReadStream: function createReadStream() {
        var streams = AWS2.util.stream;
        var req = this;
        var stream = null;
        if (AWS2.HttpClient.streamsApiVersion === 2) {
          stream = new streams.PassThrough();
          process.nextTick(function() {
            req.send();
          });
        } else {
          stream = new streams.Stream();
          stream.readable = true;
          stream.sent = false;
          stream.on("newListener", function(event) {
            if (!stream.sent && event === "data") {
              stream.sent = true;
              process.nextTick(function() {
                req.send();
              });
            }
          });
        }
        this.on("error", function(err) {
          stream.emit("error", err);
        });
        this.on("httpHeaders", function streamHeaders(statusCode, headers, resp) {
          if (statusCode < 300) {
            req.removeListener("httpData", AWS2.EventListeners.Core.HTTP_DATA);
            req.removeListener("httpError", AWS2.EventListeners.Core.HTTP_ERROR);
            req.on("httpError", function streamHttpError(error) {
              resp.error = error;
              resp.error.retryable = false;
            });
            var shouldCheckContentLength = false;
            var expectedLen;
            if (req.httpRequest.method !== "HEAD") {
              expectedLen = parseInt(headers["content-length"], 10);
            }
            if (expectedLen !== void 0 && !isNaN(expectedLen) && expectedLen >= 0) {
              shouldCheckContentLength = true;
              var receivedLen = 0;
            }
            var checkContentLengthAndEmit = function checkContentLengthAndEmit2() {
              if (shouldCheckContentLength && receivedLen !== expectedLen) {
                stream.emit("error", AWS2.util.error(
                  new Error("Stream content length mismatch. Received " + receivedLen + " of " + expectedLen + " bytes."),
                  { code: "StreamContentLengthMismatch" }
                ));
              } else if (AWS2.HttpClient.streamsApiVersion === 2) {
                stream.end();
              } else {
                stream.emit("end");
              }
            };
            var httpStream = resp.httpResponse.createUnbufferedStream();
            if (AWS2.HttpClient.streamsApiVersion === 2) {
              if (shouldCheckContentLength) {
                var lengthAccumulator = new streams.PassThrough();
                lengthAccumulator._write = function(chunk) {
                  if (chunk && chunk.length) {
                    receivedLen += chunk.length;
                  }
                  return streams.PassThrough.prototype._write.apply(this, arguments);
                };
                lengthAccumulator.on("end", checkContentLengthAndEmit);
                stream.on("error", function(err) {
                  shouldCheckContentLength = false;
                  httpStream.unpipe(lengthAccumulator);
                  lengthAccumulator.emit("end");
                  lengthAccumulator.end();
                });
                httpStream.pipe(lengthAccumulator).pipe(stream, { end: false });
              } else {
                httpStream.pipe(stream);
              }
            } else {
              if (shouldCheckContentLength) {
                httpStream.on("data", function(arg) {
                  if (arg && arg.length) {
                    receivedLen += arg.length;
                  }
                });
              }
              httpStream.on("data", function(arg) {
                stream.emit("data", arg);
              });
              httpStream.on("end", checkContentLengthAndEmit);
            }
            httpStream.on("error", function(err) {
              shouldCheckContentLength = false;
              stream.emit("error", err);
            });
          }
        });
        return stream;
      },
      /**
       * @param [Array,Response] args This should be the response object,
       *   or an array of args to send to the event.
       * @api private
       */
      emitEvent: function emit(eventName, args, done) {
        if (typeof args === "function") {
          done = args;
          args = null;
        }
        if (!done)
          done = function() {
          };
        if (!args)
          args = this.eventParameters(eventName, this.response);
        var origEmit = AWS2.SequentialExecutor.prototype.emit;
        origEmit.call(this, eventName, args, function(err) {
          if (err)
            this.response.error = err;
          done.call(this, err);
        });
      },
      /**
       * @api private
       */
      eventParameters: function eventParameters(eventName) {
        switch (eventName) {
          case "restart":
          case "validate":
          case "sign":
          case "build":
          case "afterValidate":
          case "afterBuild":
            return [this];
          case "error":
            return [this.response.error, this.response];
          default:
            return [this.response];
        }
      },
      /**
       * @api private
       */
      presign: function presign(expires, callback) {
        if (!callback && typeof expires === "function") {
          callback = expires;
          expires = null;
        }
        return new AWS2.Signers.Presign().sign(this.toGet(), expires, callback);
      },
      /**
       * @api private
       */
      isPresigned: function isPresigned() {
        return Object.prototype.hasOwnProperty.call(this.httpRequest.headers, "presigned-expires");
      },
      /**
       * @api private
       */
      toUnauthenticated: function toUnauthenticated() {
        this._unAuthenticated = true;
        this.removeListener("validate", AWS2.EventListeners.Core.VALIDATE_CREDENTIALS);
        this.removeListener("sign", AWS2.EventListeners.Core.SIGN);
        return this;
      },
      /**
       * @api private
       */
      toGet: function toGet() {
        if (this.service.api.protocol === "query" || this.service.api.protocol === "ec2") {
          this.removeListener("build", this.buildAsGet);
          this.addListener("build", this.buildAsGet);
        }
        return this;
      },
      /**
       * @api private
       */
      buildAsGet: function buildAsGet(request) {
        request.httpRequest.method = "GET";
        request.httpRequest.path = request.service.endpoint.path + "?" + request.httpRequest.body;
        request.httpRequest.body = "";
        delete request.httpRequest.headers["Content-Length"];
        delete request.httpRequest.headers["Content-Type"];
      },
      /**
       * @api private
       */
      haltHandlersOnError: function haltHandlersOnError() {
        this._haltHandlersOnError = true;
      }
    });
    AWS2.Request.addPromisesToClass = function addPromisesToClass(PromiseDependency) {
      this.prototype.promise = function promise() {
        var self = this;
        this.httpRequest.appendToUserAgent("promise");
        return new PromiseDependency(function(resolve, reject) {
          self.on("complete", function(resp) {
            if (resp.error) {
              reject(resp.error);
            } else {
              resolve(Object.defineProperty(
                resp.data || {},
                "$response",
                { value: resp }
              ));
            }
          });
          self.runTo();
        });
      };
    };
    AWS2.Request.deletePromisesFromClass = function deletePromisesFromClass() {
      delete this.prototype.promise;
    };
    AWS2.util.addPromises(AWS2.Request);
    AWS2.util.mixin(AWS2.Request, AWS2.SequentialExecutor);
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/response.js
var require_response = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/response.js"() {
    var AWS2 = require_core();
    var inherit = AWS2.util.inherit;
    var jmespath = require_jmespath();
    AWS2.Response = inherit({
      /**
       * @api private
       */
      constructor: function Response(request) {
        this.request = request;
        this.data = null;
        this.error = null;
        this.retryCount = 0;
        this.redirectCount = 0;
        this.httpResponse = new AWS2.HttpResponse();
        if (request) {
          this.maxRetries = request.service.numRetries();
          this.maxRedirects = request.service.config.maxRedirects;
        }
      },
      /**
       * Creates a new request for the next page of response data, calling the
       * callback with the page data if a callback is provided.
       *
       * @callback callback function(err, data)
       *   Called when a page of data is returned from the next request.
       *
       *   @param err [Error] an error object, if an error occurred in the request
       *   @param data [Object] the next page of data, or null, if there are no
       *     more pages left.
       * @return [AWS.Request] the request object for the next page of data
       * @return [null] if no callback is provided and there are no pages left
       *   to retrieve.
       * @since v1.4.0
       */
      nextPage: function nextPage(callback) {
        var config;
        var service = this.request.service;
        var operation = this.request.operation;
        try {
          config = service.paginationConfig(operation, true);
        } catch (e) {
          this.error = e;
        }
        if (!this.hasNextPage()) {
          if (callback)
            callback(this.error, null);
          else if (this.error)
            throw this.error;
          return null;
        }
        var params = AWS2.util.copy(this.request.params);
        if (!this.nextPageTokens) {
          return callback ? callback(null, null) : null;
        } else {
          var inputTokens = config.inputToken;
          if (typeof inputTokens === "string")
            inputTokens = [inputTokens];
          for (var i = 0; i < inputTokens.length; i++) {
            params[inputTokens[i]] = this.nextPageTokens[i];
          }
          return service.makeRequest(this.request.operation, params, callback);
        }
      },
      /**
       * @return [Boolean] whether more pages of data can be returned by further
       *   requests
       * @since v1.4.0
       */
      hasNextPage: function hasNextPage() {
        this.cacheNextPageTokens();
        if (this.nextPageTokens)
          return true;
        if (this.nextPageTokens === void 0)
          return void 0;
        else
          return false;
      },
      /**
       * @api private
       */
      cacheNextPageTokens: function cacheNextPageTokens() {
        if (Object.prototype.hasOwnProperty.call(this, "nextPageTokens"))
          return this.nextPageTokens;
        this.nextPageTokens = void 0;
        var config = this.request.service.paginationConfig(this.request.operation);
        if (!config)
          return this.nextPageTokens;
        this.nextPageTokens = null;
        if (config.moreResults) {
          if (!jmespath.search(this.data, config.moreResults)) {
            return this.nextPageTokens;
          }
        }
        var exprs = config.outputToken;
        if (typeof exprs === "string")
          exprs = [exprs];
        AWS2.util.arrayEach.call(this, exprs, function(expr) {
          var output = jmespath.search(this.data, expr);
          if (output) {
            this.nextPageTokens = this.nextPageTokens || [];
            this.nextPageTokens.push(output);
          }
        });
        return this.nextPageTokens;
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/resource_waiter.js
var require_resource_waiter2 = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/resource_waiter.js"() {
    var AWS2 = require_core();
    var inherit = AWS2.util.inherit;
    var jmespath = require_jmespath();
    function CHECK_ACCEPTORS(resp) {
      var waiter = resp.request._waiter;
      var acceptors = waiter.config.acceptors;
      var acceptorMatched = false;
      var state = "retry";
      acceptors.forEach(function(acceptor) {
        if (!acceptorMatched) {
          var matcher = waiter.matchers[acceptor.matcher];
          if (matcher && matcher(resp, acceptor.expected, acceptor.argument)) {
            acceptorMatched = true;
            state = acceptor.state;
          }
        }
      });
      if (!acceptorMatched && resp.error)
        state = "failure";
      if (state === "success") {
        waiter.setSuccess(resp);
      } else {
        waiter.setError(resp, state === "retry");
      }
    }
    AWS2.ResourceWaiter = inherit({
      /**
       * Waits for a given state on a service object
       * @param service [Service] the service object to wait on
       * @param state [String] the state (defined in waiter configuration) to wait
       *   for.
       * @example Create a waiter for running EC2 instances
       *   var ec2 = new AWS.EC2;
       *   var waiter = new AWS.ResourceWaiter(ec2, 'instanceRunning');
       */
      constructor: function constructor(service, state) {
        this.service = service;
        this.state = state;
        this.loadWaiterConfig(this.state);
      },
      service: null,
      state: null,
      config: null,
      matchers: {
        path: function(resp, expected, argument) {
          try {
            var result = jmespath.search(resp.data, argument);
          } catch (err) {
            return false;
          }
          return jmespath.strictDeepEqual(result, expected);
        },
        pathAll: function(resp, expected, argument) {
          try {
            var results = jmespath.search(resp.data, argument);
          } catch (err) {
            return false;
          }
          if (!Array.isArray(results))
            results = [results];
          var numResults = results.length;
          if (!numResults)
            return false;
          for (var ind = 0; ind < numResults; ind++) {
            if (!jmespath.strictDeepEqual(results[ind], expected)) {
              return false;
            }
          }
          return true;
        },
        pathAny: function(resp, expected, argument) {
          try {
            var results = jmespath.search(resp.data, argument);
          } catch (err) {
            return false;
          }
          if (!Array.isArray(results))
            results = [results];
          var numResults = results.length;
          for (var ind = 0; ind < numResults; ind++) {
            if (jmespath.strictDeepEqual(results[ind], expected)) {
              return true;
            }
          }
          return false;
        },
        status: function(resp, expected) {
          var statusCode = resp.httpResponse.statusCode;
          return typeof statusCode === "number" && statusCode === expected;
        },
        error: function(resp, expected) {
          if (typeof expected === "string" && resp.error) {
            return expected === resp.error.code;
          }
          return expected === !!resp.error;
        }
      },
      listeners: new AWS2.SequentialExecutor().addNamedListeners(function(add) {
        add("RETRY_CHECK", "retry", function(resp) {
          var waiter = resp.request._waiter;
          if (resp.error && resp.error.code === "ResourceNotReady") {
            resp.error.retryDelay = (waiter.config.delay || 0) * 1e3;
          }
        });
        add("CHECK_OUTPUT", "extractData", CHECK_ACCEPTORS);
        add("CHECK_ERROR", "extractError", CHECK_ACCEPTORS);
      }),
      /**
       * @return [AWS.Request]
       */
      wait: function wait(params, callback) {
        if (typeof params === "function") {
          callback = params;
          params = void 0;
        }
        if (params && params.$waiter) {
          params = AWS2.util.copy(params);
          if (typeof params.$waiter.delay === "number") {
            this.config.delay = params.$waiter.delay;
          }
          if (typeof params.$waiter.maxAttempts === "number") {
            this.config.maxAttempts = params.$waiter.maxAttempts;
          }
          delete params.$waiter;
        }
        var request = this.service.makeRequest(this.config.operation, params);
        request._waiter = this;
        request.response.maxRetries = this.config.maxAttempts;
        request.addListeners(this.listeners);
        if (callback)
          request.send(callback);
        return request;
      },
      setSuccess: function setSuccess(resp) {
        resp.error = null;
        resp.data = resp.data || {};
        resp.request.removeAllListeners("extractData");
      },
      setError: function setError(resp, retryable) {
        resp.data = null;
        resp.error = AWS2.util.error(resp.error || new Error(), {
          code: "ResourceNotReady",
          message: "Resource is not in the state " + this.state,
          retryable
        });
      },
      /**
       * Loads waiter configuration from API configuration
       *
       * @api private
       */
      loadWaiterConfig: function loadWaiterConfig(state) {
        if (!this.service.api.waiters[state]) {
          throw new AWS2.util.error(new Error(), {
            code: "StateNotFoundError",
            message: "State " + state + " not found."
          });
        }
        this.config = AWS2.util.copy(this.service.api.waiters[state]);
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/v2.js
var require_v2 = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/v2.js"(exports, module2) {
    var AWS2 = require_core();
    var inherit = AWS2.util.inherit;
    AWS2.Signers.V2 = inherit(AWS2.Signers.RequestSigner, {
      addAuthorization: function addAuthorization(credentials, date) {
        if (!date)
          date = AWS2.util.date.getDate();
        var r = this.request;
        r.params.Timestamp = AWS2.util.date.iso8601(date);
        r.params.SignatureVersion = "2";
        r.params.SignatureMethod = "HmacSHA256";
        r.params.AWSAccessKeyId = credentials.accessKeyId;
        if (credentials.sessionToken) {
          r.params.SecurityToken = credentials.sessionToken;
        }
        delete r.params.Signature;
        r.params.Signature = this.signature(credentials);
        r.body = AWS2.util.queryParamsToString(r.params);
        r.headers["Content-Length"] = r.body.length;
      },
      signature: function signature(credentials) {
        return AWS2.util.crypto.hmac(credentials.secretAccessKey, this.stringToSign(), "base64");
      },
      stringToSign: function stringToSign() {
        var parts = [];
        parts.push(this.request.method);
        parts.push(this.request.endpoint.host.toLowerCase());
        parts.push(this.request.pathname());
        parts.push(AWS2.util.queryParamsToString(this.request.params));
        return parts.join("\n");
      }
    });
    module2.exports = AWS2.Signers.V2;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/v3.js
var require_v3 = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/v3.js"(exports, module2) {
    var AWS2 = require_core();
    var inherit = AWS2.util.inherit;
    AWS2.Signers.V3 = inherit(AWS2.Signers.RequestSigner, {
      addAuthorization: function addAuthorization(credentials, date) {
        var datetime = AWS2.util.date.rfc822(date);
        this.request.headers["X-Amz-Date"] = datetime;
        if (credentials.sessionToken) {
          this.request.headers["x-amz-security-token"] = credentials.sessionToken;
        }
        this.request.headers["X-Amzn-Authorization"] = this.authorization(credentials, datetime);
      },
      authorization: function authorization(credentials) {
        return "AWS3 AWSAccessKeyId=" + credentials.accessKeyId + ",Algorithm=HmacSHA256,SignedHeaders=" + this.signedHeaders() + ",Signature=" + this.signature(credentials);
      },
      signedHeaders: function signedHeaders() {
        var headers = [];
        AWS2.util.arrayEach(this.headersToSign(), function iterator(h) {
          headers.push(h.toLowerCase());
        });
        return headers.sort().join(";");
      },
      canonicalHeaders: function canonicalHeaders() {
        var headers = this.request.headers;
        var parts = [];
        AWS2.util.arrayEach(this.headersToSign(), function iterator(h) {
          parts.push(h.toLowerCase().trim() + ":" + String(headers[h]).trim());
        });
        return parts.sort().join("\n") + "\n";
      },
      headersToSign: function headersToSign() {
        var headers = [];
        AWS2.util.each(this.request.headers, function iterator(k) {
          if (k === "Host" || k === "Content-Encoding" || k.match(/^X-Amz/i)) {
            headers.push(k);
          }
        });
        return headers;
      },
      signature: function signature(credentials) {
        return AWS2.util.crypto.hmac(credentials.secretAccessKey, this.stringToSign(), "base64");
      },
      stringToSign: function stringToSign() {
        var parts = [];
        parts.push(this.request.method);
        parts.push("/");
        parts.push("");
        parts.push(this.canonicalHeaders());
        parts.push(this.request.body);
        return AWS2.util.crypto.sha256(parts.join("\n"));
      }
    });
    module2.exports = AWS2.Signers.V3;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/v3https.js
var require_v3https = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/v3https.js"(exports, module2) {
    var AWS2 = require_core();
    var inherit = AWS2.util.inherit;
    require_v3();
    AWS2.Signers.V3Https = inherit(AWS2.Signers.V3, {
      authorization: function authorization(credentials) {
        return "AWS3-HTTPS AWSAccessKeyId=" + credentials.accessKeyId + ",Algorithm=HmacSHA256,Signature=" + this.signature(credentials);
      },
      stringToSign: function stringToSign() {
        return this.request.headers["X-Amz-Date"];
      }
    });
    module2.exports = AWS2.Signers.V3Https;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/v4_credentials.js
var require_v4_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/v4_credentials.js"(exports, module2) {
    var AWS2 = require_core();
    var cachedSecret = {};
    var cacheQueue = [];
    var maxCacheEntries = 50;
    var v4Identifier = "aws4_request";
    module2.exports = {
      /**
       * @api private
       *
       * @param date [String]
       * @param region [String]
       * @param serviceName [String]
       * @return [String]
       */
      createScope: function createScope(date, region, serviceName) {
        return [
          date.substr(0, 8),
          region,
          serviceName,
          v4Identifier
        ].join("/");
      },
      /**
       * @api private
       *
       * @param credentials [Credentials]
       * @param date [String]
       * @param region [String]
       * @param service [String]
       * @param shouldCache [Boolean]
       * @return [String]
       */
      getSigningKey: function getSigningKey(credentials, date, region, service, shouldCache) {
        var credsIdentifier = AWS2.util.crypto.hmac(credentials.secretAccessKey, credentials.accessKeyId, "base64");
        var cacheKey = [credsIdentifier, date, region, service].join("_");
        shouldCache = shouldCache !== false;
        if (shouldCache && cacheKey in cachedSecret) {
          return cachedSecret[cacheKey];
        }
        var kDate = AWS2.util.crypto.hmac(
          "AWS4" + credentials.secretAccessKey,
          date,
          "buffer"
        );
        var kRegion = AWS2.util.crypto.hmac(kDate, region, "buffer");
        var kService = AWS2.util.crypto.hmac(kRegion, service, "buffer");
        var signingKey = AWS2.util.crypto.hmac(kService, v4Identifier, "buffer");
        if (shouldCache) {
          cachedSecret[cacheKey] = signingKey;
          cacheQueue.push(cacheKey);
          if (cacheQueue.length > maxCacheEntries) {
            delete cachedSecret[cacheQueue.shift()];
          }
        }
        return signingKey;
      },
      /**
       * @api private
       *
       * Empties the derived signing key cache. Made available for testing purposes
       * only.
       */
      emptyCache: function emptyCache() {
        cachedSecret = {};
        cacheQueue = [];
      }
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/v4.js
var require_v4 = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/v4.js"(exports, module2) {
    var AWS2 = require_core();
    var v4Credentials = require_v4_credentials();
    var inherit = AWS2.util.inherit;
    var expiresHeader = "presigned-expires";
    AWS2.Signers.V4 = inherit(AWS2.Signers.RequestSigner, {
      constructor: function V4(request, serviceName, options) {
        AWS2.Signers.RequestSigner.call(this, request);
        this.serviceName = serviceName;
        options = options || {};
        this.signatureCache = typeof options.signatureCache === "boolean" ? options.signatureCache : true;
        this.operation = options.operation;
        this.signatureVersion = options.signatureVersion;
      },
      algorithm: "AWS4-HMAC-SHA256",
      addAuthorization: function addAuthorization(credentials, date) {
        var datetime = AWS2.util.date.iso8601(date).replace(/[:\-]|\.\d{3}/g, "");
        if (this.isPresigned()) {
          this.updateForPresigned(credentials, datetime);
        } else {
          this.addHeaders(credentials, datetime);
        }
        this.request.headers["Authorization"] = this.authorization(credentials, datetime);
      },
      addHeaders: function addHeaders(credentials, datetime) {
        this.request.headers["X-Amz-Date"] = datetime;
        if (credentials.sessionToken) {
          this.request.headers["x-amz-security-token"] = credentials.sessionToken;
        }
      },
      updateForPresigned: function updateForPresigned(credentials, datetime) {
        var credString = this.credentialString(datetime);
        var qs = {
          "X-Amz-Date": datetime,
          "X-Amz-Algorithm": this.algorithm,
          "X-Amz-Credential": credentials.accessKeyId + "/" + credString,
          "X-Amz-Expires": this.request.headers[expiresHeader],
          "X-Amz-SignedHeaders": this.signedHeaders()
        };
        if (credentials.sessionToken) {
          qs["X-Amz-Security-Token"] = credentials.sessionToken;
        }
        if (this.request.headers["Content-Type"]) {
          qs["Content-Type"] = this.request.headers["Content-Type"];
        }
        if (this.request.headers["Content-MD5"]) {
          qs["Content-MD5"] = this.request.headers["Content-MD5"];
        }
        if (this.request.headers["Cache-Control"]) {
          qs["Cache-Control"] = this.request.headers["Cache-Control"];
        }
        AWS2.util.each.call(this, this.request.headers, function(key, value) {
          if (key === expiresHeader)
            return;
          if (this.isSignableHeader(key)) {
            var lowerKey = key.toLowerCase();
            if (lowerKey.indexOf("x-amz-meta-") === 0) {
              qs[lowerKey] = value;
            } else if (lowerKey.indexOf("x-amz-") === 0) {
              qs[key] = value;
            }
          }
        });
        var sep = this.request.path.indexOf("?") >= 0 ? "&" : "?";
        this.request.path += sep + AWS2.util.queryParamsToString(qs);
      },
      authorization: function authorization(credentials, datetime) {
        var parts = [];
        var credString = this.credentialString(datetime);
        parts.push(this.algorithm + " Credential=" + credentials.accessKeyId + "/" + credString);
        parts.push("SignedHeaders=" + this.signedHeaders());
        parts.push("Signature=" + this.signature(credentials, datetime));
        return parts.join(", ");
      },
      signature: function signature(credentials, datetime) {
        var signingKey = v4Credentials.getSigningKey(
          credentials,
          datetime.substr(0, 8),
          this.request.region,
          this.serviceName,
          this.signatureCache
        );
        return AWS2.util.crypto.hmac(signingKey, this.stringToSign(datetime), "hex");
      },
      stringToSign: function stringToSign(datetime) {
        var parts = [];
        parts.push("AWS4-HMAC-SHA256");
        parts.push(datetime);
        parts.push(this.credentialString(datetime));
        parts.push(this.hexEncodedHash(this.canonicalString()));
        return parts.join("\n");
      },
      canonicalString: function canonicalString() {
        var parts = [], pathname = this.request.pathname();
        if (this.serviceName !== "s3" && this.signatureVersion !== "s3v4")
          pathname = AWS2.util.uriEscapePath(pathname);
        parts.push(this.request.method);
        parts.push(pathname);
        parts.push(this.request.search());
        parts.push(this.canonicalHeaders() + "\n");
        parts.push(this.signedHeaders());
        parts.push(this.hexEncodedBodyHash());
        return parts.join("\n");
      },
      canonicalHeaders: function canonicalHeaders() {
        var headers = [];
        AWS2.util.each.call(this, this.request.headers, function(key, item) {
          headers.push([key, item]);
        });
        headers.sort(function(a, b) {
          return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1;
        });
        var parts = [];
        AWS2.util.arrayEach.call(this, headers, function(item) {
          var key = item[0].toLowerCase();
          if (this.isSignableHeader(key)) {
            var value = item[1];
            if (typeof value === "undefined" || value === null || typeof value.toString !== "function") {
              throw AWS2.util.error(new Error("Header " + key + " contains invalid value"), {
                code: "InvalidHeader"
              });
            }
            parts.push(key + ":" + this.canonicalHeaderValues(value.toString()));
          }
        });
        return parts.join("\n");
      },
      canonicalHeaderValues: function canonicalHeaderValues(values) {
        return values.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
      },
      signedHeaders: function signedHeaders() {
        var keys = [];
        AWS2.util.each.call(this, this.request.headers, function(key) {
          key = key.toLowerCase();
          if (this.isSignableHeader(key))
            keys.push(key);
        });
        return keys.sort().join(";");
      },
      credentialString: function credentialString(datetime) {
        return v4Credentials.createScope(
          datetime.substr(0, 8),
          this.request.region,
          this.serviceName
        );
      },
      hexEncodedHash: function hash(string) {
        return AWS2.util.crypto.sha256(string, "hex");
      },
      hexEncodedBodyHash: function hexEncodedBodyHash() {
        var request = this.request;
        if (this.isPresigned() && ["s3", "s3-object-lambda"].indexOf(this.serviceName) > -1 && !request.body) {
          return "UNSIGNED-PAYLOAD";
        } else if (request.headers["X-Amz-Content-Sha256"]) {
          return request.headers["X-Amz-Content-Sha256"];
        } else {
          return this.hexEncodedHash(this.request.body || "");
        }
      },
      unsignableHeaders: [
        "authorization",
        "content-type",
        "content-length",
        "user-agent",
        expiresHeader,
        "expect",
        "x-amzn-trace-id"
      ],
      isSignableHeader: function isSignableHeader(key) {
        if (key.toLowerCase().indexOf("x-amz-") === 0)
          return true;
        return this.unsignableHeaders.indexOf(key) < 0;
      },
      isPresigned: function isPresigned() {
        return this.request.headers[expiresHeader] ? true : false;
      }
    });
    module2.exports = AWS2.Signers.V4;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/s3.js
var require_s3 = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/s3.js"(exports, module2) {
    var AWS2 = require_core();
    var inherit = AWS2.util.inherit;
    AWS2.Signers.S3 = inherit(AWS2.Signers.RequestSigner, {
      /**
       * When building the stringToSign, these sub resource params should be
       * part of the canonical resource string with their NON-decoded values
       */
      subResources: {
        "acl": 1,
        "accelerate": 1,
        "analytics": 1,
        "cors": 1,
        "lifecycle": 1,
        "delete": 1,
        "inventory": 1,
        "location": 1,
        "logging": 1,
        "metrics": 1,
        "notification": 1,
        "partNumber": 1,
        "policy": 1,
        "requestPayment": 1,
        "replication": 1,
        "restore": 1,
        "tagging": 1,
        "torrent": 1,
        "uploadId": 1,
        "uploads": 1,
        "versionId": 1,
        "versioning": 1,
        "versions": 1,
        "website": 1
      },
      // when building the stringToSign, these querystring params should be
      // part of the canonical resource string with their NON-encoded values
      responseHeaders: {
        "response-content-type": 1,
        "response-content-language": 1,
        "response-expires": 1,
        "response-cache-control": 1,
        "response-content-disposition": 1,
        "response-content-encoding": 1
      },
      addAuthorization: function addAuthorization(credentials, date) {
        if (!this.request.headers["presigned-expires"]) {
          this.request.headers["X-Amz-Date"] = AWS2.util.date.rfc822(date);
        }
        if (credentials.sessionToken) {
          this.request.headers["x-amz-security-token"] = credentials.sessionToken;
        }
        var signature = this.sign(credentials.secretAccessKey, this.stringToSign());
        var auth = "AWS " + credentials.accessKeyId + ":" + signature;
        this.request.headers["Authorization"] = auth;
      },
      stringToSign: function stringToSign() {
        var r = this.request;
        var parts = [];
        parts.push(r.method);
        parts.push(r.headers["Content-MD5"] || "");
        parts.push(r.headers["Content-Type"] || "");
        parts.push(r.headers["presigned-expires"] || "");
        var headers = this.canonicalizedAmzHeaders();
        if (headers)
          parts.push(headers);
        parts.push(this.canonicalizedResource());
        return parts.join("\n");
      },
      canonicalizedAmzHeaders: function canonicalizedAmzHeaders() {
        var amzHeaders = [];
        AWS2.util.each(this.request.headers, function(name) {
          if (name.match(/^x-amz-/i))
            amzHeaders.push(name);
        });
        amzHeaders.sort(function(a, b) {
          return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
        });
        var parts = [];
        AWS2.util.arrayEach.call(this, amzHeaders, function(name) {
          parts.push(name.toLowerCase() + ":" + String(this.request.headers[name]));
        });
        return parts.join("\n");
      },
      canonicalizedResource: function canonicalizedResource() {
        var r = this.request;
        var parts = r.path.split("?");
        var path = parts[0];
        var querystring = parts[1];
        var resource = "";
        if (r.virtualHostedBucket)
          resource += "/" + r.virtualHostedBucket;
        resource += path;
        if (querystring) {
          var resources = [];
          AWS2.util.arrayEach.call(this, querystring.split("&"), function(param) {
            var name = param.split("=")[0];
            var value = param.split("=")[1];
            if (this.subResources[name] || this.responseHeaders[name]) {
              var subresource = { name };
              if (value !== void 0) {
                if (this.subResources[name]) {
                  subresource.value = value;
                } else {
                  subresource.value = decodeURIComponent(value);
                }
              }
              resources.push(subresource);
            }
          });
          resources.sort(function(a, b) {
            return a.name < b.name ? -1 : 1;
          });
          if (resources.length) {
            querystring = [];
            AWS2.util.arrayEach(resources, function(res) {
              if (res.value === void 0) {
                querystring.push(res.name);
              } else {
                querystring.push(res.name + "=" + res.value);
              }
            });
            resource += "?" + querystring.join("&");
          }
        }
        return resource;
      },
      sign: function sign(secret, string) {
        return AWS2.util.crypto.hmac(secret, string, "base64", "sha1");
      }
    });
    module2.exports = AWS2.Signers.S3;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/presign.js
var require_presign = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/presign.js"(exports, module2) {
    var AWS2 = require_core();
    var inherit = AWS2.util.inherit;
    var expiresHeader = "presigned-expires";
    function signedUrlBuilder(request) {
      var expires = request.httpRequest.headers[expiresHeader];
      var signerClass = request.service.getSignerClass(request);
      delete request.httpRequest.headers["User-Agent"];
      delete request.httpRequest.headers["X-Amz-User-Agent"];
      if (signerClass === AWS2.Signers.V4) {
        if (expires > 604800) {
          var message = "Presigning does not support expiry time greater than a week with SigV4 signing.";
          throw AWS2.util.error(new Error(), {
            code: "InvalidExpiryTime",
            message,
            retryable: false
          });
        }
        request.httpRequest.headers[expiresHeader] = expires;
      } else if (signerClass === AWS2.Signers.S3) {
        var now = request.service ? request.service.getSkewCorrectedDate() : AWS2.util.date.getDate();
        request.httpRequest.headers[expiresHeader] = parseInt(
          AWS2.util.date.unixTimestamp(now) + expires,
          10
        ).toString();
      } else {
        throw AWS2.util.error(new Error(), {
          message: "Presigning only supports S3 or SigV4 signing.",
          code: "UnsupportedSigner",
          retryable: false
        });
      }
    }
    function signedUrlSigner(request) {
      var endpoint = request.httpRequest.endpoint;
      var parsedUrl = AWS2.util.urlParse(request.httpRequest.path);
      var queryParams = {};
      if (parsedUrl.search) {
        queryParams = AWS2.util.queryStringParse(parsedUrl.search.substr(1));
      }
      var auth = request.httpRequest.headers["Authorization"].split(" ");
      if (auth[0] === "AWS") {
        auth = auth[1].split(":");
        queryParams["Signature"] = auth.pop();
        queryParams["AWSAccessKeyId"] = auth.join(":");
        AWS2.util.each(request.httpRequest.headers, function(key, value) {
          if (key === expiresHeader)
            key = "Expires";
          if (key.indexOf("x-amz-meta-") === 0) {
            delete queryParams[key];
            key = key.toLowerCase();
          }
          queryParams[key] = value;
        });
        delete request.httpRequest.headers[expiresHeader];
        delete queryParams["Authorization"];
        delete queryParams["Host"];
      } else if (auth[0] === "AWS4-HMAC-SHA256") {
        auth.shift();
        var rest = auth.join(" ");
        var signature = rest.match(/Signature=(.*?)(?:,|\s|\r?\n|$)/)[1];
        queryParams["X-Amz-Signature"] = signature;
        delete queryParams["Expires"];
      }
      endpoint.pathname = parsedUrl.pathname;
      endpoint.search = AWS2.util.queryParamsToString(queryParams);
    }
    AWS2.Signers.Presign = inherit({
      /**
       * @api private
       */
      sign: function sign(request, expireTime, callback) {
        request.httpRequest.headers[expiresHeader] = expireTime || 3600;
        request.on("build", signedUrlBuilder);
        request.on("sign", signedUrlSigner);
        request.removeListener(
          "afterBuild",
          AWS2.EventListeners.Core.SET_CONTENT_LENGTH
        );
        request.removeListener(
          "afterBuild",
          AWS2.EventListeners.Core.COMPUTE_SHA256
        );
        request.emit("beforePresign", [request]);
        if (callback) {
          request.build(function() {
            if (this.response.error)
              callback(this.response.error);
            else {
              callback(null, AWS2.util.urlFormat(request.httpRequest.endpoint));
            }
          });
        } else {
          request.build();
          if (request.response.error)
            throw request.response.error;
          return AWS2.util.urlFormat(request.httpRequest.endpoint);
        }
      }
    });
    module2.exports = AWS2.Signers.Presign;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/bearer.js
var require_bearer = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/bearer.js"() {
    var AWS2 = require_core();
    AWS2.Signers.Bearer = AWS2.util.inherit(AWS2.Signers.RequestSigner, {
      constructor: function Bearer(request) {
        AWS2.Signers.RequestSigner.call(this, request);
      },
      addAuthorization: function addAuthorization(token) {
        this.request.headers["Authorization"] = "Bearer " + token.token;
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/request_signer.js
var require_request_signer = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/signers/request_signer.js"() {
    var AWS2 = require_core();
    var inherit = AWS2.util.inherit;
    AWS2.Signers.RequestSigner = inherit({
      constructor: function RequestSigner(request) {
        this.request = request;
      },
      setServiceClientId: function setServiceClientId(id) {
        this.serviceClientId = id;
      },
      getServiceClientId: function getServiceClientId() {
        return this.serviceClientId;
      }
    });
    AWS2.Signers.RequestSigner.getVersion = function getVersion(version) {
      switch (version) {
        case "v2":
          return AWS2.Signers.V2;
        case "v3":
          return AWS2.Signers.V3;
        case "s3v4":
          return AWS2.Signers.V4;
        case "v4":
          return AWS2.Signers.V4;
        case "s3":
          return AWS2.Signers.S3;
        case "v3https":
          return AWS2.Signers.V3Https;
        case "bearer":
          return AWS2.Signers.Bearer;
      }
      throw new Error("Unknown signing version " + version);
    };
    require_v2();
    require_v3();
    require_v3https();
    require_v4();
    require_s3();
    require_presign();
    require_bearer();
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/param_validator.js
var require_param_validator = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/param_validator.js"() {
    var AWS2 = require_core();
    AWS2.ParamValidator = AWS2.util.inherit({
      /**
       * Create a new validator object.
       *
       * @param validation [Boolean|map] whether input parameters should be
       *     validated against the operation description before sending the
       *     request. Pass a map to enable any of the following specific
       *     validation features:
       *
       *     * **min** [Boolean] &mdash; Validates that a value meets the min
       *       constraint. This is enabled by default when paramValidation is set
       *       to `true`.
       *     * **max** [Boolean] &mdash; Validates that a value meets the max
       *       constraint.
       *     * **pattern** [Boolean] &mdash; Validates that a string value matches a
       *       regular expression.
       *     * **enum** [Boolean] &mdash; Validates that a string value matches one
       *       of the allowable enum values.
       */
      constructor: function ParamValidator(validation) {
        if (validation === true || validation === void 0) {
          validation = { "min": true };
        }
        this.validation = validation;
      },
      validate: function validate(shape, params, context) {
        this.errors = [];
        this.validateMember(shape, params || {}, context || "params");
        if (this.errors.length > 1) {
          var msg = this.errors.join("\n* ");
          msg = "There were " + this.errors.length + " validation errors:\n* " + msg;
          throw AWS2.util.error(
            new Error(msg),
            { code: "MultipleValidationErrors", errors: this.errors }
          );
        } else if (this.errors.length === 1) {
          throw this.errors[0];
        } else {
          return true;
        }
      },
      fail: function fail(code, message) {
        this.errors.push(AWS2.util.error(new Error(message), { code }));
      },
      validateStructure: function validateStructure(shape, params, context) {
        if (shape.isDocument)
          return true;
        this.validateType(params, context, ["object"], "structure");
        var paramName;
        for (var i = 0; shape.required && i < shape.required.length; i++) {
          paramName = shape.required[i];
          var value = params[paramName];
          if (value === void 0 || value === null) {
            this.fail(
              "MissingRequiredParameter",
              "Missing required key '" + paramName + "' in " + context
            );
          }
        }
        for (paramName in params) {
          if (!Object.prototype.hasOwnProperty.call(params, paramName))
            continue;
          var paramValue = params[paramName], memberShape = shape.members[paramName];
          if (memberShape !== void 0) {
            var memberContext = [context, paramName].join(".");
            this.validateMember(memberShape, paramValue, memberContext);
          } else if (paramValue !== void 0 && paramValue !== null) {
            this.fail(
              "UnexpectedParameter",
              "Unexpected key '" + paramName + "' found in " + context
            );
          }
        }
        return true;
      },
      validateMember: function validateMember(shape, param, context) {
        switch (shape.type) {
          case "structure":
            return this.validateStructure(shape, param, context);
          case "list":
            return this.validateList(shape, param, context);
          case "map":
            return this.validateMap(shape, param, context);
          default:
            return this.validateScalar(shape, param, context);
        }
      },
      validateList: function validateList(shape, params, context) {
        if (this.validateType(params, context, [Array])) {
          this.validateRange(shape, params.length, context, "list member count");
          for (var i = 0; i < params.length; i++) {
            this.validateMember(shape.member, params[i], context + "[" + i + "]");
          }
        }
      },
      validateMap: function validateMap(shape, params, context) {
        if (this.validateType(params, context, ["object"], "map")) {
          var mapCount = 0;
          for (var param in params) {
            if (!Object.prototype.hasOwnProperty.call(params, param))
              continue;
            this.validateMember(
              shape.key,
              param,
              context + "[key='" + param + "']"
            );
            this.validateMember(
              shape.value,
              params[param],
              context + "['" + param + "']"
            );
            mapCount++;
          }
          this.validateRange(shape, mapCount, context, "map member count");
        }
      },
      validateScalar: function validateScalar(shape, value, context) {
        switch (shape.type) {
          case null:
          case void 0:
          case "string":
            return this.validateString(shape, value, context);
          case "base64":
          case "binary":
            return this.validatePayload(value, context);
          case "integer":
          case "float":
            return this.validateNumber(shape, value, context);
          case "boolean":
            return this.validateType(value, context, ["boolean"]);
          case "timestamp":
            return this.validateType(
              value,
              context,
              [
                Date,
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/,
                "number"
              ],
              "Date object, ISO-8601 string, or a UNIX timestamp"
            );
          default:
            return this.fail("UnkownType", "Unhandled type " + shape.type + " for " + context);
        }
      },
      validateString: function validateString(shape, value, context) {
        var validTypes = ["string"];
        if (shape.isJsonValue) {
          validTypes = validTypes.concat(["number", "object", "boolean"]);
        }
        if (value !== null && this.validateType(value, context, validTypes)) {
          this.validateEnum(shape, value, context);
          this.validateRange(shape, value.length, context, "string length");
          this.validatePattern(shape, value, context);
          this.validateUri(shape, value, context);
        }
      },
      validateUri: function validateUri(shape, value, context) {
        if (shape["location"] === "uri") {
          if (value.length === 0) {
            this.fail("UriParameterError", 'Expected uri parameter to have length >= 1, but found "' + value + '" for ' + context);
          }
        }
      },
      validatePattern: function validatePattern(shape, value, context) {
        if (this.validation["pattern"] && shape["pattern"] !== void 0) {
          if (!new RegExp(shape["pattern"]).test(value)) {
            this.fail("PatternMatchError", 'Provided value "' + value + '" does not match regex pattern /' + shape["pattern"] + "/ for " + context);
          }
        }
      },
      validateRange: function validateRange(shape, value, context, descriptor) {
        if (this.validation["min"]) {
          if (shape["min"] !== void 0 && value < shape["min"]) {
            this.fail("MinRangeError", "Expected " + descriptor + " >= " + shape["min"] + ", but found " + value + " for " + context);
          }
        }
        if (this.validation["max"]) {
          if (shape["max"] !== void 0 && value > shape["max"]) {
            this.fail("MaxRangeError", "Expected " + descriptor + " <= " + shape["max"] + ", but found " + value + " for " + context);
          }
        }
      },
      validateEnum: function validateRange(shape, value, context) {
        if (this.validation["enum"] && shape["enum"] !== void 0) {
          if (shape["enum"].indexOf(value) === -1) {
            this.fail("EnumError", "Found string value of " + value + ", but expected " + shape["enum"].join("|") + " for " + context);
          }
        }
      },
      validateType: function validateType(value, context, acceptedTypes, type) {
        if (value === null || value === void 0)
          return false;
        var foundInvalidType = false;
        for (var i = 0; i < acceptedTypes.length; i++) {
          if (typeof acceptedTypes[i] === "string") {
            if (typeof value === acceptedTypes[i])
              return true;
          } else if (acceptedTypes[i] instanceof RegExp) {
            if ((value || "").toString().match(acceptedTypes[i]))
              return true;
          } else {
            if (value instanceof acceptedTypes[i])
              return true;
            if (AWS2.util.isType(value, acceptedTypes[i]))
              return true;
            if (!type && !foundInvalidType)
              acceptedTypes = acceptedTypes.slice();
            acceptedTypes[i] = AWS2.util.typeName(acceptedTypes[i]);
          }
          foundInvalidType = true;
        }
        var acceptedType = type;
        if (!acceptedType) {
          acceptedType = acceptedTypes.join(", ").replace(/,([^,]+)$/, ", or$1");
        }
        var vowel = acceptedType.match(/^[aeiou]/i) ? "n" : "";
        this.fail("InvalidParameterType", "Expected " + context + " to be a" + vowel + " " + acceptedType);
        return false;
      },
      validateNumber: function validateNumber(shape, value, context) {
        if (value === null || value === void 0)
          return;
        if (typeof value === "string") {
          var castedValue = parseFloat(value);
          if (castedValue.toString() === value)
            value = castedValue;
        }
        if (this.validateType(value, context, ["number"])) {
          this.validateRange(shape, value, context, "numeric value");
        }
      },
      validatePayload: function validatePayload(value, context) {
        if (value === null || value === void 0)
          return;
        if (typeof value === "string")
          return;
        if (value && typeof value.byteLength === "number")
          return;
        if (AWS2.util.isNode()) {
          var Stream = AWS2.util.stream.Stream;
          if (AWS2.util.Buffer.isBuffer(value) || value instanceof Stream)
            return;
        } else {
          if (typeof Blob !== void 0 && value instanceof Blob)
            return;
        }
        var types = ["Buffer", "Stream", "File", "Blob", "ArrayBuffer", "DataView"];
        if (value) {
          for (var i = 0; i < types.length; i++) {
            if (AWS2.util.isType(value, types[i]))
              return;
            if (AWS2.util.typeName(value.constructor) === types[i])
              return;
          }
        }
        this.fail("InvalidParameterType", "Expected " + context + " to be a string, Buffer, Stream, Blob, or typed array object");
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/maintenance_mode_message.js
var require_maintenance_mode_message = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/maintenance_mode_message.js"(exports, module2) {
    var warning = [
      "The AWS SDK for JavaScript (v2) will be put into maintenance mode in 2023.\n",
      "Please migrate your code to use AWS SDK for JavaScript (v3).",
      "For more information, check the migration guide at https://a.co/7PzMCcy"
    ].join("\n");
    module2.exports = {
      suppress: false
    };
    function emitWarning() {
      if (typeof process !== "undefined" && typeof process.emitWarning === "function") {
        process.emitWarning(warning, {
          type: "NOTE"
        });
      }
    }
    setTimeout(function() {
      if (!module2.exports.suppress) {
        emitWarning();
      }
    }, 0);
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/core.js
var require_core = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/core.js"(exports, module2) {
    var AWS2 = { util: require_util() };
    var _hidden = {};
    _hidden.toString();
    module2.exports = AWS2;
    AWS2.util.update(AWS2, {
      /**
       * @constant
       */
      VERSION: "2.1319.0",
      /**
       * @api private
       */
      Signers: {},
      /**
       * @api private
       */
      Protocol: {
        Json: require_json(),
        Query: require_query(),
        Rest: require_rest(),
        RestJson: require_rest_json(),
        RestXml: require_rest_xml()
      },
      /**
       * @api private
       */
      XML: {
        Builder: require_builder2(),
        Parser: null
        // conditionally set based on environment
      },
      /**
       * @api private
       */
      JSON: {
        Builder: require_builder(),
        Parser: require_parser()
      },
      /**
       * @api private
       */
      Model: {
        Api: require_api(),
        Operation: require_operation(),
        Shape: require_shape(),
        Paginator: require_paginator(),
        ResourceWaiter: require_resource_waiter()
      },
      /**
       * @api private
       */
      apiLoader: require_api_loader(),
      /**
       * @api private
       */
      EndpointCache: require_endpoint_cache().EndpointCache
    });
    require_sequential_executor();
    require_service();
    require_config();
    require_http();
    require_event_listeners();
    require_request();
    require_response();
    require_resource_waiter2();
    require_request_signer();
    require_param_validator();
    require_maintenance_mode_message();
    AWS2.events = new AWS2.SequentialExecutor();
    AWS2.util.memoizedProperty(AWS2, "endpointCache", function() {
      return new AWS2.EndpointCache(AWS2.config.endpointCacheSize);
    }, true);
  }
});

// node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/rng.js
var require_rng = __commonJS({
  "node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/rng.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = rng;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function rng() {
      return _crypto.default.randomBytes(16);
    }
  }
});

// node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/bytesToUuid.js
var require_bytesToUuid = __commonJS({
  "node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/bytesToUuid.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var byteToHex = [];
    for (i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 256).toString(16).substr(1);
    }
    var i;
    function bytesToUuid(buf, offset) {
      var i2 = offset || 0;
      var bth = byteToHex;
      return [bth[buf[i2++]], bth[buf[i2++]], bth[buf[i2++]], bth[buf[i2++]], "-", bth[buf[i2++]], bth[buf[i2++]], "-", bth[buf[i2++]], bth[buf[i2++]], "-", bth[buf[i2++]], bth[buf[i2++]], "-", bth[buf[i2++]], bth[buf[i2++]], bth[buf[i2++]], bth[buf[i2++]], bth[buf[i2++]], bth[buf[i2++]]].join("");
    }
    var _default = bytesToUuid;
    exports.default = _default;
  }
});

// node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/v1.js
var require_v1 = __commonJS({
  "node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/v1.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _rng = _interopRequireDefault(require_rng());
    var _bytesToUuid = _interopRequireDefault(require_bytesToUuid());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var _nodeId;
    var _clockseq;
    var _lastMSecs = 0;
    var _lastNSecs = 0;
    function v1(options, buf, offset) {
      var i = buf && offset || 0;
      var b = buf || [];
      options = options || {};
      var node = options.node || _nodeId;
      var clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
      if (node == null || clockseq == null) {
        var seedBytes = options.random || (options.rng || _rng.default)();
        if (node == null) {
          node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
        }
        if (clockseq == null) {
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
        }
      }
      var msecs = options.msecs !== void 0 ? options.msecs : (/* @__PURE__ */ new Date()).getTime();
      var nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
      var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
      if (dt < 0 && options.clockseq === void 0) {
        clockseq = clockseq + 1 & 16383;
      }
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
        nsecs = 0;
      }
      if (nsecs >= 1e4) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
      }
      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;
      msecs += 122192928e5;
      var tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
      b[i++] = tl >>> 24 & 255;
      b[i++] = tl >>> 16 & 255;
      b[i++] = tl >>> 8 & 255;
      b[i++] = tl & 255;
      var tmh = msecs / 4294967296 * 1e4 & 268435455;
      b[i++] = tmh >>> 8 & 255;
      b[i++] = tmh & 255;
      b[i++] = tmh >>> 24 & 15 | 16;
      b[i++] = tmh >>> 16 & 255;
      b[i++] = clockseq >>> 8 | 128;
      b[i++] = clockseq & 255;
      for (var n = 0; n < 6; ++n) {
        b[i + n] = node[n];
      }
      return buf ? buf : (0, _bytesToUuid.default)(b);
    }
    var _default = v1;
    exports.default = _default;
  }
});

// node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/v35.js
var require_v35 = __commonJS({
  "node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/v35.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = _default;
    exports.URL = exports.DNS = void 0;
    var _bytesToUuid = _interopRequireDefault(require_bytesToUuid());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function uuidToBytes(uuid) {
      var bytes = [];
      uuid.replace(/[a-fA-F0-9]{2}/g, function(hex) {
        bytes.push(parseInt(hex, 16));
      });
      return bytes;
    }
    function stringToBytes(str) {
      str = unescape(encodeURIComponent(str));
      var bytes = new Array(str.length);
      for (var i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
      }
      return bytes;
    }
    var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    exports.DNS = DNS;
    var URL2 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    exports.URL = URL2;
    function _default(name, version, hashfunc) {
      var generateUUID = function(value, namespace, buf, offset) {
        var off = buf && offset || 0;
        if (typeof value == "string")
          value = stringToBytes(value);
        if (typeof namespace == "string")
          namespace = uuidToBytes(namespace);
        if (!Array.isArray(value))
          throw TypeError("value must be an array of bytes");
        if (!Array.isArray(namespace) || namespace.length !== 16)
          throw TypeError("namespace must be uuid string or an Array of 16 byte values");
        var bytes = hashfunc(namespace.concat(value));
        bytes[6] = bytes[6] & 15 | version;
        bytes[8] = bytes[8] & 63 | 128;
        if (buf) {
          for (var idx = 0; idx < 16; ++idx) {
            buf[off + idx] = bytes[idx];
          }
        }
        return buf || (0, _bytesToUuid.default)(bytes);
      };
      try {
        generateUUID.name = name;
      } catch (err) {
      }
      generateUUID.DNS = DNS;
      generateUUID.URL = URL2;
      return generateUUID;
    }
  }
});

// node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/md5.js
var require_md5 = __commonJS({
  "node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/md5.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function md5(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("md5").update(bytes).digest();
    }
    var _default = md5;
    exports.default = _default;
  }
});

// node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/v3.js
var require_v32 = __commonJS({
  "node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/v3.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _v = _interopRequireDefault(require_v35());
    var _md = _interopRequireDefault(require_md5());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v3 = (0, _v.default)("v3", 48, _md.default);
    var _default = v3;
    exports.default = _default;
  }
});

// node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/v4.js
var require_v42 = __commonJS({
  "node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/v4.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _rng = _interopRequireDefault(require_rng());
    var _bytesToUuid = _interopRequireDefault(require_bytesToUuid());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function v4(options, buf, offset) {
      var i = buf && offset || 0;
      if (typeof options == "string") {
        buf = options === "binary" ? new Array(16) : null;
        options = null;
      }
      options = options || {};
      var rnds = options.random || (options.rng || _rng.default)();
      rnds[6] = rnds[6] & 15 | 64;
      rnds[8] = rnds[8] & 63 | 128;
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }
      return buf || (0, _bytesToUuid.default)(rnds);
    }
    var _default = v4;
    exports.default = _default;
  }
});

// node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/sha1.js
var require_sha1 = __commonJS({
  "node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/sha1.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function sha1(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("sha1").update(bytes).digest();
    }
    var _default = sha1;
    exports.default = _default;
  }
});

// node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/v5.js
var require_v5 = __commonJS({
  "node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/v5.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _v = _interopRequireDefault(require_v35());
    var _sha = _interopRequireDefault(require_sha1());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v5 = (0, _v.default)("v5", 80, _sha.default);
    var _default = v5;
    exports.default = _default;
  }
});

// node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/uuid@8.0.0/node_modules/uuid/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "v1", {
      enumerable: true,
      get: function() {
        return _v.default;
      }
    });
    Object.defineProperty(exports, "v3", {
      enumerable: true,
      get: function() {
        return _v2.default;
      }
    });
    Object.defineProperty(exports, "v4", {
      enumerable: true,
      get: function() {
        return _v3.default;
      }
    });
    Object.defineProperty(exports, "v5", {
      enumerable: true,
      get: function() {
        return _v4.default;
      }
    });
    var _v = _interopRequireDefault(require_v1());
    var _v2 = _interopRequireDefault(require_v32());
    var _v3 = _interopRequireDefault(require_v42());
    var _v4 = _interopRequireDefault(require_v5());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/util.js
var require_util = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/util.js"(exports, module2) {
    var AWS2;
    var util2 = {
      environment: "nodejs",
      engine: function engine() {
        if (util2.isBrowser() && typeof navigator !== "undefined") {
          return navigator.userAgent;
        } else {
          var engine2 = process.platform + "/" + process.version;
          if (process.env.AWS_EXECUTION_ENV) {
            engine2 += " exec-env/" + process.env.AWS_EXECUTION_ENV;
          }
          return engine2;
        }
      },
      userAgent: function userAgent() {
        var name = util2.environment;
        var agent = "aws-sdk-" + name + "/" + require_core().VERSION;
        if (name === "nodejs")
          agent += " " + util2.engine();
        return agent;
      },
      uriEscape: function uriEscape(string) {
        var output = encodeURIComponent(string);
        output = output.replace(/[^A-Za-z0-9_.~\-%]+/g, escape);
        output = output.replace(/[*]/g, function(ch) {
          return "%" + ch.charCodeAt(0).toString(16).toUpperCase();
        });
        return output;
      },
      uriEscapePath: function uriEscapePath(string) {
        var parts = [];
        util2.arrayEach(string.split("/"), function(part) {
          parts.push(util2.uriEscape(part));
        });
        return parts.join("/");
      },
      urlParse: function urlParse(url) {
        return util2.url.parse(url);
      },
      urlFormat: function urlFormat(url) {
        return util2.url.format(url);
      },
      queryStringParse: function queryStringParse(qs) {
        return util2.querystring.parse(qs);
      },
      queryParamsToString: function queryParamsToString(params) {
        var items = [];
        var escape2 = util2.uriEscape;
        var sortedKeys = Object.keys(params).sort();
        util2.arrayEach(sortedKeys, function(name) {
          var value = params[name];
          var ename = escape2(name);
          var result = ename + "=";
          if (Array.isArray(value)) {
            var vals = [];
            util2.arrayEach(value, function(item) {
              vals.push(escape2(item));
            });
            result = ename + "=" + vals.sort().join("&" + ename + "=");
          } else if (value !== void 0 && value !== null) {
            result = ename + "=" + escape2(value);
          }
          items.push(result);
        });
        return items.join("&");
      },
      readFileSync: function readFileSync(path) {
        if (util2.isBrowser())
          return null;
        return require("fs").readFileSync(path, "utf-8");
      },
      base64: {
        encode: function encode64(string) {
          if (typeof string === "number") {
            throw util2.error(new Error("Cannot base64 encode number " + string));
          }
          if (string === null || typeof string === "undefined") {
            return string;
          }
          var buf = util2.buffer.toBuffer(string);
          return buf.toString("base64");
        },
        decode: function decode64(string) {
          if (typeof string === "number") {
            throw util2.error(new Error("Cannot base64 decode number " + string));
          }
          if (string === null || typeof string === "undefined") {
            return string;
          }
          return util2.buffer.toBuffer(string, "base64");
        }
      },
      buffer: {
        /**
         * Buffer constructor for Node buffer and buffer pollyfill
         */
        toBuffer: function(data, encoding) {
          return typeof util2.Buffer.from === "function" && util2.Buffer.from !== Uint8Array.from ? util2.Buffer.from(data, encoding) : new util2.Buffer(data, encoding);
        },
        alloc: function(size, fill, encoding) {
          if (typeof size !== "number") {
            throw new Error("size passed to alloc must be a number.");
          }
          if (typeof util2.Buffer.alloc === "function") {
            return util2.Buffer.alloc(size, fill, encoding);
          } else {
            var buf = new util2.Buffer(size);
            if (fill !== void 0 && typeof buf.fill === "function") {
              buf.fill(fill, void 0, void 0, encoding);
            }
            return buf;
          }
        },
        toStream: function toStream(buffer) {
          if (!util2.Buffer.isBuffer(buffer))
            buffer = util2.buffer.toBuffer(buffer);
          var readable = new util2.stream.Readable();
          var pos = 0;
          readable._read = function(size) {
            if (pos >= buffer.length)
              return readable.push(null);
            var end = pos + size;
            if (end > buffer.length)
              end = buffer.length;
            readable.push(buffer.slice(pos, end));
            pos = end;
          };
          return readable;
        },
        /**
         * Concatenates a list of Buffer objects.
         */
        concat: function(buffers) {
          var length = 0, offset = 0, buffer = null, i;
          for (i = 0; i < buffers.length; i++) {
            length += buffers[i].length;
          }
          buffer = util2.buffer.alloc(length);
          for (i = 0; i < buffers.length; i++) {
            buffers[i].copy(buffer, offset);
            offset += buffers[i].length;
          }
          return buffer;
        }
      },
      string: {
        byteLength: function byteLength(string) {
          if (string === null || string === void 0)
            return 0;
          if (typeof string === "string")
            string = util2.buffer.toBuffer(string);
          if (typeof string.byteLength === "number") {
            return string.byteLength;
          } else if (typeof string.length === "number") {
            return string.length;
          } else if (typeof string.size === "number") {
            return string.size;
          } else if (typeof string.path === "string") {
            return require("fs").lstatSync(string.path).size;
          } else {
            throw util2.error(
              new Error("Cannot determine length of " + string),
              { object: string }
            );
          }
        },
        upperFirst: function upperFirst(string) {
          return string[0].toUpperCase() + string.substr(1);
        },
        lowerFirst: function lowerFirst(string) {
          return string[0].toLowerCase() + string.substr(1);
        }
      },
      ini: {
        parse: function string(ini) {
          var currentSection, map = {};
          util2.arrayEach(ini.split(/\r?\n/), function(line) {
            line = line.split(/(^|\s)[;#]/)[0].trim();
            var isSection = line[0] === "[" && line[line.length - 1] === "]";
            if (isSection) {
              currentSection = line.substring(1, line.length - 1);
              if (currentSection === "__proto__" || currentSection.split(/\s/)[1] === "__proto__") {
                throw util2.error(
                  new Error("Cannot load profile name '" + currentSection + "' from shared ini file.")
                );
              }
            } else if (currentSection) {
              var indexOfEqualsSign = line.indexOf("=");
              var start = 0;
              var end = line.length - 1;
              var isAssignment = indexOfEqualsSign !== -1 && indexOfEqualsSign !== start && indexOfEqualsSign !== end;
              if (isAssignment) {
                var name = line.substring(0, indexOfEqualsSign).trim();
                var value = line.substring(indexOfEqualsSign + 1).trim();
                map[currentSection] = map[currentSection] || {};
                map[currentSection][name] = value;
              }
            }
          });
          return map;
        }
      },
      fn: {
        noop: function() {
        },
        callback: function(err) {
          if (err)
            throw err;
        },
        /**
         * Turn a synchronous function into as "async" function by making it call
         * a callback. The underlying function is called with all but the last argument,
         * which is treated as the callback. The callback is passed passed a first argument
         * of null on success to mimick standard node callbacks.
         */
        makeAsync: function makeAsync(fn, expectedArgs) {
          if (expectedArgs && expectedArgs <= fn.length) {
            return fn;
          }
          return function() {
            var args = Array.prototype.slice.call(arguments, 0);
            var callback = args.pop();
            var result = fn.apply(null, args);
            callback(result);
          };
        }
      },
      /**
       * Date and time utility functions.
       */
      date: {
        /**
         * @return [Date] the current JavaScript date object. Since all
         *   AWS services rely on this date object, you can override
         *   this function to provide a special time value to AWS service
         *   requests.
         */
        getDate: function getDate() {
          if (!AWS2)
            AWS2 = require_core();
          if (AWS2.config.systemClockOffset) {
            return new Date((/* @__PURE__ */ new Date()).getTime() + AWS2.config.systemClockOffset);
          } else {
            return /* @__PURE__ */ new Date();
          }
        },
        /**
         * @return [String] the date in ISO-8601 format
         */
        iso8601: function iso8601(date) {
          if (date === void 0) {
            date = util2.date.getDate();
          }
          return date.toISOString().replace(/\.\d{3}Z$/, "Z");
        },
        /**
         * @return [String] the date in RFC 822 format
         */
        rfc822: function rfc822(date) {
          if (date === void 0) {
            date = util2.date.getDate();
          }
          return date.toUTCString();
        },
        /**
         * @return [Integer] the UNIX timestamp value for the current time
         */
        unixTimestamp: function unixTimestamp(date) {
          if (date === void 0) {
            date = util2.date.getDate();
          }
          return date.getTime() / 1e3;
        },
        /**
         * @param [String,number,Date] date
         * @return [Date]
         */
        from: function format(date) {
          if (typeof date === "number") {
            return new Date(date * 1e3);
          } else {
            return new Date(date);
          }
        },
        /**
         * Given a Date or date-like value, this function formats the
         * date into a string of the requested value.
         * @param [String,number,Date] date
         * @param [String] formatter Valid formats are:
         #   * 'iso8601'
         #   * 'rfc822'
         #   * 'unixTimestamp'
         * @return [String]
         */
        format: function format(date, formatter) {
          if (!formatter)
            formatter = "iso8601";
          return util2.date[formatter](util2.date.from(date));
        },
        parseTimestamp: function parseTimestamp(value) {
          if (typeof value === "number") {
            return new Date(value * 1e3);
          } else if (value.match(/^\d+$/)) {
            return new Date(value * 1e3);
          } else if (value.match(/^\d{4}/)) {
            return new Date(value);
          } else if (value.match(/^\w{3},/)) {
            return new Date(value);
          } else {
            throw util2.error(
              new Error("unhandled timestamp format: " + value),
              { code: "TimestampParserError" }
            );
          }
        }
      },
      crypto: {
        crc32Table: [
          0,
          1996959894,
          3993919788,
          2567524794,
          124634137,
          1886057615,
          3915621685,
          2657392035,
          249268274,
          2044508324,
          3772115230,
          2547177864,
          162941995,
          2125561021,
          3887607047,
          2428444049,
          498536548,
          1789927666,
          4089016648,
          2227061214,
          450548861,
          1843258603,
          4107580753,
          2211677639,
          325883990,
          1684777152,
          4251122042,
          2321926636,
          335633487,
          1661365465,
          4195302755,
          2366115317,
          997073096,
          1281953886,
          3579855332,
          2724688242,
          1006888145,
          1258607687,
          3524101629,
          2768942443,
          901097722,
          1119000684,
          3686517206,
          2898065728,
          853044451,
          1172266101,
          3705015759,
          2882616665,
          651767980,
          1373503546,
          3369554304,
          3218104598,
          565507253,
          1454621731,
          3485111705,
          3099436303,
          671266974,
          1594198024,
          3322730930,
          2970347812,
          795835527,
          1483230225,
          3244367275,
          3060149565,
          1994146192,
          31158534,
          2563907772,
          4023717930,
          1907459465,
          112637215,
          2680153253,
          3904427059,
          2013776290,
          251722036,
          2517215374,
          3775830040,
          2137656763,
          141376813,
          2439277719,
          3865271297,
          1802195444,
          476864866,
          2238001368,
          4066508878,
          1812370925,
          453092731,
          2181625025,
          4111451223,
          1706088902,
          314042704,
          2344532202,
          4240017532,
          1658658271,
          366619977,
          2362670323,
          4224994405,
          1303535960,
          984961486,
          2747007092,
          3569037538,
          1256170817,
          1037604311,
          2765210733,
          3554079995,
          1131014506,
          879679996,
          2909243462,
          3663771856,
          1141124467,
          855842277,
          2852801631,
          3708648649,
          1342533948,
          654459306,
          3188396048,
          3373015174,
          1466479909,
          544179635,
          3110523913,
          3462522015,
          1591671054,
          702138776,
          2966460450,
          3352799412,
          1504918807,
          783551873,
          3082640443,
          3233442989,
          3988292384,
          2596254646,
          62317068,
          1957810842,
          3939845945,
          2647816111,
          81470997,
          1943803523,
          3814918930,
          2489596804,
          225274430,
          2053790376,
          3826175755,
          2466906013,
          167816743,
          2097651377,
          4027552580,
          2265490386,
          503444072,
          1762050814,
          4150417245,
          2154129355,
          426522225,
          1852507879,
          4275313526,
          2312317920,
          282753626,
          1742555852,
          4189708143,
          2394877945,
          397917763,
          1622183637,
          3604390888,
          2714866558,
          953729732,
          1340076626,
          3518719985,
          2797360999,
          1068828381,
          1219638859,
          3624741850,
          2936675148,
          906185462,
          1090812512,
          3747672003,
          2825379669,
          829329135,
          1181335161,
          3412177804,
          3160834842,
          628085408,
          1382605366,
          3423369109,
          3138078467,
          570562233,
          1426400815,
          3317316542,
          2998733608,
          733239954,
          1555261956,
          3268935591,
          3050360625,
          752459403,
          1541320221,
          2607071920,
          3965973030,
          1969922972,
          40735498,
          2617837225,
          3943577151,
          1913087877,
          83908371,
          2512341634,
          3803740692,
          2075208622,
          213261112,
          2463272603,
          3855990285,
          2094854071,
          198958881,
          2262029012,
          4057260610,
          1759359992,
          534414190,
          2176718541,
          4139329115,
          1873836001,
          414664567,
          2282248934,
          4279200368,
          1711684554,
          285281116,
          2405801727,
          4167216745,
          1634467795,
          376229701,
          2685067896,
          3608007406,
          1308918612,
          956543938,
          2808555105,
          3495958263,
          1231636301,
          1047427035,
          2932959818,
          3654703836,
          1088359270,
          936918e3,
          2847714899,
          3736837829,
          1202900863,
          817233897,
          3183342108,
          3401237130,
          1404277552,
          615818150,
          3134207493,
          3453421203,
          1423857449,
          601450431,
          3009837614,
          3294710456,
          1567103746,
          711928724,
          3020668471,
          3272380065,
          1510334235,
          755167117
        ],
        crc32: function crc32(data) {
          var tbl = util2.crypto.crc32Table;
          var crc = 0 ^ -1;
          if (typeof data === "string") {
            data = util2.buffer.toBuffer(data);
          }
          for (var i = 0; i < data.length; i++) {
            var code = data.readUInt8(i);
            crc = crc >>> 8 ^ tbl[(crc ^ code) & 255];
          }
          return (crc ^ -1) >>> 0;
        },
        hmac: function hmac(key, string, digest, fn) {
          if (!digest)
            digest = "binary";
          if (digest === "buffer") {
            digest = void 0;
          }
          if (!fn)
            fn = "sha256";
          if (typeof string === "string")
            string = util2.buffer.toBuffer(string);
          return util2.crypto.lib.createHmac(fn, key).update(string).digest(digest);
        },
        md5: function md5(data, digest, callback) {
          return util2.crypto.hash("md5", data, digest, callback);
        },
        sha256: function sha256(data, digest, callback) {
          return util2.crypto.hash("sha256", data, digest, callback);
        },
        hash: function(algorithm, data, digest, callback) {
          var hash = util2.crypto.createHash(algorithm);
          if (!digest) {
            digest = "binary";
          }
          if (digest === "buffer") {
            digest = void 0;
          }
          if (typeof data === "string")
            data = util2.buffer.toBuffer(data);
          var sliceFn = util2.arraySliceFn(data);
          var isBuffer = util2.Buffer.isBuffer(data);
          if (util2.isBrowser() && typeof ArrayBuffer !== "undefined" && data && data.buffer instanceof ArrayBuffer)
            isBuffer = true;
          if (callback && typeof data === "object" && typeof data.on === "function" && !isBuffer) {
            data.on("data", function(chunk) {
              hash.update(chunk);
            });
            data.on("error", function(err) {
              callback(err);
            });
            data.on("end", function() {
              callback(null, hash.digest(digest));
            });
          } else if (callback && sliceFn && !isBuffer && typeof FileReader !== "undefined") {
            var index = 0, size = 1024 * 512;
            var reader = new FileReader();
            reader.onerror = function() {
              callback(new Error("Failed to read data."));
            };
            reader.onload = function() {
              var buf = new util2.Buffer(new Uint8Array(reader.result));
              hash.update(buf);
              index += buf.length;
              reader._continueReading();
            };
            reader._continueReading = function() {
              if (index >= data.size) {
                callback(null, hash.digest(digest));
                return;
              }
              var back = index + size;
              if (back > data.size)
                back = data.size;
              reader.readAsArrayBuffer(sliceFn.call(data, index, back));
            };
            reader._continueReading();
          } else {
            if (util2.isBrowser() && typeof data === "object" && !isBuffer) {
              data = new util2.Buffer(new Uint8Array(data));
            }
            var out = hash.update(data).digest(digest);
            if (callback)
              callback(null, out);
            return out;
          }
        },
        toHex: function toHex(data) {
          var out = [];
          for (var i = 0; i < data.length; i++) {
            out.push(("0" + data.charCodeAt(i).toString(16)).substr(-2, 2));
          }
          return out.join("");
        },
        createHash: function createHash(algorithm) {
          return util2.crypto.lib.createHash(algorithm);
        }
      },
      /** @!ignore */
      /* Abort constant */
      abort: {},
      each: function each(object, iterFunction) {
        for (var key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            var ret = iterFunction.call(this, key, object[key]);
            if (ret === util2.abort)
              break;
          }
        }
      },
      arrayEach: function arrayEach(array, iterFunction) {
        for (var idx in array) {
          if (Object.prototype.hasOwnProperty.call(array, idx)) {
            var ret = iterFunction.call(this, array[idx], parseInt(idx, 10));
            if (ret === util2.abort)
              break;
          }
        }
      },
      update: function update(obj1, obj2) {
        util2.each(obj2, function iterator(key, item) {
          obj1[key] = item;
        });
        return obj1;
      },
      merge: function merge(obj1, obj2) {
        return util2.update(util2.copy(obj1), obj2);
      },
      copy: function copy(object) {
        if (object === null || object === void 0)
          return object;
        var dupe = {};
        for (var key in object) {
          dupe[key] = object[key];
        }
        return dupe;
      },
      isEmpty: function isEmpty(obj) {
        for (var prop in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
          }
        }
        return true;
      },
      arraySliceFn: function arraySliceFn(obj) {
        var fn = obj.slice || obj.webkitSlice || obj.mozSlice;
        return typeof fn === "function" ? fn : null;
      },
      isType: function isType(obj, type) {
        if (typeof type === "function")
          type = util2.typeName(type);
        return Object.prototype.toString.call(obj) === "[object " + type + "]";
      },
      typeName: function typeName(type) {
        if (Object.prototype.hasOwnProperty.call(type, "name"))
          return type.name;
        var str = type.toString();
        var match = str.match(/^\s*function (.+)\(/);
        return match ? match[1] : str;
      },
      error: function error(err, options) {
        var originalError = null;
        if (typeof err.message === "string" && err.message !== "") {
          if (typeof options === "string" || options && options.message) {
            originalError = util2.copy(err);
            originalError.message = err.message;
          }
        }
        err.message = err.message || null;
        if (typeof options === "string") {
          err.message = options;
        } else if (typeof options === "object" && options !== null) {
          util2.update(err, options);
          if (options.message)
            err.message = options.message;
          if (options.code || options.name)
            err.code = options.code || options.name;
          if (options.stack)
            err.stack = options.stack;
        }
        if (typeof Object.defineProperty === "function") {
          Object.defineProperty(err, "name", { writable: true, enumerable: false });
          Object.defineProperty(err, "message", { enumerable: true });
        }
        err.name = String(options && options.name || err.name || err.code || "Error");
        err.time = /* @__PURE__ */ new Date();
        if (originalError)
          err.originalError = originalError;
        return err;
      },
      /**
       * @api private
       */
      inherit: function inherit(klass, features) {
        var newObject = null;
        if (features === void 0) {
          features = klass;
          klass = Object;
          newObject = {};
        } else {
          var ctor = function ConstructorWrapper() {
          };
          ctor.prototype = klass.prototype;
          newObject = new ctor();
        }
        if (features.constructor === Object) {
          features.constructor = function() {
            if (klass !== Object) {
              return klass.apply(this, arguments);
            }
          };
        }
        features.constructor.prototype = newObject;
        util2.update(features.constructor.prototype, features);
        features.constructor.__super__ = klass;
        return features.constructor;
      },
      /**
       * @api private
       */
      mixin: function mixin() {
        var klass = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
          for (var prop in arguments[i].prototype) {
            var fn = arguments[i].prototype[prop];
            if (prop !== "constructor") {
              klass.prototype[prop] = fn;
            }
          }
        }
        return klass;
      },
      /**
       * @api private
       */
      hideProperties: function hideProperties(obj, props) {
        if (typeof Object.defineProperty !== "function")
          return;
        util2.arrayEach(props, function(key) {
          Object.defineProperty(obj, key, {
            enumerable: false,
            writable: true,
            configurable: true
          });
        });
      },
      /**
       * @api private
       */
      property: function property(obj, name, value, enumerable, isValue) {
        var opts = {
          configurable: true,
          enumerable: enumerable !== void 0 ? enumerable : true
        };
        if (typeof value === "function" && !isValue) {
          opts.get = value;
        } else {
          opts.value = value;
          opts.writable = true;
        }
        Object.defineProperty(obj, name, opts);
      },
      /**
       * @api private
       */
      memoizedProperty: function memoizedProperty(obj, name, get, enumerable) {
        var cachedValue = null;
        util2.property(obj, name, function() {
          if (cachedValue === null) {
            cachedValue = get();
          }
          return cachedValue;
        }, enumerable);
      },
      /**
       * TODO Remove in major version revision
       * This backfill populates response data without the
       * top-level payload name.
       *
       * @api private
       */
      hoistPayloadMember: function hoistPayloadMember(resp) {
        var req = resp.request;
        var operationName = req.operation;
        var operation = req.service.api.operations[operationName];
        var output = operation.output;
        if (output.payload && !operation.hasEventOutput) {
          var payloadMember = output.members[output.payload];
          var responsePayload = resp.data[output.payload];
          if (payloadMember.type === "structure") {
            util2.each(responsePayload, function(key, value) {
              util2.property(resp.data, key, value, false);
            });
          }
        }
      },
      /**
       * Compute SHA-256 checksums of streams
       *
       * @api private
       */
      computeSha256: function computeSha256(body, done) {
        if (util2.isNode()) {
          var Stream = util2.stream.Stream;
          var fs = require("fs");
          if (typeof Stream === "function" && body instanceof Stream) {
            if (typeof body.path === "string") {
              var settings = {};
              if (typeof body.start === "number") {
                settings.start = body.start;
              }
              if (typeof body.end === "number") {
                settings.end = body.end;
              }
              body = fs.createReadStream(body.path, settings);
            } else {
              return done(new Error("Non-file stream objects are not supported with SigV4"));
            }
          }
        }
        util2.crypto.sha256(body, "hex", function(err, sha) {
          if (err)
            done(err);
          else
            done(null, sha);
        });
      },
      /**
       * @api private
       */
      isClockSkewed: function isClockSkewed(serverTime) {
        if (serverTime) {
          util2.property(
            AWS2.config,
            "isClockSkewed",
            Math.abs((/* @__PURE__ */ new Date()).getTime() - serverTime) >= 3e5,
            false
          );
          return AWS2.config.isClockSkewed;
        }
      },
      applyClockOffset: function applyClockOffset(serverTime) {
        if (serverTime)
          AWS2.config.systemClockOffset = serverTime - (/* @__PURE__ */ new Date()).getTime();
      },
      /**
       * @api private
       */
      extractRequestId: function extractRequestId(resp) {
        var requestId = resp.httpResponse.headers["x-amz-request-id"] || resp.httpResponse.headers["x-amzn-requestid"];
        if (!requestId && resp.data && resp.data.ResponseMetadata) {
          requestId = resp.data.ResponseMetadata.RequestId;
        }
        if (requestId) {
          resp.requestId = requestId;
        }
        if (resp.error) {
          resp.error.requestId = requestId;
        }
      },
      /**
       * @api private
       */
      addPromises: function addPromises(constructors, PromiseDependency) {
        var deletePromises = false;
        if (PromiseDependency === void 0 && AWS2 && AWS2.config) {
          PromiseDependency = AWS2.config.getPromisesDependency();
        }
        if (PromiseDependency === void 0 && typeof Promise !== "undefined") {
          PromiseDependency = Promise;
        }
        if (typeof PromiseDependency !== "function")
          deletePromises = true;
        if (!Array.isArray(constructors))
          constructors = [constructors];
        for (var ind = 0; ind < constructors.length; ind++) {
          var constructor = constructors[ind];
          if (deletePromises) {
            if (constructor.deletePromisesFromClass) {
              constructor.deletePromisesFromClass();
            }
          } else if (constructor.addPromisesToClass) {
            constructor.addPromisesToClass(PromiseDependency);
          }
        }
      },
      /**
       * @api private
       * Return a function that will return a promise whose fate is decided by the
       * callback behavior of the given method with `methodName`. The method to be
       * promisified should conform to node.js convention of accepting a callback as
       * last argument and calling that callback with error as the first argument
       * and success value on the second argument.
       */
      promisifyMethod: function promisifyMethod(methodName, PromiseDependency) {
        return function promise() {
          var self = this;
          var args = Array.prototype.slice.call(arguments);
          return new PromiseDependency(function(resolve, reject) {
            args.push(function(err, data) {
              if (err) {
                reject(err);
              } else {
                resolve(data);
              }
            });
            self[methodName].apply(self, args);
          });
        };
      },
      /**
       * @api private
       */
      isDualstackAvailable: function isDualstackAvailable(service) {
        if (!service)
          return false;
        var metadata = require_metadata();
        if (typeof service !== "string")
          service = service.serviceIdentifier;
        if (typeof service !== "string" || !metadata.hasOwnProperty(service))
          return false;
        return !!metadata[service].dualstackAvailable;
      },
      /**
       * @api private
       */
      calculateRetryDelay: function calculateRetryDelay(retryCount, retryDelayOptions, err) {
        if (!retryDelayOptions)
          retryDelayOptions = {};
        var customBackoff = retryDelayOptions.customBackoff || null;
        if (typeof customBackoff === "function") {
          return customBackoff(retryCount, err);
        }
        var base = typeof retryDelayOptions.base === "number" ? retryDelayOptions.base : 100;
        var delay = Math.random() * (Math.pow(2, retryCount) * base);
        return delay;
      },
      /**
       * @api private
       */
      handleRequestWithRetries: function handleRequestWithRetries(httpRequest, options, cb) {
        if (!options)
          options = {};
        var http = AWS2.HttpClient.getInstance();
        var httpOptions = options.httpOptions || {};
        var retryCount = 0;
        var errCallback = function(err) {
          var maxRetries = options.maxRetries || 0;
          if (err && err.code === "TimeoutError")
            err.retryable = true;
          if (err && err.retryable && retryCount < maxRetries) {
            var delay = util2.calculateRetryDelay(retryCount, options.retryDelayOptions, err);
            if (delay >= 0) {
              retryCount++;
              setTimeout(sendRequest, delay + (err.retryAfter || 0));
              return;
            }
          }
          cb(err);
        };
        var sendRequest = function() {
          var data = "";
          http.handleRequest(httpRequest, httpOptions, function(httpResponse) {
            httpResponse.on("data", function(chunk) {
              data += chunk.toString();
            });
            httpResponse.on("end", function() {
              var statusCode = httpResponse.statusCode;
              if (statusCode < 300) {
                cb(null, data);
              } else {
                var retryAfter = parseInt(httpResponse.headers["retry-after"], 10) * 1e3 || 0;
                var err = util2.error(
                  new Error(),
                  {
                    statusCode,
                    retryable: statusCode >= 500 || statusCode === 429
                  }
                );
                if (retryAfter && err.retryable)
                  err.retryAfter = retryAfter;
                errCallback(err);
              }
            });
          }, errCallback);
        };
        AWS2.util.defer(sendRequest);
      },
      /**
       * @api private
       */
      uuid: {
        v4: function uuidV4() {
          return require_dist().v4();
        }
      },
      /**
       * @api private
       */
      convertPayloadToString: function convertPayloadToString(resp) {
        var req = resp.request;
        var operation = req.operation;
        var rules = req.service.api.operations[operation].output || {};
        if (rules.payload && resp.data[rules.payload]) {
          resp.data[rules.payload] = resp.data[rules.payload].toString();
        }
      },
      /**
       * @api private
       */
      defer: function defer(callback) {
        if (typeof process === "object" && typeof process.nextTick === "function") {
          process.nextTick(callback);
        } else if (typeof setImmediate === "function") {
          setImmediate(callback);
        } else {
          setTimeout(callback, 0);
        }
      },
      /**
       * @api private
       */
      getRequestPayloadShape: function getRequestPayloadShape(req) {
        var operations = req.service.api.operations;
        if (!operations)
          return void 0;
        var operation = (operations || {})[req.operation];
        if (!operation || !operation.input || !operation.input.payload)
          return void 0;
        return operation.input.members[operation.input.payload];
      },
      getProfilesFromSharedConfig: function getProfilesFromSharedConfig(iniLoader, filename) {
        var profiles = {};
        var profilesFromConfig = {};
        if (process.env[util2.configOptInEnv]) {
          var profilesFromConfig = iniLoader.loadFrom({
            isConfig: true,
            filename: process.env[util2.sharedConfigFileEnv]
          });
        }
        var profilesFromCreds = {};
        try {
          var profilesFromCreds = iniLoader.loadFrom({
            filename: filename || process.env[util2.configOptInEnv] && process.env[util2.sharedCredentialsFileEnv]
          });
        } catch (error) {
          if (!process.env[util2.configOptInEnv])
            throw error;
        }
        for (var i = 0, profileNames = Object.keys(profilesFromConfig); i < profileNames.length; i++) {
          profiles[profileNames[i]] = objectAssign(profiles[profileNames[i]] || {}, profilesFromConfig[profileNames[i]]);
        }
        for (var i = 0, profileNames = Object.keys(profilesFromCreds); i < profileNames.length; i++) {
          profiles[profileNames[i]] = objectAssign(profiles[profileNames[i]] || {}, profilesFromCreds[profileNames[i]]);
        }
        return profiles;
        function objectAssign(target, source) {
          for (var i2 = 0, keys = Object.keys(source); i2 < keys.length; i2++) {
            target[keys[i2]] = source[keys[i2]];
          }
          return target;
        }
      },
      /**
       * @api private
       */
      ARN: {
        validate: function validateARN(str) {
          return str && str.indexOf("arn:") === 0 && str.split(":").length >= 6;
        },
        parse: function parseARN(arn) {
          var matched = arn.split(":");
          return {
            partition: matched[1],
            service: matched[2],
            region: matched[3],
            accountId: matched[4],
            resource: matched.slice(5).join(":")
          };
        },
        build: function buildARN(arnObject) {
          if (arnObject.service === void 0 || arnObject.region === void 0 || arnObject.accountId === void 0 || arnObject.resource === void 0)
            throw util2.error(new Error("Input ARN object is invalid"));
          return "arn:" + (arnObject.partition || "aws") + ":" + arnObject.service + ":" + arnObject.region + ":" + arnObject.accountId + ":" + arnObject.resource;
        }
      },
      /**
       * @api private
       */
      defaultProfile: "default",
      /**
       * @api private
       */
      configOptInEnv: "AWS_SDK_LOAD_CONFIG",
      /**
       * @api private
       */
      sharedCredentialsFileEnv: "AWS_SHARED_CREDENTIALS_FILE",
      /**
       * @api private
       */
      sharedConfigFileEnv: "AWS_CONFIG_FILE",
      /**
       * @api private
       */
      imdsDisabledEnv: "AWS_EC2_METADATA_DISABLED"
    };
    module2.exports = util2;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/event-message-chunker-stream.js
var require_event_message_chunker_stream = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/event-message-chunker-stream.js"(exports, module2) {
    var util2 = require_core().util;
    var Transform = require("stream").Transform;
    var allocBuffer = util2.buffer.alloc;
    function EventMessageChunkerStream(options) {
      Transform.call(this, options);
      this.currentMessageTotalLength = 0;
      this.currentMessagePendingLength = 0;
      this.currentMessage = null;
      this.messageLengthBuffer = null;
    }
    EventMessageChunkerStream.prototype = Object.create(Transform.prototype);
    EventMessageChunkerStream.prototype._transform = function(chunk, encoding, callback) {
      var chunkLength = chunk.length;
      var currentOffset = 0;
      while (currentOffset < chunkLength) {
        if (!this.currentMessage) {
          var bytesRemaining = chunkLength - currentOffset;
          if (!this.messageLengthBuffer) {
            this.messageLengthBuffer = allocBuffer(4);
          }
          var numBytesForTotal = Math.min(
            4 - this.currentMessagePendingLength,
            // remaining bytes to fill the messageLengthBuffer
            bytesRemaining
            // bytes left in chunk
          );
          chunk.copy(
            this.messageLengthBuffer,
            this.currentMessagePendingLength,
            currentOffset,
            currentOffset + numBytesForTotal
          );
          this.currentMessagePendingLength += numBytesForTotal;
          currentOffset += numBytesForTotal;
          if (this.currentMessagePendingLength < 4) {
            break;
          }
          this.allocateMessage(this.messageLengthBuffer.readUInt32BE(0));
          this.messageLengthBuffer = null;
        }
        var numBytesToWrite = Math.min(
          this.currentMessageTotalLength - this.currentMessagePendingLength,
          // number of bytes left to complete message
          chunkLength - currentOffset
          // number of bytes left in the original chunk
        );
        chunk.copy(
          this.currentMessage,
          // target buffer
          this.currentMessagePendingLength,
          // target offset
          currentOffset,
          // chunk offset
          currentOffset + numBytesToWrite
          // chunk end to write
        );
        this.currentMessagePendingLength += numBytesToWrite;
        currentOffset += numBytesToWrite;
        if (this.currentMessageTotalLength && this.currentMessageTotalLength === this.currentMessagePendingLength) {
          this.push(this.currentMessage);
          this.currentMessage = null;
          this.currentMessageTotalLength = 0;
          this.currentMessagePendingLength = 0;
        }
      }
      callback();
    };
    EventMessageChunkerStream.prototype._flush = function(callback) {
      if (this.currentMessageTotalLength) {
        if (this.currentMessageTotalLength === this.currentMessagePendingLength) {
          callback(null, this.currentMessage);
        } else {
          callback(new Error("Truncated event message received."));
        }
      } else {
        callback();
      }
    };
    EventMessageChunkerStream.prototype.allocateMessage = function(size) {
      if (typeof size !== "number") {
        throw new Error("Attempted to allocate an event message where size was not a number: " + size);
      }
      this.currentMessageTotalLength = size;
      this.currentMessagePendingLength = 4;
      this.currentMessage = allocBuffer(size);
      this.currentMessage.writeUInt32BE(size, 0);
    };
    module2.exports = {
      EventMessageChunkerStream
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/int64.js
var require_int64 = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/int64.js"(exports, module2) {
    var util2 = require_core().util;
    var toBuffer = util2.buffer.toBuffer;
    function Int64(bytes) {
      if (bytes.length !== 8) {
        throw new Error("Int64 buffers must be exactly 8 bytes");
      }
      if (!util2.Buffer.isBuffer(bytes))
        bytes = toBuffer(bytes);
      this.bytes = bytes;
    }
    Int64.fromNumber = function(number) {
      if (number > 9223372036854776e3 || number < -9223372036854776e3) {
        throw new Error(
          number + " is too large (or, if negative, too small) to represent as an Int64"
        );
      }
      var bytes = new Uint8Array(8);
      for (var i = 7, remaining = Math.abs(Math.round(number)); i > -1 && remaining > 0; i--, remaining /= 256) {
        bytes[i] = remaining;
      }
      if (number < 0) {
        negate(bytes);
      }
      return new Int64(bytes);
    };
    Int64.prototype.valueOf = function() {
      var bytes = this.bytes.slice(0);
      var negative = bytes[0] & 128;
      if (negative) {
        negate(bytes);
      }
      return parseInt(bytes.toString("hex"), 16) * (negative ? -1 : 1);
    };
    Int64.prototype.toString = function() {
      return String(this.valueOf());
    };
    function negate(bytes) {
      for (var i = 0; i < 8; i++) {
        bytes[i] ^= 255;
      }
      for (var i = 7; i > -1; i--) {
        bytes[i]++;
        if (bytes[i] !== 0) {
          break;
        }
      }
    }
    module2.exports = {
      Int64
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/split-message.js
var require_split_message = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/split-message.js"(exports, module2) {
    var util2 = require_core().util;
    var toBuffer = util2.buffer.toBuffer;
    var PRELUDE_MEMBER_LENGTH = 4;
    var PRELUDE_LENGTH = PRELUDE_MEMBER_LENGTH * 2;
    var CHECKSUM_LENGTH = 4;
    var MINIMUM_MESSAGE_LENGTH = PRELUDE_LENGTH + CHECKSUM_LENGTH * 2;
    function splitMessage(message) {
      if (!util2.Buffer.isBuffer(message))
        message = toBuffer(message);
      if (message.length < MINIMUM_MESSAGE_LENGTH) {
        throw new Error("Provided message too short to accommodate event stream message overhead");
      }
      if (message.length !== message.readUInt32BE(0)) {
        throw new Error("Reported message length does not match received message length");
      }
      var expectedPreludeChecksum = message.readUInt32BE(PRELUDE_LENGTH);
      if (expectedPreludeChecksum !== util2.crypto.crc32(
        message.slice(0, PRELUDE_LENGTH)
      )) {
        throw new Error(
          "The prelude checksum specified in the message (" + expectedPreludeChecksum + ") does not match the calculated CRC32 checksum."
        );
      }
      var expectedMessageChecksum = message.readUInt32BE(message.length - CHECKSUM_LENGTH);
      if (expectedMessageChecksum !== util2.crypto.crc32(
        message.slice(0, message.length - CHECKSUM_LENGTH)
      )) {
        throw new Error(
          "The message checksum did not match the expected value of " + expectedMessageChecksum
        );
      }
      var headersStart = PRELUDE_LENGTH + CHECKSUM_LENGTH;
      var headersEnd = headersStart + message.readUInt32BE(PRELUDE_MEMBER_LENGTH);
      return {
        headers: message.slice(headersStart, headersEnd),
        body: message.slice(headersEnd, message.length - CHECKSUM_LENGTH)
      };
    }
    module2.exports = {
      splitMessage
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/parse-message.js
var require_parse_message = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/parse-message.js"(exports, module2) {
    var Int64 = require_int64().Int64;
    var splitMessage = require_split_message().splitMessage;
    var BOOLEAN_TAG = "boolean";
    var BYTE_TAG = "byte";
    var SHORT_TAG = "short";
    var INT_TAG = "integer";
    var LONG_TAG = "long";
    var BINARY_TAG = "binary";
    var STRING_TAG = "string";
    var TIMESTAMP_TAG = "timestamp";
    var UUID_TAG = "uuid";
    function parseHeaders(headers) {
      var out = {};
      var position = 0;
      while (position < headers.length) {
        var nameLength = headers.readUInt8(position++);
        var name = headers.slice(position, position + nameLength).toString();
        position += nameLength;
        switch (headers.readUInt8(position++)) {
          case 0:
            out[name] = {
              type: BOOLEAN_TAG,
              value: true
            };
            break;
          case 1:
            out[name] = {
              type: BOOLEAN_TAG,
              value: false
            };
            break;
          case 2:
            out[name] = {
              type: BYTE_TAG,
              value: headers.readInt8(position++)
            };
            break;
          case 3:
            out[name] = {
              type: SHORT_TAG,
              value: headers.readInt16BE(position)
            };
            position += 2;
            break;
          case 4:
            out[name] = {
              type: INT_TAG,
              value: headers.readInt32BE(position)
            };
            position += 4;
            break;
          case 5:
            out[name] = {
              type: LONG_TAG,
              value: new Int64(headers.slice(position, position + 8))
            };
            position += 8;
            break;
          case 6:
            var binaryLength = headers.readUInt16BE(position);
            position += 2;
            out[name] = {
              type: BINARY_TAG,
              value: headers.slice(position, position + binaryLength)
            };
            position += binaryLength;
            break;
          case 7:
            var stringLength = headers.readUInt16BE(position);
            position += 2;
            out[name] = {
              type: STRING_TAG,
              value: headers.slice(
                position,
                position + stringLength
              ).toString()
            };
            position += stringLength;
            break;
          case 8:
            out[name] = {
              type: TIMESTAMP_TAG,
              value: new Date(
                new Int64(headers.slice(position, position + 8)).valueOf()
              )
            };
            position += 8;
            break;
          case 9:
            var uuidChars = headers.slice(position, position + 16).toString("hex");
            position += 16;
            out[name] = {
              type: UUID_TAG,
              value: uuidChars.substr(0, 8) + "-" + uuidChars.substr(8, 4) + "-" + uuidChars.substr(12, 4) + "-" + uuidChars.substr(16, 4) + "-" + uuidChars.substr(20)
            };
            break;
          default:
            throw new Error("Unrecognized header type tag");
        }
      }
      return out;
    }
    function parseMessage(message) {
      var parsed = splitMessage(message);
      return { headers: parseHeaders(parsed.headers), body: parsed.body };
    }
    module2.exports = {
      parseMessage
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/parse-event.js
var require_parse_event = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/parse-event.js"(exports, module2) {
    var parseMessage = require_parse_message().parseMessage;
    function parseEvent(parser, message, shape) {
      var parsedMessage = parseMessage(message);
      var messageType = parsedMessage.headers[":message-type"];
      if (messageType) {
        if (messageType.value === "error") {
          throw parseError(parsedMessage);
        } else if (messageType.value !== "event") {
          return;
        }
      }
      var eventType = parsedMessage.headers[":event-type"];
      var eventModel = shape.members[eventType.value];
      if (!eventModel) {
        return;
      }
      var result = {};
      var eventPayloadMemberName = eventModel.eventPayloadMemberName;
      if (eventPayloadMemberName) {
        var payloadShape = eventModel.members[eventPayloadMemberName];
        if (payloadShape.type === "binary") {
          result[eventPayloadMemberName] = parsedMessage.body;
        } else {
          result[eventPayloadMemberName] = parser.parse(parsedMessage.body.toString(), payloadShape);
        }
      }
      var eventHeaderNames = eventModel.eventHeaderMemberNames;
      for (var i = 0; i < eventHeaderNames.length; i++) {
        var name = eventHeaderNames[i];
        if (parsedMessage.headers[name]) {
          result[name] = eventModel.members[name].toType(parsedMessage.headers[name].value);
        }
      }
      var output = {};
      output[eventType.value] = result;
      return output;
    }
    function parseError(message) {
      var errorCode = message.headers[":error-code"];
      var errorMessage = message.headers[":error-message"];
      var error = new Error(errorMessage.value || errorMessage);
      error.code = error.name = errorCode.value || errorCode;
      return error;
    }
    module2.exports = {
      parseEvent
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/event-message-unmarshaller-stream.js
var require_event_message_unmarshaller_stream = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/event-message-unmarshaller-stream.js"(exports, module2) {
    var Transform = require("stream").Transform;
    var parseEvent = require_parse_event().parseEvent;
    function EventUnmarshallerStream(options) {
      options = options || {};
      options.readableObjectMode = true;
      Transform.call(this, options);
      this._readableState.objectMode = true;
      this.parser = options.parser;
      this.eventStreamModel = options.eventStreamModel;
    }
    EventUnmarshallerStream.prototype = Object.create(Transform.prototype);
    EventUnmarshallerStream.prototype._transform = function(chunk, encoding, callback) {
      try {
        var event = parseEvent(this.parser, chunk, this.eventStreamModel);
        this.push(event);
        return callback();
      } catch (err) {
        callback(err);
      }
    };
    module2.exports = {
      EventUnmarshallerStream
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/streaming-create-event-stream.js
var require_streaming_create_event_stream = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/streaming-create-event-stream.js"(exports, module2) {
    var EventMessageChunkerStream = require_event_message_chunker_stream().EventMessageChunkerStream;
    var EventUnmarshallerStream = require_event_message_unmarshaller_stream().EventUnmarshallerStream;
    function createEventStream(stream, parser, model) {
      var eventStream = new EventUnmarshallerStream({
        parser,
        eventStreamModel: model
      });
      var eventMessageChunker = new EventMessageChunkerStream();
      stream.pipe(
        eventMessageChunker
      ).pipe(eventStream);
      stream.on("error", function(err) {
        eventMessageChunker.emit("error", err);
      });
      eventMessageChunker.on("error", function(err) {
        eventStream.emit("error", err);
      });
      return eventStream;
    }
    module2.exports = {
      createEventStream
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/event-message-chunker.js
var require_event_message_chunker = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/event-message-chunker.js"(exports, module2) {
    function eventMessageChunker(buffer) {
      var messages = [];
      var offset = 0;
      while (offset < buffer.length) {
        var totalLength = buffer.readInt32BE(offset);
        var message = buffer.slice(offset, totalLength + offset);
        offset += totalLength;
        messages.push(message);
      }
      return messages;
    }
    module2.exports = {
      eventMessageChunker
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/buffered-create-event-stream.js
var require_buffered_create_event_stream = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/event-stream/buffered-create-event-stream.js"(exports, module2) {
    var eventMessageChunker = require_event_message_chunker().eventMessageChunker;
    var parseEvent = require_parse_event().parseEvent;
    function createEventStream(body, parser, model) {
      var eventMessages = eventMessageChunker(body);
      var events = [];
      for (var i = 0; i < eventMessages.length; i++) {
        events.push(parseEvent(parser, eventMessages[i], model));
      }
      return events;
    }
    module2.exports = {
      createEventStream
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/realclock/nodeClock.js
var require_nodeClock = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/realclock/nodeClock.js"(exports, module2) {
    module2.exports = {
      //provide realtime clock for performance measurement
      now: function now() {
        var second = process.hrtime();
        return second[0] * 1e3 + second[1] / 1e6;
      }
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/publisher/index.js
var require_publisher = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/publisher/index.js"(exports, module2) {
    var util2 = require_core().util;
    var dgram = require("dgram");
    var stringToBuffer = util2.buffer.toBuffer;
    var MAX_MESSAGE_SIZE = 1024 * 8;
    function Publisher(options) {
      options = options || {};
      this.enabled = options.enabled || false;
      this.port = options.port || 31e3;
      this.clientId = options.clientId || "";
      this.address = options.host || "127.0.0.1";
      if (this.clientId.length > 255) {
        this.clientId = this.clientId.substr(0, 255);
      }
      this.messagesInFlight = 0;
    }
    Publisher.prototype.fieldsToTrim = {
      UserAgent: 256,
      SdkException: 128,
      SdkExceptionMessage: 512,
      AwsException: 128,
      AwsExceptionMessage: 512,
      FinalSdkException: 128,
      FinalSdkExceptionMessage: 512,
      FinalAwsException: 128,
      FinalAwsExceptionMessage: 512
    };
    Publisher.prototype.trimFields = function(event) {
      var trimmableFields = Object.keys(this.fieldsToTrim);
      for (var i = 0, iLen = trimmableFields.length; i < iLen; i++) {
        var field = trimmableFields[i];
        if (event.hasOwnProperty(field)) {
          var maxLength = this.fieldsToTrim[field];
          var value = event[field];
          if (value && value.length > maxLength) {
            event[field] = value.substr(0, maxLength);
          }
        }
      }
      return event;
    };
    Publisher.prototype.eventHandler = function(event) {
      event.ClientId = this.clientId;
      this.trimFields(event);
      var message = stringToBuffer(JSON.stringify(event));
      if (!this.enabled || message.length > MAX_MESSAGE_SIZE) {
        return;
      }
      this.publishDatagram(message);
    };
    Publisher.prototype.publishDatagram = function(message) {
      var self = this;
      var client = this.getClient();
      this.messagesInFlight++;
      this.client.send(message, 0, message.length, this.port, this.address, function(err, bytes) {
        if (--self.messagesInFlight <= 0) {
          self.destroyClient();
        }
      });
    };
    Publisher.prototype.getClient = function() {
      if (!this.client) {
        this.client = dgram.createSocket("udp4");
      }
      return this.client;
    };
    Publisher.prototype.destroyClient = function() {
      if (this.client) {
        this.client.close();
        this.client = void 0;
      }
    };
    module2.exports = {
      Publisher
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/publisher/configuration.js
var require_configuration = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/publisher/configuration.js"(exports, module2) {
    var AWS2 = require_core();
    function resolveMonitoringConfig() {
      var config = {
        port: void 0,
        clientId: void 0,
        enabled: void 0,
        host: void 0
      };
      if (fromEnvironment(config) || fromConfigFile(config))
        return toJSType(config);
      return toJSType(config);
    }
    function fromEnvironment(config) {
      config.port = config.port || process.env.AWS_CSM_PORT;
      config.enabled = config.enabled || process.env.AWS_CSM_ENABLED;
      config.clientId = config.clientId || process.env.AWS_CSM_CLIENT_ID;
      config.host = config.host || process.env.AWS_CSM_HOST;
      return config.port && config.enabled && config.clientId && config.host || ["false", "0"].indexOf(config.enabled) >= 0;
    }
    function fromConfigFile(config) {
      var sharedFileConfig;
      try {
        var configFile = AWS2.util.iniLoader.loadFrom({
          isConfig: true,
          filename: process.env[AWS2.util.sharedConfigFileEnv]
        });
        var sharedFileConfig = configFile[process.env.AWS_PROFILE || AWS2.util.defaultProfile];
      } catch (err) {
        return false;
      }
      if (!sharedFileConfig)
        return config;
      config.port = config.port || sharedFileConfig.csm_port;
      config.enabled = config.enabled || sharedFileConfig.csm_enabled;
      config.clientId = config.clientId || sharedFileConfig.csm_client_id;
      config.host = config.host || sharedFileConfig.csm_host;
      return config.port && config.enabled && config.clientId && config.host;
    }
    function toJSType(config) {
      var falsyNotations = ["false", "0", void 0];
      if (!config.enabled || falsyNotations.indexOf(config.enabled.toLowerCase()) >= 0) {
        config.enabled = false;
      } else {
        config.enabled = true;
      }
      config.port = config.port ? parseInt(config.port, 10) : void 0;
      return config;
    }
    module2.exports = resolveMonitoringConfig;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/shared-ini/ini-loader.js
var require_ini_loader = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/shared-ini/ini-loader.js"(exports, module2) {
    var AWS2 = require_core();
    var os = require("os");
    var path = require("path");
    function parseFile(filename) {
      return AWS2.util.ini.parse(AWS2.util.readFileSync(filename));
    }
    function getProfiles(fileContent) {
      var tmpContent = {};
      Object.keys(fileContent).forEach(function(sectionName) {
        if (/^sso-session\s/.test(sectionName))
          return;
        Object.defineProperty(tmpContent, sectionName.replace(/^profile\s/, ""), {
          value: fileContent[sectionName],
          enumerable: true
        });
      });
      return tmpContent;
    }
    function getSsoSessions(fileContent) {
      var tmpContent = {};
      Object.keys(fileContent).forEach(function(sectionName) {
        if (!/^sso-session\s/.test(sectionName))
          return;
        Object.defineProperty(tmpContent, sectionName.replace(/^sso-session\s/, ""), {
          value: fileContent[sectionName],
          enumerable: true
        });
      });
      return tmpContent;
    }
    AWS2.IniLoader = AWS2.util.inherit({
      constructor: function IniLoader2() {
        this.resolvedProfiles = {};
        this.resolvedSsoSessions = {};
      },
      /** Remove all cached files. Used after config files are updated. */
      clearCachedFiles: function clearCachedFiles() {
        this.resolvedProfiles = {};
        this.resolvedSsoSessions = {};
      },
      /**
       * Load configurations from config/credentials files and cache them
       * for later use. If no file is specified it will try to load default files.
       *
       * @param options [map] information describing the file
       * @option options filename [String] ('~/.aws/credentials' or defined by
       *   AWS_SHARED_CREDENTIALS_FILE process env var or '~/.aws/config' if
       *   isConfig is set to true)
       *   path to the file to be read.
       * @option options isConfig [Boolean] (false) True to read config file.
       * @return [map<String,String>] object containing contents from file in key-value
       *   pairs.
       */
      loadFrom: function loadFrom(options) {
        options = options || {};
        var isConfig = options.isConfig === true;
        var filename = options.filename || this.getDefaultFilePath(isConfig);
        if (!this.resolvedProfiles[filename]) {
          var fileContent = parseFile(filename);
          if (isConfig) {
            Object.defineProperty(this.resolvedProfiles, filename, {
              value: getProfiles(fileContent)
            });
          } else {
            Object.defineProperty(this.resolvedProfiles, filename, { value: fileContent });
          }
        }
        return this.resolvedProfiles[filename];
      },
      /**
       * Load sso sessions from config/credentials files and cache them
       * for later use. If no file is specified it will try to load default file.
       *
       * @param options [map] information describing the file
       * @option options filename [String] ('~/.aws/config' or defined by
       *   AWS_CONFIG_FILE process env var)
       * @return [map<String,String>] object containing contents from file in key-value
       *   pairs.
       */
      loadSsoSessionsFrom: function loadSsoSessionsFrom(options) {
        options = options || {};
        var filename = options.filename || this.getDefaultFilePath(true);
        if (!this.resolvedSsoSessions[filename]) {
          var fileContent = parseFile(filename);
          Object.defineProperty(this.resolvedSsoSessions, filename, {
            value: getSsoSessions(fileContent)
          });
        }
        return this.resolvedSsoSessions[filename];
      },
      /**
       * @api private
       */
      getDefaultFilePath: function getDefaultFilePath(isConfig) {
        return path.join(
          this.getHomeDir(),
          ".aws",
          isConfig ? "config" : "credentials"
        );
      },
      /**
       * @api private
       */
      getHomeDir: function getHomeDir() {
        var env = process.env;
        var home = env.HOME || env.USERPROFILE || (env.HOMEPATH ? (env.HOMEDRIVE || "C:/") + env.HOMEPATH : null);
        if (home) {
          return home;
        }
        if (typeof os.homedir === "function") {
          return os.homedir();
        }
        throw AWS2.util.error(
          new Error("Cannot load credentials, HOME path not set")
        );
      }
    });
    var IniLoader = AWS2.IniLoader;
    module2.exports = {
      IniLoader
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/shared-ini/index.js
var require_shared_ini = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/shared-ini/index.js"(exports, module2) {
    var IniLoader = require_ini_loader().IniLoader;
    module2.exports.iniLoader = new IniLoader();
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/config_regional_endpoint.js
var require_config_regional_endpoint = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/config_regional_endpoint.js"(exports, module2) {
    var AWS2 = require_core();
    function validateRegionalEndpointsFlagValue(configValue, errorOptions) {
      if (typeof configValue !== "string")
        return void 0;
      else if (["legacy", "regional"].indexOf(configValue.toLowerCase()) >= 0) {
        return configValue.toLowerCase();
      } else {
        throw AWS2.util.error(new Error(), errorOptions);
      }
    }
    function resolveRegionalEndpointsFlag(originalConfig, options) {
      originalConfig = originalConfig || {};
      var resolved;
      if (originalConfig[options.clientConfig]) {
        resolved = validateRegionalEndpointsFlagValue(originalConfig[options.clientConfig], {
          code: "InvalidConfiguration",
          message: 'invalid "' + options.clientConfig + '" configuration. Expect "legacy"  or "regional". Got "' + originalConfig[options.clientConfig] + '".'
        });
        if (resolved)
          return resolved;
      }
      if (!AWS2.util.isNode())
        return resolved;
      if (Object.prototype.hasOwnProperty.call(process.env, options.env)) {
        var envFlag = process.env[options.env];
        resolved = validateRegionalEndpointsFlagValue(envFlag, {
          code: "InvalidEnvironmentalVariable",
          message: "invalid " + options.env + ' environmental variable. Expect "legacy"  or "regional". Got "' + process.env[options.env] + '".'
        });
        if (resolved)
          return resolved;
      }
      var profile = {};
      try {
        var profiles = AWS2.util.getProfilesFromSharedConfig(AWS2.util.iniLoader);
        profile = profiles[process.env.AWS_PROFILE || AWS2.util.defaultProfile];
      } catch (e) {
      }
      ;
      if (profile && Object.prototype.hasOwnProperty.call(profile, options.sharedConfig)) {
        var fileFlag = profile[options.sharedConfig];
        resolved = validateRegionalEndpointsFlagValue(fileFlag, {
          code: "InvalidConfiguration",
          message: "invalid " + options.sharedConfig + ' profile config. Expect "legacy"  or "regional". Got "' + profile[options.sharedConfig] + '".'
        });
        if (resolved)
          return resolved;
      }
      return resolved;
    }
    module2.exports = resolveRegionalEndpointsFlag;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/services/sts.js
var require_sts = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/services/sts.js"() {
    var AWS2 = require_core();
    var resolveRegionalEndpointsFlag = require_config_regional_endpoint();
    var ENV_REGIONAL_ENDPOINT_ENABLED = "AWS_STS_REGIONAL_ENDPOINTS";
    var CONFIG_REGIONAL_ENDPOINT_ENABLED = "sts_regional_endpoints";
    AWS2.util.update(AWS2.STS.prototype, {
      /**
       * @overload credentialsFrom(data, credentials = null)
       *   Creates a credentials object from STS response data containing
       *   credentials information. Useful for quickly setting AWS credentials.
       *
       *   @note This is a low-level utility function. If you want to load temporary
       *     credentials into your process for subsequent requests to AWS resources,
       *     you should use {AWS.TemporaryCredentials} instead.
       *   @param data [map] data retrieved from a call to {getFederatedToken},
       *     {getSessionToken}, {assumeRole}, or {assumeRoleWithWebIdentity}.
       *   @param credentials [AWS.Credentials] an optional credentials object to
       *     fill instead of creating a new object. Useful when modifying an
       *     existing credentials object from a refresh call.
       *   @return [AWS.TemporaryCredentials] the set of temporary credentials
       *     loaded from a raw STS operation response.
       *   @example Using credentialsFrom to load global AWS credentials
       *     var sts = new AWS.STS();
       *     sts.getSessionToken(function (err, data) {
       *       if (err) console.log("Error getting credentials");
       *       else {
       *         AWS.config.credentials = sts.credentialsFrom(data);
       *       }
       *     });
       *   @see AWS.TemporaryCredentials
       */
      credentialsFrom: function credentialsFrom(data, credentials) {
        if (!data)
          return null;
        if (!credentials)
          credentials = new AWS2.TemporaryCredentials();
        credentials.expired = false;
        credentials.accessKeyId = data.Credentials.AccessKeyId;
        credentials.secretAccessKey = data.Credentials.SecretAccessKey;
        credentials.sessionToken = data.Credentials.SessionToken;
        credentials.expireTime = data.Credentials.Expiration;
        return credentials;
      },
      assumeRoleWithWebIdentity: function assumeRoleWithWebIdentity(params, callback) {
        return this.makeUnauthenticatedRequest("assumeRoleWithWebIdentity", params, callback);
      },
      assumeRoleWithSAML: function assumeRoleWithSAML(params, callback) {
        return this.makeUnauthenticatedRequest("assumeRoleWithSAML", params, callback);
      },
      /**
       * @api private
       */
      setupRequestListeners: function setupRequestListeners(request) {
        request.addListener("validate", this.optInRegionalEndpoint, true);
      },
      /**
       * @api private
       */
      optInRegionalEndpoint: function optInRegionalEndpoint(req) {
        var service = req.service;
        var config = service.config;
        config.stsRegionalEndpoints = resolveRegionalEndpointsFlag(service._originalConfig, {
          env: ENV_REGIONAL_ENDPOINT_ENABLED,
          sharedConfig: CONFIG_REGIONAL_ENDPOINT_ENABLED,
          clientConfig: "stsRegionalEndpoints"
        });
        if (config.stsRegionalEndpoints === "regional" && service.isGlobalEndpoint) {
          if (!config.region) {
            throw AWS2.util.error(
              new Error(),
              { code: "ConfigError", message: "Missing region in config" }
            );
          }
          var insertPoint = config.endpoint.indexOf(".amazonaws.com");
          var regionalEndpoint = config.endpoint.substring(0, insertPoint) + "." + config.region + config.endpoint.substring(insertPoint);
          req.httpRequest.updateEndpoint(regionalEndpoint);
          req.httpRequest.region = config.region;
        }
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/sts-2011-06-15.min.json
var require_sts_2011_06_15_min = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/sts-2011-06-15.min.json"(exports, module2) {
    module2.exports = {
      version: "2.0",
      metadata: {
        apiVersion: "2011-06-15",
        endpointPrefix: "sts",
        globalEndpoint: "sts.amazonaws.com",
        protocol: "query",
        serviceAbbreviation: "AWS STS",
        serviceFullName: "AWS Security Token Service",
        serviceId: "STS",
        signatureVersion: "v4",
        uid: "sts-2011-06-15",
        xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/"
      },
      operations: {
        AssumeRole: {
          input: {
            type: "structure",
            required: [
              "RoleArn",
              "RoleSessionName"
            ],
            members: {
              RoleArn: {},
              RoleSessionName: {},
              PolicyArns: {
                shape: "S4"
              },
              Policy: {},
              DurationSeconds: {
                type: "integer"
              },
              Tags: {
                shape: "S8"
              },
              TransitiveTagKeys: {
                type: "list",
                member: {}
              },
              ExternalId: {},
              SerialNumber: {},
              TokenCode: {},
              SourceIdentity: {}
            }
          },
          output: {
            resultWrapper: "AssumeRoleResult",
            type: "structure",
            members: {
              Credentials: {
                shape: "Si"
              },
              AssumedRoleUser: {
                shape: "Sn"
              },
              PackedPolicySize: {
                type: "integer"
              },
              SourceIdentity: {}
            }
          }
        },
        AssumeRoleWithSAML: {
          input: {
            type: "structure",
            required: [
              "RoleArn",
              "PrincipalArn",
              "SAMLAssertion"
            ],
            members: {
              RoleArn: {},
              PrincipalArn: {},
              SAMLAssertion: {},
              PolicyArns: {
                shape: "S4"
              },
              Policy: {},
              DurationSeconds: {
                type: "integer"
              }
            }
          },
          output: {
            resultWrapper: "AssumeRoleWithSAMLResult",
            type: "structure",
            members: {
              Credentials: {
                shape: "Si"
              },
              AssumedRoleUser: {
                shape: "Sn"
              },
              PackedPolicySize: {
                type: "integer"
              },
              Subject: {},
              SubjectType: {},
              Issuer: {},
              Audience: {},
              NameQualifier: {},
              SourceIdentity: {}
            }
          }
        },
        AssumeRoleWithWebIdentity: {
          input: {
            type: "structure",
            required: [
              "RoleArn",
              "RoleSessionName",
              "WebIdentityToken"
            ],
            members: {
              RoleArn: {},
              RoleSessionName: {},
              WebIdentityToken: {},
              ProviderId: {},
              PolicyArns: {
                shape: "S4"
              },
              Policy: {},
              DurationSeconds: {
                type: "integer"
              }
            }
          },
          output: {
            resultWrapper: "AssumeRoleWithWebIdentityResult",
            type: "structure",
            members: {
              Credentials: {
                shape: "Si"
              },
              SubjectFromWebIdentityToken: {},
              AssumedRoleUser: {
                shape: "Sn"
              },
              PackedPolicySize: {
                type: "integer"
              },
              Provider: {},
              Audience: {},
              SourceIdentity: {}
            }
          }
        },
        DecodeAuthorizationMessage: {
          input: {
            type: "structure",
            required: [
              "EncodedMessage"
            ],
            members: {
              EncodedMessage: {}
            }
          },
          output: {
            resultWrapper: "DecodeAuthorizationMessageResult",
            type: "structure",
            members: {
              DecodedMessage: {}
            }
          }
        },
        GetAccessKeyInfo: {
          input: {
            type: "structure",
            required: [
              "AccessKeyId"
            ],
            members: {
              AccessKeyId: {}
            }
          },
          output: {
            resultWrapper: "GetAccessKeyInfoResult",
            type: "structure",
            members: {
              Account: {}
            }
          }
        },
        GetCallerIdentity: {
          input: {
            type: "structure",
            members: {}
          },
          output: {
            resultWrapper: "GetCallerIdentityResult",
            type: "structure",
            members: {
              UserId: {},
              Account: {},
              Arn: {}
            }
          }
        },
        GetFederationToken: {
          input: {
            type: "structure",
            required: [
              "Name"
            ],
            members: {
              Name: {},
              Policy: {},
              PolicyArns: {
                shape: "S4"
              },
              DurationSeconds: {
                type: "integer"
              },
              Tags: {
                shape: "S8"
              }
            }
          },
          output: {
            resultWrapper: "GetFederationTokenResult",
            type: "structure",
            members: {
              Credentials: {
                shape: "Si"
              },
              FederatedUser: {
                type: "structure",
                required: [
                  "FederatedUserId",
                  "Arn"
                ],
                members: {
                  FederatedUserId: {},
                  Arn: {}
                }
              },
              PackedPolicySize: {
                type: "integer"
              }
            }
          }
        },
        GetSessionToken: {
          input: {
            type: "structure",
            members: {
              DurationSeconds: {
                type: "integer"
              },
              SerialNumber: {},
              TokenCode: {}
            }
          },
          output: {
            resultWrapper: "GetSessionTokenResult",
            type: "structure",
            members: {
              Credentials: {
                shape: "Si"
              }
            }
          }
        }
      },
      shapes: {
        S4: {
          type: "list",
          member: {
            type: "structure",
            members: {
              arn: {}
            }
          }
        },
        S8: {
          type: "list",
          member: {
            type: "structure",
            required: [
              "Key",
              "Value"
            ],
            members: {
              Key: {},
              Value: {}
            }
          }
        },
        Si: {
          type: "structure",
          required: [
            "AccessKeyId",
            "SecretAccessKey",
            "SessionToken",
            "Expiration"
          ],
          members: {
            AccessKeyId: {},
            SecretAccessKey: {},
            SessionToken: {},
            Expiration: {
              type: "timestamp"
            }
          }
        },
        Sn: {
          type: "structure",
          required: [
            "AssumedRoleId",
            "Arn"
          ],
          members: {
            AssumedRoleId: {},
            Arn: {}
          }
        }
      }
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/sts-2011-06-15.paginators.json
var require_sts_2011_06_15_paginators = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/sts-2011-06-15.paginators.json"(exports, module2) {
    module2.exports = {
      pagination: {}
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/clients/sts.js
var require_sts2 = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/clients/sts.js"(exports, module2) {
    require_node_loader();
    var AWS2 = require_core();
    var Service = AWS2.Service;
    var apiLoader = AWS2.apiLoader;
    apiLoader.services["sts"] = {};
    AWS2.STS = Service.defineService("sts", ["2011-06-15"]);
    require_sts();
    Object.defineProperty(apiLoader.services["sts"], "2011-06-15", {
      get: function get() {
        var model = require_sts_2011_06_15_min();
        model.paginators = require_sts_2011_06_15_paginators().pagination;
        return model;
      },
      enumerable: true,
      configurable: true
    });
    module2.exports = AWS2.STS;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/temporary_credentials.js
var require_temporary_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/temporary_credentials.js"() {
    var AWS2 = require_core();
    var STS = require_sts2();
    AWS2.TemporaryCredentials = AWS2.util.inherit(AWS2.Credentials, {
      /**
       * Creates a new temporary credentials object.
       *
       * @note In order to create temporary credentials, you first need to have
       *   "master" credentials configured in {AWS.Config.credentials}. These
       *   master credentials are necessary to retrieve the temporary credentials,
       *   as well as refresh the credentials when they expire.
       * @param params [map] a map of options that are passed to the
       *   {AWS.STS.assumeRole} or {AWS.STS.getSessionToken} operations.
       *   If a `RoleArn` parameter is passed in, credentials will be based on the
       *   IAM role.
       * @param masterCredentials [AWS.Credentials] the master (non-temporary) credentials
       *  used to get and refresh temporary credentials from AWS STS.
       * @example Creating a new credentials object for generic temporary credentials
       *   AWS.config.credentials = new AWS.TemporaryCredentials();
       * @example Creating a new credentials object for an IAM role
       *   AWS.config.credentials = new AWS.TemporaryCredentials({
       *     RoleArn: 'arn:aws:iam::1234567890:role/TemporaryCredentials',
       *   });
       * @see AWS.STS.assumeRole
       * @see AWS.STS.getSessionToken
       */
      constructor: function TemporaryCredentials(params, masterCredentials) {
        AWS2.Credentials.call(this);
        this.loadMasterCredentials(masterCredentials);
        this.expired = true;
        this.params = params || {};
        if (this.params.RoleArn) {
          this.params.RoleSessionName = this.params.RoleSessionName || "temporary-credentials";
        }
      },
      /**
       * Refreshes credentials using {AWS.STS.assumeRole} or
       * {AWS.STS.getSessionToken}, depending on whether an IAM role ARN was passed
       * to the credentials {constructor}.
       *
       * @callback callback function(err)
       *   Called when the STS service responds (or fails). When
       *   this callback is called with no error, it means that the credentials
       *   information has been loaded into the object (as the `accessKeyId`,
       *   `secretAccessKey`, and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @see get
       */
      refresh: function refresh(callback) {
        this.coalesceRefresh(callback || AWS2.util.fn.callback);
      },
      /**
       * @api private
       */
      load: function load(callback) {
        var self = this;
        self.createClients();
        self.masterCredentials.get(function() {
          self.service.config.credentials = self.masterCredentials;
          var operation = self.params.RoleArn ? self.service.assumeRole : self.service.getSessionToken;
          operation.call(self.service, function(err, data) {
            if (!err) {
              self.service.credentialsFrom(data, self);
            }
            callback(err);
          });
        });
      },
      /**
       * @api private
       */
      loadMasterCredentials: function loadMasterCredentials(masterCredentials) {
        this.masterCredentials = masterCredentials || AWS2.config.credentials;
        while (this.masterCredentials.masterCredentials) {
          this.masterCredentials = this.masterCredentials.masterCredentials;
        }
        if (typeof this.masterCredentials.get !== "function") {
          this.masterCredentials = new AWS2.Credentials(this.masterCredentials);
        }
      },
      /**
       * @api private
       */
      createClients: function() {
        this.service = this.service || new STS({ params: this.params });
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/chainable_temporary_credentials.js
var require_chainable_temporary_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/chainable_temporary_credentials.js"() {
    var AWS2 = require_core();
    var STS = require_sts2();
    AWS2.ChainableTemporaryCredentials = AWS2.util.inherit(AWS2.Credentials, {
      /**
       * Creates a new temporary credentials object.
       *
       * @param options [map] a set of options
       * @option options params [map] ({}) a map of options that are passed to the
       *   {AWS.STS.assumeRole} or {AWS.STS.getSessionToken} operations.
       *   If a `RoleArn` parameter is passed in, credentials will be based on the
       *   IAM role. If a `SerialNumber` parameter is passed in, {tokenCodeFn} must
       *   also be passed in or an error will be thrown.
       * @option options masterCredentials [AWS.Credentials] the master credentials
       *   used to get and refresh temporary credentials from AWS STS. By default,
       *   AWS.config.credentials or AWS.config.credentialProvider will be used.
       * @option options tokenCodeFn [Function] (null) Function to provide
       *   `TokenCode`, if `SerialNumber` is provided for profile in {params}. Function
       *   is called with value of `SerialNumber` and `callback`, and should provide
       *   the `TokenCode` or an error to the callback in the format
       *   `callback(err, token)`.
       * @example Creating a new credentials object for generic temporary credentials
       *   AWS.config.credentials = new AWS.ChainableTemporaryCredentials();
       * @example Creating a new credentials object for an IAM role
       *   AWS.config.credentials = new AWS.ChainableTemporaryCredentials({
       *     params: {
       *       RoleArn: 'arn:aws:iam::1234567890:role/TemporaryCredentials'
       *     }
       *   });
       * @see AWS.STS.assumeRole
       * @see AWS.STS.getSessionToken
       */
      constructor: function ChainableTemporaryCredentials(options) {
        AWS2.Credentials.call(this);
        options = options || {};
        this.errorCode = "ChainableTemporaryCredentialsProviderFailure";
        this.expired = true;
        this.tokenCodeFn = null;
        var params = AWS2.util.copy(options.params) || {};
        if (params.RoleArn) {
          params.RoleSessionName = params.RoleSessionName || "temporary-credentials";
        }
        if (params.SerialNumber) {
          if (!options.tokenCodeFn || typeof options.tokenCodeFn !== "function") {
            throw new AWS2.util.error(
              new Error("tokenCodeFn must be a function when params.SerialNumber is given"),
              { code: this.errorCode }
            );
          } else {
            this.tokenCodeFn = options.tokenCodeFn;
          }
        }
        var config = AWS2.util.merge(
          {
            params,
            credentials: options.masterCredentials || AWS2.config.credentials
          },
          options.stsConfig || {}
        );
        this.service = new STS(config);
      },
      /**
       * Refreshes credentials using {AWS.STS.assumeRole} or
       * {AWS.STS.getSessionToken}, depending on whether an IAM role ARN was passed
       * to the credentials {constructor}.
       *
       * @callback callback function(err)
       *   Called when the STS service responds (or fails). When
       *   this callback is called with no error, it means that the credentials
       *   information has been loaded into the object (as the `accessKeyId`,
       *   `secretAccessKey`, and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @see AWS.Credentials.get
       */
      refresh: function refresh(callback) {
        this.coalesceRefresh(callback || AWS2.util.fn.callback);
      },
      /**
       * @api private
       * @param callback
       */
      load: function load(callback) {
        var self = this;
        var operation = self.service.config.params.RoleArn ? "assumeRole" : "getSessionToken";
        this.getTokenCode(function(err, tokenCode) {
          var params = {};
          if (err) {
            callback(err);
            return;
          }
          if (tokenCode) {
            params.TokenCode = tokenCode;
          }
          self.service[operation](params, function(err2, data) {
            if (!err2) {
              self.service.credentialsFrom(data, self);
            }
            callback(err2);
          });
        });
      },
      /**
       * @api private
       */
      getTokenCode: function getTokenCode(callback) {
        var self = this;
        if (this.tokenCodeFn) {
          this.tokenCodeFn(this.service.config.params.SerialNumber, function(err, token) {
            if (err) {
              var message = err;
              if (err instanceof Error) {
                message = err.message;
              }
              callback(
                AWS2.util.error(
                  new Error("Error fetching MFA token: " + message),
                  { code: self.errorCode }
                )
              );
              return;
            }
            callback(null, token);
          });
        } else {
          callback(null);
        }
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/web_identity_credentials.js
var require_web_identity_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/web_identity_credentials.js"() {
    var AWS2 = require_core();
    var STS = require_sts2();
    AWS2.WebIdentityCredentials = AWS2.util.inherit(AWS2.Credentials, {
      /**
       * Creates a new credentials object.
       * @param (see AWS.STS.assumeRoleWithWebIdentity)
       * @example Creating a new credentials object
       *   AWS.config.credentials = new AWS.WebIdentityCredentials({
       *     RoleArn: 'arn:aws:iam::1234567890:role/WebIdentity',
       *     WebIdentityToken: 'ABCDEFGHIJKLMNOP', // token from identity service
       *     RoleSessionName: 'web' // optional name, defaults to web-identity
       *   }, {
       *     // optionally provide configuration to apply to the underlying AWS.STS service client
       *     // if configuration is not provided, then configuration will be pulled from AWS.config
       *
       *     // specify timeout options
       *     httpOptions: {
       *       timeout: 100
       *     }
       *   });
       * @see AWS.STS.assumeRoleWithWebIdentity
       * @see AWS.Config
       */
      constructor: function WebIdentityCredentials(params, clientConfig) {
        AWS2.Credentials.call(this);
        this.expired = true;
        this.params = params;
        this.params.RoleSessionName = this.params.RoleSessionName || "web-identity";
        this.data = null;
        this._clientConfig = AWS2.util.copy(clientConfig || {});
      },
      /**
       * Refreshes credentials using {AWS.STS.assumeRoleWithWebIdentity}
       *
       * @callback callback function(err)
       *   Called when the STS service responds (or fails). When
       *   this callback is called with no error, it means that the credentials
       *   information has been loaded into the object (as the `accessKeyId`,
       *   `secretAccessKey`, and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @see get
       */
      refresh: function refresh(callback) {
        this.coalesceRefresh(callback || AWS2.util.fn.callback);
      },
      /**
       * @api private
       */
      load: function load(callback) {
        var self = this;
        self.createClients();
        self.service.assumeRoleWithWebIdentity(function(err, data) {
          self.data = null;
          if (!err) {
            self.data = data;
            self.service.credentialsFrom(data, self);
          }
          callback(err);
        });
      },
      /**
       * @api private
       */
      createClients: function() {
        if (!this.service) {
          var stsConfig = AWS2.util.merge({}, this._clientConfig);
          stsConfig.params = this.params;
          this.service = new STS(stsConfig);
        }
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/cognito-identity-2014-06-30.min.json
var require_cognito_identity_2014_06_30_min = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/cognito-identity-2014-06-30.min.json"(exports, module2) {
    module2.exports = {
      version: "2.0",
      metadata: {
        apiVersion: "2014-06-30",
        endpointPrefix: "cognito-identity",
        jsonVersion: "1.1",
        protocol: "json",
        serviceFullName: "Amazon Cognito Identity",
        serviceId: "Cognito Identity",
        signatureVersion: "v4",
        targetPrefix: "AWSCognitoIdentityService",
        uid: "cognito-identity-2014-06-30"
      },
      operations: {
        CreateIdentityPool: {
          input: {
            type: "structure",
            required: [
              "IdentityPoolName",
              "AllowUnauthenticatedIdentities"
            ],
            members: {
              IdentityPoolName: {},
              AllowUnauthenticatedIdentities: {
                type: "boolean"
              },
              AllowClassicFlow: {
                type: "boolean"
              },
              SupportedLoginProviders: {
                shape: "S5"
              },
              DeveloperProviderName: {},
              OpenIdConnectProviderARNs: {
                shape: "S9"
              },
              CognitoIdentityProviders: {
                shape: "Sb"
              },
              SamlProviderARNs: {
                shape: "Sg"
              },
              IdentityPoolTags: {
                shape: "Sh"
              }
            }
          },
          output: {
            shape: "Sk"
          }
        },
        DeleteIdentities: {
          input: {
            type: "structure",
            required: [
              "IdentityIdsToDelete"
            ],
            members: {
              IdentityIdsToDelete: {
                type: "list",
                member: {}
              }
            }
          },
          output: {
            type: "structure",
            members: {
              UnprocessedIdentityIds: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    IdentityId: {},
                    ErrorCode: {}
                  }
                }
              }
            }
          }
        },
        DeleteIdentityPool: {
          input: {
            type: "structure",
            required: [
              "IdentityPoolId"
            ],
            members: {
              IdentityPoolId: {}
            }
          }
        },
        DescribeIdentity: {
          input: {
            type: "structure",
            required: [
              "IdentityId"
            ],
            members: {
              IdentityId: {}
            }
          },
          output: {
            shape: "Sv"
          }
        },
        DescribeIdentityPool: {
          input: {
            type: "structure",
            required: [
              "IdentityPoolId"
            ],
            members: {
              IdentityPoolId: {}
            }
          },
          output: {
            shape: "Sk"
          }
        },
        GetCredentialsForIdentity: {
          input: {
            type: "structure",
            required: [
              "IdentityId"
            ],
            members: {
              IdentityId: {},
              Logins: {
                shape: "S10"
              },
              CustomRoleArn: {}
            }
          },
          output: {
            type: "structure",
            members: {
              IdentityId: {},
              Credentials: {
                type: "structure",
                members: {
                  AccessKeyId: {},
                  SecretKey: {},
                  SessionToken: {},
                  Expiration: {
                    type: "timestamp"
                  }
                }
              }
            }
          },
          authtype: "none"
        },
        GetId: {
          input: {
            type: "structure",
            required: [
              "IdentityPoolId"
            ],
            members: {
              AccountId: {},
              IdentityPoolId: {},
              Logins: {
                shape: "S10"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              IdentityId: {}
            }
          },
          authtype: "none"
        },
        GetIdentityPoolRoles: {
          input: {
            type: "structure",
            required: [
              "IdentityPoolId"
            ],
            members: {
              IdentityPoolId: {}
            }
          },
          output: {
            type: "structure",
            members: {
              IdentityPoolId: {},
              Roles: {
                shape: "S1c"
              },
              RoleMappings: {
                shape: "S1e"
              }
            }
          }
        },
        GetOpenIdToken: {
          input: {
            type: "structure",
            required: [
              "IdentityId"
            ],
            members: {
              IdentityId: {},
              Logins: {
                shape: "S10"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              IdentityId: {},
              Token: {}
            }
          },
          authtype: "none"
        },
        GetOpenIdTokenForDeveloperIdentity: {
          input: {
            type: "structure",
            required: [
              "IdentityPoolId",
              "Logins"
            ],
            members: {
              IdentityPoolId: {},
              IdentityId: {},
              Logins: {
                shape: "S10"
              },
              PrincipalTags: {
                shape: "S1s"
              },
              TokenDuration: {
                type: "long"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              IdentityId: {},
              Token: {}
            }
          }
        },
        GetPrincipalTagAttributeMap: {
          input: {
            type: "structure",
            required: [
              "IdentityPoolId",
              "IdentityProviderName"
            ],
            members: {
              IdentityPoolId: {},
              IdentityProviderName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              IdentityPoolId: {},
              IdentityProviderName: {},
              UseDefaults: {
                type: "boolean"
              },
              PrincipalTags: {
                shape: "S1s"
              }
            }
          }
        },
        ListIdentities: {
          input: {
            type: "structure",
            required: [
              "IdentityPoolId",
              "MaxResults"
            ],
            members: {
              IdentityPoolId: {},
              MaxResults: {
                type: "integer"
              },
              NextToken: {},
              HideDisabled: {
                type: "boolean"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              IdentityPoolId: {},
              Identities: {
                type: "list",
                member: {
                  shape: "Sv"
                }
              },
              NextToken: {}
            }
          }
        },
        ListIdentityPools: {
          input: {
            type: "structure",
            required: [
              "MaxResults"
            ],
            members: {
              MaxResults: {
                type: "integer"
              },
              NextToken: {}
            }
          },
          output: {
            type: "structure",
            members: {
              IdentityPools: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    IdentityPoolId: {},
                    IdentityPoolName: {}
                  }
                }
              },
              NextToken: {}
            }
          }
        },
        ListTagsForResource: {
          input: {
            type: "structure",
            required: [
              "ResourceArn"
            ],
            members: {
              ResourceArn: {}
            }
          },
          output: {
            type: "structure",
            members: {
              Tags: {
                shape: "Sh"
              }
            }
          }
        },
        LookupDeveloperIdentity: {
          input: {
            type: "structure",
            required: [
              "IdentityPoolId"
            ],
            members: {
              IdentityPoolId: {},
              IdentityId: {},
              DeveloperUserIdentifier: {},
              MaxResults: {
                type: "integer"
              },
              NextToken: {}
            }
          },
          output: {
            type: "structure",
            members: {
              IdentityId: {},
              DeveloperUserIdentifierList: {
                type: "list",
                member: {}
              },
              NextToken: {}
            }
          }
        },
        MergeDeveloperIdentities: {
          input: {
            type: "structure",
            required: [
              "SourceUserIdentifier",
              "DestinationUserIdentifier",
              "DeveloperProviderName",
              "IdentityPoolId"
            ],
            members: {
              SourceUserIdentifier: {},
              DestinationUserIdentifier: {},
              DeveloperProviderName: {},
              IdentityPoolId: {}
            }
          },
          output: {
            type: "structure",
            members: {
              IdentityId: {}
            }
          }
        },
        SetIdentityPoolRoles: {
          input: {
            type: "structure",
            required: [
              "IdentityPoolId",
              "Roles"
            ],
            members: {
              IdentityPoolId: {},
              Roles: {
                shape: "S1c"
              },
              RoleMappings: {
                shape: "S1e"
              }
            }
          }
        },
        SetPrincipalTagAttributeMap: {
          input: {
            type: "structure",
            required: [
              "IdentityPoolId",
              "IdentityProviderName"
            ],
            members: {
              IdentityPoolId: {},
              IdentityProviderName: {},
              UseDefaults: {
                type: "boolean"
              },
              PrincipalTags: {
                shape: "S1s"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              IdentityPoolId: {},
              IdentityProviderName: {},
              UseDefaults: {
                type: "boolean"
              },
              PrincipalTags: {
                shape: "S1s"
              }
            }
          }
        },
        TagResource: {
          input: {
            type: "structure",
            required: [
              "ResourceArn",
              "Tags"
            ],
            members: {
              ResourceArn: {},
              Tags: {
                shape: "Sh"
              }
            }
          },
          output: {
            type: "structure",
            members: {}
          }
        },
        UnlinkDeveloperIdentity: {
          input: {
            type: "structure",
            required: [
              "IdentityId",
              "IdentityPoolId",
              "DeveloperProviderName",
              "DeveloperUserIdentifier"
            ],
            members: {
              IdentityId: {},
              IdentityPoolId: {},
              DeveloperProviderName: {},
              DeveloperUserIdentifier: {}
            }
          }
        },
        UnlinkIdentity: {
          input: {
            type: "structure",
            required: [
              "IdentityId",
              "Logins",
              "LoginsToRemove"
            ],
            members: {
              IdentityId: {},
              Logins: {
                shape: "S10"
              },
              LoginsToRemove: {
                shape: "Sw"
              }
            }
          },
          authtype: "none"
        },
        UntagResource: {
          input: {
            type: "structure",
            required: [
              "ResourceArn",
              "TagKeys"
            ],
            members: {
              ResourceArn: {},
              TagKeys: {
                type: "list",
                member: {}
              }
            }
          },
          output: {
            type: "structure",
            members: {}
          }
        },
        UpdateIdentityPool: {
          input: {
            shape: "Sk"
          },
          output: {
            shape: "Sk"
          }
        }
      },
      shapes: {
        S5: {
          type: "map",
          key: {},
          value: {}
        },
        S9: {
          type: "list",
          member: {}
        },
        Sb: {
          type: "list",
          member: {
            type: "structure",
            members: {
              ProviderName: {},
              ClientId: {},
              ServerSideTokenCheck: {
                type: "boolean"
              }
            }
          }
        },
        Sg: {
          type: "list",
          member: {}
        },
        Sh: {
          type: "map",
          key: {},
          value: {}
        },
        Sk: {
          type: "structure",
          required: [
            "IdentityPoolId",
            "IdentityPoolName",
            "AllowUnauthenticatedIdentities"
          ],
          members: {
            IdentityPoolId: {},
            IdentityPoolName: {},
            AllowUnauthenticatedIdentities: {
              type: "boolean"
            },
            AllowClassicFlow: {
              type: "boolean"
            },
            SupportedLoginProviders: {
              shape: "S5"
            },
            DeveloperProviderName: {},
            OpenIdConnectProviderARNs: {
              shape: "S9"
            },
            CognitoIdentityProviders: {
              shape: "Sb"
            },
            SamlProviderARNs: {
              shape: "Sg"
            },
            IdentityPoolTags: {
              shape: "Sh"
            }
          }
        },
        Sv: {
          type: "structure",
          members: {
            IdentityId: {},
            Logins: {
              shape: "Sw"
            },
            CreationDate: {
              type: "timestamp"
            },
            LastModifiedDate: {
              type: "timestamp"
            }
          }
        },
        Sw: {
          type: "list",
          member: {}
        },
        S10: {
          type: "map",
          key: {},
          value: {}
        },
        S1c: {
          type: "map",
          key: {},
          value: {}
        },
        S1e: {
          type: "map",
          key: {},
          value: {
            type: "structure",
            required: [
              "Type"
            ],
            members: {
              Type: {},
              AmbiguousRoleResolution: {},
              RulesConfiguration: {
                type: "structure",
                required: [
                  "Rules"
                ],
                members: {
                  Rules: {
                    type: "list",
                    member: {
                      type: "structure",
                      required: [
                        "Claim",
                        "MatchType",
                        "Value",
                        "RoleARN"
                      ],
                      members: {
                        Claim: {},
                        MatchType: {},
                        Value: {},
                        RoleARN: {}
                      }
                    }
                  }
                }
              }
            }
          }
        },
        S1s: {
          type: "map",
          key: {},
          value: {}
        }
      }
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/cognito-identity-2014-06-30.paginators.json
var require_cognito_identity_2014_06_30_paginators = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/cognito-identity-2014-06-30.paginators.json"(exports, module2) {
    module2.exports = {
      pagination: {
        ListIdentityPools: {
          input_token: "NextToken",
          limit_key: "MaxResults",
          output_token: "NextToken",
          result_key: "IdentityPools"
        }
      }
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/clients/cognitoidentity.js
var require_cognitoidentity = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/clients/cognitoidentity.js"(exports, module2) {
    require_node_loader();
    var AWS2 = require_core();
    var Service = AWS2.Service;
    var apiLoader = AWS2.apiLoader;
    apiLoader.services["cognitoidentity"] = {};
    AWS2.CognitoIdentity = Service.defineService("cognitoidentity", ["2014-06-30"]);
    Object.defineProperty(apiLoader.services["cognitoidentity"], "2014-06-30", {
      get: function get() {
        var model = require_cognito_identity_2014_06_30_min();
        model.paginators = require_cognito_identity_2014_06_30_paginators().pagination;
        return model;
      },
      enumerable: true,
      configurable: true
    });
    module2.exports = AWS2.CognitoIdentity;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/cognito_identity_credentials.js
var require_cognito_identity_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/cognito_identity_credentials.js"() {
    var AWS2 = require_core();
    var CognitoIdentity = require_cognitoidentity();
    var STS = require_sts2();
    AWS2.CognitoIdentityCredentials = AWS2.util.inherit(AWS2.Credentials, {
      /**
       * @api private
       */
      localStorageKey: {
        id: "aws.cognito.identity-id.",
        providers: "aws.cognito.identity-providers."
      },
      /**
       * Creates a new credentials object.
       * @example Creating a new credentials object
       *   AWS.config.credentials = new AWS.CognitoIdentityCredentials({
       *
       *     // either IdentityPoolId or IdentityId is required
       *     // See the IdentityPoolId param for AWS.CognitoIdentity.getID (linked below)
       *     // See the IdentityId param for AWS.CognitoIdentity.getCredentialsForIdentity
       *     // or AWS.CognitoIdentity.getOpenIdToken (linked below)
       *     IdentityPoolId: 'us-east-1:1699ebc0-7900-4099-b910-2df94f52a030',
       *     IdentityId: 'us-east-1:128d0a74-c82f-4553-916d-90053e4a8b0f'
       *
       *     // optional, only necessary when the identity pool is not configured
       *     // to use IAM roles in the Amazon Cognito Console
       *     // See the RoleArn param for AWS.STS.assumeRoleWithWebIdentity (linked below)
       *     RoleArn: 'arn:aws:iam::1234567890:role/MYAPP-CognitoIdentity',
       *
       *     // optional tokens, used for authenticated login
       *     // See the Logins param for AWS.CognitoIdentity.getID (linked below)
       *     Logins: {
       *       'graph.facebook.com': 'FBTOKEN',
       *       'www.amazon.com': 'AMAZONTOKEN',
       *       'accounts.google.com': 'GOOGLETOKEN',
       *       'api.twitter.com': 'TWITTERTOKEN',
       *       'www.digits.com': 'DIGITSTOKEN'
       *     },
       *
       *     // optional name, defaults to web-identity
       *     // See the RoleSessionName param for AWS.STS.assumeRoleWithWebIdentity (linked below)
       *     RoleSessionName: 'web',
       *
       *     // optional, only necessary when application runs in a browser
       *     // and multiple users are signed in at once, used for caching
       *     LoginId: 'example@gmail.com'
       *
       *   }, {
       *      // optionally provide configuration to apply to the underlying service clients
       *      // if configuration is not provided, then configuration will be pulled from AWS.config
       *
       *      // region should match the region your identity pool is located in
       *      region: 'us-east-1',
       *
       *      // specify timeout options
       *      httpOptions: {
       *        timeout: 100
       *      }
       *   });
       * @see AWS.CognitoIdentity.getId
       * @see AWS.CognitoIdentity.getCredentialsForIdentity
       * @see AWS.STS.assumeRoleWithWebIdentity
       * @see AWS.CognitoIdentity.getOpenIdToken
       * @see AWS.Config
       * @note If a region is not provided in the global AWS.config, or
       *   specified in the `clientConfig` to the CognitoIdentityCredentials
       *   constructor, you may encounter a 'Missing credentials in config' error
       *   when calling making a service call.
       */
      constructor: function CognitoIdentityCredentials(params, clientConfig) {
        AWS2.Credentials.call(this);
        this.expired = true;
        this.params = params;
        this.data = null;
        this._identityId = null;
        this._clientConfig = AWS2.util.copy(clientConfig || {});
        this.loadCachedId();
        var self = this;
        Object.defineProperty(this, "identityId", {
          get: function() {
            self.loadCachedId();
            return self._identityId || self.params.IdentityId;
          },
          set: function(identityId) {
            self._identityId = identityId;
          }
        });
      },
      /**
       * Refreshes credentials using {AWS.CognitoIdentity.getCredentialsForIdentity},
       * or {AWS.STS.assumeRoleWithWebIdentity}.
       *
       * @callback callback function(err)
       *   Called when the STS service responds (or fails). When
       *   this callback is called with no error, it means that the credentials
       *   information has been loaded into the object (as the `accessKeyId`,
       *   `secretAccessKey`, and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @see AWS.Credentials.get
       */
      refresh: function refresh(callback) {
        this.coalesceRefresh(callback || AWS2.util.fn.callback);
      },
      /**
       * @api private
       * @param callback
       */
      load: function load(callback) {
        var self = this;
        self.createClients();
        self.data = null;
        self._identityId = null;
        self.getId(function(err) {
          if (!err) {
            if (!self.params.RoleArn) {
              self.getCredentialsForIdentity(callback);
            } else {
              self.getCredentialsFromSTS(callback);
            }
          } else {
            self.clearIdOnNotAuthorized(err);
            callback(err);
          }
        });
      },
      /**
       * Clears the cached Cognito ID associated with the currently configured
       * identity pool ID. Use this to manually invalidate your cache if
       * the identity pool ID was deleted.
       */
      clearCachedId: function clearCache() {
        this._identityId = null;
        delete this.params.IdentityId;
        var poolId = this.params.IdentityPoolId;
        var loginId = this.params.LoginId || "";
        delete this.storage[this.localStorageKey.id + poolId + loginId];
        delete this.storage[this.localStorageKey.providers + poolId + loginId];
      },
      /**
       * @api private
       */
      clearIdOnNotAuthorized: function clearIdOnNotAuthorized(err) {
        var self = this;
        if (err.code == "NotAuthorizedException") {
          self.clearCachedId();
        }
      },
      /**
       * Retrieves a Cognito ID, loading from cache if it was already retrieved
       * on this device.
       *
       * @callback callback function(err, identityId)
       *   @param err [Error, null] an error object if the call failed or null if
       *     it succeeded.
       *   @param identityId [String, null] if successful, the callback will return
       *     the Cognito ID.
       * @note If not loaded explicitly, the Cognito ID is loaded and stored in
       *   localStorage in the browser environment of a device.
       * @api private
       */
      getId: function getId(callback) {
        var self = this;
        if (typeof self.params.IdentityId === "string") {
          return callback(null, self.params.IdentityId);
        }
        self.cognito.getId(function(err, data) {
          if (!err && data.IdentityId) {
            self.params.IdentityId = data.IdentityId;
            callback(null, data.IdentityId);
          } else {
            callback(err);
          }
        });
      },
      /**
       * @api private
       */
      loadCredentials: function loadCredentials(data, credentials) {
        if (!data || !credentials)
          return;
        credentials.expired = false;
        credentials.accessKeyId = data.Credentials.AccessKeyId;
        credentials.secretAccessKey = data.Credentials.SecretKey;
        credentials.sessionToken = data.Credentials.SessionToken;
        credentials.expireTime = data.Credentials.Expiration;
      },
      /**
       * @api private
       */
      getCredentialsForIdentity: function getCredentialsForIdentity(callback) {
        var self = this;
        self.cognito.getCredentialsForIdentity(function(err, data) {
          if (!err) {
            self.cacheId(data);
            self.data = data;
            self.loadCredentials(self.data, self);
          } else {
            self.clearIdOnNotAuthorized(err);
          }
          callback(err);
        });
      },
      /**
       * @api private
       */
      getCredentialsFromSTS: function getCredentialsFromSTS(callback) {
        var self = this;
        self.cognito.getOpenIdToken(function(err, data) {
          if (!err) {
            self.cacheId(data);
            self.params.WebIdentityToken = data.Token;
            self.webIdentityCredentials.refresh(function(webErr) {
              if (!webErr) {
                self.data = self.webIdentityCredentials.data;
                self.sts.credentialsFrom(self.data, self);
              }
              callback(webErr);
            });
          } else {
            self.clearIdOnNotAuthorized(err);
            callback(err);
          }
        });
      },
      /**
       * @api private
       */
      loadCachedId: function loadCachedId() {
        var self = this;
        if (AWS2.util.isBrowser() && !self.params.IdentityId) {
          var id = self.getStorage("id");
          if (id && self.params.Logins) {
            var actualProviders = Object.keys(self.params.Logins);
            var cachedProviders = (self.getStorage("providers") || "").split(",");
            var intersect = cachedProviders.filter(function(n) {
              return actualProviders.indexOf(n) !== -1;
            });
            if (intersect.length !== 0) {
              self.params.IdentityId = id;
            }
          } else if (id) {
            self.params.IdentityId = id;
          }
        }
      },
      /**
       * @api private
       */
      createClients: function() {
        var clientConfig = this._clientConfig;
        this.webIdentityCredentials = this.webIdentityCredentials || new AWS2.WebIdentityCredentials(this.params, clientConfig);
        if (!this.cognito) {
          var cognitoConfig = AWS2.util.merge({}, clientConfig);
          cognitoConfig.params = this.params;
          this.cognito = new CognitoIdentity(cognitoConfig);
        }
        this.sts = this.sts || new STS(clientConfig);
      },
      /**
       * @api private
       */
      cacheId: function cacheId(data) {
        this._identityId = data.IdentityId;
        this.params.IdentityId = this._identityId;
        if (AWS2.util.isBrowser()) {
          this.setStorage("id", data.IdentityId);
          if (this.params.Logins) {
            this.setStorage("providers", Object.keys(this.params.Logins).join(","));
          }
        }
      },
      /**
       * @api private
       */
      getStorage: function getStorage(key) {
        return this.storage[this.localStorageKey[key] + this.params.IdentityPoolId + (this.params.LoginId || "")];
      },
      /**
       * @api private
       */
      setStorage: function setStorage(key, val) {
        try {
          this.storage[this.localStorageKey[key] + this.params.IdentityPoolId + (this.params.LoginId || "")] = val;
        } catch (_) {
        }
      },
      /**
       * @api private
       */
      storage: function() {
        try {
          var storage = AWS2.util.isBrowser() && window.localStorage !== null && typeof window.localStorage === "object" ? window.localStorage : {};
          storage["aws.test-storage"] = "foobar";
          delete storage["aws.test-storage"];
          return storage;
        } catch (_) {
          return {};
        }
      }()
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/saml_credentials.js
var require_saml_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/saml_credentials.js"() {
    var AWS2 = require_core();
    var STS = require_sts2();
    AWS2.SAMLCredentials = AWS2.util.inherit(AWS2.Credentials, {
      /**
       * Creates a new credentials object.
       * @param (see AWS.STS.assumeRoleWithSAML)
       * @example Creating a new credentials object
       *   AWS.config.credentials = new AWS.SAMLCredentials({
       *     RoleArn: 'arn:aws:iam::1234567890:role/SAMLRole',
       *     PrincipalArn: 'arn:aws:iam::1234567890:role/SAMLPrincipal',
       *     SAMLAssertion: 'base64-token', // base64-encoded token from IdP
       *   });
       * @see AWS.STS.assumeRoleWithSAML
       */
      constructor: function SAMLCredentials(params) {
        AWS2.Credentials.call(this);
        this.expired = true;
        this.params = params;
      },
      /**
       * Refreshes credentials using {AWS.STS.assumeRoleWithSAML}
       *
       * @callback callback function(err)
       *   Called when the STS service responds (or fails). When
       *   this callback is called with no error, it means that the credentials
       *   information has been loaded into the object (as the `accessKeyId`,
       *   `secretAccessKey`, and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @see get
       */
      refresh: function refresh(callback) {
        this.coalesceRefresh(callback || AWS2.util.fn.callback);
      },
      /**
       * @api private
       */
      load: function load(callback) {
        var self = this;
        self.createClients();
        self.service.assumeRoleWithSAML(function(err, data) {
          if (!err) {
            self.service.credentialsFrom(data, self);
          }
          callback(err);
        });
      },
      /**
       * @api private
       */
      createClients: function() {
        this.service = this.service || new STS({ params: this.params });
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/process_credentials.js
var require_process_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/process_credentials.js"() {
    var AWS2 = require_core();
    var proc = require("child_process");
    var iniLoader = AWS2.util.iniLoader;
    AWS2.ProcessCredentials = AWS2.util.inherit(AWS2.Credentials, {
      /**
       * Creates a new ProcessCredentials object.
       *
       * @param options [map] a set of options
       * @option options profile [String] (AWS_PROFILE env var or 'default')
       *   the name of the profile to load.
       * @option options filename [String] ('~/.aws/credentials' or defined by
       *   AWS_SHARED_CREDENTIALS_FILE process env var)
       *   the filename to use when loading credentials.
       * @option options callback [Function] (err) Credentials are eagerly loaded
       *   by the constructor. When the callback is called with no error, the
       *   credentials have been loaded successfully.
       */
      constructor: function ProcessCredentials(options) {
        AWS2.Credentials.call(this);
        options = options || {};
        this.filename = options.filename;
        this.profile = options.profile || process.env.AWS_PROFILE || AWS2.util.defaultProfile;
        this.get(options.callback || AWS2.util.fn.noop);
      },
      /**
       * @api private
       */
      load: function load(callback) {
        var self = this;
        try {
          var profiles = AWS2.util.getProfilesFromSharedConfig(iniLoader, this.filename);
          var profile = profiles[this.profile] || {};
          if (Object.keys(profile).length === 0) {
            throw AWS2.util.error(
              new Error("Profile " + this.profile + " not found"),
              { code: "ProcessCredentialsProviderFailure" }
            );
          }
          if (profile["credential_process"]) {
            this.loadViaCredentialProcess(profile, function(err, data) {
              if (err) {
                callback(err, null);
              } else {
                self.expired = false;
                self.accessKeyId = data.AccessKeyId;
                self.secretAccessKey = data.SecretAccessKey;
                self.sessionToken = data.SessionToken;
                if (data.Expiration) {
                  self.expireTime = new Date(data.Expiration);
                }
                callback(null);
              }
            });
          } else {
            throw AWS2.util.error(
              new Error("Profile " + this.profile + " did not include credential process"),
              { code: "ProcessCredentialsProviderFailure" }
            );
          }
        } catch (err) {
          callback(err);
        }
      },
      /**
      * Executes the credential_process and retrieves
      * credentials from the output
      * @api private
      * @param profile [map] credentials profile
      * @throws ProcessCredentialsProviderFailure
      */
      loadViaCredentialProcess: function loadViaCredentialProcess(profile, callback) {
        proc.exec(profile["credential_process"], { env: process.env }, function(err, stdOut, stdErr) {
          if (err) {
            callback(AWS2.util.error(
              new Error("credential_process returned error"),
              { code: "ProcessCredentialsProviderFailure" }
            ), null);
          } else {
            try {
              var credData = JSON.parse(stdOut);
              if (credData.Expiration) {
                var currentTime = AWS2.util.date.getDate();
                var expireTime = new Date(credData.Expiration);
                if (expireTime < currentTime) {
                  throw Error("credential_process returned expired credentials");
                }
              }
              if (credData.Version !== 1) {
                throw Error("credential_process does not return Version == 1");
              }
              callback(null, credData);
            } catch (err2) {
              callback(AWS2.util.error(
                new Error(err2.message),
                { code: "ProcessCredentialsProviderFailure" }
              ), null);
            }
          }
        });
      },
      /**
       * Loads the credentials from the credential process
       *
       * @callback callback function(err)
       *   Called after the credential process has been executed. When this
       *   callback is called with no error, it means that the credentials
       *   information has been loaded into the object (as the `accessKeyId`,
       *   `secretAccessKey`, and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @see get
       */
      refresh: function refresh(callback) {
        iniLoader.clearCachedFiles();
        this.coalesceRefresh(callback || AWS2.util.fn.callback);
      }
    });
  }
});

// node_modules/.pnpm/xml2js@0.4.19/node_modules/xml2js/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/.pnpm/xml2js@0.4.19/node_modules/xml2js/lib/defaults.js"(exports) {
    (function() {
      exports.defaults = {
        "0.1": {
          explicitCharkey: false,
          trim: true,
          normalize: true,
          normalizeTags: false,
          attrkey: "@",
          charkey: "#",
          explicitArray: false,
          ignoreAttrs: false,
          mergeAttrs: false,
          explicitRoot: false,
          validator: null,
          xmlns: false,
          explicitChildren: false,
          childkey: "@@",
          charsAsChildren: false,
          includeWhiteChars: false,
          async: false,
          strict: true,
          attrNameProcessors: null,
          attrValueProcessors: null,
          tagNameProcessors: null,
          valueProcessors: null,
          emptyTag: ""
        },
        "0.2": {
          explicitCharkey: false,
          trim: false,
          normalize: false,
          normalizeTags: false,
          attrkey: "$",
          charkey: "_",
          explicitArray: true,
          ignoreAttrs: false,
          mergeAttrs: false,
          explicitRoot: true,
          validator: null,
          xmlns: false,
          explicitChildren: false,
          preserveChildrenOrder: false,
          childkey: "$$",
          charsAsChildren: false,
          includeWhiteChars: false,
          async: false,
          strict: true,
          attrNameProcessors: null,
          attrValueProcessors: null,
          tagNameProcessors: null,
          valueProcessors: null,
          rootName: "root",
          xmldec: {
            "version": "1.0",
            "encoding": "UTF-8",
            "standalone": true
          },
          doctype: null,
          renderOpts: {
            "pretty": true,
            "indent": "  ",
            "newline": "\n"
          },
          headless: false,
          chunkSize: 1e4,
          emptyTag: "",
          cdata: false
        }
      };
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/Utility.js
var require_Utility = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/Utility.js"(exports, module2) {
    (function() {
      var assign, isArray, isEmpty, isFunction, isObject, isPlainObject, slice = [].slice, hasProp = {}.hasOwnProperty;
      assign = function() {
        var i, key, len, source, sources, target;
        target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        if (isFunction(Object.assign)) {
          Object.assign.apply(null, arguments);
        } else {
          for (i = 0, len = sources.length; i < len; i++) {
            source = sources[i];
            if (source != null) {
              for (key in source) {
                if (!hasProp.call(source, key))
                  continue;
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      };
      isFunction = function(val) {
        return !!val && Object.prototype.toString.call(val) === "[object Function]";
      };
      isObject = function(val) {
        var ref;
        return !!val && ((ref = typeof val) === "function" || ref === "object");
      };
      isArray = function(val) {
        if (isFunction(Array.isArray)) {
          return Array.isArray(val);
        } else {
          return Object.prototype.toString.call(val) === "[object Array]";
        }
      };
      isEmpty = function(val) {
        var key;
        if (isArray(val)) {
          return !val.length;
        } else {
          for (key in val) {
            if (!hasProp.call(val, key))
              continue;
            return false;
          }
          return true;
        }
      };
      isPlainObject = function(val) {
        var ctor, proto;
        return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && typeof ctor === "function" && ctor instanceof ctor && Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object);
      };
      module2.exports.assign = assign;
      module2.exports.isFunction = isFunction;
      module2.exports.isObject = isObject;
      module2.exports.isArray = isArray;
      module2.exports.isEmpty = isEmpty;
      module2.exports.isPlainObject = isPlainObject;
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLAttribute.js
var require_XMLAttribute = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLAttribute.js"(exports, module2) {
    (function() {
      var XMLAttribute;
      module2.exports = XMLAttribute = function() {
        function XMLAttribute2(parent, name, value) {
          this.options = parent.options;
          this.stringify = parent.stringify;
          if (name == null) {
            throw new Error("Missing attribute name of element " + parent.name);
          }
          if (value == null) {
            throw new Error("Missing attribute value for attribute " + name + " of element " + parent.name);
          }
          this.name = this.stringify.attName(name);
          this.value = this.stringify.attValue(value);
        }
        XMLAttribute2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLAttribute2.prototype.toString = function(options) {
          return this.options.writer.set(options).attribute(this);
        };
        return XMLAttribute2;
      }();
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLElement.js
var require_XMLElement = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLElement.js"(exports, module2) {
    (function() {
      var XMLAttribute, XMLElement, XMLNode, isFunction, isObject, ref, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction;
      XMLNode = require_XMLNode();
      XMLAttribute = require_XMLAttribute();
      module2.exports = XMLElement = function(superClass) {
        extend(XMLElement2, superClass);
        function XMLElement2(parent, name, attributes) {
          XMLElement2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing element name");
          }
          this.name = this.stringify.eleName(name);
          this.attributes = {};
          if (attributes != null) {
            this.attribute(attributes);
          }
          if (parent.isDocument) {
            this.isRoot = true;
            this.documentObject = parent;
            parent.rootObject = this;
          }
        }
        XMLElement2.prototype.clone = function() {
          var att, attName, clonedSelf, ref1;
          clonedSelf = Object.create(this);
          if (clonedSelf.isRoot) {
            clonedSelf.documentObject = null;
          }
          clonedSelf.attributes = {};
          ref1 = this.attributes;
          for (attName in ref1) {
            if (!hasProp.call(ref1, attName))
              continue;
            att = ref1[attName];
            clonedSelf.attributes[attName] = att.clone();
          }
          clonedSelf.children = [];
          this.children.forEach(function(child) {
            var clonedChild;
            clonedChild = child.clone();
            clonedChild.parent = clonedSelf;
            return clonedSelf.children.push(clonedChild);
          });
          return clonedSelf;
        };
        XMLElement2.prototype.attribute = function(name, value) {
          var attName, attValue;
          if (name != null) {
            name = name.valueOf();
          }
          if (isObject(name)) {
            for (attName in name) {
              if (!hasProp.call(name, attName))
                continue;
              attValue = name[attName];
              this.attribute(attName, attValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            if (!this.options.skipNullAttributes || value != null) {
              this.attributes[name] = new XMLAttribute(this, name, value);
            }
          }
          return this;
        };
        XMLElement2.prototype.removeAttribute = function(name) {
          var attName, i, len;
          if (name == null) {
            throw new Error("Missing attribute name");
          }
          name = name.valueOf();
          if (Array.isArray(name)) {
            for (i = 0, len = name.length; i < len; i++) {
              attName = name[i];
              delete this.attributes[attName];
            }
          } else {
            delete this.attributes[name];
          }
          return this;
        };
        XMLElement2.prototype.toString = function(options) {
          return this.options.writer.set(options).element(this);
        };
        XMLElement2.prototype.att = function(name, value) {
          return this.attribute(name, value);
        };
        XMLElement2.prototype.a = function(name, value) {
          return this.attribute(name, value);
        };
        return XMLElement2;
      }(XMLNode);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLCData.js
var require_XMLCData = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLCData.js"(exports, module2) {
    (function() {
      var XMLCData, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      module2.exports = XMLCData = function(superClass) {
        extend(XMLCData2, superClass);
        function XMLCData2(parent, text) {
          XMLCData2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing CDATA text");
          }
          this.text = this.stringify.cdata(text);
        }
        XMLCData2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLCData2.prototype.toString = function(options) {
          return this.options.writer.set(options).cdata(this);
        };
        return XMLCData2;
      }(XMLNode);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLComment.js
var require_XMLComment = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLComment.js"(exports, module2) {
    (function() {
      var XMLComment, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      module2.exports = XMLComment = function(superClass) {
        extend(XMLComment2, superClass);
        function XMLComment2(parent, text) {
          XMLComment2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing comment text");
          }
          this.text = this.stringify.comment(text);
        }
        XMLComment2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLComment2.prototype.toString = function(options) {
          return this.options.writer.set(options).comment(this);
        };
        return XMLComment2;
      }(XMLNode);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDeclaration.js
var require_XMLDeclaration = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDeclaration.js"(exports, module2) {
    (function() {
      var XMLDeclaration, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      module2.exports = XMLDeclaration = function(superClass) {
        extend(XMLDeclaration2, superClass);
        function XMLDeclaration2(parent, version, encoding, standalone) {
          var ref;
          XMLDeclaration2.__super__.constructor.call(this, parent);
          if (isObject(version)) {
            ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
          }
          if (!version) {
            version = "1.0";
          }
          this.version = this.stringify.xmlVersion(version);
          if (encoding != null) {
            this.encoding = this.stringify.xmlEncoding(encoding);
          }
          if (standalone != null) {
            this.standalone = this.stringify.xmlStandalone(standalone);
          }
        }
        XMLDeclaration2.prototype.toString = function(options) {
          return this.options.writer.set(options).declaration(this);
        };
        return XMLDeclaration2;
      }(XMLNode);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDTDAttList.js
var require_XMLDTDAttList = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDTDAttList.js"(exports, module2) {
    (function() {
      var XMLDTDAttList, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      module2.exports = XMLDTDAttList = function(superClass) {
        extend(XMLDTDAttList2, superClass);
        function XMLDTDAttList2(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          XMLDTDAttList2.__super__.constructor.call(this, parent);
          if (elementName == null) {
            throw new Error("Missing DTD element name");
          }
          if (attributeName == null) {
            throw new Error("Missing DTD attribute name");
          }
          if (!attributeType) {
            throw new Error("Missing DTD attribute type");
          }
          if (!defaultValueType) {
            throw new Error("Missing DTD attribute default");
          }
          if (defaultValueType.indexOf("#") !== 0) {
            defaultValueType = "#" + defaultValueType;
          }
          if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
            throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT");
          }
          if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
            throw new Error("Default value only applies to #FIXED or #DEFAULT");
          }
          this.elementName = this.stringify.eleName(elementName);
          this.attributeName = this.stringify.attName(attributeName);
          this.attributeType = this.stringify.dtdAttType(attributeType);
          this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
          this.defaultValueType = defaultValueType;
        }
        XMLDTDAttList2.prototype.toString = function(options) {
          return this.options.writer.set(options).dtdAttList(this);
        };
        return XMLDTDAttList2;
      }(XMLNode);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDTDEntity.js
var require_XMLDTDEntity = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDTDEntity.js"(exports, module2) {
    (function() {
      var XMLDTDEntity, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      module2.exports = XMLDTDEntity = function(superClass) {
        extend(XMLDTDEntity2, superClass);
        function XMLDTDEntity2(parent, pe, name, value) {
          XMLDTDEntity2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing entity name");
          }
          if (value == null) {
            throw new Error("Missing entity value");
          }
          this.pe = !!pe;
          this.name = this.stringify.eleName(name);
          if (!isObject(value)) {
            this.value = this.stringify.dtdEntityValue(value);
          } else {
            if (!value.pubID && !value.sysID) {
              throw new Error("Public and/or system identifiers are required for an external entity");
            }
            if (value.pubID && !value.sysID) {
              throw new Error("System identifier is required for a public external entity");
            }
            if (value.pubID != null) {
              this.pubID = this.stringify.dtdPubID(value.pubID);
            }
            if (value.sysID != null) {
              this.sysID = this.stringify.dtdSysID(value.sysID);
            }
            if (value.nData != null) {
              this.nData = this.stringify.dtdNData(value.nData);
            }
            if (this.pe && this.nData) {
              throw new Error("Notation declaration is not allowed in a parameter entity");
            }
          }
        }
        XMLDTDEntity2.prototype.toString = function(options) {
          return this.options.writer.set(options).dtdEntity(this);
        };
        return XMLDTDEntity2;
      }(XMLNode);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDTDElement.js
var require_XMLDTDElement = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDTDElement.js"(exports, module2) {
    (function() {
      var XMLDTDElement, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      module2.exports = XMLDTDElement = function(superClass) {
        extend(XMLDTDElement2, superClass);
        function XMLDTDElement2(parent, name, value) {
          XMLDTDElement2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing DTD element name");
          }
          if (!value) {
            value = "(#PCDATA)";
          }
          if (Array.isArray(value)) {
            value = "(" + value.join(",") + ")";
          }
          this.name = this.stringify.eleName(name);
          this.value = this.stringify.dtdElementValue(value);
        }
        XMLDTDElement2.prototype.toString = function(options) {
          return this.options.writer.set(options).dtdElement(this);
        };
        return XMLDTDElement2;
      }(XMLNode);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDTDNotation.js
var require_XMLDTDNotation = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDTDNotation.js"(exports, module2) {
    (function() {
      var XMLDTDNotation, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      module2.exports = XMLDTDNotation = function(superClass) {
        extend(XMLDTDNotation2, superClass);
        function XMLDTDNotation2(parent, name, value) {
          XMLDTDNotation2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing notation name");
          }
          if (!value.pubID && !value.sysID) {
            throw new Error("Public or system identifiers are required for an external entity");
          }
          this.name = this.stringify.eleName(name);
          if (value.pubID != null) {
            this.pubID = this.stringify.dtdPubID(value.pubID);
          }
          if (value.sysID != null) {
            this.sysID = this.stringify.dtdSysID(value.sysID);
          }
        }
        XMLDTDNotation2.prototype.toString = function(options) {
          return this.options.writer.set(options).dtdNotation(this);
        };
        return XMLDTDNotation2;
      }(XMLNode);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDocType.js
var require_XMLDocType = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDocType.js"(exports, module2) {
    (function() {
      var XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDNotation = require_XMLDTDNotation();
      module2.exports = XMLDocType = function(superClass) {
        extend(XMLDocType2, superClass);
        function XMLDocType2(parent, pubID, sysID) {
          var ref, ref1;
          XMLDocType2.__super__.constructor.call(this, parent);
          this.documentObject = parent;
          if (isObject(pubID)) {
            ref = pubID, pubID = ref.pubID, sysID = ref.sysID;
          }
          if (sysID == null) {
            ref1 = [pubID, sysID], sysID = ref1[0], pubID = ref1[1];
          }
          if (pubID != null) {
            this.pubID = this.stringify.dtdPubID(pubID);
          }
          if (sysID != null) {
            this.sysID = this.stringify.dtdSysID(sysID);
          }
        }
        XMLDocType2.prototype.element = function(name, value) {
          var child;
          child = new XMLDTDElement(this, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          var child;
          child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.entity = function(name, value) {
          var child;
          child = new XMLDTDEntity(this, false, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.pEntity = function(name, value) {
          var child;
          child = new XMLDTDEntity(this, true, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.notation = function(name, value) {
          var child;
          child = new XMLDTDNotation(this, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.toString = function(options) {
          return this.options.writer.set(options).docType(this);
        };
        XMLDocType2.prototype.ele = function(name, value) {
          return this.element(name, value);
        };
        XMLDocType2.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
        };
        XMLDocType2.prototype.ent = function(name, value) {
          return this.entity(name, value);
        };
        XMLDocType2.prototype.pent = function(name, value) {
          return this.pEntity(name, value);
        };
        XMLDocType2.prototype.not = function(name, value) {
          return this.notation(name, value);
        };
        XMLDocType2.prototype.up = function() {
          return this.root() || this.documentObject;
        };
        return XMLDocType2;
      }(XMLNode);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLRaw.js
var require_XMLRaw = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLRaw.js"(exports, module2) {
    (function() {
      var XMLNode, XMLRaw, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      module2.exports = XMLRaw = function(superClass) {
        extend(XMLRaw2, superClass);
        function XMLRaw2(parent, text) {
          XMLRaw2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing raw text");
          }
          this.value = this.stringify.raw(text);
        }
        XMLRaw2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLRaw2.prototype.toString = function(options) {
          return this.options.writer.set(options).raw(this);
        };
        return XMLRaw2;
      }(XMLNode);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLText.js
var require_XMLText = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLText.js"(exports, module2) {
    (function() {
      var XMLNode, XMLText, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      module2.exports = XMLText = function(superClass) {
        extend(XMLText2, superClass);
        function XMLText2(parent, text) {
          XMLText2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing element text");
          }
          this.value = this.stringify.eleText(text);
        }
        XMLText2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLText2.prototype.toString = function(options) {
          return this.options.writer.set(options).text(this);
        };
        return XMLText2;
      }(XMLNode);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLProcessingInstruction.js
var require_XMLProcessingInstruction = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLProcessingInstruction.js"(exports, module2) {
    (function() {
      var XMLNode, XMLProcessingInstruction, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      module2.exports = XMLProcessingInstruction = function(superClass) {
        extend(XMLProcessingInstruction2, superClass);
        function XMLProcessingInstruction2(parent, target, value) {
          XMLProcessingInstruction2.__super__.constructor.call(this, parent);
          if (target == null) {
            throw new Error("Missing instruction target");
          }
          this.target = this.stringify.insTarget(target);
          if (value) {
            this.value = this.stringify.insValue(value);
          }
        }
        XMLProcessingInstruction2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLProcessingInstruction2.prototype.toString = function(options) {
          return this.options.writer.set(options).processingInstruction(this);
        };
        return XMLProcessingInstruction2;
      }(XMLNode);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLNode.js
var require_XMLNode = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLNode.js"(exports, module2) {
    (function() {
      var XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLElement, XMLNode, XMLProcessingInstruction, XMLRaw, XMLText, isEmpty, isFunction, isObject, ref, hasProp = {}.hasOwnProperty;
      ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, isEmpty = ref.isEmpty;
      XMLElement = null;
      XMLCData = null;
      XMLComment = null;
      XMLDeclaration = null;
      XMLDocType = null;
      XMLRaw = null;
      XMLText = null;
      XMLProcessingInstruction = null;
      module2.exports = XMLNode = function() {
        function XMLNode2(parent) {
          this.parent = parent;
          if (this.parent) {
            this.options = this.parent.options;
            this.stringify = this.parent.stringify;
          }
          this.children = [];
          if (!XMLElement) {
            XMLElement = require_XMLElement();
            XMLCData = require_XMLCData();
            XMLComment = require_XMLComment();
            XMLDeclaration = require_XMLDeclaration();
            XMLDocType = require_XMLDocType();
            XMLRaw = require_XMLRaw();
            XMLText = require_XMLText();
            XMLProcessingInstruction = require_XMLProcessingInstruction();
          }
        }
        XMLNode2.prototype.element = function(name, attributes, text) {
          var childNode, item, j, k, key, lastChild, len, len1, ref1, val;
          lastChild = null;
          if (attributes == null) {
            attributes = {};
          }
          attributes = attributes.valueOf();
          if (!isObject(attributes)) {
            ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
          }
          if (name != null) {
            name = name.valueOf();
          }
          if (Array.isArray(name)) {
            for (j = 0, len = name.length; j < len; j++) {
              item = name[j];
              lastChild = this.element(item);
            }
          } else if (isFunction(name)) {
            lastChild = this.element(name.apply());
          } else if (isObject(name)) {
            for (key in name) {
              if (!hasProp.call(name, key))
                continue;
              val = name[key];
              if (isFunction(val)) {
                val = val.apply();
              }
              if (isObject(val) && isEmpty(val)) {
                val = null;
              }
              if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
                lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
              } else if (!this.options.separateArrayItems && Array.isArray(val)) {
                for (k = 0, len1 = val.length; k < len1; k++) {
                  item = val[k];
                  childNode = {};
                  childNode[key] = item;
                  lastChild = this.element(childNode);
                }
              } else if (isObject(val)) {
                lastChild = this.element(key);
                lastChild.element(val);
              } else {
                lastChild = this.element(key, val);
              }
            }
          } else {
            if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
              lastChild = this.text(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
              lastChild = this.cdata(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
              lastChild = this.comment(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
              lastChild = this.raw(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
              lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
            } else {
              lastChild = this.node(name, attributes, text);
            }
          }
          if (lastChild == null) {
            throw new Error("Could not create any elements with: " + name);
          }
          return lastChild;
        };
        XMLNode2.prototype.insertBefore = function(name, attributes, text) {
          var child, i, removed;
          if (this.isRoot) {
            throw new Error("Cannot insert elements at root level");
          }
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i);
          child = this.parent.element(name, attributes, text);
          Array.prototype.push.apply(this.parent.children, removed);
          return child;
        };
        XMLNode2.prototype.insertAfter = function(name, attributes, text) {
          var child, i, removed;
          if (this.isRoot) {
            throw new Error("Cannot insert elements at root level");
          }
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          child = this.parent.element(name, attributes, text);
          Array.prototype.push.apply(this.parent.children, removed);
          return child;
        };
        XMLNode2.prototype.remove = function() {
          var i, ref1;
          if (this.isRoot) {
            throw new Error("Cannot remove the root element");
          }
          i = this.parent.children.indexOf(this);
          [].splice.apply(this.parent.children, [i, i - i + 1].concat(ref1 = [])), ref1;
          return this.parent;
        };
        XMLNode2.prototype.node = function(name, attributes, text) {
          var child, ref1;
          if (name != null) {
            name = name.valueOf();
          }
          attributes || (attributes = {});
          attributes = attributes.valueOf();
          if (!isObject(attributes)) {
            ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
          }
          child = new XMLElement(this, name, attributes);
          if (text != null) {
            child.text(text);
          }
          this.children.push(child);
          return child;
        };
        XMLNode2.prototype.text = function(value) {
          var child;
          child = new XMLText(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.cdata = function(value) {
          var child;
          child = new XMLCData(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.comment = function(value) {
          var child;
          child = new XMLComment(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.commentBefore = function(value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i);
          child = this.parent.comment(value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.commentAfter = function(value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          child = this.parent.comment(value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.raw = function(value) {
          var child;
          child = new XMLRaw(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.instruction = function(target, value) {
          var insTarget, insValue, instruction, j, len;
          if (target != null) {
            target = target.valueOf();
          }
          if (value != null) {
            value = value.valueOf();
          }
          if (Array.isArray(target)) {
            for (j = 0, len = target.length; j < len; j++) {
              insTarget = target[j];
              this.instruction(insTarget);
            }
          } else if (isObject(target)) {
            for (insTarget in target) {
              if (!hasProp.call(target, insTarget))
                continue;
              insValue = target[insTarget];
              this.instruction(insTarget, insValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            instruction = new XMLProcessingInstruction(this, target, value);
            this.children.push(instruction);
          }
          return this;
        };
        XMLNode2.prototype.instructionBefore = function(target, value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i);
          child = this.parent.instruction(target, value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.instructionAfter = function(target, value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          child = this.parent.instruction(target, value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.declaration = function(version, encoding, standalone) {
          var doc, xmldec;
          doc = this.document();
          xmldec = new XMLDeclaration(doc, version, encoding, standalone);
          if (doc.children[0] instanceof XMLDeclaration) {
            doc.children[0] = xmldec;
          } else {
            doc.children.unshift(xmldec);
          }
          return doc.root() || doc;
        };
        XMLNode2.prototype.doctype = function(pubID, sysID) {
          var child, doc, doctype, i, j, k, len, len1, ref1, ref2;
          doc = this.document();
          doctype = new XMLDocType(doc, pubID, sysID);
          ref1 = doc.children;
          for (i = j = 0, len = ref1.length; j < len; i = ++j) {
            child = ref1[i];
            if (child instanceof XMLDocType) {
              doc.children[i] = doctype;
              return doctype;
            }
          }
          ref2 = doc.children;
          for (i = k = 0, len1 = ref2.length; k < len1; i = ++k) {
            child = ref2[i];
            if (child.isRoot) {
              doc.children.splice(i, 0, doctype);
              return doctype;
            }
          }
          doc.children.push(doctype);
          return doctype;
        };
        XMLNode2.prototype.up = function() {
          if (this.isRoot) {
            throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
          }
          return this.parent;
        };
        XMLNode2.prototype.root = function() {
          var node;
          node = this;
          while (node) {
            if (node.isDocument) {
              return node.rootObject;
            } else if (node.isRoot) {
              return node;
            } else {
              node = node.parent;
            }
          }
        };
        XMLNode2.prototype.document = function() {
          var node;
          node = this;
          while (node) {
            if (node.isDocument) {
              return node;
            } else {
              node = node.parent;
            }
          }
        };
        XMLNode2.prototype.end = function(options) {
          return this.document().end(options);
        };
        XMLNode2.prototype.prev = function() {
          var i;
          i = this.parent.children.indexOf(this);
          if (i < 1) {
            throw new Error("Already at the first node");
          }
          return this.parent.children[i - 1];
        };
        XMLNode2.prototype.next = function() {
          var i;
          i = this.parent.children.indexOf(this);
          if (i === -1 || i === this.parent.children.length - 1) {
            throw new Error("Already at the last node");
          }
          return this.parent.children[i + 1];
        };
        XMLNode2.prototype.importDocument = function(doc) {
          var clonedRoot;
          clonedRoot = doc.root().clone();
          clonedRoot.parent = this;
          clonedRoot.isRoot = false;
          this.children.push(clonedRoot);
          return this;
        };
        XMLNode2.prototype.ele = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLNode2.prototype.nod = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLNode2.prototype.txt = function(value) {
          return this.text(value);
        };
        XMLNode2.prototype.dat = function(value) {
          return this.cdata(value);
        };
        XMLNode2.prototype.com = function(value) {
          return this.comment(value);
        };
        XMLNode2.prototype.ins = function(target, value) {
          return this.instruction(target, value);
        };
        XMLNode2.prototype.doc = function() {
          return this.document();
        };
        XMLNode2.prototype.dec = function(version, encoding, standalone) {
          return this.declaration(version, encoding, standalone);
        };
        XMLNode2.prototype.dtd = function(pubID, sysID) {
          return this.doctype(pubID, sysID);
        };
        XMLNode2.prototype.e = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLNode2.prototype.n = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLNode2.prototype.t = function(value) {
          return this.text(value);
        };
        XMLNode2.prototype.d = function(value) {
          return this.cdata(value);
        };
        XMLNode2.prototype.c = function(value) {
          return this.comment(value);
        };
        XMLNode2.prototype.r = function(value) {
          return this.raw(value);
        };
        XMLNode2.prototype.i = function(target, value) {
          return this.instruction(target, value);
        };
        XMLNode2.prototype.u = function() {
          return this.up();
        };
        XMLNode2.prototype.importXMLBuilder = function(doc) {
          return this.importDocument(doc);
        };
        return XMLNode2;
      }();
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLStringifier.js
var require_XMLStringifier = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLStringifier.js"(exports, module2) {
    (function() {
      var XMLStringifier, bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      }, hasProp = {}.hasOwnProperty;
      module2.exports = XMLStringifier = function() {
        function XMLStringifier2(options) {
          this.assertLegalChar = bind(this.assertLegalChar, this);
          var key, ref, value;
          options || (options = {});
          this.noDoubleEncoding = options.noDoubleEncoding;
          ref = options.stringify || {};
          for (key in ref) {
            if (!hasProp.call(ref, key))
              continue;
            value = ref[key];
            this[key] = value;
          }
        }
        XMLStringifier2.prototype.eleName = function(val) {
          val = "" + val || "";
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.eleText = function(val) {
          val = "" + val || "";
          return this.assertLegalChar(this.elEscape(val));
        };
        XMLStringifier2.prototype.cdata = function(val) {
          val = "" + val || "";
          val = val.replace("]]>", "]]]]><![CDATA[>");
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.comment = function(val) {
          val = "" + val || "";
          if (val.match(/--/)) {
            throw new Error("Comment text cannot contain double-hypen: " + val);
          }
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.raw = function(val) {
          return "" + val || "";
        };
        XMLStringifier2.prototype.attName = function(val) {
          return val = "" + val || "";
        };
        XMLStringifier2.prototype.attValue = function(val) {
          val = "" + val || "";
          return this.attEscape(val);
        };
        XMLStringifier2.prototype.insTarget = function(val) {
          return "" + val || "";
        };
        XMLStringifier2.prototype.insValue = function(val) {
          val = "" + val || "";
          if (val.match(/\?>/)) {
            throw new Error("Invalid processing instruction value: " + val);
          }
          return val;
        };
        XMLStringifier2.prototype.xmlVersion = function(val) {
          val = "" + val || "";
          if (!val.match(/1\.[0-9]+/)) {
            throw new Error("Invalid version number: " + val);
          }
          return val;
        };
        XMLStringifier2.prototype.xmlEncoding = function(val) {
          val = "" + val || "";
          if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
            throw new Error("Invalid encoding: " + val);
          }
          return val;
        };
        XMLStringifier2.prototype.xmlStandalone = function(val) {
          if (val) {
            return "yes";
          } else {
            return "no";
          }
        };
        XMLStringifier2.prototype.dtdPubID = function(val) {
          return "" + val || "";
        };
        XMLStringifier2.prototype.dtdSysID = function(val) {
          return "" + val || "";
        };
        XMLStringifier2.prototype.dtdElementValue = function(val) {
          return "" + val || "";
        };
        XMLStringifier2.prototype.dtdAttType = function(val) {
          return "" + val || "";
        };
        XMLStringifier2.prototype.dtdAttDefault = function(val) {
          if (val != null) {
            return "" + val || "";
          } else {
            return val;
          }
        };
        XMLStringifier2.prototype.dtdEntityValue = function(val) {
          return "" + val || "";
        };
        XMLStringifier2.prototype.dtdNData = function(val) {
          return "" + val || "";
        };
        XMLStringifier2.prototype.convertAttKey = "@";
        XMLStringifier2.prototype.convertPIKey = "?";
        XMLStringifier2.prototype.convertTextKey = "#text";
        XMLStringifier2.prototype.convertCDataKey = "#cdata";
        XMLStringifier2.prototype.convertCommentKey = "#comment";
        XMLStringifier2.prototype.convertRawKey = "#raw";
        XMLStringifier2.prototype.assertLegalChar = function(str) {
          var res;
          res = str.match(/[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/);
          if (res) {
            throw new Error("Invalid character in string: " + str + " at index " + res.index);
          }
          return str;
        };
        XMLStringifier2.prototype.elEscape = function(str) {
          var ampregex;
          ampregex = this.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
          return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;");
        };
        XMLStringifier2.prototype.attEscape = function(str) {
          var ampregex;
          ampregex = this.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
          return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;");
        };
        return XMLStringifier2;
      }();
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLWriterBase.js
var require_XMLWriterBase = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLWriterBase.js"(exports, module2) {
    (function() {
      var XMLWriterBase, hasProp = {}.hasOwnProperty;
      module2.exports = XMLWriterBase = function() {
        function XMLWriterBase2(options) {
          var key, ref, ref1, ref2, ref3, ref4, ref5, ref6, value;
          options || (options = {});
          this.pretty = options.pretty || false;
          this.allowEmpty = (ref = options.allowEmpty) != null ? ref : false;
          if (this.pretty) {
            this.indent = (ref1 = options.indent) != null ? ref1 : "  ";
            this.newline = (ref2 = options.newline) != null ? ref2 : "\n";
            this.offset = (ref3 = options.offset) != null ? ref3 : 0;
            this.dontprettytextnodes = (ref4 = options.dontprettytextnodes) != null ? ref4 : 0;
          } else {
            this.indent = "";
            this.newline = "";
            this.offset = 0;
            this.dontprettytextnodes = 0;
          }
          this.spacebeforeslash = (ref5 = options.spacebeforeslash) != null ? ref5 : "";
          if (this.spacebeforeslash === true) {
            this.spacebeforeslash = " ";
          }
          this.newlinedefault = this.newline;
          this.prettydefault = this.pretty;
          ref6 = options.writer || {};
          for (key in ref6) {
            if (!hasProp.call(ref6, key))
              continue;
            value = ref6[key];
            this[key] = value;
          }
        }
        XMLWriterBase2.prototype.set = function(options) {
          var key, ref, value;
          options || (options = {});
          if ("pretty" in options) {
            this.pretty = options.pretty;
          }
          if ("allowEmpty" in options) {
            this.allowEmpty = options.allowEmpty;
          }
          if (this.pretty) {
            this.indent = "indent" in options ? options.indent : "  ";
            this.newline = "newline" in options ? options.newline : "\n";
            this.offset = "offset" in options ? options.offset : 0;
            this.dontprettytextnodes = "dontprettytextnodes" in options ? options.dontprettytextnodes : 0;
          } else {
            this.indent = "";
            this.newline = "";
            this.offset = 0;
            this.dontprettytextnodes = 0;
          }
          this.spacebeforeslash = "spacebeforeslash" in options ? options.spacebeforeslash : "";
          if (this.spacebeforeslash === true) {
            this.spacebeforeslash = " ";
          }
          this.newlinedefault = this.newline;
          this.prettydefault = this.pretty;
          ref = options.writer || {};
          for (key in ref) {
            if (!hasProp.call(ref, key))
              continue;
            value = ref[key];
            this[key] = value;
          }
          return this;
        };
        XMLWriterBase2.prototype.space = function(level) {
          var indent;
          if (this.pretty) {
            indent = (level || 0) + this.offset + 1;
            if (indent > 0) {
              return new Array(indent).join(this.indent);
            } else {
              return "";
            }
          } else {
            return "";
          }
        };
        return XMLWriterBase2;
      }();
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLStringWriter.js
var require_XMLStringWriter = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLStringWriter.js"(exports, module2) {
    (function() {
      var XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLText, XMLWriterBase, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLDeclaration = require_XMLDeclaration();
      XMLDocType = require_XMLDocType();
      XMLCData = require_XMLCData();
      XMLComment = require_XMLComment();
      XMLElement = require_XMLElement();
      XMLRaw = require_XMLRaw();
      XMLText = require_XMLText();
      XMLProcessingInstruction = require_XMLProcessingInstruction();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDNotation = require_XMLDTDNotation();
      XMLWriterBase = require_XMLWriterBase();
      module2.exports = XMLStringWriter = function(superClass) {
        extend(XMLStringWriter2, superClass);
        function XMLStringWriter2(options) {
          XMLStringWriter2.__super__.constructor.call(this, options);
        }
        XMLStringWriter2.prototype.document = function(doc) {
          var child, i, len, r, ref;
          this.textispresent = false;
          r = "";
          ref = doc.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            r += function() {
              switch (false) {
                case !(child instanceof XMLDeclaration):
                  return this.declaration(child);
                case !(child instanceof XMLDocType):
                  return this.docType(child);
                case !(child instanceof XMLComment):
                  return this.comment(child);
                case !(child instanceof XMLProcessingInstruction):
                  return this.processingInstruction(child);
                default:
                  return this.element(child, 0);
              }
            }.call(this);
          }
          if (this.pretty && r.slice(-this.newline.length) === this.newline) {
            r = r.slice(0, -this.newline.length);
          }
          return r;
        };
        XMLStringWriter2.prototype.attribute = function(att) {
          return " " + att.name + '="' + att.value + '"';
        };
        XMLStringWriter2.prototype.cdata = function(node, level) {
          return this.space(level) + "<![CDATA[" + node.text + "]]>" + this.newline;
        };
        XMLStringWriter2.prototype.comment = function(node, level) {
          return this.space(level) + "<!-- " + node.text + " -->" + this.newline;
        };
        XMLStringWriter2.prototype.declaration = function(node, level) {
          var r;
          r = this.space(level);
          r += '<?xml version="' + node.version + '"';
          if (node.encoding != null) {
            r += ' encoding="' + node.encoding + '"';
          }
          if (node.standalone != null) {
            r += ' standalone="' + node.standalone + '"';
          }
          r += this.spacebeforeslash + "?>";
          r += this.newline;
          return r;
        };
        XMLStringWriter2.prototype.docType = function(node, level) {
          var child, i, len, r, ref;
          level || (level = 0);
          r = this.space(level);
          r += "<!DOCTYPE " + node.root().name;
          if (node.pubID && node.sysID) {
            r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.sysID) {
            r += ' SYSTEM "' + node.sysID + '"';
          }
          if (node.children.length > 0) {
            r += " [";
            r += this.newline;
            ref = node.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              r += function() {
                switch (false) {
                  case !(child instanceof XMLDTDAttList):
                    return this.dtdAttList(child, level + 1);
                  case !(child instanceof XMLDTDElement):
                    return this.dtdElement(child, level + 1);
                  case !(child instanceof XMLDTDEntity):
                    return this.dtdEntity(child, level + 1);
                  case !(child instanceof XMLDTDNotation):
                    return this.dtdNotation(child, level + 1);
                  case !(child instanceof XMLCData):
                    return this.cdata(child, level + 1);
                  case !(child instanceof XMLComment):
                    return this.comment(child, level + 1);
                  case !(child instanceof XMLProcessingInstruction):
                    return this.processingInstruction(child, level + 1);
                  default:
                    throw new Error("Unknown DTD node type: " + child.constructor.name);
                }
              }.call(this);
            }
            r += "]";
          }
          r += this.spacebeforeslash + ">";
          r += this.newline;
          return r;
        };
        XMLStringWriter2.prototype.element = function(node, level) {
          var att, child, i, j, len, len1, name, r, ref, ref1, ref2, space, textispresentwasset;
          level || (level = 0);
          textispresentwasset = false;
          if (this.textispresent) {
            this.newline = "";
            this.pretty = false;
          } else {
            this.newline = this.newlinedefault;
            this.pretty = this.prettydefault;
          }
          space = this.space(level);
          r = "";
          r += space + "<" + node.name;
          ref = node.attributes;
          for (name in ref) {
            if (!hasProp.call(ref, name))
              continue;
            att = ref[name];
            r += this.attribute(att);
          }
          if (node.children.length === 0 || node.children.every(function(e) {
            return e.value === "";
          })) {
            if (this.allowEmpty) {
              r += "></" + node.name + ">" + this.newline;
            } else {
              r += this.spacebeforeslash + "/>" + this.newline;
            }
          } else if (this.pretty && node.children.length === 1 && node.children[0].value != null) {
            r += ">";
            r += node.children[0].value;
            r += "</" + node.name + ">" + this.newline;
          } else {
            if (this.dontprettytextnodes) {
              ref1 = node.children;
              for (i = 0, len = ref1.length; i < len; i++) {
                child = ref1[i];
                if (child.value != null) {
                  this.textispresent++;
                  textispresentwasset = true;
                  break;
                }
              }
            }
            if (this.textispresent) {
              this.newline = "";
              this.pretty = false;
              space = this.space(level);
            }
            r += ">" + this.newline;
            ref2 = node.children;
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              child = ref2[j];
              r += function() {
                switch (false) {
                  case !(child instanceof XMLCData):
                    return this.cdata(child, level + 1);
                  case !(child instanceof XMLComment):
                    return this.comment(child, level + 1);
                  case !(child instanceof XMLElement):
                    return this.element(child, level + 1);
                  case !(child instanceof XMLRaw):
                    return this.raw(child, level + 1);
                  case !(child instanceof XMLText):
                    return this.text(child, level + 1);
                  case !(child instanceof XMLProcessingInstruction):
                    return this.processingInstruction(child, level + 1);
                  default:
                    throw new Error("Unknown XML node type: " + child.constructor.name);
                }
              }.call(this);
            }
            if (textispresentwasset) {
              this.textispresent--;
            }
            if (!this.textispresent) {
              this.newline = this.newlinedefault;
              this.pretty = this.prettydefault;
            }
            r += space + "</" + node.name + ">" + this.newline;
          }
          return r;
        };
        XMLStringWriter2.prototype.processingInstruction = function(node, level) {
          var r;
          r = this.space(level) + "<?" + node.target;
          if (node.value) {
            r += " " + node.value;
          }
          r += this.spacebeforeslash + "?>" + this.newline;
          return r;
        };
        XMLStringWriter2.prototype.raw = function(node, level) {
          return this.space(level) + node.value + this.newline;
        };
        XMLStringWriter2.prototype.text = function(node, level) {
          return this.space(level) + node.value + this.newline;
        };
        XMLStringWriter2.prototype.dtdAttList = function(node, level) {
          var r;
          r = this.space(level) + "<!ATTLIST " + node.elementName + " " + node.attributeName + " " + node.attributeType;
          if (node.defaultValueType !== "#DEFAULT") {
            r += " " + node.defaultValueType;
          }
          if (node.defaultValue) {
            r += ' "' + node.defaultValue + '"';
          }
          r += this.spacebeforeslash + ">" + this.newline;
          return r;
        };
        XMLStringWriter2.prototype.dtdElement = function(node, level) {
          return this.space(level) + "<!ELEMENT " + node.name + " " + node.value + this.spacebeforeslash + ">" + this.newline;
        };
        XMLStringWriter2.prototype.dtdEntity = function(node, level) {
          var r;
          r = this.space(level) + "<!ENTITY";
          if (node.pe) {
            r += " %";
          }
          r += " " + node.name;
          if (node.value) {
            r += ' "' + node.value + '"';
          } else {
            if (node.pubID && node.sysID) {
              r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
            } else if (node.sysID) {
              r += ' SYSTEM "' + node.sysID + '"';
            }
            if (node.nData) {
              r += " NDATA " + node.nData;
            }
          }
          r += this.spacebeforeslash + ">" + this.newline;
          return r;
        };
        XMLStringWriter2.prototype.dtdNotation = function(node, level) {
          var r;
          r = this.space(level) + "<!NOTATION " + node.name;
          if (node.pubID && node.sysID) {
            r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.pubID) {
            r += ' PUBLIC "' + node.pubID + '"';
          } else if (node.sysID) {
            r += ' SYSTEM "' + node.sysID + '"';
          }
          r += this.spacebeforeslash + ">" + this.newline;
          return r;
        };
        XMLStringWriter2.prototype.openNode = function(node, level) {
          var att, name, r, ref;
          level || (level = 0);
          if (node instanceof XMLElement) {
            r = this.space(level) + "<" + node.name;
            ref = node.attributes;
            for (name in ref) {
              if (!hasProp.call(ref, name))
                continue;
              att = ref[name];
              r += this.attribute(att);
            }
            r += (node.children ? ">" : "/>") + this.newline;
            return r;
          } else {
            r = this.space(level) + "<!DOCTYPE " + node.rootNodeName;
            if (node.pubID && node.sysID) {
              r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
            } else if (node.sysID) {
              r += ' SYSTEM "' + node.sysID + '"';
            }
            r += (node.children ? " [" : ">") + this.newline;
            return r;
          }
        };
        XMLStringWriter2.prototype.closeNode = function(node, level) {
          level || (level = 0);
          switch (false) {
            case !(node instanceof XMLElement):
              return this.space(level) + "</" + node.name + ">" + this.newline;
            case !(node instanceof XMLDocType):
              return this.space(level) + "]>" + this.newline;
          }
        };
        return XMLStringWriter2;
      }(XMLWriterBase);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDocument.js
var require_XMLDocument = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDocument.js"(exports, module2) {
    (function() {
      var XMLDocument, XMLNode, XMLStringWriter, XMLStringifier, isPlainObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isPlainObject = require_Utility().isPlainObject;
      XMLNode = require_XMLNode();
      XMLStringifier = require_XMLStringifier();
      XMLStringWriter = require_XMLStringWriter();
      module2.exports = XMLDocument = function(superClass) {
        extend(XMLDocument2, superClass);
        function XMLDocument2(options) {
          XMLDocument2.__super__.constructor.call(this, null);
          options || (options = {});
          if (!options.writer) {
            options.writer = new XMLStringWriter();
          }
          this.options = options;
          this.stringify = new XMLStringifier(options);
          this.isDocument = true;
        }
        XMLDocument2.prototype.end = function(writer) {
          var writerOptions;
          if (!writer) {
            writer = this.options.writer;
          } else if (isPlainObject(writer)) {
            writerOptions = writer;
            writer = this.options.writer.set(writerOptions);
          }
          return writer.document(this);
        };
        XMLDocument2.prototype.toString = function(options) {
          return this.options.writer.set(options).document(this);
        };
        return XMLDocument2;
      }(XMLNode);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDocumentCB.js
var require_XMLDocumentCB = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLDocumentCB.js"(exports, module2) {
    (function() {
      var XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDocumentCB, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, isFunction, isObject, isPlainObject, ref, hasProp = {}.hasOwnProperty;
      ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject;
      XMLElement = require_XMLElement();
      XMLCData = require_XMLCData();
      XMLComment = require_XMLComment();
      XMLRaw = require_XMLRaw();
      XMLText = require_XMLText();
      XMLProcessingInstruction = require_XMLProcessingInstruction();
      XMLDeclaration = require_XMLDeclaration();
      XMLDocType = require_XMLDocType();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDNotation = require_XMLDTDNotation();
      XMLAttribute = require_XMLAttribute();
      XMLStringifier = require_XMLStringifier();
      XMLStringWriter = require_XMLStringWriter();
      module2.exports = XMLDocumentCB = function() {
        function XMLDocumentCB2(options, onData, onEnd) {
          var writerOptions;
          options || (options = {});
          if (!options.writer) {
            options.writer = new XMLStringWriter(options);
          } else if (isPlainObject(options.writer)) {
            writerOptions = options.writer;
            options.writer = new XMLStringWriter(writerOptions);
          }
          this.options = options;
          this.writer = options.writer;
          this.stringify = new XMLStringifier(options);
          this.onDataCallback = onData || function() {
          };
          this.onEndCallback = onEnd || function() {
          };
          this.currentNode = null;
          this.currentLevel = -1;
          this.openTags = {};
          this.documentStarted = false;
          this.documentCompleted = false;
          this.root = null;
        }
        XMLDocumentCB2.prototype.node = function(name, attributes, text) {
          var ref1;
          if (name == null) {
            throw new Error("Missing node name");
          }
          if (this.root && this.currentLevel === -1) {
            throw new Error("Document can only have one root node");
          }
          this.openCurrent();
          name = name.valueOf();
          if (attributes == null) {
            attributes = {};
          }
          attributes = attributes.valueOf();
          if (!isObject(attributes)) {
            ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
          }
          this.currentNode = new XMLElement(this, name, attributes);
          this.currentNode.children = false;
          this.currentLevel++;
          this.openTags[this.currentLevel] = this.currentNode;
          if (text != null) {
            this.text(text);
          }
          return this;
        };
        XMLDocumentCB2.prototype.element = function(name, attributes, text) {
          if (this.currentNode && this.currentNode instanceof XMLDocType) {
            return this.dtdElement.apply(this, arguments);
          } else {
            return this.node(name, attributes, text);
          }
        };
        XMLDocumentCB2.prototype.attribute = function(name, value) {
          var attName, attValue;
          if (!this.currentNode || this.currentNode.children) {
            throw new Error("att() can only be used immediately after an ele() call in callback mode");
          }
          if (name != null) {
            name = name.valueOf();
          }
          if (isObject(name)) {
            for (attName in name) {
              if (!hasProp.call(name, attName))
                continue;
              attValue = name[attName];
              this.attribute(attName, attValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            if (!this.options.skipNullAttributes || value != null) {
              this.currentNode.attributes[name] = new XMLAttribute(this, name, value);
            }
          }
          return this;
        };
        XMLDocumentCB2.prototype.text = function(value) {
          var node;
          this.openCurrent();
          node = new XMLText(this, value);
          this.onData(this.writer.text(node, this.currentLevel + 1));
          return this;
        };
        XMLDocumentCB2.prototype.cdata = function(value) {
          var node;
          this.openCurrent();
          node = new XMLCData(this, value);
          this.onData(this.writer.cdata(node, this.currentLevel + 1));
          return this;
        };
        XMLDocumentCB2.prototype.comment = function(value) {
          var node;
          this.openCurrent();
          node = new XMLComment(this, value);
          this.onData(this.writer.comment(node, this.currentLevel + 1));
          return this;
        };
        XMLDocumentCB2.prototype.raw = function(value) {
          var node;
          this.openCurrent();
          node = new XMLRaw(this, value);
          this.onData(this.writer.raw(node, this.currentLevel + 1));
          return this;
        };
        XMLDocumentCB2.prototype.instruction = function(target, value) {
          var i, insTarget, insValue, len, node;
          this.openCurrent();
          if (target != null) {
            target = target.valueOf();
          }
          if (value != null) {
            value = value.valueOf();
          }
          if (Array.isArray(target)) {
            for (i = 0, len = target.length; i < len; i++) {
              insTarget = target[i];
              this.instruction(insTarget);
            }
          } else if (isObject(target)) {
            for (insTarget in target) {
              if (!hasProp.call(target, insTarget))
                continue;
              insValue = target[insTarget];
              this.instruction(insTarget, insValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            node = new XMLProcessingInstruction(this, target, value);
            this.onData(this.writer.processingInstruction(node, this.currentLevel + 1));
          }
          return this;
        };
        XMLDocumentCB2.prototype.declaration = function(version, encoding, standalone) {
          var node;
          this.openCurrent();
          if (this.documentStarted) {
            throw new Error("declaration() must be the first node");
          }
          node = new XMLDeclaration(this, version, encoding, standalone);
          this.onData(this.writer.declaration(node, this.currentLevel + 1));
          return this;
        };
        XMLDocumentCB2.prototype.doctype = function(root, pubID, sysID) {
          this.openCurrent();
          if (root == null) {
            throw new Error("Missing root node name");
          }
          if (this.root) {
            throw new Error("dtd() must come before the root node");
          }
          this.currentNode = new XMLDocType(this, pubID, sysID);
          this.currentNode.rootNodeName = root;
          this.currentNode.children = false;
          this.currentLevel++;
          this.openTags[this.currentLevel] = this.currentNode;
          return this;
        };
        XMLDocumentCB2.prototype.dtdElement = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDElement(this, name, value);
          this.onData(this.writer.dtdElement(node, this.currentLevel + 1));
          return this;
        };
        XMLDocumentCB2.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          var node;
          this.openCurrent();
          node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
          this.onData(this.writer.dtdAttList(node, this.currentLevel + 1));
          return this;
        };
        XMLDocumentCB2.prototype.entity = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDEntity(this, false, name, value);
          this.onData(this.writer.dtdEntity(node, this.currentLevel + 1));
          return this;
        };
        XMLDocumentCB2.prototype.pEntity = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDEntity(this, true, name, value);
          this.onData(this.writer.dtdEntity(node, this.currentLevel + 1));
          return this;
        };
        XMLDocumentCB2.prototype.notation = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDNotation(this, name, value);
          this.onData(this.writer.dtdNotation(node, this.currentLevel + 1));
          return this;
        };
        XMLDocumentCB2.prototype.up = function() {
          if (this.currentLevel < 0) {
            throw new Error("The document node has no parent");
          }
          if (this.currentNode) {
            if (this.currentNode.children) {
              this.closeNode(this.currentNode);
            } else {
              this.openNode(this.currentNode);
            }
            this.currentNode = null;
          } else {
            this.closeNode(this.openTags[this.currentLevel]);
          }
          delete this.openTags[this.currentLevel];
          this.currentLevel--;
          return this;
        };
        XMLDocumentCB2.prototype.end = function() {
          while (this.currentLevel >= 0) {
            this.up();
          }
          return this.onEnd();
        };
        XMLDocumentCB2.prototype.openCurrent = function() {
          if (this.currentNode) {
            this.currentNode.children = true;
            return this.openNode(this.currentNode);
          }
        };
        XMLDocumentCB2.prototype.openNode = function(node) {
          if (!node.isOpen) {
            if (!this.root && this.currentLevel === 0 && node instanceof XMLElement) {
              this.root = node;
            }
            this.onData(this.writer.openNode(node, this.currentLevel));
            return node.isOpen = true;
          }
        };
        XMLDocumentCB2.prototype.closeNode = function(node) {
          if (!node.isClosed) {
            this.onData(this.writer.closeNode(node, this.currentLevel));
            return node.isClosed = true;
          }
        };
        XMLDocumentCB2.prototype.onData = function(chunk) {
          this.documentStarted = true;
          return this.onDataCallback(chunk);
        };
        XMLDocumentCB2.prototype.onEnd = function() {
          this.documentCompleted = true;
          return this.onEndCallback();
        };
        XMLDocumentCB2.prototype.ele = function() {
          return this.element.apply(this, arguments);
        };
        XMLDocumentCB2.prototype.nod = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLDocumentCB2.prototype.txt = function(value) {
          return this.text(value);
        };
        XMLDocumentCB2.prototype.dat = function(value) {
          return this.cdata(value);
        };
        XMLDocumentCB2.prototype.com = function(value) {
          return this.comment(value);
        };
        XMLDocumentCB2.prototype.ins = function(target, value) {
          return this.instruction(target, value);
        };
        XMLDocumentCB2.prototype.dec = function(version, encoding, standalone) {
          return this.declaration(version, encoding, standalone);
        };
        XMLDocumentCB2.prototype.dtd = function(root, pubID, sysID) {
          return this.doctype(root, pubID, sysID);
        };
        XMLDocumentCB2.prototype.e = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLDocumentCB2.prototype.n = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLDocumentCB2.prototype.t = function(value) {
          return this.text(value);
        };
        XMLDocumentCB2.prototype.d = function(value) {
          return this.cdata(value);
        };
        XMLDocumentCB2.prototype.c = function(value) {
          return this.comment(value);
        };
        XMLDocumentCB2.prototype.r = function(value) {
          return this.raw(value);
        };
        XMLDocumentCB2.prototype.i = function(target, value) {
          return this.instruction(target, value);
        };
        XMLDocumentCB2.prototype.att = function() {
          if (this.currentNode && this.currentNode instanceof XMLDocType) {
            return this.attList.apply(this, arguments);
          } else {
            return this.attribute.apply(this, arguments);
          }
        };
        XMLDocumentCB2.prototype.a = function() {
          if (this.currentNode && this.currentNode instanceof XMLDocType) {
            return this.attList.apply(this, arguments);
          } else {
            return this.attribute.apply(this, arguments);
          }
        };
        XMLDocumentCB2.prototype.ent = function(name, value) {
          return this.entity(name, value);
        };
        XMLDocumentCB2.prototype.pent = function(name, value) {
          return this.pEntity(name, value);
        };
        XMLDocumentCB2.prototype.not = function(name, value) {
          return this.notation(name, value);
        };
        return XMLDocumentCB2;
      }();
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLStreamWriter.js
var require_XMLStreamWriter = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/XMLStreamWriter.js"(exports, module2) {
    (function() {
      var XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStreamWriter, XMLText, XMLWriterBase, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLDeclaration = require_XMLDeclaration();
      XMLDocType = require_XMLDocType();
      XMLCData = require_XMLCData();
      XMLComment = require_XMLComment();
      XMLElement = require_XMLElement();
      XMLRaw = require_XMLRaw();
      XMLText = require_XMLText();
      XMLProcessingInstruction = require_XMLProcessingInstruction();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDNotation = require_XMLDTDNotation();
      XMLWriterBase = require_XMLWriterBase();
      module2.exports = XMLStreamWriter = function(superClass) {
        extend(XMLStreamWriter2, superClass);
        function XMLStreamWriter2(stream, options) {
          XMLStreamWriter2.__super__.constructor.call(this, options);
          this.stream = stream;
        }
        XMLStreamWriter2.prototype.document = function(doc) {
          var child, i, j, len, len1, ref, ref1, results;
          ref = doc.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            child.isLastRootNode = false;
          }
          doc.children[doc.children.length - 1].isLastRootNode = true;
          ref1 = doc.children;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            child = ref1[j];
            switch (false) {
              case !(child instanceof XMLDeclaration):
                results.push(this.declaration(child));
                break;
              case !(child instanceof XMLDocType):
                results.push(this.docType(child));
                break;
              case !(child instanceof XMLComment):
                results.push(this.comment(child));
                break;
              case !(child instanceof XMLProcessingInstruction):
                results.push(this.processingInstruction(child));
                break;
              default:
                results.push(this.element(child));
            }
          }
          return results;
        };
        XMLStreamWriter2.prototype.attribute = function(att) {
          return this.stream.write(" " + att.name + '="' + att.value + '"');
        };
        XMLStreamWriter2.prototype.cdata = function(node, level) {
          return this.stream.write(this.space(level) + "<![CDATA[" + node.text + "]]>" + this.endline(node));
        };
        XMLStreamWriter2.prototype.comment = function(node, level) {
          return this.stream.write(this.space(level) + "<!-- " + node.text + " -->" + this.endline(node));
        };
        XMLStreamWriter2.prototype.declaration = function(node, level) {
          this.stream.write(this.space(level));
          this.stream.write('<?xml version="' + node.version + '"');
          if (node.encoding != null) {
            this.stream.write(' encoding="' + node.encoding + '"');
          }
          if (node.standalone != null) {
            this.stream.write(' standalone="' + node.standalone + '"');
          }
          this.stream.write(this.spacebeforeslash + "?>");
          return this.stream.write(this.endline(node));
        };
        XMLStreamWriter2.prototype.docType = function(node, level) {
          var child, i, len, ref;
          level || (level = 0);
          this.stream.write(this.space(level));
          this.stream.write("<!DOCTYPE " + node.root().name);
          if (node.pubID && node.sysID) {
            this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
          } else if (node.sysID) {
            this.stream.write(' SYSTEM "' + node.sysID + '"');
          }
          if (node.children.length > 0) {
            this.stream.write(" [");
            this.stream.write(this.endline(node));
            ref = node.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              switch (false) {
                case !(child instanceof XMLDTDAttList):
                  this.dtdAttList(child, level + 1);
                  break;
                case !(child instanceof XMLDTDElement):
                  this.dtdElement(child, level + 1);
                  break;
                case !(child instanceof XMLDTDEntity):
                  this.dtdEntity(child, level + 1);
                  break;
                case !(child instanceof XMLDTDNotation):
                  this.dtdNotation(child, level + 1);
                  break;
                case !(child instanceof XMLCData):
                  this.cdata(child, level + 1);
                  break;
                case !(child instanceof XMLComment):
                  this.comment(child, level + 1);
                  break;
                case !(child instanceof XMLProcessingInstruction):
                  this.processingInstruction(child, level + 1);
                  break;
                default:
                  throw new Error("Unknown DTD node type: " + child.constructor.name);
              }
            }
            this.stream.write("]");
          }
          this.stream.write(this.spacebeforeslash + ">");
          return this.stream.write(this.endline(node));
        };
        XMLStreamWriter2.prototype.element = function(node, level) {
          var att, child, i, len, name, ref, ref1, space;
          level || (level = 0);
          space = this.space(level);
          this.stream.write(space + "<" + node.name);
          ref = node.attributes;
          for (name in ref) {
            if (!hasProp.call(ref, name))
              continue;
            att = ref[name];
            this.attribute(att);
          }
          if (node.children.length === 0 || node.children.every(function(e) {
            return e.value === "";
          })) {
            if (this.allowEmpty) {
              this.stream.write("></" + node.name + ">");
            } else {
              this.stream.write(this.spacebeforeslash + "/>");
            }
          } else if (this.pretty && node.children.length === 1 && node.children[0].value != null) {
            this.stream.write(">");
            this.stream.write(node.children[0].value);
            this.stream.write("</" + node.name + ">");
          } else {
            this.stream.write(">" + this.newline);
            ref1 = node.children;
            for (i = 0, len = ref1.length; i < len; i++) {
              child = ref1[i];
              switch (false) {
                case !(child instanceof XMLCData):
                  this.cdata(child, level + 1);
                  break;
                case !(child instanceof XMLComment):
                  this.comment(child, level + 1);
                  break;
                case !(child instanceof XMLElement):
                  this.element(child, level + 1);
                  break;
                case !(child instanceof XMLRaw):
                  this.raw(child, level + 1);
                  break;
                case !(child instanceof XMLText):
                  this.text(child, level + 1);
                  break;
                case !(child instanceof XMLProcessingInstruction):
                  this.processingInstruction(child, level + 1);
                  break;
                default:
                  throw new Error("Unknown XML node type: " + child.constructor.name);
              }
            }
            this.stream.write(space + "</" + node.name + ">");
          }
          return this.stream.write(this.endline(node));
        };
        XMLStreamWriter2.prototype.processingInstruction = function(node, level) {
          this.stream.write(this.space(level) + "<?" + node.target);
          if (node.value) {
            this.stream.write(" " + node.value);
          }
          return this.stream.write(this.spacebeforeslash + "?>" + this.endline(node));
        };
        XMLStreamWriter2.prototype.raw = function(node, level) {
          return this.stream.write(this.space(level) + node.value + this.endline(node));
        };
        XMLStreamWriter2.prototype.text = function(node, level) {
          return this.stream.write(this.space(level) + node.value + this.endline(node));
        };
        XMLStreamWriter2.prototype.dtdAttList = function(node, level) {
          this.stream.write(this.space(level) + "<!ATTLIST " + node.elementName + " " + node.attributeName + " " + node.attributeType);
          if (node.defaultValueType !== "#DEFAULT") {
            this.stream.write(" " + node.defaultValueType);
          }
          if (node.defaultValue) {
            this.stream.write(' "' + node.defaultValue + '"');
          }
          return this.stream.write(this.spacebeforeslash + ">" + this.endline(node));
        };
        XMLStreamWriter2.prototype.dtdElement = function(node, level) {
          this.stream.write(this.space(level) + "<!ELEMENT " + node.name + " " + node.value);
          return this.stream.write(this.spacebeforeslash + ">" + this.endline(node));
        };
        XMLStreamWriter2.prototype.dtdEntity = function(node, level) {
          this.stream.write(this.space(level) + "<!ENTITY");
          if (node.pe) {
            this.stream.write(" %");
          }
          this.stream.write(" " + node.name);
          if (node.value) {
            this.stream.write(' "' + node.value + '"');
          } else {
            if (node.pubID && node.sysID) {
              this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
            } else if (node.sysID) {
              this.stream.write(' SYSTEM "' + node.sysID + '"');
            }
            if (node.nData) {
              this.stream.write(" NDATA " + node.nData);
            }
          }
          return this.stream.write(this.spacebeforeslash + ">" + this.endline(node));
        };
        XMLStreamWriter2.prototype.dtdNotation = function(node, level) {
          this.stream.write(this.space(level) + "<!NOTATION " + node.name);
          if (node.pubID && node.sysID) {
            this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
          } else if (node.pubID) {
            this.stream.write(' PUBLIC "' + node.pubID + '"');
          } else if (node.sysID) {
            this.stream.write(' SYSTEM "' + node.sysID + '"');
          }
          return this.stream.write(this.spacebeforeslash + ">" + this.endline(node));
        };
        XMLStreamWriter2.prototype.endline = function(node) {
          if (!node.isLastRootNode) {
            return this.newline;
          } else {
            return "";
          }
        };
        return XMLStreamWriter2;
      }(XMLWriterBase);
    }).call(exports);
  }
});

// node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/xmlbuilder@9.0.7/node_modules/xmlbuilder/lib/index.js"(exports, module2) {
    (function() {
      var XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction, ref;
      ref = require_Utility(), assign = ref.assign, isFunction = ref.isFunction;
      XMLDocument = require_XMLDocument();
      XMLDocumentCB = require_XMLDocumentCB();
      XMLStringWriter = require_XMLStringWriter();
      XMLStreamWriter = require_XMLStreamWriter();
      module2.exports.create = function(name, xmldec, doctype, options) {
        var doc, root;
        if (name == null) {
          throw new Error("Root element needs a name");
        }
        options = assign({}, xmldec, doctype, options);
        doc = new XMLDocument(options);
        root = doc.element(name);
        if (!options.headless) {
          doc.declaration(options);
          if (options.pubID != null || options.sysID != null) {
            doc.doctype(options);
          }
        }
        return root;
      };
      module2.exports.begin = function(options, onData, onEnd) {
        var ref1;
        if (isFunction(options)) {
          ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
          options = {};
        }
        if (onData) {
          return new XMLDocumentCB(options, onData, onEnd);
        } else {
          return new XMLDocument(options);
        }
      };
      module2.exports.stringWriter = function(options) {
        return new XMLStringWriter(options);
      };
      module2.exports.streamWriter = function(stream, options) {
        return new XMLStreamWriter(stream, options);
      };
    }).call(exports);
  }
});

// node_modules/.pnpm/xml2js@0.4.19/node_modules/xml2js/lib/builder.js
var require_builder3 = __commonJS({
  "node_modules/.pnpm/xml2js@0.4.19/node_modules/xml2js/lib/builder.js"(exports) {
    (function() {
      "use strict";
      var builder, defaults, escapeCDATA, requiresCDATA, wrapCDATA, hasProp = {}.hasOwnProperty;
      builder = require_lib();
      defaults = require_defaults().defaults;
      requiresCDATA = function(entry) {
        return typeof entry === "string" && (entry.indexOf("&") >= 0 || entry.indexOf(">") >= 0 || entry.indexOf("<") >= 0);
      };
      wrapCDATA = function(entry) {
        return "<![CDATA[" + escapeCDATA(entry) + "]]>";
      };
      escapeCDATA = function(entry) {
        return entry.replace("]]>", "]]]]><![CDATA[>");
      };
      exports.Builder = function() {
        function Builder(opts) {
          var key, ref, value;
          this.options = {};
          ref = defaults["0.2"];
          for (key in ref) {
            if (!hasProp.call(ref, key))
              continue;
            value = ref[key];
            this.options[key] = value;
          }
          for (key in opts) {
            if (!hasProp.call(opts, key))
              continue;
            value = opts[key];
            this.options[key] = value;
          }
        }
        Builder.prototype.buildObject = function(rootObj) {
          var attrkey, charkey, render, rootElement, rootName;
          attrkey = this.options.attrkey;
          charkey = this.options.charkey;
          if (Object.keys(rootObj).length === 1 && this.options.rootName === defaults["0.2"].rootName) {
            rootName = Object.keys(rootObj)[0];
            rootObj = rootObj[rootName];
          } else {
            rootName = this.options.rootName;
          }
          render = function(_this) {
            return function(element, obj) {
              var attr, child, entry, index, key, value;
              if (typeof obj !== "object") {
                if (_this.options.cdata && requiresCDATA(obj)) {
                  element.raw(wrapCDATA(obj));
                } else {
                  element.txt(obj);
                }
              } else if (Array.isArray(obj)) {
                for (index in obj) {
                  if (!hasProp.call(obj, index))
                    continue;
                  child = obj[index];
                  for (key in child) {
                    entry = child[key];
                    element = render(element.ele(key), entry).up();
                  }
                }
              } else {
                for (key in obj) {
                  if (!hasProp.call(obj, key))
                    continue;
                  child = obj[key];
                  if (key === attrkey) {
                    if (typeof child === "object") {
                      for (attr in child) {
                        value = child[attr];
                        element = element.att(attr, value);
                      }
                    }
                  } else if (key === charkey) {
                    if (_this.options.cdata && requiresCDATA(child)) {
                      element = element.raw(wrapCDATA(child));
                    } else {
                      element = element.txt(child);
                    }
                  } else if (Array.isArray(child)) {
                    for (index in child) {
                      if (!hasProp.call(child, index))
                        continue;
                      entry = child[index];
                      if (typeof entry === "string") {
                        if (_this.options.cdata && requiresCDATA(entry)) {
                          element = element.ele(key).raw(wrapCDATA(entry)).up();
                        } else {
                          element = element.ele(key, entry).up();
                        }
                      } else {
                        element = render(element.ele(key), entry).up();
                      }
                    }
                  } else if (typeof child === "object") {
                    element = render(element.ele(key), child).up();
                  } else {
                    if (typeof child === "string" && _this.options.cdata && requiresCDATA(child)) {
                      element = element.ele(key).raw(wrapCDATA(child)).up();
                    } else {
                      if (child == null) {
                        child = "";
                      }
                      element = element.ele(key, child.toString()).up();
                    }
                  }
                }
              }
              return element;
            };
          }(this);
          rootElement = builder.create(rootName, this.options.xmldec, this.options.doctype, {
            headless: this.options.headless,
            allowSurrogateChars: this.options.allowSurrogateChars
          });
          return render(rootElement, rootObj).end(this.options.renderOpts);
        };
        return Builder;
      }();
    }).call(exports);
  }
});

// node_modules/.pnpm/sax@1.2.1/node_modules/sax/lib/sax.js
var require_sax = __commonJS({
  "node_modules/.pnpm/sax@1.2.1/node_modules/sax/lib/sax.js"(exports) {
    (function(sax) {
      sax.parser = function(strict, opt) {
        return new SAXParser(strict, opt);
      };
      sax.SAXParser = SAXParser;
      sax.SAXStream = SAXStream;
      sax.createStream = createStream;
      sax.MAX_BUFFER_LENGTH = 64 * 1024;
      var buffers = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      sax.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function SAXParser(strict, opt) {
        if (!(this instanceof SAXParser)) {
          return new SAXParser(strict, opt);
        }
        var parser = this;
        clearBuffers(parser);
        parser.q = parser.c = "";
        parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH;
        parser.opt = opt || {};
        parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
        parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase";
        parser.tags = [];
        parser.closed = parser.closedRoot = parser.sawRoot = false;
        parser.tag = parser.error = null;
        parser.strict = !!strict;
        parser.noscript = !!(strict || parser.opt.noscript);
        parser.state = S.BEGIN;
        parser.strictEntities = parser.opt.strictEntities;
        parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES);
        parser.attribList = [];
        if (parser.opt.xmlns) {
          parser.ns = Object.create(rootNS);
        }
        parser.trackPosition = parser.opt.position !== false;
        if (parser.trackPosition) {
          parser.position = parser.line = parser.column = 0;
        }
        emit(parser, "onready");
      }
      if (!Object.create) {
        Object.create = function(o) {
          function F() {
          }
          F.prototype = o;
          var newf = new F();
          return newf;
        };
      }
      if (!Object.keys) {
        Object.keys = function(o) {
          var a = [];
          for (var i in o)
            if (o.hasOwnProperty(i))
              a.push(i);
          return a;
        };
      }
      function checkBufferLength(parser) {
        var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10);
        var maxActual = 0;
        for (var i = 0, l = buffers.length; i < l; i++) {
          var len = parser[buffers[i]].length;
          if (len > maxAllowed) {
            switch (buffers[i]) {
              case "textNode":
                closeText(parser);
                break;
              case "cdata":
                emitNode(parser, "oncdata", parser.cdata);
                parser.cdata = "";
                break;
              case "script":
                emitNode(parser, "onscript", parser.script);
                parser.script = "";
                break;
              default:
                error(parser, "Max buffer length exceeded: " + buffers[i]);
            }
          }
          maxActual = Math.max(maxActual, len);
        }
        var m = sax.MAX_BUFFER_LENGTH - maxActual;
        parser.bufferCheckPosition = m + parser.position;
      }
      function clearBuffers(parser) {
        for (var i = 0, l = buffers.length; i < l; i++) {
          parser[buffers[i]] = "";
        }
      }
      function flushBuffers(parser) {
        closeText(parser);
        if (parser.cdata !== "") {
          emitNode(parser, "oncdata", parser.cdata);
          parser.cdata = "";
        }
        if (parser.script !== "") {
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
      }
      SAXParser.prototype = {
        end: function() {
          end(this);
        },
        write,
        resume: function() {
          this.error = null;
          return this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          flushBuffers(this);
        }
      };
      var Stream;
      try {
        Stream = require("stream").Stream;
      } catch (ex) {
        Stream = function() {
        };
      }
      var streamWraps = sax.EVENTS.filter(function(ev) {
        return ev !== "error" && ev !== "end";
      });
      function createStream(strict, opt) {
        return new SAXStream(strict, opt);
      }
      function SAXStream(strict, opt) {
        if (!(this instanceof SAXStream)) {
          return new SAXStream(strict, opt);
        }
        Stream.apply(this);
        this._parser = new SAXParser(strict, opt);
        this.writable = true;
        this.readable = true;
        var me = this;
        this._parser.onend = function() {
          me.emit("end");
        };
        this._parser.onerror = function(er) {
          me.emit("error", er);
          me._parser.error = null;
        };
        this._decoder = null;
        streamWraps.forEach(function(ev) {
          Object.defineProperty(me, "on" + ev, {
            get: function() {
              return me._parser["on" + ev];
            },
            set: function(h) {
              if (!h) {
                me.removeAllListeners(ev);
                me._parser["on" + ev] = h;
                return h;
              }
              me.on(ev, h);
            },
            enumerable: true,
            configurable: false
          });
        });
      }
      SAXStream.prototype = Object.create(Stream.prototype, {
        constructor: {
          value: SAXStream
        }
      });
      SAXStream.prototype.write = function(data) {
        if (typeof Buffer === "function" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(data)) {
          if (!this._decoder) {
            var SD = require("string_decoder").StringDecoder;
            this._decoder = new SD("utf8");
          }
          data = this._decoder.write(data);
        }
        this._parser.write(data.toString());
        this.emit("data", data);
        return true;
      };
      SAXStream.prototype.end = function(chunk) {
        if (chunk && chunk.length) {
          this.write(chunk);
        }
        this._parser.end();
        return true;
      };
      SAXStream.prototype.on = function(ev, handler2) {
        var me = this;
        if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
          me._parser["on" + ev] = function() {
            var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
            args.splice(0, 0, ev);
            me.emit.apply(me, args);
          };
        }
        return Stream.prototype.on.call(me, ev, handler2);
      };
      var whitespace = "\r\n	 ";
      var number = "0124356789";
      var letter = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var quote = `'"`;
      var attribEnd = whitespace + ">";
      var CDATA = "[CDATA[";
      var DOCTYPE = "DOCTYPE";
      var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
      var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
      var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE };
      whitespace = charClass(whitespace);
      number = charClass(number);
      letter = charClass(letter);
      var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040\.\d-]/;
      var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040\.\d-]/;
      quote = charClass(quote);
      attribEnd = charClass(attribEnd);
      function charClass(str) {
        return str.split("").reduce(function(s2, c) {
          s2[c] = true;
          return s2;
        }, {});
      }
      function isRegExp(c) {
        return Object.prototype.toString.call(c) === "[object RegExp]";
      }
      function is(charclass, c) {
        return isRegExp(charclass) ? !!c.match(charclass) : charclass[c];
      }
      function not(charclass, c) {
        return !is(charclass, c);
      }
      var S = 0;
      sax.STATE = {
        BEGIN: S++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: S++,
        // leading whitespace
        TEXT: S++,
        // general stuff
        TEXT_ENTITY: S++,
        // &amp and such.
        OPEN_WAKA: S++,
        // <
        SGML_DECL: S++,
        // <!BLARG
        SGML_DECL_QUOTED: S++,
        // <!BLARG foo "bar
        DOCTYPE: S++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: S++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: S++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: S++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: S++,
        // <!-
        COMMENT: S++,
        // <!--
        COMMENT_ENDING: S++,
        // <!-- blah -
        COMMENT_ENDED: S++,
        // <!-- blah --
        CDATA: S++,
        // <![CDATA[ something
        CDATA_ENDING: S++,
        // ]
        CDATA_ENDING_2: S++,
        // ]]
        PROC_INST: S++,
        // <?hi
        PROC_INST_BODY: S++,
        // <?hi there
        PROC_INST_ENDING: S++,
        // <?hi "there" ?
        OPEN_TAG: S++,
        // <strong
        OPEN_TAG_SLASH: S++,
        // <strong /
        ATTRIB: S++,
        // <a
        ATTRIB_NAME: S++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: S++,
        // <a foo _
        ATTRIB_VALUE: S++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: S++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: S++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: S++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: S++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: S++,
        // <foo bar=&quot
        CLOSE_TAG: S++,
        // </a
        CLOSE_TAG_SAW_WHITE: S++,
        // </a   >
        SCRIPT: S++,
        // <script> ...
        SCRIPT_ENDING: S++
        // <script> ... <
      };
      sax.XML_ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'"
      };
      sax.ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'",
        "AElig": 198,
        "Aacute": 193,
        "Acirc": 194,
        "Agrave": 192,
        "Aring": 197,
        "Atilde": 195,
        "Auml": 196,
        "Ccedil": 199,
        "ETH": 208,
        "Eacute": 201,
        "Ecirc": 202,
        "Egrave": 200,
        "Euml": 203,
        "Iacute": 205,
        "Icirc": 206,
        "Igrave": 204,
        "Iuml": 207,
        "Ntilde": 209,
        "Oacute": 211,
        "Ocirc": 212,
        "Ograve": 210,
        "Oslash": 216,
        "Otilde": 213,
        "Ouml": 214,
        "THORN": 222,
        "Uacute": 218,
        "Ucirc": 219,
        "Ugrave": 217,
        "Uuml": 220,
        "Yacute": 221,
        "aacute": 225,
        "acirc": 226,
        "aelig": 230,
        "agrave": 224,
        "aring": 229,
        "atilde": 227,
        "auml": 228,
        "ccedil": 231,
        "eacute": 233,
        "ecirc": 234,
        "egrave": 232,
        "eth": 240,
        "euml": 235,
        "iacute": 237,
        "icirc": 238,
        "igrave": 236,
        "iuml": 239,
        "ntilde": 241,
        "oacute": 243,
        "ocirc": 244,
        "ograve": 242,
        "oslash": 248,
        "otilde": 245,
        "ouml": 246,
        "szlig": 223,
        "thorn": 254,
        "uacute": 250,
        "ucirc": 251,
        "ugrave": 249,
        "uuml": 252,
        "yacute": 253,
        "yuml": 255,
        "copy": 169,
        "reg": 174,
        "nbsp": 160,
        "iexcl": 161,
        "cent": 162,
        "pound": 163,
        "curren": 164,
        "yen": 165,
        "brvbar": 166,
        "sect": 167,
        "uml": 168,
        "ordf": 170,
        "laquo": 171,
        "not": 172,
        "shy": 173,
        "macr": 175,
        "deg": 176,
        "plusmn": 177,
        "sup1": 185,
        "sup2": 178,
        "sup3": 179,
        "acute": 180,
        "micro": 181,
        "para": 182,
        "middot": 183,
        "cedil": 184,
        "ordm": 186,
        "raquo": 187,
        "frac14": 188,
        "frac12": 189,
        "frac34": 190,
        "iquest": 191,
        "times": 215,
        "divide": 247,
        "OElig": 338,
        "oelig": 339,
        "Scaron": 352,
        "scaron": 353,
        "Yuml": 376,
        "fnof": 402,
        "circ": 710,
        "tilde": 732,
        "Alpha": 913,
        "Beta": 914,
        "Gamma": 915,
        "Delta": 916,
        "Epsilon": 917,
        "Zeta": 918,
        "Eta": 919,
        "Theta": 920,
        "Iota": 921,
        "Kappa": 922,
        "Lambda": 923,
        "Mu": 924,
        "Nu": 925,
        "Xi": 926,
        "Omicron": 927,
        "Pi": 928,
        "Rho": 929,
        "Sigma": 931,
        "Tau": 932,
        "Upsilon": 933,
        "Phi": 934,
        "Chi": 935,
        "Psi": 936,
        "Omega": 937,
        "alpha": 945,
        "beta": 946,
        "gamma": 947,
        "delta": 948,
        "epsilon": 949,
        "zeta": 950,
        "eta": 951,
        "theta": 952,
        "iota": 953,
        "kappa": 954,
        "lambda": 955,
        "mu": 956,
        "nu": 957,
        "xi": 958,
        "omicron": 959,
        "pi": 960,
        "rho": 961,
        "sigmaf": 962,
        "sigma": 963,
        "tau": 964,
        "upsilon": 965,
        "phi": 966,
        "chi": 967,
        "psi": 968,
        "omega": 969,
        "thetasym": 977,
        "upsih": 978,
        "piv": 982,
        "ensp": 8194,
        "emsp": 8195,
        "thinsp": 8201,
        "zwnj": 8204,
        "zwj": 8205,
        "lrm": 8206,
        "rlm": 8207,
        "ndash": 8211,
        "mdash": 8212,
        "lsquo": 8216,
        "rsquo": 8217,
        "sbquo": 8218,
        "ldquo": 8220,
        "rdquo": 8221,
        "bdquo": 8222,
        "dagger": 8224,
        "Dagger": 8225,
        "bull": 8226,
        "hellip": 8230,
        "permil": 8240,
        "prime": 8242,
        "Prime": 8243,
        "lsaquo": 8249,
        "rsaquo": 8250,
        "oline": 8254,
        "frasl": 8260,
        "euro": 8364,
        "image": 8465,
        "weierp": 8472,
        "real": 8476,
        "trade": 8482,
        "alefsym": 8501,
        "larr": 8592,
        "uarr": 8593,
        "rarr": 8594,
        "darr": 8595,
        "harr": 8596,
        "crarr": 8629,
        "lArr": 8656,
        "uArr": 8657,
        "rArr": 8658,
        "dArr": 8659,
        "hArr": 8660,
        "forall": 8704,
        "part": 8706,
        "exist": 8707,
        "empty": 8709,
        "nabla": 8711,
        "isin": 8712,
        "notin": 8713,
        "ni": 8715,
        "prod": 8719,
        "sum": 8721,
        "minus": 8722,
        "lowast": 8727,
        "radic": 8730,
        "prop": 8733,
        "infin": 8734,
        "ang": 8736,
        "and": 8743,
        "or": 8744,
        "cap": 8745,
        "cup": 8746,
        "int": 8747,
        "there4": 8756,
        "sim": 8764,
        "cong": 8773,
        "asymp": 8776,
        "ne": 8800,
        "equiv": 8801,
        "le": 8804,
        "ge": 8805,
        "sub": 8834,
        "sup": 8835,
        "nsub": 8836,
        "sube": 8838,
        "supe": 8839,
        "oplus": 8853,
        "otimes": 8855,
        "perp": 8869,
        "sdot": 8901,
        "lceil": 8968,
        "rceil": 8969,
        "lfloor": 8970,
        "rfloor": 8971,
        "lang": 9001,
        "rang": 9002,
        "loz": 9674,
        "spades": 9824,
        "clubs": 9827,
        "hearts": 9829,
        "diams": 9830
      };
      Object.keys(sax.ENTITIES).forEach(function(key) {
        var e = sax.ENTITIES[key];
        var s2 = typeof e === "number" ? String.fromCharCode(e) : e;
        sax.ENTITIES[key] = s2;
      });
      for (var s in sax.STATE) {
        sax.STATE[sax.STATE[s]] = s;
      }
      S = sax.STATE;
      function emit(parser, event, data) {
        parser[event] && parser[event](data);
      }
      function emitNode(parser, nodeType, data) {
        if (parser.textNode)
          closeText(parser);
        emit(parser, nodeType, data);
      }
      function closeText(parser) {
        parser.textNode = textopts(parser.opt, parser.textNode);
        if (parser.textNode)
          emit(parser, "ontext", parser.textNode);
        parser.textNode = "";
      }
      function textopts(opt, text) {
        if (opt.trim)
          text = text.trim();
        if (opt.normalize)
          text = text.replace(/\s+/g, " ");
        return text;
      }
      function error(parser, er) {
        closeText(parser);
        if (parser.trackPosition) {
          er += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
        }
        er = new Error(er);
        parser.error = er;
        emit(parser, "onerror", er);
        return parser;
      }
      function end(parser) {
        if (parser.sawRoot && !parser.closedRoot)
          strictFail(parser, "Unclosed root tag");
        if (parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT) {
          error(parser, "Unexpected end");
        }
        closeText(parser);
        parser.c = "";
        parser.closed = true;
        emit(parser, "onend");
        SAXParser.call(parser, parser.strict, parser.opt);
        return parser;
      }
      function strictFail(parser, message) {
        if (typeof parser !== "object" || !(parser instanceof SAXParser)) {
          throw new Error("bad call to strictFail");
        }
        if (parser.strict) {
          error(parser, message);
        }
      }
      function newTag(parser) {
        if (!parser.strict)
          parser.tagName = parser.tagName[parser.looseCase]();
        var parent = parser.tags[parser.tags.length - 1] || parser;
        var tag = parser.tag = { name: parser.tagName, attributes: {} };
        if (parser.opt.xmlns) {
          tag.ns = parent.ns;
        }
        parser.attribList.length = 0;
        emitNode(parser, "onopentagstart", tag);
      }
      function qname(name, attribute) {
        var i = name.indexOf(":");
        var qualName = i < 0 ? ["", name] : name.split(":");
        var prefix = qualName[0];
        var local = qualName[1];
        if (attribute && name === "xmlns") {
          prefix = "xmlns";
          local = "";
        }
        return { prefix, local };
      }
      function attrib(parser) {
        if (!parser.strict) {
          parser.attribName = parser.attribName[parser.looseCase]();
        }
        if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
          parser.attribName = parser.attribValue = "";
          return;
        }
        if (parser.opt.xmlns) {
          var qn = qname(parser.attribName, true);
          var prefix = qn.prefix;
          var local = qn.local;
          if (prefix === "xmlns") {
            if (local === "xml" && parser.attribValue !== XML_NAMESPACE) {
              strictFail(
                parser,
                "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) {
              strictFail(
                parser,
                "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else {
              var tag = parser.tag;
              var parent = parser.tags[parser.tags.length - 1] || parser;
              if (tag.ns === parent.ns) {
                tag.ns = Object.create(parent.ns);
              }
              tag.ns[local] = parser.attribValue;
            }
          }
          parser.attribList.push([parser.attribName, parser.attribValue]);
        } else {
          parser.tag.attributes[parser.attribName] = parser.attribValue;
          emitNode(parser, "onattribute", {
            name: parser.attribName,
            value: parser.attribValue
          });
        }
        parser.attribName = parser.attribValue = "";
      }
      function openTag(parser, selfClosing) {
        if (parser.opt.xmlns) {
          var tag = parser.tag;
          var qn = qname(parser.tagName);
          tag.prefix = qn.prefix;
          tag.local = qn.local;
          tag.uri = tag.ns[qn.prefix] || "";
          if (tag.prefix && !tag.uri) {
            strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(parser.tagName));
            tag.uri = qn.prefix;
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (tag.ns && parent.ns !== tag.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              emitNode(parser, "onopennamespace", {
                prefix: p,
                uri: tag.ns[p]
              });
            });
          }
          for (var i = 0, l = parser.attribList.length; i < l; i++) {
            var nv = parser.attribList[i];
            var name = nv[0];
            var value = nv[1];
            var qualName = qname(name, true);
            var prefix = qualName.prefix;
            var local = qualName.local;
            var uri = prefix === "" ? "" : tag.ns[prefix] || "";
            var a = {
              name,
              value,
              prefix,
              local,
              uri
            };
            if (prefix && prefix !== "xmlns" && !uri) {
              strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(prefix));
              a.uri = prefix;
            }
            parser.tag.attributes[name] = a;
            emitNode(parser, "onattribute", a);
          }
          parser.attribList.length = 0;
        }
        parser.tag.isSelfClosing = !!selfClosing;
        parser.sawRoot = true;
        parser.tags.push(parser.tag);
        emitNode(parser, "onopentag", parser.tag);
        if (!selfClosing) {
          if (!parser.noscript && parser.tagName.toLowerCase() === "script") {
            parser.state = S.SCRIPT;
          } else {
            parser.state = S.TEXT;
          }
          parser.tag = null;
          parser.tagName = "";
        }
        parser.attribName = parser.attribValue = "";
        parser.attribList.length = 0;
      }
      function closeTag(parser) {
        if (!parser.tagName) {
          strictFail(parser, "Weird empty close tag.");
          parser.textNode += "</>";
          parser.state = S.TEXT;
          return;
        }
        if (parser.script) {
          if (parser.tagName !== "script") {
            parser.script += "</" + parser.tagName + ">";
            parser.tagName = "";
            parser.state = S.SCRIPT;
            return;
          }
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
        var t = parser.tags.length;
        var tagName = parser.tagName;
        if (!parser.strict) {
          tagName = tagName[parser.looseCase]();
        }
        var closeTo = tagName;
        while (t--) {
          var close = parser.tags[t];
          if (close.name !== closeTo) {
            strictFail(parser, "Unexpected close tag");
          } else {
            break;
          }
        }
        if (t < 0) {
          strictFail(parser, "Unmatched closing tag: " + parser.tagName);
          parser.textNode += "</" + parser.tagName + ">";
          parser.state = S.TEXT;
          return;
        }
        parser.tagName = tagName;
        var s2 = parser.tags.length;
        while (s2-- > t) {
          var tag = parser.tag = parser.tags.pop();
          parser.tagName = parser.tag.name;
          emitNode(parser, "onclosetag", parser.tagName);
          var x = {};
          for (var i in tag.ns) {
            x[i] = tag.ns[i];
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (parser.opt.xmlns && tag.ns !== parent.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              var n = tag.ns[p];
              emitNode(parser, "onclosenamespace", { prefix: p, uri: n });
            });
          }
        }
        if (t === 0)
          parser.closedRoot = true;
        parser.tagName = parser.attribValue = parser.attribName = "";
        parser.attribList.length = 0;
        parser.state = S.TEXT;
      }
      function parseEntity(parser) {
        var entity = parser.entity;
        var entityLC = entity.toLowerCase();
        var num;
        var numStr = "";
        if (parser.ENTITIES[entity]) {
          return parser.ENTITIES[entity];
        }
        if (parser.ENTITIES[entityLC]) {
          return parser.ENTITIES[entityLC];
        }
        entity = entityLC;
        if (entity.charAt(0) === "#") {
          if (entity.charAt(1) === "x") {
            entity = entity.slice(2);
            num = parseInt(entity, 16);
            numStr = num.toString(16);
          } else {
            entity = entity.slice(1);
            num = parseInt(entity, 10);
            numStr = num.toString(10);
          }
        }
        entity = entity.replace(/^0+/, "");
        if (numStr.toLowerCase() !== entity) {
          strictFail(parser, "Invalid character entity");
          return "&" + parser.entity + ";";
        }
        return String.fromCodePoint(num);
      }
      function beginWhiteSpace(parser, c) {
        if (c === "<") {
          parser.state = S.OPEN_WAKA;
          parser.startTagPosition = parser.position;
        } else if (not(whitespace, c)) {
          strictFail(parser, "Non-whitespace before first tag.");
          parser.textNode = c;
          parser.state = S.TEXT;
        }
      }
      function charAt(chunk, i) {
        var result = "";
        if (i < chunk.length) {
          result = chunk.charAt(i);
        }
        return result;
      }
      function write(chunk) {
        var parser = this;
        if (this.error) {
          throw this.error;
        }
        if (parser.closed) {
          return error(
            parser,
            "Cannot write after close. Assign an onready handler."
          );
        }
        if (chunk === null) {
          return end(parser);
        }
        if (typeof chunk === "object") {
          chunk = chunk.toString();
        }
        var i = 0;
        var c = "";
        while (true) {
          c = charAt(chunk, i++);
          parser.c = c;
          if (!c) {
            break;
          }
          if (parser.trackPosition) {
            parser.position++;
            if (c === "\n") {
              parser.line++;
              parser.column = 0;
            } else {
              parser.column++;
            }
          }
          switch (parser.state) {
            case S.BEGIN:
              parser.state = S.BEGIN_WHITESPACE;
              if (c === "\uFEFF") {
                continue;
              }
              beginWhiteSpace(parser, c);
              continue;
            case S.BEGIN_WHITESPACE:
              beginWhiteSpace(parser, c);
              continue;
            case S.TEXT:
              if (parser.sawRoot && !parser.closedRoot) {
                var starti = i - 1;
                while (c && c !== "<" && c !== "&") {
                  c = charAt(chunk, i++);
                  if (c && parser.trackPosition) {
                    parser.position++;
                    if (c === "\n") {
                      parser.line++;
                      parser.column = 0;
                    } else {
                      parser.column++;
                    }
                  }
                }
                parser.textNode += chunk.substring(starti, i - 1);
              }
              if (c === "<" && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
                parser.state = S.OPEN_WAKA;
                parser.startTagPosition = parser.position;
              } else {
                if (not(whitespace, c) && (!parser.sawRoot || parser.closedRoot)) {
                  strictFail(parser, "Text data outside of root node.");
                }
                if (c === "&") {
                  parser.state = S.TEXT_ENTITY;
                } else {
                  parser.textNode += c;
                }
              }
              continue;
            case S.SCRIPT:
              if (c === "<") {
                parser.state = S.SCRIPT_ENDING;
              } else {
                parser.script += c;
              }
              continue;
            case S.SCRIPT_ENDING:
              if (c === "/") {
                parser.state = S.CLOSE_TAG;
              } else {
                parser.script += "<" + c;
                parser.state = S.SCRIPT;
              }
              continue;
            case S.OPEN_WAKA:
              if (c === "!") {
                parser.state = S.SGML_DECL;
                parser.sgmlDecl = "";
              } else if (is(whitespace, c)) {
              } else if (is(nameStart, c)) {
                parser.state = S.OPEN_TAG;
                parser.tagName = c;
              } else if (c === "/") {
                parser.state = S.CLOSE_TAG;
                parser.tagName = "";
              } else if (c === "?") {
                parser.state = S.PROC_INST;
                parser.procInstName = parser.procInstBody = "";
              } else {
                strictFail(parser, "Unencoded <");
                if (parser.startTagPosition + 1 < parser.position) {
                  var pad = parser.position - parser.startTagPosition;
                  c = new Array(pad).join(" ") + c;
                }
                parser.textNode += "<" + c;
                parser.state = S.TEXT;
              }
              continue;
            case S.SGML_DECL:
              if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
                emitNode(parser, "onopencdata");
                parser.state = S.CDATA;
                parser.sgmlDecl = "";
                parser.cdata = "";
              } else if (parser.sgmlDecl + c === "--") {
                parser.state = S.COMMENT;
                parser.comment = "";
                parser.sgmlDecl = "";
              } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
                parser.state = S.DOCTYPE;
                if (parser.doctype || parser.sawRoot) {
                  strictFail(
                    parser,
                    "Inappropriately located doctype declaration"
                  );
                }
                parser.doctype = "";
                parser.sgmlDecl = "";
              } else if (c === ">") {
                emitNode(parser, "onsgmldeclaration", parser.sgmlDecl);
                parser.sgmlDecl = "";
                parser.state = S.TEXT;
              } else if (is(quote, c)) {
                parser.state = S.SGML_DECL_QUOTED;
                parser.sgmlDecl += c;
              } else {
                parser.sgmlDecl += c;
              }
              continue;
            case S.SGML_DECL_QUOTED:
              if (c === parser.q) {
                parser.state = S.SGML_DECL;
                parser.q = "";
              }
              parser.sgmlDecl += c;
              continue;
            case S.DOCTYPE:
              if (c === ">") {
                parser.state = S.TEXT;
                emitNode(parser, "ondoctype", parser.doctype);
                parser.doctype = true;
              } else {
                parser.doctype += c;
                if (c === "[") {
                  parser.state = S.DOCTYPE_DTD;
                } else if (is(quote, c)) {
                  parser.state = S.DOCTYPE_QUOTED;
                  parser.q = c;
                }
              }
              continue;
            case S.DOCTYPE_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.q = "";
                parser.state = S.DOCTYPE;
              }
              continue;
            case S.DOCTYPE_DTD:
              parser.doctype += c;
              if (c === "]") {
                parser.state = S.DOCTYPE;
              } else if (is(quote, c)) {
                parser.state = S.DOCTYPE_DTD_QUOTED;
                parser.q = c;
              }
              continue;
            case S.DOCTYPE_DTD_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.state = S.DOCTYPE_DTD;
                parser.q = "";
              }
              continue;
            case S.COMMENT:
              if (c === "-") {
                parser.state = S.COMMENT_ENDING;
              } else {
                parser.comment += c;
              }
              continue;
            case S.COMMENT_ENDING:
              if (c === "-") {
                parser.state = S.COMMENT_ENDED;
                parser.comment = textopts(parser.opt, parser.comment);
                if (parser.comment) {
                  emitNode(parser, "oncomment", parser.comment);
                }
                parser.comment = "";
              } else {
                parser.comment += "-" + c;
                parser.state = S.COMMENT;
              }
              continue;
            case S.COMMENT_ENDED:
              if (c !== ">") {
                strictFail(parser, "Malformed comment");
                parser.comment += "--" + c;
                parser.state = S.COMMENT;
              } else {
                parser.state = S.TEXT;
              }
              continue;
            case S.CDATA:
              if (c === "]") {
                parser.state = S.CDATA_ENDING;
              } else {
                parser.cdata += c;
              }
              continue;
            case S.CDATA_ENDING:
              if (c === "]") {
                parser.state = S.CDATA_ENDING_2;
              } else {
                parser.cdata += "]" + c;
                parser.state = S.CDATA;
              }
              continue;
            case S.CDATA_ENDING_2:
              if (c === ">") {
                if (parser.cdata) {
                  emitNode(parser, "oncdata", parser.cdata);
                }
                emitNode(parser, "onclosecdata");
                parser.cdata = "";
                parser.state = S.TEXT;
              } else if (c === "]") {
                parser.cdata += "]";
              } else {
                parser.cdata += "]]" + c;
                parser.state = S.CDATA;
              }
              continue;
            case S.PROC_INST:
              if (c === "?") {
                parser.state = S.PROC_INST_ENDING;
              } else if (is(whitespace, c)) {
                parser.state = S.PROC_INST_BODY;
              } else {
                parser.procInstName += c;
              }
              continue;
            case S.PROC_INST_BODY:
              if (!parser.procInstBody && is(whitespace, c)) {
                continue;
              } else if (c === "?") {
                parser.state = S.PROC_INST_ENDING;
              } else {
                parser.procInstBody += c;
              }
              continue;
            case S.PROC_INST_ENDING:
              if (c === ">") {
                emitNode(parser, "onprocessinginstruction", {
                  name: parser.procInstName,
                  body: parser.procInstBody
                });
                parser.procInstName = parser.procInstBody = "";
                parser.state = S.TEXT;
              } else {
                parser.procInstBody += "?" + c;
                parser.state = S.PROC_INST_BODY;
              }
              continue;
            case S.OPEN_TAG:
              if (is(nameBody, c)) {
                parser.tagName += c;
              } else {
                newTag(parser);
                if (c === ">") {
                  openTag(parser);
                } else if (c === "/") {
                  parser.state = S.OPEN_TAG_SLASH;
                } else {
                  if (not(whitespace, c)) {
                    strictFail(parser, "Invalid character in tag name");
                  }
                  parser.state = S.ATTRIB;
                }
              }
              continue;
            case S.OPEN_TAG_SLASH:
              if (c === ">") {
                openTag(parser, true);
                closeTag(parser);
              } else {
                strictFail(parser, "Forward-slash in opening tag not followed by >");
                parser.state = S.ATTRIB;
              }
              continue;
            case S.ATTRIB:
              if (is(whitespace, c)) {
                continue;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else if (is(nameStart, c)) {
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME:
              if (c === "=") {
                parser.state = S.ATTRIB_VALUE;
              } else if (c === ">") {
                strictFail(parser, "Attribute without value");
                parser.attribValue = parser.attribName;
                attrib(parser);
                openTag(parser);
              } else if (is(whitespace, c)) {
                parser.state = S.ATTRIB_NAME_SAW_WHITE;
              } else if (is(nameBody, c)) {
                parser.attribName += c;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME_SAW_WHITE:
              if (c === "=") {
                parser.state = S.ATTRIB_VALUE;
              } else if (is(whitespace, c)) {
                continue;
              } else {
                strictFail(parser, "Attribute without value");
                parser.tag.attributes[parser.attribName] = "";
                parser.attribValue = "";
                emitNode(parser, "onattribute", {
                  name: parser.attribName,
                  value: ""
                });
                parser.attribName = "";
                if (c === ">") {
                  openTag(parser);
                } else if (is(nameStart, c)) {
                  parser.attribName = c;
                  parser.state = S.ATTRIB_NAME;
                } else {
                  strictFail(parser, "Invalid attribute name");
                  parser.state = S.ATTRIB;
                }
              }
              continue;
            case S.ATTRIB_VALUE:
              if (is(whitespace, c)) {
                continue;
              } else if (is(quote, c)) {
                parser.q = c;
                parser.state = S.ATTRIB_VALUE_QUOTED;
              } else {
                strictFail(parser, "Unquoted attribute value");
                parser.state = S.ATTRIB_VALUE_UNQUOTED;
                parser.attribValue = c;
              }
              continue;
            case S.ATTRIB_VALUE_QUOTED:
              if (c !== parser.q) {
                if (c === "&") {
                  parser.state = S.ATTRIB_VALUE_ENTITY_Q;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              parser.q = "";
              parser.state = S.ATTRIB_VALUE_CLOSED;
              continue;
            case S.ATTRIB_VALUE_CLOSED:
              if (is(whitespace, c)) {
                parser.state = S.ATTRIB;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else if (is(nameStart, c)) {
                strictFail(parser, "No whitespace between attributes");
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_VALUE_UNQUOTED:
              if (not(attribEnd, c)) {
                if (c === "&") {
                  parser.state = S.ATTRIB_VALUE_ENTITY_U;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              if (c === ">") {
                openTag(parser);
              } else {
                parser.state = S.ATTRIB;
              }
              continue;
            case S.CLOSE_TAG:
              if (!parser.tagName) {
                if (is(whitespace, c)) {
                  continue;
                } else if (not(nameStart, c)) {
                  if (parser.script) {
                    parser.script += "</" + c;
                    parser.state = S.SCRIPT;
                  } else {
                    strictFail(parser, "Invalid tagname in closing tag.");
                  }
                } else {
                  parser.tagName = c;
                }
              } else if (c === ">") {
                closeTag(parser);
              } else if (is(nameBody, c)) {
                parser.tagName += c;
              } else if (parser.script) {
                parser.script += "</" + parser.tagName;
                parser.tagName = "";
                parser.state = S.SCRIPT;
              } else {
                if (not(whitespace, c)) {
                  strictFail(parser, "Invalid tagname in closing tag");
                }
                parser.state = S.CLOSE_TAG_SAW_WHITE;
              }
              continue;
            case S.CLOSE_TAG_SAW_WHITE:
              if (is(whitespace, c)) {
                continue;
              }
              if (c === ">") {
                closeTag(parser);
              } else {
                strictFail(parser, "Invalid characters in closing tag");
              }
              continue;
            case S.TEXT_ENTITY:
            case S.ATTRIB_VALUE_ENTITY_Q:
            case S.ATTRIB_VALUE_ENTITY_U:
              var returnState;
              var buffer;
              switch (parser.state) {
                case S.TEXT_ENTITY:
                  returnState = S.TEXT;
                  buffer = "textNode";
                  break;
                case S.ATTRIB_VALUE_ENTITY_Q:
                  returnState = S.ATTRIB_VALUE_QUOTED;
                  buffer = "attribValue";
                  break;
                case S.ATTRIB_VALUE_ENTITY_U:
                  returnState = S.ATTRIB_VALUE_UNQUOTED;
                  buffer = "attribValue";
                  break;
              }
              if (c === ";") {
                parser[buffer] += parseEntity(parser);
                parser.entity = "";
                parser.state = returnState;
              } else if (is(parser.entity.length ? entityBody : entityStart, c)) {
                parser.entity += c;
              } else {
                strictFail(parser, "Invalid character in entity name");
                parser[buffer] += "&" + parser.entity + c;
                parser.entity = "";
                parser.state = returnState;
              }
              continue;
            default:
              throw new Error(parser, "Unknown state: " + parser.state);
          }
        }
        if (parser.position >= parser.bufferCheckPosition) {
          checkBufferLength(parser);
        }
        return parser;
      }
      if (!String.fromCodePoint) {
        (function() {
          var stringFromCharCode = String.fromCharCode;
          var floor = Math.floor;
          var fromCodePoint = function() {
            var MAX_SIZE = 16384;
            var codeUnits = [];
            var highSurrogate;
            var lowSurrogate;
            var index = -1;
            var length = arguments.length;
            if (!length) {
              return "";
            }
            var result = "";
            while (++index < length) {
              var codePoint = Number(arguments[index]);
              if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
              codePoint < 0 || // not a valid Unicode code point
              codePoint > 1114111 || // not a valid Unicode code point
              floor(codePoint) !== codePoint) {
                throw RangeError("Invalid code point: " + codePoint);
              }
              if (codePoint <= 65535) {
                codeUnits.push(codePoint);
              } else {
                codePoint -= 65536;
                highSurrogate = (codePoint >> 10) + 55296;
                lowSurrogate = codePoint % 1024 + 56320;
                codeUnits.push(highSurrogate, lowSurrogate);
              }
              if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                result += stringFromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
              }
            }
            return result;
          };
          if (Object.defineProperty) {
            Object.defineProperty(String, "fromCodePoint", {
              value: fromCodePoint,
              configurable: true,
              writable: true
            });
          } else {
            String.fromCodePoint = fromCodePoint;
          }
        })();
      }
    })(typeof exports === "undefined" ? exports.sax = {} : exports);
  }
});

// node_modules/.pnpm/xml2js@0.4.19/node_modules/xml2js/lib/bom.js
var require_bom = __commonJS({
  "node_modules/.pnpm/xml2js@0.4.19/node_modules/xml2js/lib/bom.js"(exports) {
    (function() {
      "use strict";
      exports.stripBOM = function(str) {
        if (str[0] === "\uFEFF") {
          return str.substring(1);
        } else {
          return str;
        }
      };
    }).call(exports);
  }
});

// node_modules/.pnpm/xml2js@0.4.19/node_modules/xml2js/lib/processors.js
var require_processors = __commonJS({
  "node_modules/.pnpm/xml2js@0.4.19/node_modules/xml2js/lib/processors.js"(exports) {
    (function() {
      "use strict";
      var prefixMatch;
      prefixMatch = new RegExp(/(?!xmlns)^.*:/);
      exports.normalize = function(str) {
        return str.toLowerCase();
      };
      exports.firstCharLowerCase = function(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
      };
      exports.stripPrefix = function(str) {
        return str.replace(prefixMatch, "");
      };
      exports.parseNumbers = function(str) {
        if (!isNaN(str)) {
          str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
        }
        return str;
      };
      exports.parseBooleans = function(str) {
        if (/^(?:true|false)$/i.test(str)) {
          str = str.toLowerCase() === "true";
        }
        return str;
      };
    }).call(exports);
  }
});

// node_modules/.pnpm/xml2js@0.4.19/node_modules/xml2js/lib/parser.js
var require_parser2 = __commonJS({
  "node_modules/.pnpm/xml2js@0.4.19/node_modules/xml2js/lib/parser.js"(exports) {
    (function() {
      "use strict";
      var bom, defaults, events, isEmpty, processItem, processors, sax, setImmediate2, bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      }, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      sax = require_sax();
      events = require("events");
      bom = require_bom();
      processors = require_processors();
      setImmediate2 = require("timers").setImmediate;
      defaults = require_defaults().defaults;
      isEmpty = function(thing) {
        return typeof thing === "object" && thing != null && Object.keys(thing).length === 0;
      };
      processItem = function(processors2, item, key) {
        var i, len, process2;
        for (i = 0, len = processors2.length; i < len; i++) {
          process2 = processors2[i];
          item = process2(item, key);
        }
        return item;
      };
      exports.Parser = function(superClass) {
        extend(Parser, superClass);
        function Parser(opts) {
          this.parseString = bind(this.parseString, this);
          this.reset = bind(this.reset, this);
          this.assignOrPush = bind(this.assignOrPush, this);
          this.processAsync = bind(this.processAsync, this);
          var key, ref, value;
          if (!(this instanceof exports.Parser)) {
            return new exports.Parser(opts);
          }
          this.options = {};
          ref = defaults["0.2"];
          for (key in ref) {
            if (!hasProp.call(ref, key))
              continue;
            value = ref[key];
            this.options[key] = value;
          }
          for (key in opts) {
            if (!hasProp.call(opts, key))
              continue;
            value = opts[key];
            this.options[key] = value;
          }
          if (this.options.xmlns) {
            this.options.xmlnskey = this.options.attrkey + "ns";
          }
          if (this.options.normalizeTags) {
            if (!this.options.tagNameProcessors) {
              this.options.tagNameProcessors = [];
            }
            this.options.tagNameProcessors.unshift(processors.normalize);
          }
          this.reset();
        }
        Parser.prototype.processAsync = function() {
          var chunk, err;
          try {
            if (this.remaining.length <= this.options.chunkSize) {
              chunk = this.remaining;
              this.remaining = "";
              this.saxParser = this.saxParser.write(chunk);
              return this.saxParser.close();
            } else {
              chunk = this.remaining.substr(0, this.options.chunkSize);
              this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length);
              this.saxParser = this.saxParser.write(chunk);
              return setImmediate2(this.processAsync);
            }
          } catch (error1) {
            err = error1;
            if (!this.saxParser.errThrown) {
              this.saxParser.errThrown = true;
              return this.emit(err);
            }
          }
        };
        Parser.prototype.assignOrPush = function(obj, key, newValue) {
          if (!(key in obj)) {
            if (!this.options.explicitArray) {
              return obj[key] = newValue;
            } else {
              return obj[key] = [newValue];
            }
          } else {
            if (!(obj[key] instanceof Array)) {
              obj[key] = [obj[key]];
            }
            return obj[key].push(newValue);
          }
        };
        Parser.prototype.reset = function() {
          var attrkey, charkey, ontext, stack;
          this.removeAllListeners();
          this.saxParser = sax.parser(this.options.strict, {
            trim: false,
            normalize: false,
            xmlns: this.options.xmlns
          });
          this.saxParser.errThrown = false;
          this.saxParser.onerror = function(_this) {
            return function(error) {
              _this.saxParser.resume();
              if (!_this.saxParser.errThrown) {
                _this.saxParser.errThrown = true;
                return _this.emit("error", error);
              }
            };
          }(this);
          this.saxParser.onend = function(_this) {
            return function() {
              if (!_this.saxParser.ended) {
                _this.saxParser.ended = true;
                return _this.emit("end", _this.resultObject);
              }
            };
          }(this);
          this.saxParser.ended = false;
          this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
          this.resultObject = null;
          stack = [];
          attrkey = this.options.attrkey;
          charkey = this.options.charkey;
          this.saxParser.onopentag = function(_this) {
            return function(node) {
              var key, newValue, obj, processedKey, ref;
              obj = {};
              obj[charkey] = "";
              if (!_this.options.ignoreAttrs) {
                ref = node.attributes;
                for (key in ref) {
                  if (!hasProp.call(ref, key))
                    continue;
                  if (!(attrkey in obj) && !_this.options.mergeAttrs) {
                    obj[attrkey] = {};
                  }
                  newValue = _this.options.attrValueProcessors ? processItem(_this.options.attrValueProcessors, node.attributes[key], key) : node.attributes[key];
                  processedKey = _this.options.attrNameProcessors ? processItem(_this.options.attrNameProcessors, key) : key;
                  if (_this.options.mergeAttrs) {
                    _this.assignOrPush(obj, processedKey, newValue);
                  } else {
                    obj[attrkey][processedKey] = newValue;
                  }
                }
              }
              obj["#name"] = _this.options.tagNameProcessors ? processItem(_this.options.tagNameProcessors, node.name) : node.name;
              if (_this.options.xmlns) {
                obj[_this.options.xmlnskey] = {
                  uri: node.uri,
                  local: node.local
                };
              }
              return stack.push(obj);
            };
          }(this);
          this.saxParser.onclosetag = function(_this) {
            return function() {
              var cdata, emptyStr, key, node, nodeName, obj, objClone, old, s, xpath;
              obj = stack.pop();
              nodeName = obj["#name"];
              if (!_this.options.explicitChildren || !_this.options.preserveChildrenOrder) {
                delete obj["#name"];
              }
              if (obj.cdata === true) {
                cdata = obj.cdata;
                delete obj.cdata;
              }
              s = stack[stack.length - 1];
              if (obj[charkey].match(/^\s*$/) && !cdata) {
                emptyStr = obj[charkey];
                delete obj[charkey];
              } else {
                if (_this.options.trim) {
                  obj[charkey] = obj[charkey].trim();
                }
                if (_this.options.normalize) {
                  obj[charkey] = obj[charkey].replace(/\s{2,}/g, " ").trim();
                }
                obj[charkey] = _this.options.valueProcessors ? processItem(_this.options.valueProcessors, obj[charkey], nodeName) : obj[charkey];
                if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                  obj = obj[charkey];
                }
              }
              if (isEmpty(obj)) {
                obj = _this.options.emptyTag !== "" ? _this.options.emptyTag : emptyStr;
              }
              if (_this.options.validator != null) {
                xpath = "/" + function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = stack.length; i < len; i++) {
                    node = stack[i];
                    results.push(node["#name"]);
                  }
                  return results;
                }().concat(nodeName).join("/");
                (function() {
                  var err;
                  try {
                    return obj = _this.options.validator(xpath, s && s[nodeName], obj);
                  } catch (error1) {
                    err = error1;
                    return _this.emit("error", err);
                  }
                })();
              }
              if (_this.options.explicitChildren && !_this.options.mergeAttrs && typeof obj === "object") {
                if (!_this.options.preserveChildrenOrder) {
                  node = {};
                  if (_this.options.attrkey in obj) {
                    node[_this.options.attrkey] = obj[_this.options.attrkey];
                    delete obj[_this.options.attrkey];
                  }
                  if (!_this.options.charsAsChildren && _this.options.charkey in obj) {
                    node[_this.options.charkey] = obj[_this.options.charkey];
                    delete obj[_this.options.charkey];
                  }
                  if (Object.getOwnPropertyNames(obj).length > 0) {
                    node[_this.options.childkey] = obj;
                  }
                  obj = node;
                } else if (s) {
                  s[_this.options.childkey] = s[_this.options.childkey] || [];
                  objClone = {};
                  for (key in obj) {
                    if (!hasProp.call(obj, key))
                      continue;
                    objClone[key] = obj[key];
                  }
                  s[_this.options.childkey].push(objClone);
                  delete obj["#name"];
                  if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                    obj = obj[charkey];
                  }
                }
              }
              if (stack.length > 0) {
                return _this.assignOrPush(s, nodeName, obj);
              } else {
                if (_this.options.explicitRoot) {
                  old = obj;
                  obj = {};
                  obj[nodeName] = old;
                }
                _this.resultObject = obj;
                _this.saxParser.ended = true;
                return _this.emit("end", _this.resultObject);
              }
            };
          }(this);
          ontext = function(_this) {
            return function(text) {
              var charChild, s;
              s = stack[stack.length - 1];
              if (s) {
                s[charkey] += text;
                if (_this.options.explicitChildren && _this.options.preserveChildrenOrder && _this.options.charsAsChildren && (_this.options.includeWhiteChars || text.replace(/\\n/g, "").trim() !== "")) {
                  s[_this.options.childkey] = s[_this.options.childkey] || [];
                  charChild = {
                    "#name": "__text__"
                  };
                  charChild[charkey] = text;
                  if (_this.options.normalize) {
                    charChild[charkey] = charChild[charkey].replace(/\s{2,}/g, " ").trim();
                  }
                  s[_this.options.childkey].push(charChild);
                }
                return s;
              }
            };
          }(this);
          this.saxParser.ontext = ontext;
          return this.saxParser.oncdata = function(_this) {
            return function(text) {
              var s;
              s = ontext(text);
              if (s) {
                return s.cdata = true;
              }
            };
          }(this);
        };
        Parser.prototype.parseString = function(str, cb) {
          var err;
          if (cb != null && typeof cb === "function") {
            this.on("end", function(result) {
              this.reset();
              return cb(null, result);
            });
            this.on("error", function(err2) {
              this.reset();
              return cb(err2);
            });
          }
          try {
            str = str.toString();
            if (str.trim() === "") {
              this.emit("end", null);
              return true;
            }
            str = bom.stripBOM(str);
            if (this.options.async) {
              this.remaining = str;
              setImmediate2(this.processAsync);
              return this.saxParser;
            }
            return this.saxParser.write(str).close();
          } catch (error1) {
            err = error1;
            if (!(this.saxParser.errThrown || this.saxParser.ended)) {
              this.emit("error", err);
              return this.saxParser.errThrown = true;
            } else if (this.saxParser.ended) {
              throw err;
            }
          }
        };
        return Parser;
      }(events.EventEmitter);
      exports.parseString = function(str, a, b) {
        var cb, options, parser;
        if (b != null) {
          if (typeof b === "function") {
            cb = b;
          }
          if (typeof a === "object") {
            options = a;
          }
        } else {
          if (typeof a === "function") {
            cb = a;
          }
          options = {};
        }
        parser = new exports.Parser(options);
        return parser.parseString(str, cb);
      };
    }).call(exports);
  }
});

// node_modules/.pnpm/xml2js@0.4.19/node_modules/xml2js/lib/xml2js.js
var require_xml2js = __commonJS({
  "node_modules/.pnpm/xml2js@0.4.19/node_modules/xml2js/lib/xml2js.js"(exports) {
    (function() {
      "use strict";
      var builder, defaults, parser, processors, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      defaults = require_defaults();
      builder = require_builder3();
      parser = require_parser2();
      processors = require_processors();
      exports.defaults = defaults.defaults;
      exports.processors = processors;
      exports.ValidationError = function(superClass) {
        extend(ValidationError, superClass);
        function ValidationError(message) {
          this.message = message;
        }
        return ValidationError;
      }(Error);
      exports.Builder = builder.Builder;
      exports.Parser = parser.Parser;
      exports.parseString = parser.parseString;
    }).call(exports);
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/xml/node_parser.js
var require_node_parser = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/xml/node_parser.js"(exports, module2) {
    var AWS2 = require_core();
    var util2 = AWS2.util;
    var Shape = AWS2.Model.Shape;
    var xml2js = require_xml2js();
    var options = {
      // options passed to xml2js parser
      explicitCharkey: false,
      // undocumented
      trim: false,
      // trim the leading/trailing whitespace from text nodes
      normalize: false,
      // trim interior whitespace inside text nodes
      explicitRoot: false,
      // return the root node in the resulting object?
      emptyTag: null,
      // the default value for empty nodes
      explicitArray: true,
      // always put child nodes in an array
      ignoreAttrs: false,
      // ignore attributes, only create text nodes
      mergeAttrs: false,
      // merge attributes and child elements
      validator: null
      // a callable validator
    };
    function NodeXmlParser() {
    }
    NodeXmlParser.prototype.parse = function(xml, shape) {
      shape = shape || {};
      var result = null;
      var error = null;
      var parser = new xml2js.Parser(options);
      parser.parseString(xml, function(e, r) {
        error = e;
        result = r;
      });
      if (result) {
        var data = parseXml(result, shape);
        if (result.ResponseMetadata) {
          data.ResponseMetadata = parseXml(result.ResponseMetadata[0], {});
        }
        return data;
      } else if (error) {
        throw util2.error(error, { code: "XMLParserError", retryable: true });
      } else {
        return parseXml({}, shape);
      }
    };
    function parseXml(xml, shape) {
      switch (shape.type) {
        case "structure":
          return parseStructure(xml, shape);
        case "map":
          return parseMap(xml, shape);
        case "list":
          return parseList(xml, shape);
        case void 0:
        case null:
          return parseUnknown(xml);
        default:
          return parseScalar(xml, shape);
      }
    }
    function parseStructure(xml, shape) {
      var data = {};
      if (xml === null)
        return data;
      util2.each(shape.members, function(memberName, memberShape) {
        var xmlName = memberShape.name;
        if (Object.prototype.hasOwnProperty.call(xml, xmlName) && Array.isArray(xml[xmlName])) {
          var xmlChild = xml[xmlName];
          if (!memberShape.flattened)
            xmlChild = xmlChild[0];
          data[memberName] = parseXml(xmlChild, memberShape);
        } else if (memberShape.isXmlAttribute && xml.$ && Object.prototype.hasOwnProperty.call(xml.$, xmlName)) {
          data[memberName] = parseScalar(xml.$[xmlName], memberShape);
        } else if (memberShape.type === "list" && !shape.api.xmlNoDefaultLists) {
          data[memberName] = memberShape.defaultValue;
        }
      });
      return data;
    }
    function parseMap(xml, shape) {
      var data = {};
      if (xml === null)
        return data;
      var xmlKey = shape.key.name || "key";
      var xmlValue = shape.value.name || "value";
      var iterable = shape.flattened ? xml : xml.entry;
      if (Array.isArray(iterable)) {
        util2.arrayEach(iterable, function(child) {
          data[child[xmlKey][0]] = parseXml(child[xmlValue][0], shape.value);
        });
      }
      return data;
    }
    function parseList(xml, shape) {
      var data = [];
      var name = shape.member.name || "member";
      if (shape.flattened) {
        util2.arrayEach(xml, function(xmlChild) {
          data.push(parseXml(xmlChild, shape.member));
        });
      } else if (xml && Array.isArray(xml[name])) {
        util2.arrayEach(xml[name], function(child) {
          data.push(parseXml(child, shape.member));
        });
      }
      return data;
    }
    function parseScalar(text, shape) {
      if (text && text.$ && text.$.encoding === "base64") {
        shape = new Shape.create({ type: text.$.encoding });
      }
      if (text && text._)
        text = text._;
      if (typeof shape.toType === "function") {
        return shape.toType(text);
      } else {
        return text;
      }
    }
    function parseUnknown(xml) {
      if (xml === void 0 || xml === null)
        return "";
      if (typeof xml === "string")
        return xml;
      if (Array.isArray(xml)) {
        var arr = [];
        for (i = 0; i < xml.length; i++) {
          arr.push(parseXml(xml[i], {}));
        }
        return arr;
      }
      var keys = Object.keys(xml), i;
      if (keys.length === 0 || keys.length === 1 && keys[0] === "$") {
        return {};
      }
      var data = {};
      for (i = 0; i < keys.length; i++) {
        var key = keys[i], value = xml[key];
        if (key === "$")
          continue;
        if (value.length > 1) {
          data[key] = parseList(value, { member: {} });
        } else {
          data[key] = parseXml(value[0], {});
        }
      }
      return data;
    }
    module2.exports = NodeXmlParser;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/http/node.js
var require_node = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/http/node.js"() {
    var AWS2 = require_core();
    var Stream = AWS2.util.stream.Stream;
    var TransformStream = AWS2.util.stream.Transform;
    var ReadableStream = AWS2.util.stream.Readable;
    require_http();
    var CONNECTION_REUSE_ENV_NAME = "AWS_NODEJS_CONNECTION_REUSE_ENABLED";
    AWS2.NodeHttpClient = AWS2.util.inherit({
      handleRequest: function handleRequest(httpRequest, httpOptions, callback, errCallback) {
        var self = this;
        var endpoint = httpRequest.endpoint;
        var pathPrefix = "";
        if (!httpOptions)
          httpOptions = {};
        if (httpOptions.proxy) {
          pathPrefix = endpoint.protocol + "//" + endpoint.hostname;
          if (endpoint.port !== 80 && endpoint.port !== 443) {
            pathPrefix += ":" + endpoint.port;
          }
          endpoint = new AWS2.Endpoint(httpOptions.proxy);
        }
        var useSSL = endpoint.protocol === "https:";
        var http = useSSL ? require("https") : require("http");
        var options = {
          host: endpoint.hostname,
          port: endpoint.port,
          method: httpRequest.method,
          headers: httpRequest.headers,
          path: pathPrefix + httpRequest.path
        };
        if (!httpOptions.agent) {
          options.agent = this.getAgent(useSSL, {
            keepAlive: process.env[CONNECTION_REUSE_ENV_NAME] === "1" ? true : false
          });
        }
        AWS2.util.update(options, httpOptions);
        delete options.proxy;
        delete options.timeout;
        var stream = http.request(options, function(httpResp) {
          if (stream.didCallback)
            return;
          callback(httpResp);
          httpResp.emit(
            "headers",
            httpResp.statusCode,
            httpResp.headers,
            httpResp.statusMessage
          );
        });
        httpRequest.stream = stream;
        stream.didCallback = false;
        if (httpOptions.connectTimeout) {
          var connectTimeoutId;
          stream.on("socket", function(socket) {
            if (socket.connecting) {
              connectTimeoutId = setTimeout(function connectTimeout() {
                if (stream.didCallback)
                  return;
                stream.didCallback = true;
                stream.abort();
                errCallback(AWS2.util.error(
                  new Error("Socket timed out without establishing a connection"),
                  { code: "TimeoutError" }
                ));
              }, httpOptions.connectTimeout);
              socket.on("connect", function() {
                clearTimeout(connectTimeoutId);
                connectTimeoutId = null;
              });
            }
          });
        }
        stream.setTimeout(httpOptions.timeout || 0, function() {
          if (stream.didCallback)
            return;
          stream.didCallback = true;
          var msg = "Connection timed out after " + httpOptions.timeout + "ms";
          errCallback(AWS2.util.error(new Error(msg), { code: "TimeoutError" }));
          stream.abort();
        });
        stream.on("error", function(err) {
          if (connectTimeoutId) {
            clearTimeout(connectTimeoutId);
            connectTimeoutId = null;
          }
          if (stream.didCallback)
            return;
          stream.didCallback = true;
          if ("ECONNRESET" === err.code || "EPIPE" === err.code || "ETIMEDOUT" === err.code) {
            errCallback(AWS2.util.error(err, { code: "TimeoutError" }));
          } else {
            errCallback(err);
          }
        });
        var expect = httpRequest.headers.Expect || httpRequest.headers.expect;
        if (expect === "100-continue") {
          stream.once("continue", function() {
            self.writeBody(stream, httpRequest);
          });
        } else {
          this.writeBody(stream, httpRequest);
        }
        return stream;
      },
      writeBody: function writeBody(stream, httpRequest) {
        var body = httpRequest.body;
        var totalBytes = parseInt(httpRequest.headers["Content-Length"], 10);
        if (body instanceof Stream) {
          var progressStream = this.progressStream(stream, totalBytes);
          if (progressStream) {
            body.pipe(progressStream).pipe(stream);
          } else {
            body.pipe(stream);
          }
        } else if (body) {
          stream.once("finish", function() {
            stream.emit("sendProgress", {
              loaded: totalBytes,
              total: totalBytes
            });
          });
          stream.end(body);
        } else {
          stream.end();
        }
      },
      /**
       * Create the https.Agent or http.Agent according to the request schema.
       */
      getAgent: function getAgent(useSSL, agentOptions) {
        var http = useSSL ? require("https") : require("http");
        if (useSSL) {
          if (!AWS2.NodeHttpClient.sslAgent) {
            AWS2.NodeHttpClient.sslAgent = new http.Agent(AWS2.util.merge({
              rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0" ? false : true
            }, agentOptions || {}));
            AWS2.NodeHttpClient.sslAgent.setMaxListeners(0);
            Object.defineProperty(AWS2.NodeHttpClient.sslAgent, "maxSockets", {
              enumerable: true,
              get: function() {
                var defaultMaxSockets = 50;
                var globalAgent = http.globalAgent;
                if (globalAgent && globalAgent.maxSockets !== Infinity && typeof globalAgent.maxSockets === "number") {
                  return globalAgent.maxSockets;
                }
                return defaultMaxSockets;
              }
            });
          }
          return AWS2.NodeHttpClient.sslAgent;
        } else {
          if (!AWS2.NodeHttpClient.agent) {
            AWS2.NodeHttpClient.agent = new http.Agent(agentOptions);
          }
          return AWS2.NodeHttpClient.agent;
        }
      },
      progressStream: function progressStream(stream, totalBytes) {
        if (typeof TransformStream === "undefined") {
          return;
        }
        var loadedBytes = 0;
        var reporter = new TransformStream();
        reporter._transform = function(chunk, encoding, callback) {
          if (chunk) {
            loadedBytes += chunk.length;
            stream.emit("sendProgress", {
              loaded: loadedBytes,
              total: totalBytes
            });
          }
          callback(null, chunk);
        };
        return reporter;
      },
      emitter: null
    });
    AWS2.HttpClient.prototype = AWS2.NodeHttpClient.prototype;
    AWS2.HttpClient.streamsApiVersion = ReadableStream ? 2 : 1;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/token_file_web_identity_credentials.js
var require_token_file_web_identity_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/token_file_web_identity_credentials.js"() {
    var AWS2 = require_core();
    var fs = require("fs");
    var STS = require_sts2();
    var iniLoader = AWS2.util.iniLoader;
    AWS2.TokenFileWebIdentityCredentials = AWS2.util.inherit(AWS2.Credentials, {
      /**
       * @example Creating a new credentials object
       *  AWS.config.credentials = new AWS.TokenFileWebIdentityCredentials(
       *   // optionally provide configuration to apply to the underlying AWS.STS service client
       *   // if configuration is not provided, then configuration will be pulled from AWS.config
       *   {
       *     // specify timeout options
       *     httpOptions: {
       *       timeout: 100
       *     }
       *   });
       * @see AWS.Config
       */
      constructor: function TokenFileWebIdentityCredentials(clientConfig) {
        AWS2.Credentials.call(this);
        this.data = null;
        this.clientConfig = AWS2.util.copy(clientConfig || {});
      },
      /**
       * Returns params from environment variables
       *
       * @api private
       */
      getParamsFromEnv: function getParamsFromEnv() {
        var ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE", ENV_ROLE_ARN = "AWS_ROLE_ARN";
        if (process.env[ENV_TOKEN_FILE] && process.env[ENV_ROLE_ARN]) {
          return [{
            envTokenFile: process.env[ENV_TOKEN_FILE],
            roleArn: process.env[ENV_ROLE_ARN],
            roleSessionName: process.env["AWS_ROLE_SESSION_NAME"]
          }];
        }
      },
      /**
       * Returns params from shared config variables
       *
       * @api private
       */
      getParamsFromSharedConfig: function getParamsFromSharedConfig() {
        var profiles = AWS2.util.getProfilesFromSharedConfig(iniLoader);
        var profileName2 = process.env.AWS_PROFILE || AWS2.util.defaultProfile;
        var profile = profiles[profileName2] || {};
        if (Object.keys(profile).length === 0) {
          throw AWS2.util.error(
            new Error("Profile " + profileName2 + " not found"),
            { code: "TokenFileWebIdentityCredentialsProviderFailure" }
          );
        }
        var paramsArray = [];
        while (!profile["web_identity_token_file"] && profile["source_profile"]) {
          paramsArray.unshift({
            roleArn: profile["role_arn"],
            roleSessionName: profile["role_session_name"]
          });
          var sourceProfile = profile["source_profile"];
          profile = profiles[sourceProfile];
        }
        paramsArray.unshift({
          envTokenFile: profile["web_identity_token_file"],
          roleArn: profile["role_arn"],
          roleSessionName: profile["role_session_name"]
        });
        return paramsArray;
      },
      /**
       * Refreshes credentials using {AWS.STS.assumeRoleWithWebIdentity}
       *
       * @callback callback function(err)
       *   Called when the STS service responds (or fails). When
       *   this callback is called with no error, it means that the credentials
       *   information has been loaded into the object (as the `accessKeyId`,
       *   `secretAccessKey`, and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @see AWS.Credentials.get
       */
      refresh: function refresh(callback) {
        this.coalesceRefresh(callback || AWS2.util.fn.callback);
      },
      /**
       * @api private
      */
      assumeRoleChaining: function assumeRoleChaining(paramsArray, callback) {
        var self = this;
        if (paramsArray.length === 0) {
          self.service.credentialsFrom(self.data, self);
          callback();
        } else {
          var params = paramsArray.shift();
          self.service.config.credentials = self.service.credentialsFrom(self.data, self);
          self.service.assumeRole(
            {
              RoleArn: params.roleArn,
              RoleSessionName: params.roleSessionName || "token-file-web-identity"
            },
            function(err, data) {
              self.data = null;
              if (err) {
                callback(err);
              } else {
                self.data = data;
                self.assumeRoleChaining(paramsArray, callback);
              }
            }
          );
        }
      },
      /**
       * @api private
       */
      load: function load(callback) {
        var self = this;
        try {
          var paramsArray = self.getParamsFromEnv();
          if (!paramsArray) {
            paramsArray = self.getParamsFromSharedConfig();
          }
          if (paramsArray) {
            var params = paramsArray.shift();
            var oidcToken = fs.readFileSync(params.envTokenFile, { encoding: "ascii" });
            if (!self.service) {
              self.createClients();
            }
            self.service.assumeRoleWithWebIdentity(
              {
                WebIdentityToken: oidcToken,
                RoleArn: params.roleArn,
                RoleSessionName: params.roleSessionName || "token-file-web-identity"
              },
              function(err, data) {
                self.data = null;
                if (err) {
                  callback(err);
                } else {
                  self.data = data;
                  self.assumeRoleChaining(paramsArray, callback);
                }
              }
            );
          }
        } catch (err) {
          callback(err);
        }
      },
      /**
       * @api private
       */
      createClients: function() {
        if (!this.service) {
          var stsConfig = AWS2.util.merge({}, this.clientConfig);
          this.service = new STS(stsConfig);
          this.service.retryableError = function(error) {
            if (error.code === "IDPCommunicationErrorException" || error.code === "InvalidIdentityToken") {
              return true;
            } else {
              return AWS2.Service.prototype.retryableError.call(this, error);
            }
          };
        }
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/metadata_service/get_endpoint.js
var require_get_endpoint = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/metadata_service/get_endpoint.js"(exports, module2) {
    var getEndpoint = function() {
      return {
        IPv4: "http://169.254.169.254",
        IPv6: "http://[fd00:ec2::254]"
      };
    };
    module2.exports = getEndpoint;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/metadata_service/get_endpoint_mode.js
var require_get_endpoint_mode = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/metadata_service/get_endpoint_mode.js"(exports, module2) {
    var getEndpointMode = function() {
      return {
        IPv4: "IPv4",
        IPv6: "IPv6"
      };
    };
    module2.exports = getEndpointMode;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/metadata_service/get_endpoint_config_options.js
var require_get_endpoint_config_options = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/metadata_service/get_endpoint_config_options.js"(exports, module2) {
    var ENV_ENDPOINT_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT";
    var CONFIG_ENDPOINT_NAME = "ec2_metadata_service_endpoint";
    var getEndpointConfigOptions = function() {
      return {
        environmentVariableSelector: function(env) {
          return env[ENV_ENDPOINT_NAME];
        },
        configFileSelector: function(profile) {
          return profile[CONFIG_ENDPOINT_NAME];
        },
        default: void 0
      };
    };
    module2.exports = getEndpointConfigOptions;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/metadata_service/get_endpoint_mode_config_options.js
var require_get_endpoint_mode_config_options = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/metadata_service/get_endpoint_mode_config_options.js"(exports, module2) {
    var EndpointMode = require_get_endpoint_mode()();
    var ENV_ENDPOINT_MODE_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE";
    var CONFIG_ENDPOINT_MODE_NAME = "ec2_metadata_service_endpoint_mode";
    var getEndpointModeConfigOptions = function() {
      return {
        environmentVariableSelector: function(env) {
          return env[ENV_ENDPOINT_MODE_NAME];
        },
        configFileSelector: function(profile) {
          return profile[CONFIG_ENDPOINT_MODE_NAME];
        },
        default: EndpointMode.IPv4
      };
    };
    module2.exports = getEndpointModeConfigOptions;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/metadata_service/get_metadata_service_endpoint.js
var require_get_metadata_service_endpoint = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/metadata_service/get_metadata_service_endpoint.js"(exports, module2) {
    var AWS2 = require_core();
    var Endpoint = require_get_endpoint()();
    var EndpointMode = require_get_endpoint_mode()();
    var ENDPOINT_CONFIG_OPTIONS = require_get_endpoint_config_options()();
    var ENDPOINT_MODE_CONFIG_OPTIONS = require_get_endpoint_mode_config_options()();
    var getMetadataServiceEndpoint = function() {
      var endpoint = AWS2.util.loadConfig(ENDPOINT_CONFIG_OPTIONS);
      if (endpoint !== void 0)
        return endpoint;
      var endpointMode = AWS2.util.loadConfig(ENDPOINT_MODE_CONFIG_OPTIONS);
      switch (endpointMode) {
        case EndpointMode.IPv4:
          return Endpoint.IPv4;
        case EndpointMode.IPv6:
          return Endpoint.IPv6;
        default:
          throw new Error("Unsupported endpoint mode: " + endpointMode);
      }
    };
    module2.exports = getMetadataServiceEndpoint;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/metadata_service.js
var require_metadata_service = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/metadata_service.js"(exports, module2) {
    var AWS2 = require_core();
    require_http();
    var inherit = AWS2.util.inherit;
    var getMetadataServiceEndpoint = require_get_metadata_service_endpoint();
    var URL2 = require("url").URL;
    AWS2.MetadataService = inherit({
      /**
       * @return [String] the endpoint of the instance metadata service
       */
      endpoint: getMetadataServiceEndpoint(),
      /**
       * @!ignore
       */
      /**
       * Default HTTP options. By default, the metadata service is set to not
       * timeout on long requests. This means that on non-EC2 machines, this
       * request will never return. If you are calling this operation from an
       * environment that may not always run on EC2, set a `timeout` value so
       * the SDK will abort the request after a given number of milliseconds.
       */
      httpOptions: { timeout: 0 },
      /**
       * when enabled, metadata service will not fetch token
       */
      disableFetchToken: false,
      /**
       * Creates a new MetadataService object with a given set of options.
       *
       * @option options host [String] the hostname of the instance metadata
       *   service
       * @option options httpOptions [map] a map of options to pass to the
       *   underlying HTTP request:
       *
       *   * **timeout** (Number) &mdash; a timeout value in milliseconds to wait
       *     before aborting the connection. Set to 0 for no timeout.
       * @option options maxRetries [Integer] the maximum number of retries to
       *   perform for timeout errors
       * @option options retryDelayOptions [map] A set of options to configure the
       *   retry delay on retryable errors. See AWS.Config for details.
       */
      constructor: function MetadataService(options) {
        if (options && options.host) {
          options.endpoint = "http://" + options.host;
          delete options.host;
        }
        AWS2.util.update(this, options);
      },
      /**
       * Sends a request to the instance metadata service for a given resource.
       *
       * @param path [String] the path of the resource to get
       *
       * @param options [map] an optional map used to make request
       *
       *   * **method** (String) &mdash; HTTP request method
       *
       *   * **headers** (map<String,String>) &mdash; a map of response header keys and their respective values
       *
       * @callback callback function(err, data)
       *   Called when a response is available from the service.
       *   @param err [Error, null] if an error occurred, this value will be set
       *   @param data [String, null] if the request was successful, the body of
       *     the response
       */
      request: function request(path, options, callback) {
        if (arguments.length === 2) {
          callback = options;
          options = {};
        }
        if (process.env[AWS2.util.imdsDisabledEnv]) {
          callback(new Error("EC2 Instance Metadata Service access disabled"));
          return;
        }
        path = path || "/";
        if (URL2) {
          new URL2(this.endpoint);
        }
        var httpRequest = new AWS2.HttpRequest(this.endpoint + path);
        httpRequest.method = options.method || "GET";
        if (options.headers) {
          httpRequest.headers = options.headers;
        }
        AWS2.util.handleRequestWithRetries(httpRequest, this, callback);
      },
      /**
      * @api private
      */
      loadCredentialsCallbacks: [],
      /**
       * Fetches metadata token used for getting credentials
       *
       * @api private
       * @callback callback function(err, token)
       *   Called when token is loaded from the resource
       */
      fetchMetadataToken: function fetchMetadataToken(callback) {
        var self = this;
        var tokenFetchPath = "/latest/api/token";
        self.request(
          tokenFetchPath,
          {
            "method": "PUT",
            "headers": {
              "x-aws-ec2-metadata-token-ttl-seconds": "21600"
            }
          },
          callback
        );
      },
      /**
       * Fetches credentials
       *
       * @api private
       * @callback cb function(err, creds)
       *   Called when credentials are loaded from the resource
       */
      fetchCredentials: function fetchCredentials(options, cb) {
        var self = this;
        var basePath = "/latest/meta-data/iam/security-credentials/";
        self.request(basePath, options, function(err, roleName) {
          if (err) {
            self.disableFetchToken = !(err.statusCode === 401);
            cb(AWS2.util.error(
              err,
              {
                message: "EC2 Metadata roleName request returned error"
              }
            ));
            return;
          }
          roleName = roleName.split("\n")[0];
          self.request(basePath + roleName, options, function(credErr, credData) {
            if (credErr) {
              self.disableFetchToken = !(credErr.statusCode === 401);
              cb(AWS2.util.error(
                credErr,
                {
                  message: "EC2 Metadata creds request returned error"
                }
              ));
              return;
            }
            try {
              var credentials = JSON.parse(credData);
              cb(null, credentials);
            } catch (parseError) {
              cb(parseError);
            }
          });
        });
      },
      /**
       * Loads a set of credentials stored in the instance metadata service
       *
       * @api private
       * @callback callback function(err, credentials)
       *   Called when credentials are loaded from the resource
       *   @param err [Error] if an error occurred, this value will be set
       *   @param credentials [Object] the raw JSON object containing all
       *     metadata from the credentials resource
       */
      loadCredentials: function loadCredentials(callback) {
        var self = this;
        self.loadCredentialsCallbacks.push(callback);
        if (self.loadCredentialsCallbacks.length > 1) {
          return;
        }
        function callbacks(err, creds) {
          var cb;
          while ((cb = self.loadCredentialsCallbacks.shift()) !== void 0) {
            cb(err, creds);
          }
        }
        if (self.disableFetchToken) {
          self.fetchCredentials({}, callbacks);
        } else {
          self.fetchMetadataToken(function(tokenError, token) {
            if (tokenError) {
              if (tokenError.code === "TimeoutError") {
                self.disableFetchToken = true;
              } else if (tokenError.retryable === true) {
                callbacks(AWS2.util.error(
                  tokenError,
                  {
                    message: "EC2 Metadata token request returned error"
                  }
                ));
                return;
              } else if (tokenError.statusCode === 400) {
                callbacks(AWS2.util.error(
                  tokenError,
                  {
                    message: "EC2 Metadata token request returned 400"
                  }
                ));
                return;
              }
            }
            var options = {};
            if (token) {
              options.headers = {
                "x-aws-ec2-metadata-token": token
              };
            }
            self.fetchCredentials(options, callbacks);
          });
        }
      }
    });
    module2.exports = AWS2.MetadataService;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/ec2_metadata_credentials.js
var require_ec2_metadata_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/ec2_metadata_credentials.js"() {
    var AWS2 = require_core();
    require_metadata_service();
    AWS2.EC2MetadataCredentials = AWS2.util.inherit(AWS2.Credentials, {
      constructor: function EC2MetadataCredentials(options) {
        AWS2.Credentials.call(this);
        options = options ? AWS2.util.copy(options) : {};
        options = AWS2.util.merge(
          { maxRetries: this.defaultMaxRetries },
          options
        );
        if (!options.httpOptions)
          options.httpOptions = {};
        options.httpOptions = AWS2.util.merge(
          {
            timeout: this.defaultTimeout,
            connectTimeout: this.defaultConnectTimeout
          },
          options.httpOptions
        );
        this.metadataService = new AWS2.MetadataService(options);
        this.logger = options.logger || AWS2.config && AWS2.config.logger;
      },
      /**
       * @api private
       */
      defaultTimeout: 1e3,
      /**
      * @api private
      */
      defaultConnectTimeout: 1e3,
      /**
       * @api private
       */
      defaultMaxRetries: 3,
      /**
       * The original expiration of the current credential. In case of AWS
       * outage, the EC2 metadata will extend expiration of the existing
       * credential.
       */
      originalExpiration: void 0,
      /**
       * Loads the credentials from the instance metadata service
       *
       * @callback callback function(err)
       *   Called when the instance metadata service responds (or fails). When
       *   this callback is called with no error, it means that the credentials
       *   information has been loaded into the object (as the `accessKeyId`,
       *   `secretAccessKey`, and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @see get
       */
      refresh: function refresh(callback) {
        this.coalesceRefresh(callback || AWS2.util.fn.callback);
      },
      /**
       * @api private
       * @param callback
       */
      load: function load(callback) {
        var self = this;
        self.metadataService.loadCredentials(function(err, creds) {
          if (err) {
            if (self.hasLoadedCredentials()) {
              self.extendExpirationIfExpired();
              callback();
            } else {
              callback(err);
            }
          } else {
            self.setCredentials(creds);
            self.extendExpirationIfExpired();
            callback();
          }
        });
      },
      /**
       * Whether this credential has been loaded.
       * @api private
       */
      hasLoadedCredentials: function hasLoadedCredentials() {
        return this.AccessKeyId && this.secretAccessKey;
      },
      /**
       * if expired, extend the expiration by 15 minutes base plus a jitter of 5
       * minutes range.
       * @api private
       */
      extendExpirationIfExpired: function extendExpirationIfExpired() {
        if (this.needsRefresh()) {
          this.originalExpiration = this.originalExpiration || this.expireTime;
          this.expired = false;
          var nextTimeout = 15 * 60 + Math.floor(Math.random() * 5 * 60);
          var currentTime = AWS2.util.date.getDate().getTime();
          this.expireTime = new Date(currentTime + nextTimeout * 1e3);
          this.logger.warn("Attempting credential expiration extension due to a credential service availability issue. A refresh of these credentials will be attempted again at " + this.expireTime + "\nFor more information, please visit: https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html");
        }
      },
      /**
       * Update the credential with new credential responded from EC2 metadata
       * service.
       * @api private
       */
      setCredentials: function setCredentials(creds) {
        var currentTime = AWS2.util.date.getDate().getTime();
        var expireTime = new Date(creds.Expiration);
        this.expired = currentTime >= expireTime ? true : false;
        this.metadata = creds;
        this.accessKeyId = creds.AccessKeyId;
        this.secretAccessKey = creds.SecretAccessKey;
        this.sessionToken = creds.Token;
        this.expireTime = expireTime;
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/remote_credentials.js
var require_remote_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/remote_credentials.js"() {
    var AWS2 = require_core();
    var ENV_RELATIVE_URI = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI";
    var ENV_FULL_URI = "AWS_CONTAINER_CREDENTIALS_FULL_URI";
    var ENV_AUTH_TOKEN = "AWS_CONTAINER_AUTHORIZATION_TOKEN";
    var FULL_URI_UNRESTRICTED_PROTOCOLS = ["https:"];
    var FULL_URI_ALLOWED_PROTOCOLS = ["http:", "https:"];
    var FULL_URI_ALLOWED_HOSTNAMES = ["localhost", "127.0.0.1"];
    var RELATIVE_URI_HOST = "169.254.170.2";
    AWS2.RemoteCredentials = AWS2.util.inherit(AWS2.Credentials, {
      constructor: function RemoteCredentials(options) {
        AWS2.Credentials.call(this);
        options = options ? AWS2.util.copy(options) : {};
        if (!options.httpOptions)
          options.httpOptions = {};
        options.httpOptions = AWS2.util.merge(
          this.httpOptions,
          options.httpOptions
        );
        AWS2.util.update(this, options);
      },
      /**
       * @api private
       */
      httpOptions: { timeout: 1e3 },
      /**
       * @api private
       */
      maxRetries: 3,
      /**
       * @api private
       */
      isConfiguredForEcsCredentials: function isConfiguredForEcsCredentials() {
        return Boolean(
          process && process.env && (process.env[ENV_RELATIVE_URI] || process.env[ENV_FULL_URI])
        );
      },
      /**
       * @api private
       */
      getECSFullUri: function getECSFullUri() {
        if (process && process.env) {
          var relative = process.env[ENV_RELATIVE_URI], full = process.env[ENV_FULL_URI];
          if (relative) {
            return "http://" + RELATIVE_URI_HOST + relative;
          } else if (full) {
            var parsed = AWS2.util.urlParse(full);
            if (FULL_URI_ALLOWED_PROTOCOLS.indexOf(parsed.protocol) < 0) {
              throw AWS2.util.error(
                new Error("Unsupported protocol:  AWS.RemoteCredentials supports " + FULL_URI_ALLOWED_PROTOCOLS.join(",") + " only; " + parsed.protocol + " requested."),
                { code: "ECSCredentialsProviderFailure" }
              );
            }
            if (FULL_URI_UNRESTRICTED_PROTOCOLS.indexOf(parsed.protocol) < 0 && FULL_URI_ALLOWED_HOSTNAMES.indexOf(parsed.hostname) < 0) {
              throw AWS2.util.error(
                new Error("Unsupported hostname: AWS.RemoteCredentials only supports " + FULL_URI_ALLOWED_HOSTNAMES.join(",") + " for " + parsed.protocol + "; " + parsed.protocol + "//" + parsed.hostname + " requested."),
                { code: "ECSCredentialsProviderFailure" }
              );
            }
            return full;
          } else {
            throw AWS2.util.error(
              new Error("Variable " + ENV_RELATIVE_URI + " or " + ENV_FULL_URI + " must be set to use AWS.RemoteCredentials."),
              { code: "ECSCredentialsProviderFailure" }
            );
          }
        } else {
          throw AWS2.util.error(
            new Error("No process info available"),
            { code: "ECSCredentialsProviderFailure" }
          );
        }
      },
      /**
       * @api private
       */
      getECSAuthToken: function getECSAuthToken() {
        if (process && process.env && process.env[ENV_FULL_URI]) {
          return process.env[ENV_AUTH_TOKEN];
        }
      },
      /**
       * @api private
       */
      credsFormatIsValid: function credsFormatIsValid(credData) {
        return !!credData.accessKeyId && !!credData.secretAccessKey && !!credData.sessionToken && !!credData.expireTime;
      },
      /**
       * @api private
       */
      formatCreds: function formatCreds(credData) {
        if (!!credData.credentials) {
          credData = credData.credentials;
        }
        return {
          expired: false,
          accessKeyId: credData.accessKeyId || credData.AccessKeyId,
          secretAccessKey: credData.secretAccessKey || credData.SecretAccessKey,
          sessionToken: credData.sessionToken || credData.Token,
          expireTime: new Date(credData.expiration || credData.Expiration)
        };
      },
      /**
       * @api private
       */
      request: function request(url, callback) {
        var httpRequest = new AWS2.HttpRequest(url);
        httpRequest.method = "GET";
        httpRequest.headers.Accept = "application/json";
        var token = this.getECSAuthToken();
        if (token) {
          httpRequest.headers.Authorization = token;
        }
        AWS2.util.handleRequestWithRetries(httpRequest, this, callback);
      },
      /**
       * Loads the credentials from the relative URI specified by container
       *
       * @callback callback function(err)
       *   Called when the request to the relative URI responds (or fails). When
       *   this callback is called with no error, it means that the credentials
       *   information has been loaded into the object (as the `accessKeyId`,
       *   `secretAccessKey`, `sessionToken`, and `expireTime` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @see get
       */
      refresh: function refresh(callback) {
        this.coalesceRefresh(callback || AWS2.util.fn.callback);
      },
      /**
       * @api private
       */
      load: function load(callback) {
        var self = this;
        var fullUri;
        try {
          fullUri = this.getECSFullUri();
        } catch (err) {
          callback(err);
          return;
        }
        this.request(fullUri, function(err, data) {
          if (!err) {
            try {
              data = JSON.parse(data);
              var creds = self.formatCreds(data);
              if (!self.credsFormatIsValid(creds)) {
                throw AWS2.util.error(
                  new Error("Response data is not in valid format"),
                  { code: "ECSCredentialsProviderFailure" }
                );
              }
              AWS2.util.update(self, creds);
            } catch (dataError) {
              err = dataError;
            }
          }
          callback(err, creds);
        });
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/ecs_credentials.js
var require_ecs_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/ecs_credentials.js"() {
    var AWS2 = require_core();
    AWS2.ECSCredentials = AWS2.RemoteCredentials;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/environment_credentials.js
var require_environment_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/environment_credentials.js"() {
    var AWS2 = require_core();
    AWS2.EnvironmentCredentials = AWS2.util.inherit(AWS2.Credentials, {
      /**
       * Creates a new EnvironmentCredentials class with a given variable
       * prefix {envPrefix}. For example, to load credentials using the 'AWS'
       * prefix:
       *
       * ```javascript
       * var creds = new AWS.EnvironmentCredentials('AWS');
       * creds.accessKeyId == 'AKID' // from AWS_ACCESS_KEY_ID env var
       * ```
       *
       * @param envPrefix [String] the prefix to use (e.g., 'AWS') for environment
       *   variables. Do not include the separating underscore.
       */
      constructor: function EnvironmentCredentials(envPrefix) {
        AWS2.Credentials.call(this);
        this.envPrefix = envPrefix;
        this.get(function() {
        });
      },
      /**
       * Loads credentials from the environment using the prefixed
       * environment variables.
       *
       * @callback callback function(err)
       *   Called after the (prefixed) ACCESS_KEY_ID, SECRET_ACCESS_KEY, and
       *   SESSION_TOKEN environment variables are read. When this callback is
       *   called with no error, it means that the credentials information has
       *   been loaded into the object (as the `accessKeyId`, `secretAccessKey`,
       *   and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @see get
       */
      refresh: function refresh(callback) {
        if (!callback)
          callback = AWS2.util.fn.callback;
        if (!process || !process.env) {
          callback(AWS2.util.error(
            new Error("No process info or environment variables available"),
            { code: "EnvironmentCredentialsProviderFailure" }
          ));
          return;
        }
        var keys = ["ACCESS_KEY_ID", "SECRET_ACCESS_KEY", "SESSION_TOKEN"];
        var values = [];
        for (var i = 0; i < keys.length; i++) {
          var prefix = "";
          if (this.envPrefix)
            prefix = this.envPrefix + "_";
          values[i] = process.env[prefix + keys[i]];
          if (!values[i] && keys[i] !== "SESSION_TOKEN") {
            callback(AWS2.util.error(
              new Error("Variable " + prefix + keys[i] + " not set."),
              { code: "EnvironmentCredentialsProviderFailure" }
            ));
            return;
          }
        }
        this.expired = false;
        AWS2.Credentials.apply(this, values);
        callback();
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/file_system_credentials.js
var require_file_system_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/file_system_credentials.js"() {
    var AWS2 = require_core();
    AWS2.FileSystemCredentials = AWS2.util.inherit(AWS2.Credentials, {
      /**
       * @overload AWS.FileSystemCredentials(filename)
       *   Creates a new FileSystemCredentials object from a filename
       *
       *   @param filename [String] the path on disk to the JSON file to load.
       */
      constructor: function FileSystemCredentials(filename) {
        AWS2.Credentials.call(this);
        this.filename = filename;
        this.get(function() {
        });
      },
      /**
       * Loads the credentials from the {filename} on disk.
       *
       * @callback callback function(err)
       *   Called after the JSON file on disk is read and parsed. When this callback
       *   is called with no error, it means that the credentials information
       *   has been loaded into the object (as the `accessKeyId`, `secretAccessKey`,
       *   and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @see get
       */
      refresh: function refresh(callback) {
        if (!callback)
          callback = AWS2.util.fn.callback;
        try {
          var creds = JSON.parse(AWS2.util.readFileSync(this.filename));
          AWS2.Credentials.call(this, creds);
          if (!this.accessKeyId || !this.secretAccessKey) {
            throw AWS2.util.error(
              new Error("Credentials not set in " + this.filename),
              { code: "FileSystemCredentialsProviderFailure" }
            );
          }
          this.expired = false;
          callback();
        } catch (err) {
          callback(err);
        }
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/shared_ini_file_credentials.js
var require_shared_ini_file_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/shared_ini_file_credentials.js"() {
    var AWS2 = require_core();
    var STS = require_sts2();
    var iniLoader = AWS2.util.iniLoader;
    var ASSUME_ROLE_DEFAULT_REGION = "us-east-1";
    AWS2.SharedIniFileCredentials = AWS2.util.inherit(AWS2.Credentials, {
      /**
       * Creates a new SharedIniFileCredentials object.
       *
       * @param options [map] a set of options
       * @option options profile [String] (AWS_PROFILE env var or 'default')
       *   the name of the profile to load.
       * @option options filename [String] ('~/.aws/credentials' or defined by
       *   AWS_SHARED_CREDENTIALS_FILE process env var)
       *   the filename to use when loading credentials.
       * @option options disableAssumeRole [Boolean] (false) True to disable
       *   support for profiles that assume an IAM role. If true, and an assume
       *   role profile is selected, an error is raised.
       * @option options preferStaticCredentials [Boolean] (false) True to
       *   prefer static credentials to role_arn if both are present.
       * @option options tokenCodeFn [Function] (null) Function to provide
       *   STS Assume Role TokenCode, if mfa_serial is provided for profile in ini
       *   file. Function is called with value of mfa_serial and callback, and
       *   should provide the TokenCode or an error to the callback in the format
       *   callback(err, token)
       * @option options callback [Function] (err) Credentials are eagerly loaded
       *   by the constructor. When the callback is called with no error, the
       *   credentials have been loaded successfully.
       * @option options httpOptions [map] A set of options to pass to the low-level
       *   HTTP request. Currently supported options are:
       *   * **proxy** [String] &mdash; the URL to proxy requests through
       *   * **agent** [http.Agent, https.Agent] &mdash; the Agent object to perform
       *     HTTP requests with. Used for connection pooling. Defaults to the global
       *     agent (`http.globalAgent`) for non-SSL connections. Note that for
       *     SSL connections, a special Agent object is used in order to enable
       *     peer certificate verification. This feature is only available in the
       *     Node.js environment.
       *   * **connectTimeout** [Integer] &mdash; Sets the socket to timeout after
       *     failing to establish a connection with the server after
       *     `connectTimeout` milliseconds. This timeout has no effect once a socket
       *     connection has been established.
       *   * **timeout** [Integer] &mdash; The number of milliseconds a request can
       *     take before automatically being terminated.
       *     Defaults to two minutes (120000).
       */
      constructor: function SharedIniFileCredentials(options) {
        AWS2.Credentials.call(this);
        options = options || {};
        this.filename = options.filename;
        this.profile = options.profile || process.env.AWS_PROFILE || AWS2.util.defaultProfile;
        this.disableAssumeRole = Boolean(options.disableAssumeRole);
        this.preferStaticCredentials = Boolean(options.preferStaticCredentials);
        this.tokenCodeFn = options.tokenCodeFn || null;
        this.httpOptions = options.httpOptions || null;
        this.get(options.callback || AWS2.util.fn.noop);
      },
      /**
       * @api private
       */
      load: function load(callback) {
        var self = this;
        try {
          var profiles = AWS2.util.getProfilesFromSharedConfig(iniLoader, this.filename);
          var profile = profiles[this.profile] || {};
          if (Object.keys(profile).length === 0) {
            throw AWS2.util.error(
              new Error("Profile " + this.profile + " not found"),
              { code: "SharedIniFileCredentialsProviderFailure" }
            );
          }
          var preferStaticCredentialsToRoleArn = Boolean(
            this.preferStaticCredentials && profile["aws_access_key_id"] && profile["aws_secret_access_key"]
          );
          if (profile["role_arn"] && !preferStaticCredentialsToRoleArn) {
            this.loadRoleProfile(profiles, profile, function(err, data) {
              if (err) {
                callback(err);
              } else {
                self.expired = false;
                self.accessKeyId = data.Credentials.AccessKeyId;
                self.secretAccessKey = data.Credentials.SecretAccessKey;
                self.sessionToken = data.Credentials.SessionToken;
                self.expireTime = data.Credentials.Expiration;
                callback(null);
              }
            });
            return;
          }
          this.accessKeyId = profile["aws_access_key_id"];
          this.secretAccessKey = profile["aws_secret_access_key"];
          this.sessionToken = profile["aws_session_token"];
          if (!this.accessKeyId || !this.secretAccessKey) {
            throw AWS2.util.error(
              new Error("Credentials not set for profile " + this.profile),
              { code: "SharedIniFileCredentialsProviderFailure" }
            );
          }
          this.expired = false;
          callback(null);
        } catch (err) {
          callback(err);
        }
      },
      /**
       * Loads the credentials from the shared credentials file
       *
       * @callback callback function(err)
       *   Called after the shared INI file on disk is read and parsed. When this
       *   callback is called with no error, it means that the credentials
       *   information has been loaded into the object (as the `accessKeyId`,
       *   `secretAccessKey`, and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @see get
       */
      refresh: function refresh(callback) {
        iniLoader.clearCachedFiles();
        this.coalesceRefresh(
          callback || AWS2.util.fn.callback,
          this.disableAssumeRole
        );
      },
      /**
       * @api private
       */
      loadRoleProfile: function loadRoleProfile(creds, roleProfile, callback) {
        if (this.disableAssumeRole) {
          throw AWS2.util.error(
            new Error("Role assumption profiles are disabled. Failed to load profile " + this.profile + " from " + creds.filename),
            { code: "SharedIniFileCredentialsProviderFailure" }
          );
        }
        var self = this;
        var roleArn = roleProfile["role_arn"];
        var roleSessionName = roleProfile["role_session_name"];
        var externalId = roleProfile["external_id"];
        var mfaSerial = roleProfile["mfa_serial"];
        var sourceProfileName = roleProfile["source_profile"];
        var profileRegion = roleProfile["region"] || ASSUME_ROLE_DEFAULT_REGION;
        if (!sourceProfileName) {
          throw AWS2.util.error(
            new Error("source_profile is not set using profile " + this.profile),
            { code: "SharedIniFileCredentialsProviderFailure" }
          );
        }
        var sourceProfileExistanceTest = creds[sourceProfileName];
        if (typeof sourceProfileExistanceTest !== "object") {
          throw AWS2.util.error(
            new Error("source_profile " + sourceProfileName + " using profile " + this.profile + " does not exist"),
            { code: "SharedIniFileCredentialsProviderFailure" }
          );
        }
        var sourceCredentials = new AWS2.SharedIniFileCredentials(
          AWS2.util.merge(this.options || {}, {
            profile: sourceProfileName,
            preferStaticCredentials: true
          })
        );
        this.roleArn = roleArn;
        var sts = new STS({
          credentials: sourceCredentials,
          region: profileRegion,
          httpOptions: this.httpOptions
        });
        var roleParams = {
          RoleArn: roleArn,
          RoleSessionName: roleSessionName || "aws-sdk-js-" + Date.now()
        };
        if (externalId) {
          roleParams.ExternalId = externalId;
        }
        if (mfaSerial && self.tokenCodeFn) {
          roleParams.SerialNumber = mfaSerial;
          self.tokenCodeFn(mfaSerial, function(err, token) {
            if (err) {
              var message;
              if (err instanceof Error) {
                message = err.message;
              } else {
                message = err;
              }
              callback(
                AWS2.util.error(
                  new Error("Error fetching MFA token: " + message),
                  { code: "SharedIniFileCredentialsProviderFailure" }
                )
              );
              return;
            }
            roleParams.TokenCode = token;
            sts.assumeRole(roleParams, callback);
          });
          return;
        }
        sts.assumeRole(roleParams, callback);
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/sso_credentials.js
var require_sso_credentials = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/credentials/sso_credentials.js"() {
    var AWS2 = require_core();
    var path = require("path");
    var crypto = require("crypto");
    var iniLoader = AWS2.util.iniLoader;
    AWS2.SsoCredentials = AWS2.util.inherit(AWS2.Credentials, {
      /**
       * Creates a new SsoCredentials object.
       *
       * @param options [map] a set of options
       * @option options profile [String] (AWS_PROFILE env var or 'default')
       *   the name of the profile to load.
       * @option options filename [String] ('~/.aws/credentials' or defined by
       *   AWS_SHARED_CREDENTIALS_FILE process env var)
       *   the filename to use when loading credentials.
       * @option options callback [Function] (err) Credentials are eagerly loaded
       *   by the constructor. When the callback is called with no error, the
       *   credentials have been loaded successfully.
       */
      constructor: function SsoCredentials(options) {
        AWS2.Credentials.call(this);
        options = options || {};
        this.errorCode = "SsoCredentialsProviderFailure";
        this.expired = true;
        this.filename = options.filename;
        this.profile = options.profile || process.env.AWS_PROFILE || AWS2.util.defaultProfile;
        this.service = options.ssoClient;
        this.httpOptions = options.httpOptions || null;
        this.get(options.callback || AWS2.util.fn.noop);
      },
      /**
       * @api private
       */
      load: function load(callback) {
        var self = this;
        try {
          var profiles = AWS2.util.getProfilesFromSharedConfig(iniLoader, this.filename);
          var profile = profiles[this.profile] || {};
          if (Object.keys(profile).length === 0) {
            throw AWS2.util.error(
              new Error("Profile " + this.profile + " not found"),
              { code: self.errorCode }
            );
          }
          if (profile.sso_session) {
            if (!profile.sso_account_id || !profile.sso_role_name) {
              throw AWS2.util.error(
                new Error("Profile " + this.profile + " with session " + profile.sso_session + ' does not have valid SSO credentials. Required parameters "sso_account_id", "sso_session", "sso_role_name". Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html'),
                { code: self.errorCode }
              );
            }
          } else {
            if (!profile.sso_start_url || !profile.sso_account_id || !profile.sso_region || !profile.sso_role_name) {
              throw AWS2.util.error(
                new Error("Profile " + this.profile + ' does not have valid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html'),
                { code: self.errorCode }
              );
            }
          }
          this.getToken(this.profile, profile, function(err, token) {
            if (err) {
              return callback(err);
            }
            var request = {
              accessToken: token,
              accountId: profile.sso_account_id,
              roleName: profile.sso_role_name
            };
            if (!self.service || self.service.config.region !== profile.sso_region) {
              self.service = new AWS2.SSO({
                region: profile.sso_region,
                httpOptions: self.httpOptions
              });
            }
            self.service.getRoleCredentials(request, function(err2, data) {
              if (err2 || !data || !data.roleCredentials) {
                callback(AWS2.util.error(
                  err2 || new Error('Please log in using "aws sso login"'),
                  { code: self.errorCode }
                ), null);
              } else if (!data.roleCredentials.accessKeyId || !data.roleCredentials.secretAccessKey || !data.roleCredentials.sessionToken || !data.roleCredentials.expiration) {
                throw AWS2.util.error(new Error(
                  "SSO returns an invalid temporary credential."
                ));
              } else {
                self.expired = false;
                self.accessKeyId = data.roleCredentials.accessKeyId;
                self.secretAccessKey = data.roleCredentials.secretAccessKey;
                self.sessionToken = data.roleCredentials.sessionToken;
                self.expireTime = new Date(data.roleCredentials.expiration);
                callback(null);
              }
            });
          });
        } catch (err) {
          callback(err);
        }
      },
      /**
       * @private
       * Uses legacy file system retrieval or if sso-session is set,
       * use the SSOTokenProvider.
       *
       * @param {string} profileName - name of the profile.
       * @param {object} profile - profile data containing sso_session or sso_start_url etc.
       * @param {function} callback - called with (err, (string) token).
       *
       * @returns {void}
       */
      getToken: function getToken(profileName2, profile, callback) {
        var self = this;
        if (profile.sso_session) {
          var _iniLoader = AWS2.util.iniLoader;
          var ssoSessions = _iniLoader.loadSsoSessionsFrom();
          var ssoSession = ssoSessions[profile.sso_session];
          Object.assign(profile, ssoSession);
          var ssoTokenProvider = new AWS2.SSOTokenProvider({
            profile: profileName2
          });
          ssoTokenProvider.load(function(err) {
            if (err) {
              return callback(err);
            }
            return callback(null, ssoTokenProvider.token);
          });
          return;
        }
        try {
          var EXPIRE_WINDOW_MS = 15 * 60 * 1e3;
          var hasher = crypto.createHash("sha1");
          var fileName = hasher.update(profile.sso_start_url).digest("hex") + ".json";
          var cachePath = path.join(
            iniLoader.getHomeDir(),
            ".aws",
            "sso",
            "cache",
            fileName
          );
          var cacheFile = AWS2.util.readFileSync(cachePath);
          var cacheContent = null;
          if (cacheFile) {
            cacheContent = JSON.parse(cacheFile);
          }
          if (!cacheContent) {
            throw AWS2.util.error(
              new Error("Cached credentials not found under " + this.profile + " profile. Please make sure you log in with aws sso login first"),
              { code: self.errorCode }
            );
          }
          if (!cacheContent.startUrl || !cacheContent.region || !cacheContent.accessToken || !cacheContent.expiresAt) {
            throw AWS2.util.error(
              new Error("Cached credentials are missing required properties. Try running aws sso login.")
            );
          }
          if (new Date(cacheContent.expiresAt).getTime() - Date.now() <= EXPIRE_WINDOW_MS) {
            throw AWS2.util.error(new Error(
              "The SSO session associated with this profile has expired. To refresh this SSO session run aws sso login with the corresponding profile."
            ));
          }
          return callback(null, cacheContent.accessToken);
        } catch (err) {
          return callback(err, null);
        }
      },
      /**
       * Loads the credentials from the AWS SSO process
       *
       * @callback callback function(err)
       *   Called after the AWS SSO process has been executed. When this
       *   callback is called with no error, it means that the credentials
       *   information has been loaded into the object (as the `accessKeyId`,
       *   `secretAccessKey`, and `sessionToken` properties).
       *   @param err [Error] if an error occurred, this value will be filled
       * @see get
       */
      refresh: function refresh(callback) {
        iniLoader.clearCachedFiles();
        this.coalesceRefresh(callback || AWS2.util.fn.callback);
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/token.js
var require_token = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/token.js"() {
    var AWS2 = require_core();
    AWS2.Token = AWS2.util.inherit({
      /**
       * Creates a Token object with a given set of information in options hash.
       * @option options token [String] represents the literal token string.
       * @option options expireTime [Date] field representing the time at which
       *   the token expires.
       * @example Create a token object
       *   var token = new AWS.Token({ token: 'token' });
       */
      constructor: function Token(options) {
        AWS2.util.hideProperties(this, ["token"]);
        this.expired = false;
        this.expireTime = null;
        this.refreshCallbacks = [];
        if (arguments.length === 1) {
          var options = arguments[0];
          this.token = options.token;
          this.expireTime = options.expireTime;
        }
      },
      /**
       * @return [Integer] the number of seconds before {expireTime} during which
       *   the token will be considered expired.
       */
      expiryWindow: 15,
      /**
       * @return [Boolean] whether the Token object should call {refresh}
       * @note Subclasses should override this method to provide custom refresh
       *   logic.
       */
      needsRefresh: function needsRefresh() {
        var currentTime = AWS2.util.date.getDate().getTime();
        var adjustedTime = new Date(currentTime + this.expiryWindow * 1e3);
        if (this.expireTime && adjustedTime > this.expireTime)
          return true;
        return this.expired || !this.token;
      },
      /**
       * Gets the existing token, refreshing them if they are not yet loaded
       * or have expired. Users should call this method before using {refresh},
       * as this will not attempt to reload token when they are already
       * loaded into the object.
       *
       * @callback callback function(err)
       *   When this callback is called with no error, it means either token
       *   do not need to be refreshed or refreshed token information has
       *   been loaded into the object (as the `token` property).
       *   @param err [Error] if an error occurred, this value will be filled
       */
      get: function get(callback) {
        var self = this;
        if (this.needsRefresh()) {
          this.refresh(function(err) {
            if (!err)
              self.expired = false;
            if (callback)
              callback(err);
          });
        } else if (callback) {
          callback();
        }
      },
      /**
       * @!method  getPromise()
       *   Returns a 'thenable' promise.
       *   Gets the existing token, refreshing it if it's not yet loaded
       *   or have expired. Users should call this method before using {refresh},
       *   as this will not attempt to reload token when it's already
       *   loaded into the object.
       *
       *   Two callbacks can be provided to the `then` method on the returned promise.
       *   The first callback will be called if the promise is fulfilled, and the second
       *   callback will be called if the promise is rejected.
       *   @callback fulfilledCallback function()
       *     Called if the promise is fulfilled. When this callback is called, it means
       *     either token does not need to be refreshed or refreshed token information
       *     has been loaded into the object (as the `token` property).
       *   @callback rejectedCallback function(err)
       *     Called if the promise is rejected.
       *     @param err [Error] if an error occurred, this value will be filled.
       *   @return [Promise] A promise that represents the state of the `get` call.
       *   @example Calling the `getPromise` method.
       *     var promise = tokenProvider.getPromise();
       *     promise.then(function() { ... }, function(err) { ... });
       */
      /**
       * @!method  refreshPromise()
       *   Returns a 'thenable' promise.
       *   Refreshes the token. Users should call {get} before attempting
       *   to forcibly refresh token.
       *
       *   Two callbacks can be provided to the `then` method on the returned promise.
       *   The first callback will be called if the promise is fulfilled, and the second
       *   callback will be called if the promise is rejected.
       *   @callback fulfilledCallback function()
       *     Called if the promise is fulfilled. When this callback is called, it
       *     means refreshed token information has been loaded into the object
       *     (as the `token` property).
       *   @callback rejectedCallback function(err)
       *     Called if the promise is rejected.
       *     @param err [Error] if an error occurred, this value will be filled.
       *   @return [Promise] A promise that represents the state of the `refresh` call.
       *   @example Calling the `refreshPromise` method.
       *     var promise = tokenProvider.refreshPromise();
       *     promise.then(function() { ... }, function(err) { ... });
       */
      /**
       * Refreshes the token. Users should call {get} before attempting
       * to forcibly refresh token.
       *
       * @callback callback function(err)
       *   When this callback is called with no error, it means refreshed
       *   token information has been loaded into the object (as the
       *   `token` property).
       *   @param err [Error] if an error occurred, this value will be filled
       * @note Subclasses should override this class to reset the
       *   {token} on the token object and then call the callback with
       *   any error information.
       * @see get
       */
      refresh: function refresh(callback) {
        this.expired = false;
        callback();
      },
      /**
       * @api private
       * @param callback
       */
      coalesceRefresh: function coalesceRefresh(callback, sync) {
        var self = this;
        if (self.refreshCallbacks.push(callback) === 1) {
          self.load(function onLoad(err) {
            AWS2.util.arrayEach(self.refreshCallbacks, function(callback2) {
              if (sync) {
                callback2(err);
              } else {
                AWS2.util.defer(function() {
                  callback2(err);
                });
              }
            });
            self.refreshCallbacks.length = 0;
          });
        }
      },
      /**
       * @api private
       * @param callback
       */
      load: function load(callback) {
        callback();
      }
    });
    AWS2.Token.addPromisesToClass = function addPromisesToClass(PromiseDependency) {
      this.prototype.getPromise = AWS2.util.promisifyMethod("get", PromiseDependency);
      this.prototype.refreshPromise = AWS2.util.promisifyMethod("refresh", PromiseDependency);
    };
    AWS2.Token.deletePromisesFromClass = function deletePromisesFromClass() {
      delete this.prototype.getPromise;
      delete this.prototype.refreshPromise;
    };
    AWS2.util.addPromises(AWS2.Token);
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/token/token_provider_chain.js
var require_token_provider_chain = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/token/token_provider_chain.js"() {
    var AWS2 = require_core();
    AWS2.TokenProviderChain = AWS2.util.inherit(AWS2.Token, {
      /**
       * Creates a new TokenProviderChain with a default set of providers
       * specified by {defaultProviders}.
       */
      constructor: function TokenProviderChain(providers) {
        if (providers) {
          this.providers = providers;
        } else {
          this.providers = AWS2.TokenProviderChain.defaultProviders.slice(0);
        }
        this.resolveCallbacks = [];
      },
      /**
       * @!method  resolvePromise()
       *   Returns a 'thenable' promise.
       *   Resolves the provider chain by searching for the first token in {providers}.
       *
       *   Two callbacks can be provided to the `then` method on the returned promise.
       *   The first callback will be called if the promise is fulfilled, and the second
       *   callback will be called if the promise is rejected.
       *   @callback fulfilledCallback function(token)
       *     Called if the promise is fulfilled and the provider resolves the chain
       *     to a token object
       *     @param token [AWS.Token] the token object resolved by the provider chain.
       *   @callback rejectedCallback function(error)
       *     Called if the promise is rejected.
       *     @param err [Error] the error object returned if no token is found.
       *   @return [Promise] A promise that represents the state of the `resolve` method call.
       *   @example Calling the `resolvePromise` method.
       *     var promise = chain.resolvePromise();
       *     promise.then(function(token) { ... }, function(err) { ... });
       */
      /**
       * Resolves the provider chain by searching for the first token in {providers}.
       *
       * @callback callback function(err, token)
       *   Called when the provider resolves the chain to a token object
       *   or null if no token can be found.
       *
       *   @param err [Error] the error object returned if no token is found.
       *   @param token [AWS.Token] the token object resolved by the provider chain.
       * @return [AWS.TokenProviderChain] the provider, for chaining.
       */
      resolve: function resolve(callback) {
        var self = this;
        if (self.providers.length === 0) {
          callback(new Error("No providers"));
          return self;
        }
        if (self.resolveCallbacks.push(callback) === 1) {
          let resolveNext2 = function(err, token) {
            if (!err && token || index === providers.length) {
              AWS2.util.arrayEach(self.resolveCallbacks, function(callback2) {
                callback2(err, token);
              });
              self.resolveCallbacks.length = 0;
              return;
            }
            var provider = providers[index++];
            if (typeof provider === "function") {
              token = provider.call();
            } else {
              token = provider;
            }
            if (token.get) {
              token.get(function(getErr) {
                resolveNext2(getErr, getErr ? null : token);
              });
            } else {
              resolveNext2(null, token);
            }
          };
          var resolveNext = resolveNext2;
          var index = 0;
          var providers = self.providers.slice(0);
          resolveNext2();
        }
        return self;
      }
    });
    AWS2.TokenProviderChain.defaultProviders = [];
    AWS2.TokenProviderChain.addPromisesToClass = function addPromisesToClass(PromiseDependency) {
      this.prototype.resolvePromise = AWS2.util.promisifyMethod("resolve", PromiseDependency);
    };
    AWS2.TokenProviderChain.deletePromisesFromClass = function deletePromisesFromClass() {
      delete this.prototype.resolvePromise;
    };
    AWS2.util.addPromises(AWS2.TokenProviderChain);
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/token/sso_token_provider.js
var require_sso_token_provider = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/token/sso_token_provider.js"() {
    var AWS2 = require_core();
    var crypto = require("crypto");
    var fs = require("fs");
    var path = require("path");
    var iniLoader = AWS2.util.iniLoader;
    var lastRefreshAttemptTime = 0;
    var validateTokenKey = function validateTokenKey2(token, key) {
      if (!token[key]) {
        throw AWS2.util.error(
          new Error('Key "' + key + '" not present in SSO Token'),
          { code: "SSOTokenProviderFailure" }
        );
      }
    };
    var refreshUnsuccessful = function refreshUnsuccessful2(currentTime, tokenExpireTime, callback) {
      if (tokenExpireTime > currentTime) {
        callback(null);
      } else {
        throw AWS2.util.error(
          new Error('SSO Token refresh failed. Please log in using "aws sso login"'),
          { code: "SSOTokenProviderFailure" }
        );
      }
    };
    AWS2.SSOTokenProvider = AWS2.util.inherit(AWS2.Token, {
      /**
       * Expiry window of five minutes.
       */
      expiryWindow: 5 * 60,
      /**
       * Creates a new token object from cached access token.
       *
       * @param options [map] a set of options
       * @option options profile [String] (AWS_PROFILE env var or 'default')
       *   the name of the profile to load.
       * @option options callback [Function] (err) Token is eagerly loaded
       *   by the constructor. When the callback is called with no error, the
       *   token has been loaded successfully.
       */
      constructor: function SSOTokenProvider(options) {
        AWS2.Token.call(this);
        options = options || {};
        this.expired = true;
        this.profile = options.profile || process.env.AWS_PROFILE || AWS2.util.defaultProfile;
        this.get(options.callback || AWS2.util.fn.noop);
      },
      /**
       * Reads sso_start_url from provided profile, and reads token from
       * ~/.aws/sso/cache/<sha1-of-utf8-encoded-value-from-sso_start_url>.json
       *
       * Throws an error if required fields token and expiresAt are missing.
       * Throws an error if token has expired and metadata to perform refresh is
       * not available.
       * Attempts to refresh the token if it's within 5 minutes before expiry time.
       *
       * @api private
       */
      load: function load(callback) {
        var self = this;
        var profiles = iniLoader.loadFrom({ isConfig: true });
        var profile = profiles[this.profile] || {};
        if (Object.keys(profile).length === 0) {
          throw AWS2.util.error(
            new Error('Profile "' + this.profile + '" not found'),
            { code: "SSOTokenProviderFailure" }
          );
        } else if (!profile["sso_session"]) {
          throw AWS2.util.error(
            new Error('Profile "' + profileName + '" is missing required property "sso_session".'),
            { code: "SSOTokenProviderFailure" }
          );
        }
        var ssoSessionName = profile["sso_session"];
        var ssoSessions = iniLoader.loadSsoSessionsFrom();
        var ssoSession = ssoSessions[ssoSessionName];
        if (!ssoSession) {
          throw AWS2.util.error(
            new Error('Sso session "' + ssoSessionName + '" not found'),
            { code: "SSOTokenProviderFailure" }
          );
        } else if (!ssoSession["sso_start_url"]) {
          throw AWS2.util.error(
            new Error('Sso session "' + profileName + '" is missing required property "sso_start_url".'),
            { code: "SSOTokenProviderFailure" }
          );
        } else if (!ssoSession["sso_region"]) {
          throw AWS2.util.error(
            new Error('Sso session "' + profileName + '" is missing required property "sso_region".'),
            { code: "SSOTokenProviderFailure" }
          );
        }
        var hasher = crypto.createHash("sha1");
        var fileName = hasher.update(ssoSessionName).digest("hex") + ".json";
        var cachePath = path.join(iniLoader.getHomeDir(), ".aws", "sso", "cache", fileName);
        var tokenFromCache = JSON.parse(fs.readFileSync(cachePath));
        if (!tokenFromCache) {
          throw AWS2.util.error(
            new Error('Cached token not found. Please log in using "aws sso login" for profile "' + this.profile + '".'),
            { code: "SSOTokenProviderFailure" }
          );
        }
        validateTokenKey(tokenFromCache, "accessToken");
        validateTokenKey(tokenFromCache, "expiresAt");
        var currentTime = AWS2.util.date.getDate().getTime();
        var adjustedTime = new Date(currentTime + this.expiryWindow * 1e3);
        var tokenExpireTime = new Date(tokenFromCache["expiresAt"]);
        if (tokenExpireTime > adjustedTime) {
          self.token = tokenFromCache.accessToken;
          self.expireTime = tokenExpireTime;
          self.expired = false;
          callback(null);
          return;
        }
        if (currentTime - lastRefreshAttemptTime < 30 * 1e3) {
          refreshUnsuccessful(currentTime, tokenExpireTime, callback);
          return;
        }
        validateTokenKey(tokenFromCache, "clientId");
        validateTokenKey(tokenFromCache, "clientSecret");
        validateTokenKey(tokenFromCache, "refreshToken");
        if (!self.service || self.service.config.region !== ssoSession.sso_region) {
          self.service = new AWS2.SSOOIDC({ region: ssoSession.sso_region });
        }
        var params = {
          clientId: tokenFromCache.clientId,
          clientSecret: tokenFromCache.clientSecret,
          refreshToken: tokenFromCache.refreshToken,
          grantType: "refresh_token"
        };
        lastRefreshAttemptTime = AWS2.util.date.getDate().getTime();
        self.service.createToken(params, function(err, data) {
          if (err || !data) {
            refreshUnsuccessful(currentTime, tokenExpireTime, callback);
          } else {
            try {
              validateTokenKey(data, "accessToken");
              validateTokenKey(data, "expiresIn");
              self.expired = false;
              self.token = data.accessToken;
              self.expireTime = new Date(Date.now() + data.expiresIn * 1e3);
              callback(null);
              try {
                tokenFromCache.accessToken = data.accessToken;
                tokenFromCache.expiresAt = self.expireTime.toISOString();
                tokenFromCache.refreshToken = data.refreshToken;
                fs.writeFileSync(cachePath, JSON.stringify(tokenFromCache, null, 2));
              } catch (error) {
              }
            } catch (error) {
              refreshUnsuccessful(currentTime, tokenExpireTime, callback);
            }
          }
        });
      },
      /**
       * Loads the cached access token from disk.
       *
       * @callback callback function(err)
       *   Called after the AWS SSO process has been executed. When this
       *   callback is called with no error, it means that the token information
       *   has been loaded into the object (as the `token` property).
       *   @param err [Error] if an error occurred, this value will be filled.
       * @see get
       */
      refresh: function refresh(callback) {
        iniLoader.clearCachedFiles();
        this.coalesceRefresh(callback || AWS2.util.fn.callback);
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/node_loader.js
var require_node_loader = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/node_loader.js"(exports, module2) {
    var util2 = require_util();
    var region_utils = require_utils();
    var isFipsRegion = region_utils.isFipsRegion;
    var getRealRegion = region_utils.getRealRegion;
    util2.isBrowser = function() {
      return false;
    };
    util2.isNode = function() {
      return true;
    };
    util2.crypto.lib = require("crypto");
    util2.Buffer = require("buffer").Buffer;
    util2.domain = require("domain");
    util2.stream = require("stream");
    util2.url = require("url");
    util2.querystring = require("querystring");
    util2.environment = "nodejs";
    util2.createEventStream = util2.stream.Readable ? require_streaming_create_event_stream().createEventStream : require_buffered_create_event_stream().createEventStream;
    util2.realClock = require_nodeClock();
    util2.clientSideMonitoring = {
      Publisher: require_publisher().Publisher,
      configProvider: require_configuration()
    };
    util2.iniLoader = require_shared_ini().iniLoader;
    util2.getSystemErrorName = require("util").getSystemErrorName;
    util2.loadConfig = function(options) {
      var envValue = options.environmentVariableSelector(process.env);
      if (envValue !== void 0) {
        return envValue;
      }
      var configFile = {};
      try {
        configFile = util2.iniLoader ? util2.iniLoader.loadFrom({
          isConfig: true,
          filename: process.env[util2.sharedConfigFileEnv]
        }) : {};
      } catch (e) {
      }
      var sharedFileConfig = configFile[process.env.AWS_PROFILE || util2.defaultProfile] || {};
      var configValue = options.configFileSelector(sharedFileConfig);
      if (configValue !== void 0) {
        return configValue;
      }
      if (typeof options.default === "function") {
        return options.default();
      }
      return options.default;
    };
    var AWS2;
    module2.exports = AWS2 = require_core();
    require_credentials();
    require_credential_provider_chain();
    require_temporary_credentials();
    require_chainable_temporary_credentials();
    require_web_identity_credentials();
    require_cognito_identity_credentials();
    require_saml_credentials();
    require_process_credentials();
    AWS2.XML.Parser = require_node_parser();
    require_node();
    require_ini_loader();
    require_token_file_web_identity_credentials();
    require_ec2_metadata_credentials();
    require_remote_credentials();
    require_ecs_credentials();
    require_environment_credentials();
    require_file_system_credentials();
    require_shared_ini_file_credentials();
    require_process_credentials();
    require_sso_credentials();
    AWS2.CredentialProviderChain.defaultProviders = [
      function() {
        return new AWS2.EnvironmentCredentials("AWS");
      },
      function() {
        return new AWS2.EnvironmentCredentials("AMAZON");
      },
      function() {
        return new AWS2.SsoCredentials();
      },
      function() {
        return new AWS2.SharedIniFileCredentials();
      },
      function() {
        return new AWS2.ECSCredentials();
      },
      function() {
        return new AWS2.ProcessCredentials();
      },
      function() {
        return new AWS2.TokenFileWebIdentityCredentials();
      },
      function() {
        return new AWS2.EC2MetadataCredentials();
      }
    ];
    require_token();
    require_token_provider_chain();
    require_sso_token_provider();
    AWS2.TokenProviderChain.defaultProviders = [
      function() {
        return new AWS2.SSOTokenProvider();
      }
    ];
    var getRegion = function() {
      var env = process.env;
      var region = env.AWS_REGION || env.AMAZON_REGION;
      if (env[AWS2.util.configOptInEnv]) {
        var toCheck = [
          { filename: env[AWS2.util.sharedCredentialsFileEnv] },
          { isConfig: true, filename: env[AWS2.util.sharedConfigFileEnv] }
        ];
        var iniLoader = AWS2.util.iniLoader;
        while (!region && toCheck.length) {
          var configFile = {};
          var fileInfo = toCheck.shift();
          try {
            configFile = iniLoader.loadFrom(fileInfo);
          } catch (err) {
            if (fileInfo.isConfig)
              throw err;
          }
          var profile = configFile[env.AWS_PROFILE || AWS2.util.defaultProfile];
          region = profile && profile.region;
        }
      }
      return region;
    };
    var getBooleanValue = function(value) {
      return value === "true" ? true : value === "false" ? false : void 0;
    };
    var USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
      environmentVariableSelector: function(env) {
        return getBooleanValue(env["AWS_USE_FIPS_ENDPOINT"]);
      },
      configFileSelector: function(profile) {
        return getBooleanValue(profile["use_fips_endpoint"]);
      },
      default: false
    };
    var USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
      environmentVariableSelector: function(env) {
        return getBooleanValue(env["AWS_USE_DUALSTACK_ENDPOINT"]);
      },
      configFileSelector: function(profile) {
        return getBooleanValue(profile["use_dualstack_endpoint"]);
      },
      default: false
    };
    AWS2.util.update(AWS2.Config.prototype.keys, {
      credentials: function() {
        var credentials = null;
        new AWS2.CredentialProviderChain([
          function() {
            return new AWS2.EnvironmentCredentials("AWS");
          },
          function() {
            return new AWS2.EnvironmentCredentials("AMAZON");
          },
          function() {
            return new AWS2.SharedIniFileCredentials({ disableAssumeRole: true });
          }
        ]).resolve(function(err, creds) {
          if (!err)
            credentials = creds;
        });
        return credentials;
      },
      credentialProvider: function() {
        return new AWS2.CredentialProviderChain();
      },
      logger: function() {
        return process.env.AWSJS_DEBUG ? console : null;
      },
      region: function() {
        var region = getRegion();
        return region ? getRealRegion(region) : void 0;
      },
      tokenProvider: function() {
        return new AWS2.TokenProviderChain();
      },
      useFipsEndpoint: function() {
        var region = getRegion();
        return isFipsRegion(region) ? true : util2.loadConfig(USE_FIPS_ENDPOINT_CONFIG_OPTIONS);
      },
      useDualstackEndpoint: function() {
        return util2.loadConfig(USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS);
      }
    });
    AWS2.config = new AWS2.Config();
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/dynamodb/types.js
var require_types = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/dynamodb/types.js"(exports, module2) {
    var util2 = require_core().util;
    function typeOf(data) {
      if (data === null && typeof data === "object") {
        return "null";
      } else if (data !== void 0 && isBinary(data)) {
        return "Binary";
      } else if (data !== void 0 && data.constructor) {
        return data.wrapperName || util2.typeName(data.constructor);
      } else if (data !== void 0 && typeof data === "object") {
        return "Object";
      } else {
        return "undefined";
      }
    }
    function isBinary(data) {
      var types = [
        "Buffer",
        "File",
        "Blob",
        "ArrayBuffer",
        "DataView",
        "Int8Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "Int16Array",
        "Uint16Array",
        "Int32Array",
        "Uint32Array",
        "Float32Array",
        "Float64Array"
      ];
      if (util2.isNode()) {
        var Stream = util2.stream.Stream;
        if (util2.Buffer.isBuffer(data) || data instanceof Stream) {
          return true;
        }
      }
      for (var i = 0; i < types.length; i++) {
        if (data !== void 0 && data.constructor) {
          if (util2.isType(data, types[i]))
            return true;
          if (util2.typeName(data.constructor) === types[i])
            return true;
        }
      }
      return false;
    }
    module2.exports = {
      typeOf,
      isBinary
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/dynamodb/set.js
var require_set = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/dynamodb/set.js"(exports, module2) {
    var util2 = require_core().util;
    var typeOf = require_types().typeOf;
    var memberTypeToSetType = {
      "String": "String",
      "Number": "Number",
      "NumberValue": "Number",
      "Binary": "Binary"
    };
    var DynamoDBSet = util2.inherit({
      constructor: function Set2(list, options) {
        options = options || {};
        this.wrapperName = "Set";
        this.initialize(list, options.validate);
      },
      initialize: function(list, validate) {
        var self = this;
        self.values = [].concat(list);
        self.detectType();
        if (validate) {
          self.validate();
        }
      },
      detectType: function() {
        this.type = memberTypeToSetType[typeOf(this.values[0])];
        if (!this.type) {
          throw util2.error(new Error(), {
            code: "InvalidSetType",
            message: "Sets can contain string, number, or binary values"
          });
        }
      },
      validate: function() {
        var self = this;
        var length = self.values.length;
        var values = self.values;
        for (var i = 0; i < length; i++) {
          if (memberTypeToSetType[typeOf(values[i])] !== self.type) {
            throw util2.error(new Error(), {
              code: "InvalidType",
              message: self.type + " Set contains " + typeOf(values[i]) + " value"
            });
          }
        }
      },
      /**
       * Render the underlying values only when converting to JSON.
       */
      toJSON: function() {
        var self = this;
        return self.values;
      }
    });
    module2.exports = DynamoDBSet;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/dynamodb/numberValue.js
var require_numberValue = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/dynamodb/numberValue.js"(exports, module2) {
    var util2 = require_core().util;
    var DynamoDBNumberValue = util2.inherit({
      constructor: function NumberValue(value) {
        this.wrapperName = "NumberValue";
        this.value = value.toString();
      },
      /**
       * Render the underlying value as a number when converting to JSON.
       */
      toJSON: function() {
        return this.toNumber();
      },
      /**
       * Convert the underlying value to a JavaScript number.
       */
      toNumber: function() {
        return Number(this.value);
      },
      /**
       * Return a string representing the unaltered value provided to the
       * constructor.
       */
      toString: function() {
        return this.value;
      }
    });
    module2.exports = DynamoDBNumberValue;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/dynamodb/converter.js
var require_converter = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/dynamodb/converter.js"(exports, module2) {
    var AWS2 = require_core();
    var util2 = AWS2.util;
    var typeOf = require_types().typeOf;
    var DynamoDBSet = require_set();
    var NumberValue = require_numberValue();
    AWS2.DynamoDB.Converter = {
      /**
       * Convert a JavaScript value to its equivalent DynamoDB AttributeValue type
       *
       * @param data [any] The data to convert to a DynamoDB AttributeValue
       * @param options [map]
       * @option options convertEmptyValues [Boolean] Whether to automatically
       *                                              convert empty strings, blobs,
       *                                              and sets to `null`
       * @option options wrapNumbers [Boolean]  Whether to return numbers as a
       *                                        NumberValue object instead of
       *                                        converting them to native JavaScript
       *                                        numbers. This allows for the safe
       *                                        round-trip transport of numbers of
       *                                        arbitrary size.
       * @return [map] An object in the Amazon DynamoDB AttributeValue format
       *
       * @see AWS.DynamoDB.Converter.marshall AWS.DynamoDB.Converter.marshall to
       *    convert entire records (rather than individual attributes)
       */
      input: function convertInput(data, options) {
        options = options || {};
        var type = typeOf(data);
        if (type === "Object") {
          return formatMap(data, options);
        } else if (type === "Array") {
          return formatList(data, options);
        } else if (type === "Set") {
          return formatSet(data, options);
        } else if (type === "String") {
          if (data.length === 0 && options.convertEmptyValues) {
            return convertInput(null);
          }
          return { S: data };
        } else if (type === "Number" || type === "NumberValue") {
          return { N: data.toString() };
        } else if (type === "Binary") {
          if (data.length === 0 && options.convertEmptyValues) {
            return convertInput(null);
          }
          return { B: data };
        } else if (type === "Boolean") {
          return { BOOL: data };
        } else if (type === "null") {
          return { NULL: true };
        } else if (type !== "undefined" && type !== "Function") {
          return formatMap(data, options);
        }
      },
      /**
       * Convert a JavaScript object into a DynamoDB record.
       *
       * @param data [any] The data to convert to a DynamoDB record
       * @param options [map]
       * @option options convertEmptyValues [Boolean] Whether to automatically
       *                                              convert empty strings, blobs,
       *                                              and sets to `null`
       * @option options wrapNumbers [Boolean]  Whether to return numbers as a
       *                                        NumberValue object instead of
       *                                        converting them to native JavaScript
       *                                        numbers. This allows for the safe
       *                                        round-trip transport of numbers of
       *                                        arbitrary size.
       *
       * @return [map] An object in the DynamoDB record format.
       *
       * @example Convert a JavaScript object into a DynamoDB record
       *  var marshalled = AWS.DynamoDB.Converter.marshall({
       *    string: 'foo',
       *    list: ['fizz', 'buzz', 'pop'],
       *    map: {
       *      nestedMap: {
       *        key: 'value',
       *      }
       *    },
       *    number: 123,
       *    nullValue: null,
       *    boolValue: true,
       *    stringSet: new DynamoDBSet(['foo', 'bar', 'baz'])
       *  });
       */
      marshall: function marshallItem(data, options) {
        return AWS2.DynamoDB.Converter.input(data, options).M;
      },
      /**
       * Convert a DynamoDB AttributeValue object to its equivalent JavaScript type.
       *
       * @param data [map] An object in the Amazon DynamoDB AttributeValue format
       * @param options [map]
       * @option options convertEmptyValues [Boolean] Whether to automatically
       *                                              convert empty strings, blobs,
       *                                              and sets to `null`
       * @option options wrapNumbers [Boolean]  Whether to return numbers as a
       *                                        NumberValue object instead of
       *                                        converting them to native JavaScript
       *                                        numbers. This allows for the safe
       *                                        round-trip transport of numbers of
       *                                        arbitrary size.
       *
       * @return [Object|Array|String|Number|Boolean|null]
       *
       * @see AWS.DynamoDB.Converter.unmarshall AWS.DynamoDB.Converter.unmarshall to
       *    convert entire records (rather than individual attributes)
       */
      output: function convertOutput(data, options) {
        options = options || {};
        var list, map, i;
        for (var type in data) {
          var values = data[type];
          if (type === "M") {
            map = {};
            for (var key in values) {
              map[key] = convertOutput(values[key], options);
            }
            return map;
          } else if (type === "L") {
            list = [];
            for (i = 0; i < values.length; i++) {
              list.push(convertOutput(values[i], options));
            }
            return list;
          } else if (type === "SS") {
            list = [];
            for (i = 0; i < values.length; i++) {
              list.push(values[i] + "");
            }
            return new DynamoDBSet(list);
          } else if (type === "NS") {
            list = [];
            for (i = 0; i < values.length; i++) {
              list.push(convertNumber(values[i], options.wrapNumbers));
            }
            return new DynamoDBSet(list);
          } else if (type === "BS") {
            list = [];
            for (i = 0; i < values.length; i++) {
              list.push(AWS2.util.buffer.toBuffer(values[i]));
            }
            return new DynamoDBSet(list);
          } else if (type === "S") {
            return values + "";
          } else if (type === "N") {
            return convertNumber(values, options.wrapNumbers);
          } else if (type === "B") {
            return util2.buffer.toBuffer(values);
          } else if (type === "BOOL") {
            return values === "true" || values === "TRUE" || values === true;
          } else if (type === "NULL") {
            return null;
          }
        }
      },
      /**
       * Convert a DynamoDB record into a JavaScript object.
       *
       * @param data [any] The DynamoDB record
       * @param options [map]
       * @option options convertEmptyValues [Boolean] Whether to automatically
       *                                              convert empty strings, blobs,
       *                                              and sets to `null`
       * @option options wrapNumbers [Boolean]  Whether to return numbers as a
       *                                        NumberValue object instead of
       *                                        converting them to native JavaScript
       *                                        numbers. This allows for the safe
       *                                        round-trip transport of numbers of
       *                                        arbitrary size.
       *
       * @return [map] An object whose properties have been converted from
       *    DynamoDB's AttributeValue format into their corresponding native
       *    JavaScript types.
       *
       * @example Convert a record received from a DynamoDB stream
       *  var unmarshalled = AWS.DynamoDB.Converter.unmarshall({
       *    string: {S: 'foo'},
       *    list: {L: [{S: 'fizz'}, {S: 'buzz'}, {S: 'pop'}]},
       *    map: {
       *      M: {
       *        nestedMap: {
       *          M: {
       *            key: {S: 'value'}
       *          }
       *        }
       *      }
       *    },
       *    number: {N: '123'},
       *    nullValue: {NULL: true},
       *    boolValue: {BOOL: true}
       *  });
       */
      unmarshall: function unmarshall(data, options) {
        return AWS2.DynamoDB.Converter.output({ M: data }, options);
      }
    };
    function formatList(data, options) {
      var list = { L: [] };
      for (var i = 0; i < data.length; i++) {
        list["L"].push(AWS2.DynamoDB.Converter.input(data[i], options));
      }
      return list;
    }
    function convertNumber(value, wrapNumbers) {
      return wrapNumbers ? new NumberValue(value) : Number(value);
    }
    function formatMap(data, options) {
      var map = { M: {} };
      for (var key in data) {
        var formatted = AWS2.DynamoDB.Converter.input(data[key], options);
        if (formatted !== void 0) {
          map["M"][key] = formatted;
        }
      }
      return map;
    }
    function formatSet(data, options) {
      options = options || {};
      var values = data.values;
      if (options.convertEmptyValues) {
        values = filterEmptySetValues(data);
        if (values.length === 0) {
          return AWS2.DynamoDB.Converter.input(null);
        }
      }
      var map = {};
      switch (data.type) {
        case "String":
          map["SS"] = values;
          break;
        case "Binary":
          map["BS"] = values;
          break;
        case "Number":
          map["NS"] = values.map(function(value) {
            return value.toString();
          });
      }
      return map;
    }
    function filterEmptySetValues(set) {
      var nonEmptyValues = [];
      var potentiallyEmptyTypes = {
        String: true,
        Binary: true,
        Number: false
      };
      if (potentiallyEmptyTypes[set.type]) {
        for (var i = 0; i < set.values.length; i++) {
          if (set.values[i].length === 0) {
            continue;
          }
          nonEmptyValues.push(set.values[i]);
        }
        return nonEmptyValues;
      }
      return set.values;
    }
    module2.exports = AWS2.DynamoDB.Converter;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/dynamodb/translator.js
var require_translator = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/dynamodb/translator.js"(exports, module2) {
    var util2 = require_core().util;
    var convert = require_converter();
    var Translator = function(options) {
      options = options || {};
      this.attrValue = options.attrValue;
      this.convertEmptyValues = Boolean(options.convertEmptyValues);
      this.wrapNumbers = Boolean(options.wrapNumbers);
    };
    Translator.prototype.translateInput = function(value, shape) {
      this.mode = "input";
      return this.translate(value, shape);
    };
    Translator.prototype.translateOutput = function(value, shape) {
      this.mode = "output";
      return this.translate(value, shape);
    };
    Translator.prototype.translate = function(value, shape) {
      var self = this;
      if (!shape || value === void 0)
        return void 0;
      if (shape.shape === self.attrValue) {
        return convert[self.mode](value, {
          convertEmptyValues: self.convertEmptyValues,
          wrapNumbers: self.wrapNumbers
        });
      }
      switch (shape.type) {
        case "structure":
          return self.translateStructure(value, shape);
        case "map":
          return self.translateMap(value, shape);
        case "list":
          return self.translateList(value, shape);
        default:
          return self.translateScalar(value, shape);
      }
    };
    Translator.prototype.translateStructure = function(structure, shape) {
      var self = this;
      if (structure == null)
        return void 0;
      var struct = {};
      util2.each(structure, function(name, value) {
        var memberShape = shape.members[name];
        if (memberShape) {
          var result = self.translate(value, memberShape);
          if (result !== void 0)
            struct[name] = result;
        }
      });
      return struct;
    };
    Translator.prototype.translateList = function(list, shape) {
      var self = this;
      if (list == null)
        return void 0;
      var out = [];
      util2.arrayEach(list, function(value) {
        var result = self.translate(value, shape.member);
        if (result === void 0)
          out.push(null);
        else
          out.push(result);
      });
      return out;
    };
    Translator.prototype.translateMap = function(map, shape) {
      var self = this;
      if (map == null)
        return void 0;
      var out = {};
      util2.each(map, function(key, value) {
        var result = self.translate(value, shape.value);
        if (result === void 0)
          out[key] = null;
        else
          out[key] = result;
      });
      return out;
    };
    Translator.prototype.translateScalar = function(value, shape) {
      return shape.toType(value);
    };
    module2.exports = Translator;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/dynamodb/document_client.js
var require_document_client = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/dynamodb/document_client.js"(exports, module2) {
    var AWS2 = require_core();
    var Translator = require_translator();
    var DynamoDBSet = require_set();
    AWS2.DynamoDB.DocumentClient = AWS2.util.inherit({
      /**
       * Creates a DynamoDB document client with a set of configuration options.
       *
       * @option options params [map] An optional map of parameters to bind to every
       *   request sent by this service object.
       * @option options service [AWS.DynamoDB] An optional pre-configured instance
       *  of the AWS.DynamoDB service object. This instance's config will be
       *  copied to a new instance used by this client. You should not need to
       *  retain a reference to the input object, and may destroy it or allow it
       *  to be garbage collected.
       * @option options convertEmptyValues [Boolean] set to true if you would like
       *  the document client to convert empty values (0-length strings, binary
       *  buffers, and sets) to be converted to NULL types when persisting to
       *  DynamoDB.
       * @option options wrapNumbers [Boolean] Set to true to return numbers as a
       *  NumberValue object instead of converting them to native JavaScript numbers.
       *  This allows for the safe round-trip transport of numbers of arbitrary size.
       * @see AWS.DynamoDB.constructor
       *
       */
      constructor: function DocumentClient2(options) {
        var self = this;
        self.options = options || {};
        self.configure(self.options);
      },
      /**
       * @api private
       */
      configure: function configure(options) {
        var self = this;
        self.service = options.service;
        self.bindServiceObject(options);
        self.attrValue = options.attrValue = self.service.api.operations.putItem.input.members.Item.value.shape;
      },
      /**
       * @api private
       */
      bindServiceObject: function bindServiceObject(options) {
        var self = this;
        options = options || {};
        if (!self.service) {
          self.service = new AWS2.DynamoDB(options);
        } else {
          var config = AWS2.util.copy(self.service.config);
          self.service = new self.service.constructor.__super__(config);
          self.service.config.params = AWS2.util.merge(self.service.config.params || {}, options.params);
        }
      },
      /**
       * @api private
       */
      makeServiceRequest: function(operation, params, callback) {
        var self = this;
        var request = self.service[operation](params);
        self.setupRequest(request);
        self.setupResponse(request);
        if (typeof callback === "function") {
          request.send(callback);
        }
        return request;
      },
      /**
       * @api private
       */
      serviceClientOperationsMap: {
        batchGet: "batchGetItem",
        batchWrite: "batchWriteItem",
        delete: "deleteItem",
        get: "getItem",
        put: "putItem",
        query: "query",
        scan: "scan",
        update: "updateItem",
        transactGet: "transactGetItems",
        transactWrite: "transactWriteItems"
      },
      /**
       * Returns the attributes of one or more items from one or more tables
       * by delegating to `AWS.DynamoDB.batchGetItem()`.
       *
       * Supply the same parameters as {AWS.DynamoDB.batchGetItem} with
       * `AttributeValue`s substituted by native JavaScript types.
       *
       * @see AWS.DynamoDB.batchGetItem
       * @example Get items from multiple tables
       *  var params = {
       *    RequestItems: {
       *      'Table-1': {
       *        Keys: [
       *          {
       *             HashKey: 'haskey',
       *             NumberRangeKey: 1
       *          }
       *        ]
       *      },
       *      'Table-2': {
       *        Keys: [
       *          { foo: 'bar' },
       *        ]
       *      }
       *    }
       *  };
       *
       *  var documentClient = new AWS.DynamoDB.DocumentClient();
       *
       *  documentClient.batchGet(params, function(err, data) {
       *    if (err) console.log(err);
       *    else console.log(data);
       *  });
       *
       */
      batchGet: function(params, callback) {
        var operation = this.serviceClientOperationsMap["batchGet"];
        return this.makeServiceRequest(operation, params, callback);
      },
      /**
       * Puts or deletes multiple items in one or more tables by delegating
       * to `AWS.DynamoDB.batchWriteItem()`.
       *
       * Supply the same parameters as {AWS.DynamoDB.batchWriteItem} with
       * `AttributeValue`s substituted by native JavaScript types.
       *
       * @see AWS.DynamoDB.batchWriteItem
       * @example Write to and delete from a table
       *  var params = {
       *    RequestItems: {
       *      'Table-1': [
       *        {
       *          DeleteRequest: {
       *            Key: { HashKey: 'someKey' }
       *          }
       *        },
       *        {
       *          PutRequest: {
       *            Item: {
       *              HashKey: 'anotherKey',
       *              NumAttribute: 1,
       *              BoolAttribute: true,
       *              ListAttribute: [1, 'two', false],
       *              MapAttribute: { foo: 'bar' }
       *            }
       *          }
       *        }
       *      ]
       *    }
       *  };
       *
       *  var documentClient = new AWS.DynamoDB.DocumentClient();
       *
       *  documentClient.batchWrite(params, function(err, data) {
       *    if (err) console.log(err);
       *    else console.log(data);
       *  });
       *
       */
      batchWrite: function(params, callback) {
        var operation = this.serviceClientOperationsMap["batchWrite"];
        return this.makeServiceRequest(operation, params, callback);
      },
      /**
       * Deletes a single item in a table by primary key by delegating to
       * `AWS.DynamoDB.deleteItem()`
       *
       * Supply the same parameters as {AWS.DynamoDB.deleteItem} with
       * `AttributeValue`s substituted by native JavaScript types.
       *
       * @see AWS.DynamoDB.deleteItem
       * @example Delete an item from a table
       *  var params = {
       *    TableName : 'Table',
       *    Key: {
       *      HashKey: 'hashkey',
       *      NumberRangeKey: 1
       *    }
       *  };
       *
       *  var documentClient = new AWS.DynamoDB.DocumentClient();
       *
       *  documentClient.delete(params, function(err, data) {
       *    if (err) console.log(err);
       *    else console.log(data);
       *  });
       *
       */
      delete: function(params, callback) {
        var operation = this.serviceClientOperationsMap["delete"];
        return this.makeServiceRequest(operation, params, callback);
      },
      /**
       * Returns a set of attributes for the item with the given primary key
       * by delegating to `AWS.DynamoDB.getItem()`.
       *
       * Supply the same parameters as {AWS.DynamoDB.getItem} with
       * `AttributeValue`s substituted by native JavaScript types.
       *
       * @see AWS.DynamoDB.getItem
       * @example Get an item from a table
       *  var params = {
       *    TableName : 'Table',
       *    Key: {
       *      HashKey: 'hashkey'
       *    }
       *  };
       *
       *  var documentClient = new AWS.DynamoDB.DocumentClient();
       *
       *  documentClient.get(params, function(err, data) {
       *    if (err) console.log(err);
       *    else console.log(data);
       *  });
       *
       */
      get: function(params, callback) {
        var operation = this.serviceClientOperationsMap["get"];
        return this.makeServiceRequest(operation, params, callback);
      },
      /**
       * Creates a new item, or replaces an old item with a new item by
       * delegating to `AWS.DynamoDB.putItem()`.
       *
       * Supply the same parameters as {AWS.DynamoDB.putItem} with
       * `AttributeValue`s substituted by native JavaScript types.
       *
       * @see AWS.DynamoDB.putItem
       * @example Create a new item in a table
       *  var params = {
       *    TableName : 'Table',
       *    Item: {
       *       HashKey: 'haskey',
       *       NumAttribute: 1,
       *       BoolAttribute: true,
       *       ListAttribute: [1, 'two', false],
       *       MapAttribute: { foo: 'bar'},
       *       NullAttribute: null
       *    }
       *  };
       *
       *  var documentClient = new AWS.DynamoDB.DocumentClient();
       *
       *  documentClient.put(params, function(err, data) {
       *    if (err) console.log(err);
       *    else console.log(data);
       *  });
       *
       */
      put: function(params, callback) {
        var operation = this.serviceClientOperationsMap["put"];
        return this.makeServiceRequest(operation, params, callback);
      },
      /**
       * Edits an existing item's attributes, or adds a new item to the table if
       * it does not already exist by delegating to `AWS.DynamoDB.updateItem()`.
       *
       * Supply the same parameters as {AWS.DynamoDB.updateItem} with
       * `AttributeValue`s substituted by native JavaScript types.
       *
       * @see AWS.DynamoDB.updateItem
       * @example Update an item with expressions
       *  var params = {
       *    TableName: 'Table',
       *    Key: { HashKey : 'hashkey' },
       *    UpdateExpression: 'set #a = :x + :y',
       *    ConditionExpression: '#a < :MAX',
       *    ExpressionAttributeNames: {'#a' : 'Sum'},
       *    ExpressionAttributeValues: {
       *      ':x' : 20,
       *      ':y' : 45,
       *      ':MAX' : 100,
       *    }
       *  };
       *
       *  var documentClient = new AWS.DynamoDB.DocumentClient();
       *
       *  documentClient.update(params, function(err, data) {
       *     if (err) console.log(err);
       *     else console.log(data);
       *  });
       *
       */
      update: function(params, callback) {
        var operation = this.serviceClientOperationsMap["update"];
        return this.makeServiceRequest(operation, params, callback);
      },
      /**
       * Returns one or more items and item attributes by accessing every item
       * in a table or a secondary index.
       *
       * Supply the same parameters as {AWS.DynamoDB.scan} with
       * `AttributeValue`s substituted by native JavaScript types.
       *
       * @see AWS.DynamoDB.scan
       * @example Scan the table with a filter expression
       *  var params = {
       *    TableName : 'Table',
       *    FilterExpression : 'Year = :this_year',
       *    ExpressionAttributeValues : {':this_year' : 2015}
       *  };
       *
       *  var documentClient = new AWS.DynamoDB.DocumentClient();
       *
       *  documentClient.scan(params, function(err, data) {
       *     if (err) console.log(err);
       *     else console.log(data);
       *  });
       *
       */
      scan: function(params, callback) {
        var operation = this.serviceClientOperationsMap["scan"];
        return this.makeServiceRequest(operation, params, callback);
      },
      /**
       * Directly access items from a table by primary key or a secondary index.
       *
       * Supply the same parameters as {AWS.DynamoDB.query} with
       * `AttributeValue`s substituted by native JavaScript types.
       *
       * @see AWS.DynamoDB.query
       * @example Query an index
       *  var params = {
       *    TableName: 'Table',
       *    IndexName: 'Index',
       *    KeyConditionExpression: 'HashKey = :hkey and RangeKey > :rkey',
       *    ExpressionAttributeValues: {
       *      ':hkey': 'key',
       *      ':rkey': 2015
       *    }
       *  };
       *
       *  var documentClient = new AWS.DynamoDB.DocumentClient();
       *
       *  documentClient.query(params, function(err, data) {
       *     if (err) console.log(err);
       *     else console.log(data);
       *  });
       *
       */
      query: function(params, callback) {
        var operation = this.serviceClientOperationsMap["query"];
        return this.makeServiceRequest(operation, params, callback);
      },
      /**
       * Synchronous write operation that groups up to 25 action requests.
       *
       * Supply the same parameters as {AWS.DynamoDB.transactWriteItems} with
       * `AttributeValue`s substituted by native JavaScript types.
       *
       * @see AWS.DynamoDB.transactWriteItems
       * @example Get items from multiple tables
       *  var params = {
       *    TransactItems: [{
       *      Put: {
       *        TableName : 'Table0',
       *        Item: {
       *          HashKey: 'haskey',
       *          NumAttribute: 1,
       *          BoolAttribute: true,
       *          ListAttribute: [1, 'two', false],
       *          MapAttribute: { foo: 'bar'},
       *          NullAttribute: null
       *        }
       *      }
       *    }, {
       *      Update: {
       *        TableName: 'Table1',
       *        Key: { HashKey : 'hashkey' },
       *        UpdateExpression: 'set #a = :x + :y',
       *        ConditionExpression: '#a < :MAX',
       *        ExpressionAttributeNames: {'#a' : 'Sum'},
       *        ExpressionAttributeValues: {
       *          ':x' : 20,
       *          ':y' : 45,
       *          ':MAX' : 100,
       *        }
       *      }
       *    }]
       *  };
       *
       *  documentClient.transactWrite(params, function(err, data) {
       *    if (err) console.log(err);
       *    else console.log(data);
       *  });
       */
      transactWrite: function(params, callback) {
        var operation = this.serviceClientOperationsMap["transactWrite"];
        return this.makeServiceRequest(operation, params, callback);
      },
      /**
       * Atomically retrieves multiple items from one or more tables (but not from indexes)
       * in a single account and region.
       *
       * Supply the same parameters as {AWS.DynamoDB.transactGetItems} with
       * `AttributeValue`s substituted by native JavaScript types.
       *
       * @see AWS.DynamoDB.transactGetItems
       * @example Get items from multiple tables
       *  var params = {
       *    TransactItems: [{
       *      Get: {
       *        TableName : 'Table0',
       *        Key: {
       *          HashKey: 'hashkey0'
       *        }
       *      }
       *    }, {
       *      Get: {
       *        TableName : 'Table1',
       *        Key: {
       *          HashKey: 'hashkey1'
       *        }
       *      }
       *    }]
       *  };
       *
       *  documentClient.transactGet(params, function(err, data) {
       *    if (err) console.log(err);
       *    else console.log(data);
       *  });
       */
      transactGet: function(params, callback) {
        var operation = this.serviceClientOperationsMap["transactGet"];
        return this.makeServiceRequest(operation, params, callback);
      },
      /**
       * Creates a set of elements inferring the type of set from
       * the type of the first element. Amazon DynamoDB currently supports
       * the number sets, string sets, and binary sets. For more information
       * about DynamoDB data types see the documentation on the
       * [Amazon DynamoDB Data Model](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DataModel.html#DataModel.DataTypes).
       *
       * @param list [Array] Collection to represent your DynamoDB Set
       * @param options [map]
       *  * **validate** [Boolean] set to true if you want to validate the type
       *    of each element in the set. Defaults to `false`.
       * @example Creating a number set
       *  var documentClient = new AWS.DynamoDB.DocumentClient();
       *
       *  var params = {
       *    Item: {
       *      hashkey: 'hashkey'
       *      numbers: documentClient.createSet([1, 2, 3]);
       *    }
       *  };
       *
       *  documentClient.put(params, function(err, data) {
       *    if (err) console.log(err);
       *    else console.log(data);
       *  });
       *
       */
      createSet: function(list, options) {
        options = options || {};
        return new DynamoDBSet(list, options);
      },
      /**
       * @api private
       */
      getTranslator: function() {
        return new Translator(this.options);
      },
      /**
       * @api private
       */
      setupRequest: function setupRequest(request) {
        var self = this;
        var translator = self.getTranslator();
        var operation = request.operation;
        var inputShape = request.service.api.operations[operation].input;
        request._events.validate.unshift(function(req) {
          req.rawParams = AWS2.util.copy(req.params);
          req.params = translator.translateInput(req.rawParams, inputShape);
        });
      },
      /**
       * @api private
       */
      setupResponse: function setupResponse(request) {
        var self = this;
        var translator = self.getTranslator();
        var outputShape = self.service.api.operations[request.operation].output;
        request.on("extractData", function(response3) {
          response3.data = translator.translateOutput(response3.data, outputShape);
        });
        var response2 = request.response;
        response2.nextPage = function(cb) {
          var resp = this;
          var req = resp.request;
          var config;
          var service = req.service;
          var operation = req.operation;
          try {
            config = service.paginationConfig(operation, true);
          } catch (e) {
            resp.error = e;
          }
          if (!resp.hasNextPage()) {
            if (cb)
              cb(resp.error, null);
            else if (resp.error)
              throw resp.error;
            return null;
          }
          var params = AWS2.util.copy(req.rawParams);
          if (!resp.nextPageTokens) {
            return cb ? cb(null, null) : null;
          } else {
            var inputTokens = config.inputToken;
            if (typeof inputTokens === "string")
              inputTokens = [inputTokens];
            for (var i = 0; i < inputTokens.length; i++) {
              params[inputTokens[i]] = resp.nextPageTokens[i];
            }
            return self[operation](params, cb);
          }
        };
      }
    });
    module2.exports = AWS2.DynamoDB.DocumentClient;
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/services/dynamodb.js
var require_dynamodb = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/lib/services/dynamodb.js"() {
    var AWS2 = require_core();
    require_document_client();
    AWS2.util.update(AWS2.DynamoDB.prototype, {
      /**
       * @api private
       */
      setupRequestListeners: function setupRequestListeners(request) {
        if (request.service.config.dynamoDbCrc32) {
          request.removeListener("extractData", AWS2.EventListeners.Json.EXTRACT_DATA);
          request.addListener("extractData", this.checkCrc32);
          request.addListener("extractData", AWS2.EventListeners.Json.EXTRACT_DATA);
        }
      },
      /**
       * @api private
       */
      checkCrc32: function checkCrc32(resp) {
        if (!resp.httpResponse.streaming && !resp.request.service.crc32IsValid(resp)) {
          resp.data = null;
          resp.error = AWS2.util.error(new Error(), {
            code: "CRC32CheckFailed",
            message: "CRC32 integrity check failed",
            retryable: true
          });
          resp.request.haltHandlersOnError();
          throw resp.error;
        }
      },
      /**
       * @api private
       */
      crc32IsValid: function crc32IsValid(resp) {
        var crc = resp.httpResponse.headers["x-amz-crc32"];
        if (!crc)
          return true;
        return parseInt(crc, 10) === AWS2.util.crypto.crc32(resp.httpResponse.body);
      },
      /**
       * @api private
       */
      defaultRetryCount: 10,
      /**
       * @api private
       */
      retryDelays: function retryDelays(retryCount, err) {
        var retryDelayOptions = AWS2.util.copy(this.config.retryDelayOptions);
        if (typeof retryDelayOptions.base !== "number") {
          retryDelayOptions.base = 50;
        }
        var delay = AWS2.util.calculateRetryDelay(retryCount, retryDelayOptions, err);
        return delay;
      }
    });
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/dynamodb-2011-12-05.min.json
var require_dynamodb_2011_12_05_min = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/dynamodb-2011-12-05.min.json"(exports, module2) {
    module2.exports = {
      version: "2.0",
      metadata: {
        apiVersion: "2011-12-05",
        endpointPrefix: "dynamodb",
        jsonVersion: "1.0",
        protocol: "json",
        serviceAbbreviation: "DynamoDB",
        serviceFullName: "Amazon DynamoDB",
        serviceId: "DynamoDB",
        signatureVersion: "v4",
        targetPrefix: "DynamoDB_20111205",
        uid: "dynamodb-2011-12-05"
      },
      operations: {
        BatchGetItem: {
          input: {
            type: "structure",
            required: [
              "RequestItems"
            ],
            members: {
              RequestItems: {
                shape: "S2"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              Responses: {
                type: "map",
                key: {},
                value: {
                  type: "structure",
                  members: {
                    Items: {
                      shape: "Sk"
                    },
                    ConsumedCapacityUnits: {
                      type: "double"
                    }
                  }
                }
              },
              UnprocessedKeys: {
                shape: "S2"
              }
            }
          }
        },
        BatchWriteItem: {
          input: {
            type: "structure",
            required: [
              "RequestItems"
            ],
            members: {
              RequestItems: {
                shape: "So"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              Responses: {
                type: "map",
                key: {},
                value: {
                  type: "structure",
                  members: {
                    ConsumedCapacityUnits: {
                      type: "double"
                    }
                  }
                }
              },
              UnprocessedItems: {
                shape: "So"
              }
            }
          }
        },
        CreateTable: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "KeySchema",
              "ProvisionedThroughput"
            ],
            members: {
              TableName: {},
              KeySchema: {
                shape: "Sy"
              },
              ProvisionedThroughput: {
                shape: "S12"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              TableDescription: {
                shape: "S15"
              }
            }
          }
        },
        DeleteItem: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "Key"
            ],
            members: {
              TableName: {},
              Key: {
                shape: "S6"
              },
              Expected: {
                shape: "S1b"
              },
              ReturnValues: {}
            }
          },
          output: {
            type: "structure",
            members: {
              Attributes: {
                shape: "Sl"
              },
              ConsumedCapacityUnits: {
                type: "double"
              }
            }
          }
        },
        DeleteTable: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              TableName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              TableDescription: {
                shape: "S15"
              }
            }
          }
        },
        DescribeTable: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              TableName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              Table: {
                shape: "S15"
              }
            }
          }
        },
        GetItem: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "Key"
            ],
            members: {
              TableName: {},
              Key: {
                shape: "S6"
              },
              AttributesToGet: {
                shape: "Se"
              },
              ConsistentRead: {
                type: "boolean"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              Item: {
                shape: "Sl"
              },
              ConsumedCapacityUnits: {
                type: "double"
              }
            }
          }
        },
        ListTables: {
          input: {
            type: "structure",
            members: {
              ExclusiveStartTableName: {},
              Limit: {
                type: "integer"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              TableNames: {
                type: "list",
                member: {}
              },
              LastEvaluatedTableName: {}
            }
          }
        },
        PutItem: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "Item"
            ],
            members: {
              TableName: {},
              Item: {
                shape: "Ss"
              },
              Expected: {
                shape: "S1b"
              },
              ReturnValues: {}
            }
          },
          output: {
            type: "structure",
            members: {
              Attributes: {
                shape: "Sl"
              },
              ConsumedCapacityUnits: {
                type: "double"
              }
            }
          }
        },
        Query: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "HashKeyValue"
            ],
            members: {
              TableName: {},
              AttributesToGet: {
                shape: "Se"
              },
              Limit: {
                type: "integer"
              },
              ConsistentRead: {
                type: "boolean"
              },
              Count: {
                type: "boolean"
              },
              HashKeyValue: {
                shape: "S7"
              },
              RangeKeyCondition: {
                shape: "S1u"
              },
              ScanIndexForward: {
                type: "boolean"
              },
              ExclusiveStartKey: {
                shape: "S6"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              Items: {
                shape: "Sk"
              },
              Count: {
                type: "integer"
              },
              LastEvaluatedKey: {
                shape: "S6"
              },
              ConsumedCapacityUnits: {
                type: "double"
              }
            }
          }
        },
        Scan: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              TableName: {},
              AttributesToGet: {
                shape: "Se"
              },
              Limit: {
                type: "integer"
              },
              Count: {
                type: "boolean"
              },
              ScanFilter: {
                type: "map",
                key: {},
                value: {
                  shape: "S1u"
                }
              },
              ExclusiveStartKey: {
                shape: "S6"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              Items: {
                shape: "Sk"
              },
              Count: {
                type: "integer"
              },
              ScannedCount: {
                type: "integer"
              },
              LastEvaluatedKey: {
                shape: "S6"
              },
              ConsumedCapacityUnits: {
                type: "double"
              }
            }
          }
        },
        UpdateItem: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "Key",
              "AttributeUpdates"
            ],
            members: {
              TableName: {},
              Key: {
                shape: "S6"
              },
              AttributeUpdates: {
                type: "map",
                key: {},
                value: {
                  type: "structure",
                  members: {
                    Value: {
                      shape: "S7"
                    },
                    Action: {}
                  }
                }
              },
              Expected: {
                shape: "S1b"
              },
              ReturnValues: {}
            }
          },
          output: {
            type: "structure",
            members: {
              Attributes: {
                shape: "Sl"
              },
              ConsumedCapacityUnits: {
                type: "double"
              }
            }
          }
        },
        UpdateTable: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "ProvisionedThroughput"
            ],
            members: {
              TableName: {},
              ProvisionedThroughput: {
                shape: "S12"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              TableDescription: {
                shape: "S15"
              }
            }
          }
        }
      },
      shapes: {
        S2: {
          type: "map",
          key: {},
          value: {
            type: "structure",
            required: [
              "Keys"
            ],
            members: {
              Keys: {
                type: "list",
                member: {
                  shape: "S6"
                }
              },
              AttributesToGet: {
                shape: "Se"
              },
              ConsistentRead: {
                type: "boolean"
              }
            }
          }
        },
        S6: {
          type: "structure",
          required: [
            "HashKeyElement"
          ],
          members: {
            HashKeyElement: {
              shape: "S7"
            },
            RangeKeyElement: {
              shape: "S7"
            }
          }
        },
        S7: {
          type: "structure",
          members: {
            S: {},
            N: {},
            B: {
              type: "blob"
            },
            SS: {
              type: "list",
              member: {}
            },
            NS: {
              type: "list",
              member: {}
            },
            BS: {
              type: "list",
              member: {
                type: "blob"
              }
            }
          }
        },
        Se: {
          type: "list",
          member: {}
        },
        Sk: {
          type: "list",
          member: {
            shape: "Sl"
          }
        },
        Sl: {
          type: "map",
          key: {},
          value: {
            shape: "S7"
          }
        },
        So: {
          type: "map",
          key: {},
          value: {
            type: "list",
            member: {
              type: "structure",
              members: {
                PutRequest: {
                  type: "structure",
                  required: [
                    "Item"
                  ],
                  members: {
                    Item: {
                      shape: "Ss"
                    }
                  }
                },
                DeleteRequest: {
                  type: "structure",
                  required: [
                    "Key"
                  ],
                  members: {
                    Key: {
                      shape: "S6"
                    }
                  }
                }
              }
            }
          }
        },
        Ss: {
          type: "map",
          key: {},
          value: {
            shape: "S7"
          }
        },
        Sy: {
          type: "structure",
          required: [
            "HashKeyElement"
          ],
          members: {
            HashKeyElement: {
              shape: "Sz"
            },
            RangeKeyElement: {
              shape: "Sz"
            }
          }
        },
        Sz: {
          type: "structure",
          required: [
            "AttributeName",
            "AttributeType"
          ],
          members: {
            AttributeName: {},
            AttributeType: {}
          }
        },
        S12: {
          type: "structure",
          required: [
            "ReadCapacityUnits",
            "WriteCapacityUnits"
          ],
          members: {
            ReadCapacityUnits: {
              type: "long"
            },
            WriteCapacityUnits: {
              type: "long"
            }
          }
        },
        S15: {
          type: "structure",
          members: {
            TableName: {},
            KeySchema: {
              shape: "Sy"
            },
            TableStatus: {},
            CreationDateTime: {
              type: "timestamp"
            },
            ProvisionedThroughput: {
              type: "structure",
              members: {
                LastIncreaseDateTime: {
                  type: "timestamp"
                },
                LastDecreaseDateTime: {
                  type: "timestamp"
                },
                NumberOfDecreasesToday: {
                  type: "long"
                },
                ReadCapacityUnits: {
                  type: "long"
                },
                WriteCapacityUnits: {
                  type: "long"
                }
              }
            },
            TableSizeBytes: {
              type: "long"
            },
            ItemCount: {
              type: "long"
            }
          }
        },
        S1b: {
          type: "map",
          key: {},
          value: {
            type: "structure",
            members: {
              Value: {
                shape: "S7"
              },
              Exists: {
                type: "boolean"
              }
            }
          }
        },
        S1u: {
          type: "structure",
          required: [
            "ComparisonOperator"
          ],
          members: {
            AttributeValueList: {
              type: "list",
              member: {
                shape: "S7"
              }
            },
            ComparisonOperator: {}
          }
        }
      }
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/dynamodb-2011-12-05.paginators.json
var require_dynamodb_2011_12_05_paginators = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/dynamodb-2011-12-05.paginators.json"(exports, module2) {
    module2.exports = {
      pagination: {
        BatchGetItem: {
          input_token: "RequestItems",
          output_token: "UnprocessedKeys"
        },
        ListTables: {
          input_token: "ExclusiveStartTableName",
          limit_key: "Limit",
          output_token: "LastEvaluatedTableName",
          result_key: "TableNames"
        },
        Query: {
          input_token: "ExclusiveStartKey",
          limit_key: "Limit",
          output_token: "LastEvaluatedKey",
          result_key: "Items"
        },
        Scan: {
          input_token: "ExclusiveStartKey",
          limit_key: "Limit",
          output_token: "LastEvaluatedKey",
          result_key: "Items"
        }
      }
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/dynamodb-2011-12-05.waiters2.json
var require_dynamodb_2011_12_05_waiters2 = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/dynamodb-2011-12-05.waiters2.json"(exports, module2) {
    module2.exports = {
      version: 2,
      waiters: {
        TableExists: {
          delay: 20,
          operation: "DescribeTable",
          maxAttempts: 25,
          acceptors: [
            {
              expected: "ACTIVE",
              matcher: "path",
              state: "success",
              argument: "Table.TableStatus"
            },
            {
              expected: "ResourceNotFoundException",
              matcher: "error",
              state: "retry"
            }
          ]
        },
        TableNotExists: {
          delay: 20,
          operation: "DescribeTable",
          maxAttempts: 25,
          acceptors: [
            {
              expected: "ResourceNotFoundException",
              matcher: "error",
              state: "success"
            }
          ]
        }
      }
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/dynamodb-2012-08-10.min.json
var require_dynamodb_2012_08_10_min = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/dynamodb-2012-08-10.min.json"(exports, module2) {
    module2.exports = {
      version: "2.0",
      metadata: {
        apiVersion: "2012-08-10",
        endpointPrefix: "dynamodb",
        jsonVersion: "1.0",
        protocol: "json",
        serviceAbbreviation: "DynamoDB",
        serviceFullName: "Amazon DynamoDB",
        serviceId: "DynamoDB",
        signatureVersion: "v4",
        targetPrefix: "DynamoDB_20120810",
        uid: "dynamodb-2012-08-10"
      },
      operations: {
        BatchExecuteStatement: {
          input: {
            type: "structure",
            required: [
              "Statements"
            ],
            members: {
              Statements: {
                type: "list",
                member: {
                  type: "structure",
                  required: [
                    "Statement"
                  ],
                  members: {
                    Statement: {},
                    Parameters: {
                      shape: "S5"
                    },
                    ConsistentRead: {
                      type: "boolean"
                    }
                  }
                }
              },
              ReturnConsumedCapacity: {}
            }
          },
          output: {
            type: "structure",
            members: {
              Responses: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    Error: {
                      type: "structure",
                      members: {
                        Code: {},
                        Message: {}
                      }
                    },
                    TableName: {},
                    Item: {
                      shape: "Sr"
                    }
                  }
                }
              },
              ConsumedCapacity: {
                shape: "Ss"
              }
            }
          }
        },
        BatchGetItem: {
          input: {
            type: "structure",
            required: [
              "RequestItems"
            ],
            members: {
              RequestItems: {
                shape: "Sz"
              },
              ReturnConsumedCapacity: {}
            }
          },
          output: {
            type: "structure",
            members: {
              Responses: {
                type: "map",
                key: {},
                value: {
                  shape: "S19"
                }
              },
              UnprocessedKeys: {
                shape: "Sz"
              },
              ConsumedCapacity: {
                shape: "Ss"
              }
            }
          },
          endpointdiscovery: {}
        },
        BatchWriteItem: {
          input: {
            type: "structure",
            required: [
              "RequestItems"
            ],
            members: {
              RequestItems: {
                shape: "S1b"
              },
              ReturnConsumedCapacity: {},
              ReturnItemCollectionMetrics: {}
            }
          },
          output: {
            type: "structure",
            members: {
              UnprocessedItems: {
                shape: "S1b"
              },
              ItemCollectionMetrics: {
                shape: "S1j"
              },
              ConsumedCapacity: {
                shape: "Ss"
              }
            }
          },
          endpointdiscovery: {}
        },
        CreateBackup: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "BackupName"
            ],
            members: {
              TableName: {},
              BackupName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              BackupDetails: {
                shape: "S1s"
              }
            }
          },
          endpointdiscovery: {}
        },
        CreateGlobalTable: {
          input: {
            type: "structure",
            required: [
              "GlobalTableName",
              "ReplicationGroup"
            ],
            members: {
              GlobalTableName: {},
              ReplicationGroup: {
                shape: "S20"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              GlobalTableDescription: {
                shape: "S24"
              }
            }
          },
          endpointdiscovery: {}
        },
        CreateTable: {
          input: {
            type: "structure",
            required: [
              "AttributeDefinitions",
              "TableName",
              "KeySchema"
            ],
            members: {
              AttributeDefinitions: {
                shape: "S2k"
              },
              TableName: {},
              KeySchema: {
                shape: "S2o"
              },
              LocalSecondaryIndexes: {
                shape: "S2r"
              },
              GlobalSecondaryIndexes: {
                shape: "S2x"
              },
              BillingMode: {},
              ProvisionedThroughput: {
                shape: "S2z"
              },
              StreamSpecification: {
                shape: "S31"
              },
              SSESpecification: {
                shape: "S34"
              },
              Tags: {
                shape: "S37"
              },
              TableClass: {}
            }
          },
          output: {
            type: "structure",
            members: {
              TableDescription: {
                shape: "S3c"
              }
            }
          },
          endpointdiscovery: {}
        },
        DeleteBackup: {
          input: {
            type: "structure",
            required: [
              "BackupArn"
            ],
            members: {
              BackupArn: {}
            }
          },
          output: {
            type: "structure",
            members: {
              BackupDescription: {
                shape: "S40"
              }
            }
          },
          endpointdiscovery: {}
        },
        DeleteItem: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "Key"
            ],
            members: {
              TableName: {},
              Key: {
                shape: "S12"
              },
              Expected: {
                shape: "S4d"
              },
              ConditionalOperator: {},
              ReturnValues: {},
              ReturnConsumedCapacity: {},
              ReturnItemCollectionMetrics: {},
              ConditionExpression: {},
              ExpressionAttributeNames: {
                shape: "S15"
              },
              ExpressionAttributeValues: {
                shape: "S4l"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              Attributes: {
                shape: "Sr"
              },
              ConsumedCapacity: {
                shape: "St"
              },
              ItemCollectionMetrics: {
                shape: "S1l"
              }
            }
          },
          endpointdiscovery: {}
        },
        DeleteTable: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              TableName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              TableDescription: {
                shape: "S3c"
              }
            }
          },
          endpointdiscovery: {}
        },
        DescribeBackup: {
          input: {
            type: "structure",
            required: [
              "BackupArn"
            ],
            members: {
              BackupArn: {}
            }
          },
          output: {
            type: "structure",
            members: {
              BackupDescription: {
                shape: "S40"
              }
            }
          },
          endpointdiscovery: {}
        },
        DescribeContinuousBackups: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              TableName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              ContinuousBackupsDescription: {
                shape: "S4u"
              }
            }
          },
          endpointdiscovery: {}
        },
        DescribeContributorInsights: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              TableName: {},
              IndexName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              TableName: {},
              IndexName: {},
              ContributorInsightsRuleList: {
                type: "list",
                member: {}
              },
              ContributorInsightsStatus: {},
              LastUpdateDateTime: {
                type: "timestamp"
              },
              FailureException: {
                type: "structure",
                members: {
                  ExceptionName: {},
                  ExceptionDescription: {}
                }
              }
            }
          }
        },
        DescribeEndpoints: {
          input: {
            type: "structure",
            members: {}
          },
          output: {
            type: "structure",
            required: [
              "Endpoints"
            ],
            members: {
              Endpoints: {
                type: "list",
                member: {
                  type: "structure",
                  required: [
                    "Address",
                    "CachePeriodInMinutes"
                  ],
                  members: {
                    Address: {},
                    CachePeriodInMinutes: {
                      type: "long"
                    }
                  }
                }
              }
            }
          },
          endpointoperation: true
        },
        DescribeExport: {
          input: {
            type: "structure",
            required: [
              "ExportArn"
            ],
            members: {
              ExportArn: {}
            }
          },
          output: {
            type: "structure",
            members: {
              ExportDescription: {
                shape: "S5e"
              }
            }
          }
        },
        DescribeGlobalTable: {
          input: {
            type: "structure",
            required: [
              "GlobalTableName"
            ],
            members: {
              GlobalTableName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              GlobalTableDescription: {
                shape: "S24"
              }
            }
          },
          endpointdiscovery: {}
        },
        DescribeGlobalTableSettings: {
          input: {
            type: "structure",
            required: [
              "GlobalTableName"
            ],
            members: {
              GlobalTableName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              GlobalTableName: {},
              ReplicaSettings: {
                shape: "S5y"
              }
            }
          },
          endpointdiscovery: {}
        },
        DescribeImport: {
          input: {
            type: "structure",
            required: [
              "ImportArn"
            ],
            members: {
              ImportArn: {}
            }
          },
          output: {
            type: "structure",
            required: [
              "ImportTableDescription"
            ],
            members: {
              ImportTableDescription: {
                shape: "S6c"
              }
            }
          }
        },
        DescribeKinesisStreamingDestination: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              TableName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              TableName: {},
              KinesisDataStreamDestinations: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    StreamArn: {},
                    DestinationStatus: {},
                    DestinationStatusDescription: {}
                  }
                }
              }
            }
          },
          endpointdiscovery: {}
        },
        DescribeLimits: {
          input: {
            type: "structure",
            members: {}
          },
          output: {
            type: "structure",
            members: {
              AccountMaxReadCapacityUnits: {
                type: "long"
              },
              AccountMaxWriteCapacityUnits: {
                type: "long"
              },
              TableMaxReadCapacityUnits: {
                type: "long"
              },
              TableMaxWriteCapacityUnits: {
                type: "long"
              }
            }
          },
          endpointdiscovery: {}
        },
        DescribeTable: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              TableName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              Table: {
                shape: "S3c"
              }
            }
          },
          endpointdiscovery: {}
        },
        DescribeTableReplicaAutoScaling: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              TableName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              TableAutoScalingDescription: {
                shape: "S74"
              }
            }
          }
        },
        DescribeTimeToLive: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              TableName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              TimeToLiveDescription: {
                shape: "S49"
              }
            }
          },
          endpointdiscovery: {}
        },
        DisableKinesisStreamingDestination: {
          input: {
            shape: "S7b"
          },
          output: {
            shape: "S7c"
          },
          endpointdiscovery: {}
        },
        EnableKinesisStreamingDestination: {
          input: {
            shape: "S7b"
          },
          output: {
            shape: "S7c"
          },
          endpointdiscovery: {}
        },
        ExecuteStatement: {
          input: {
            type: "structure",
            required: [
              "Statement"
            ],
            members: {
              Statement: {},
              Parameters: {
                shape: "S5"
              },
              ConsistentRead: {
                type: "boolean"
              },
              NextToken: {},
              ReturnConsumedCapacity: {},
              Limit: {
                type: "integer"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              Items: {
                shape: "S19"
              },
              NextToken: {},
              ConsumedCapacity: {
                shape: "St"
              },
              LastEvaluatedKey: {
                shape: "S12"
              }
            }
          }
        },
        ExecuteTransaction: {
          input: {
            type: "structure",
            required: [
              "TransactStatements"
            ],
            members: {
              TransactStatements: {
                type: "list",
                member: {
                  type: "structure",
                  required: [
                    "Statement"
                  ],
                  members: {
                    Statement: {},
                    Parameters: {
                      shape: "S5"
                    }
                  }
                }
              },
              ClientRequestToken: {
                idempotencyToken: true
              },
              ReturnConsumedCapacity: {}
            }
          },
          output: {
            type: "structure",
            members: {
              Responses: {
                shape: "S7m"
              },
              ConsumedCapacity: {
                shape: "Ss"
              }
            }
          }
        },
        ExportTableToPointInTime: {
          input: {
            type: "structure",
            required: [
              "TableArn",
              "S3Bucket"
            ],
            members: {
              TableArn: {},
              ExportTime: {
                type: "timestamp"
              },
              ClientToken: {
                idempotencyToken: true
              },
              S3Bucket: {},
              S3BucketOwner: {},
              S3Prefix: {},
              S3SseAlgorithm: {},
              S3SseKmsKeyId: {},
              ExportFormat: {}
            }
          },
          output: {
            type: "structure",
            members: {
              ExportDescription: {
                shape: "S5e"
              }
            }
          }
        },
        GetItem: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "Key"
            ],
            members: {
              TableName: {},
              Key: {
                shape: "S12"
              },
              AttributesToGet: {
                shape: "S13"
              },
              ConsistentRead: {
                type: "boolean"
              },
              ReturnConsumedCapacity: {},
              ProjectionExpression: {},
              ExpressionAttributeNames: {
                shape: "S15"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              Item: {
                shape: "Sr"
              },
              ConsumedCapacity: {
                shape: "St"
              }
            }
          },
          endpointdiscovery: {}
        },
        ImportTable: {
          input: {
            type: "structure",
            required: [
              "S3BucketSource",
              "InputFormat",
              "TableCreationParameters"
            ],
            members: {
              ClientToken: {
                idempotencyToken: true
              },
              S3BucketSource: {
                shape: "S6e"
              },
              InputFormat: {},
              InputFormatOptions: {
                shape: "S6i"
              },
              InputCompressionType: {},
              TableCreationParameters: {
                shape: "S6o"
              }
            }
          },
          output: {
            type: "structure",
            required: [
              "ImportTableDescription"
            ],
            members: {
              ImportTableDescription: {
                shape: "S6c"
              }
            }
          }
        },
        ListBackups: {
          input: {
            type: "structure",
            members: {
              TableName: {},
              Limit: {
                type: "integer"
              },
              TimeRangeLowerBound: {
                type: "timestamp"
              },
              TimeRangeUpperBound: {
                type: "timestamp"
              },
              ExclusiveStartBackupArn: {},
              BackupType: {}
            }
          },
          output: {
            type: "structure",
            members: {
              BackupSummaries: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    TableName: {},
                    TableId: {},
                    TableArn: {},
                    BackupArn: {},
                    BackupName: {},
                    BackupCreationDateTime: {
                      type: "timestamp"
                    },
                    BackupExpiryDateTime: {
                      type: "timestamp"
                    },
                    BackupStatus: {},
                    BackupType: {},
                    BackupSizeBytes: {
                      type: "long"
                    }
                  }
                }
              },
              LastEvaluatedBackupArn: {}
            }
          },
          endpointdiscovery: {}
        },
        ListContributorInsights: {
          input: {
            type: "structure",
            members: {
              TableName: {},
              NextToken: {},
              MaxResults: {
                type: "integer"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              ContributorInsightsSummaries: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    TableName: {},
                    IndexName: {},
                    ContributorInsightsStatus: {}
                  }
                }
              },
              NextToken: {}
            }
          }
        },
        ListExports: {
          input: {
            type: "structure",
            members: {
              TableArn: {},
              MaxResults: {
                type: "integer"
              },
              NextToken: {}
            }
          },
          output: {
            type: "structure",
            members: {
              ExportSummaries: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    ExportArn: {},
                    ExportStatus: {}
                  }
                }
              },
              NextToken: {}
            }
          }
        },
        ListGlobalTables: {
          input: {
            type: "structure",
            members: {
              ExclusiveStartGlobalTableName: {},
              Limit: {
                type: "integer"
              },
              RegionName: {}
            }
          },
          output: {
            type: "structure",
            members: {
              GlobalTables: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    GlobalTableName: {},
                    ReplicationGroup: {
                      shape: "S20"
                    }
                  }
                }
              },
              LastEvaluatedGlobalTableName: {}
            }
          },
          endpointdiscovery: {}
        },
        ListImports: {
          input: {
            type: "structure",
            members: {
              TableArn: {},
              PageSize: {
                type: "integer"
              },
              NextToken: {}
            }
          },
          output: {
            type: "structure",
            members: {
              ImportSummaryList: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    ImportArn: {},
                    ImportStatus: {},
                    TableArn: {},
                    S3BucketSource: {
                      shape: "S6e"
                    },
                    CloudWatchLogGroupArn: {},
                    InputFormat: {},
                    StartTime: {
                      type: "timestamp"
                    },
                    EndTime: {
                      type: "timestamp"
                    }
                  }
                }
              },
              NextToken: {}
            }
          }
        },
        ListTables: {
          input: {
            type: "structure",
            members: {
              ExclusiveStartTableName: {},
              Limit: {
                type: "integer"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              TableNames: {
                type: "list",
                member: {}
              },
              LastEvaluatedTableName: {}
            }
          },
          endpointdiscovery: {}
        },
        ListTagsOfResource: {
          input: {
            type: "structure",
            required: [
              "ResourceArn"
            ],
            members: {
              ResourceArn: {},
              NextToken: {}
            }
          },
          output: {
            type: "structure",
            members: {
              Tags: {
                shape: "S37"
              },
              NextToken: {}
            }
          },
          endpointdiscovery: {}
        },
        PutItem: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "Item"
            ],
            members: {
              TableName: {},
              Item: {
                shape: "S1f"
              },
              Expected: {
                shape: "S4d"
              },
              ReturnValues: {},
              ReturnConsumedCapacity: {},
              ReturnItemCollectionMetrics: {},
              ConditionalOperator: {},
              ConditionExpression: {},
              ExpressionAttributeNames: {
                shape: "S15"
              },
              ExpressionAttributeValues: {
                shape: "S4l"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              Attributes: {
                shape: "Sr"
              },
              ConsumedCapacity: {
                shape: "St"
              },
              ItemCollectionMetrics: {
                shape: "S1l"
              }
            }
          },
          endpointdiscovery: {}
        },
        Query: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              TableName: {},
              IndexName: {},
              Select: {},
              AttributesToGet: {
                shape: "S13"
              },
              Limit: {
                type: "integer"
              },
              ConsistentRead: {
                type: "boolean"
              },
              KeyConditions: {
                type: "map",
                key: {},
                value: {
                  shape: "S90"
                }
              },
              QueryFilter: {
                shape: "S91"
              },
              ConditionalOperator: {},
              ScanIndexForward: {
                type: "boolean"
              },
              ExclusiveStartKey: {
                shape: "S12"
              },
              ReturnConsumedCapacity: {},
              ProjectionExpression: {},
              FilterExpression: {},
              KeyConditionExpression: {},
              ExpressionAttributeNames: {
                shape: "S15"
              },
              ExpressionAttributeValues: {
                shape: "S4l"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              Items: {
                shape: "S19"
              },
              Count: {
                type: "integer"
              },
              ScannedCount: {
                type: "integer"
              },
              LastEvaluatedKey: {
                shape: "S12"
              },
              ConsumedCapacity: {
                shape: "St"
              }
            }
          },
          endpointdiscovery: {}
        },
        RestoreTableFromBackup: {
          input: {
            type: "structure",
            required: [
              "TargetTableName",
              "BackupArn"
            ],
            members: {
              TargetTableName: {},
              BackupArn: {},
              BillingModeOverride: {},
              GlobalSecondaryIndexOverride: {
                shape: "S2x"
              },
              LocalSecondaryIndexOverride: {
                shape: "S2r"
              },
              ProvisionedThroughputOverride: {
                shape: "S2z"
              },
              SSESpecificationOverride: {
                shape: "S34"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              TableDescription: {
                shape: "S3c"
              }
            }
          },
          endpointdiscovery: {}
        },
        RestoreTableToPointInTime: {
          input: {
            type: "structure",
            required: [
              "TargetTableName"
            ],
            members: {
              SourceTableArn: {},
              SourceTableName: {},
              TargetTableName: {},
              UseLatestRestorableTime: {
                type: "boolean"
              },
              RestoreDateTime: {
                type: "timestamp"
              },
              BillingModeOverride: {},
              GlobalSecondaryIndexOverride: {
                shape: "S2x"
              },
              LocalSecondaryIndexOverride: {
                shape: "S2r"
              },
              ProvisionedThroughputOverride: {
                shape: "S2z"
              },
              SSESpecificationOverride: {
                shape: "S34"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              TableDescription: {
                shape: "S3c"
              }
            }
          },
          endpointdiscovery: {}
        },
        Scan: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              TableName: {},
              IndexName: {},
              AttributesToGet: {
                shape: "S13"
              },
              Limit: {
                type: "integer"
              },
              Select: {},
              ScanFilter: {
                shape: "S91"
              },
              ConditionalOperator: {},
              ExclusiveStartKey: {
                shape: "S12"
              },
              ReturnConsumedCapacity: {},
              TotalSegments: {
                type: "integer"
              },
              Segment: {
                type: "integer"
              },
              ProjectionExpression: {},
              FilterExpression: {},
              ExpressionAttributeNames: {
                shape: "S15"
              },
              ExpressionAttributeValues: {
                shape: "S4l"
              },
              ConsistentRead: {
                type: "boolean"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              Items: {
                shape: "S19"
              },
              Count: {
                type: "integer"
              },
              ScannedCount: {
                type: "integer"
              },
              LastEvaluatedKey: {
                shape: "S12"
              },
              ConsumedCapacity: {
                shape: "St"
              }
            }
          },
          endpointdiscovery: {}
        },
        TagResource: {
          input: {
            type: "structure",
            required: [
              "ResourceArn",
              "Tags"
            ],
            members: {
              ResourceArn: {},
              Tags: {
                shape: "S37"
              }
            }
          },
          endpointdiscovery: {}
        },
        TransactGetItems: {
          input: {
            type: "structure",
            required: [
              "TransactItems"
            ],
            members: {
              TransactItems: {
                type: "list",
                member: {
                  type: "structure",
                  required: [
                    "Get"
                  ],
                  members: {
                    Get: {
                      type: "structure",
                      required: [
                        "Key",
                        "TableName"
                      ],
                      members: {
                        Key: {
                          shape: "S12"
                        },
                        TableName: {},
                        ProjectionExpression: {},
                        ExpressionAttributeNames: {
                          shape: "S15"
                        }
                      }
                    }
                  }
                }
              },
              ReturnConsumedCapacity: {}
            }
          },
          output: {
            type: "structure",
            members: {
              ConsumedCapacity: {
                shape: "Ss"
              },
              Responses: {
                shape: "S7m"
              }
            }
          },
          endpointdiscovery: {}
        },
        TransactWriteItems: {
          input: {
            type: "structure",
            required: [
              "TransactItems"
            ],
            members: {
              TransactItems: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    ConditionCheck: {
                      type: "structure",
                      required: [
                        "Key",
                        "TableName",
                        "ConditionExpression"
                      ],
                      members: {
                        Key: {
                          shape: "S12"
                        },
                        TableName: {},
                        ConditionExpression: {},
                        ExpressionAttributeNames: {
                          shape: "S15"
                        },
                        ExpressionAttributeValues: {
                          shape: "S4l"
                        },
                        ReturnValuesOnConditionCheckFailure: {}
                      }
                    },
                    Put: {
                      type: "structure",
                      required: [
                        "Item",
                        "TableName"
                      ],
                      members: {
                        Item: {
                          shape: "S1f"
                        },
                        TableName: {},
                        ConditionExpression: {},
                        ExpressionAttributeNames: {
                          shape: "S15"
                        },
                        ExpressionAttributeValues: {
                          shape: "S4l"
                        },
                        ReturnValuesOnConditionCheckFailure: {}
                      }
                    },
                    Delete: {
                      type: "structure",
                      required: [
                        "Key",
                        "TableName"
                      ],
                      members: {
                        Key: {
                          shape: "S12"
                        },
                        TableName: {},
                        ConditionExpression: {},
                        ExpressionAttributeNames: {
                          shape: "S15"
                        },
                        ExpressionAttributeValues: {
                          shape: "S4l"
                        },
                        ReturnValuesOnConditionCheckFailure: {}
                      }
                    },
                    Update: {
                      type: "structure",
                      required: [
                        "Key",
                        "UpdateExpression",
                        "TableName"
                      ],
                      members: {
                        Key: {
                          shape: "S12"
                        },
                        UpdateExpression: {},
                        TableName: {},
                        ConditionExpression: {},
                        ExpressionAttributeNames: {
                          shape: "S15"
                        },
                        ExpressionAttributeValues: {
                          shape: "S4l"
                        },
                        ReturnValuesOnConditionCheckFailure: {}
                      }
                    }
                  }
                }
              },
              ReturnConsumedCapacity: {},
              ReturnItemCollectionMetrics: {},
              ClientRequestToken: {
                idempotencyToken: true
              }
            }
          },
          output: {
            type: "structure",
            members: {
              ConsumedCapacity: {
                shape: "Ss"
              },
              ItemCollectionMetrics: {
                shape: "S1j"
              }
            }
          },
          endpointdiscovery: {}
        },
        UntagResource: {
          input: {
            type: "structure",
            required: [
              "ResourceArn",
              "TagKeys"
            ],
            members: {
              ResourceArn: {},
              TagKeys: {
                type: "list",
                member: {}
              }
            }
          },
          endpointdiscovery: {}
        },
        UpdateContinuousBackups: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "PointInTimeRecoverySpecification"
            ],
            members: {
              TableName: {},
              PointInTimeRecoverySpecification: {
                type: "structure",
                required: [
                  "PointInTimeRecoveryEnabled"
                ],
                members: {
                  PointInTimeRecoveryEnabled: {
                    type: "boolean"
                  }
                }
              }
            }
          },
          output: {
            type: "structure",
            members: {
              ContinuousBackupsDescription: {
                shape: "S4u"
              }
            }
          },
          endpointdiscovery: {}
        },
        UpdateContributorInsights: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "ContributorInsightsAction"
            ],
            members: {
              TableName: {},
              IndexName: {},
              ContributorInsightsAction: {}
            }
          },
          output: {
            type: "structure",
            members: {
              TableName: {},
              IndexName: {},
              ContributorInsightsStatus: {}
            }
          }
        },
        UpdateGlobalTable: {
          input: {
            type: "structure",
            required: [
              "GlobalTableName",
              "ReplicaUpdates"
            ],
            members: {
              GlobalTableName: {},
              ReplicaUpdates: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    Create: {
                      type: "structure",
                      required: [
                        "RegionName"
                      ],
                      members: {
                        RegionName: {}
                      }
                    },
                    Delete: {
                      type: "structure",
                      required: [
                        "RegionName"
                      ],
                      members: {
                        RegionName: {}
                      }
                    }
                  }
                }
              }
            }
          },
          output: {
            type: "structure",
            members: {
              GlobalTableDescription: {
                shape: "S24"
              }
            }
          },
          endpointdiscovery: {}
        },
        UpdateGlobalTableSettings: {
          input: {
            type: "structure",
            required: [
              "GlobalTableName"
            ],
            members: {
              GlobalTableName: {},
              GlobalTableBillingMode: {},
              GlobalTableProvisionedWriteCapacityUnits: {
                type: "long"
              },
              GlobalTableProvisionedWriteCapacityAutoScalingSettingsUpdate: {
                shape: "Sa8"
              },
              GlobalTableGlobalSecondaryIndexSettingsUpdate: {
                type: "list",
                member: {
                  type: "structure",
                  required: [
                    "IndexName"
                  ],
                  members: {
                    IndexName: {},
                    ProvisionedWriteCapacityUnits: {
                      type: "long"
                    },
                    ProvisionedWriteCapacityAutoScalingSettingsUpdate: {
                      shape: "Sa8"
                    }
                  }
                }
              },
              ReplicaSettingsUpdate: {
                type: "list",
                member: {
                  type: "structure",
                  required: [
                    "RegionName"
                  ],
                  members: {
                    RegionName: {},
                    ReplicaProvisionedReadCapacityUnits: {
                      type: "long"
                    },
                    ReplicaProvisionedReadCapacityAutoScalingSettingsUpdate: {
                      shape: "Sa8"
                    },
                    ReplicaGlobalSecondaryIndexSettingsUpdate: {
                      type: "list",
                      member: {
                        type: "structure",
                        required: [
                          "IndexName"
                        ],
                        members: {
                          IndexName: {},
                          ProvisionedReadCapacityUnits: {
                            type: "long"
                          },
                          ProvisionedReadCapacityAutoScalingSettingsUpdate: {
                            shape: "Sa8"
                          }
                        }
                      }
                    },
                    ReplicaTableClass: {}
                  }
                }
              }
            }
          },
          output: {
            type: "structure",
            members: {
              GlobalTableName: {},
              ReplicaSettings: {
                shape: "S5y"
              }
            }
          },
          endpointdiscovery: {}
        },
        UpdateItem: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "Key"
            ],
            members: {
              TableName: {},
              Key: {
                shape: "S12"
              },
              AttributeUpdates: {
                type: "map",
                key: {},
                value: {
                  type: "structure",
                  members: {
                    Value: {
                      shape: "S6"
                    },
                    Action: {}
                  }
                }
              },
              Expected: {
                shape: "S4d"
              },
              ConditionalOperator: {},
              ReturnValues: {},
              ReturnConsumedCapacity: {},
              ReturnItemCollectionMetrics: {},
              UpdateExpression: {},
              ConditionExpression: {},
              ExpressionAttributeNames: {
                shape: "S15"
              },
              ExpressionAttributeValues: {
                shape: "S4l"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              Attributes: {
                shape: "Sr"
              },
              ConsumedCapacity: {
                shape: "St"
              },
              ItemCollectionMetrics: {
                shape: "S1l"
              }
            }
          },
          endpointdiscovery: {}
        },
        UpdateTable: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              AttributeDefinitions: {
                shape: "S2k"
              },
              TableName: {},
              BillingMode: {},
              ProvisionedThroughput: {
                shape: "S2z"
              },
              GlobalSecondaryIndexUpdates: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    Update: {
                      type: "structure",
                      required: [
                        "IndexName",
                        "ProvisionedThroughput"
                      ],
                      members: {
                        IndexName: {},
                        ProvisionedThroughput: {
                          shape: "S2z"
                        }
                      }
                    },
                    Create: {
                      type: "structure",
                      required: [
                        "IndexName",
                        "KeySchema",
                        "Projection"
                      ],
                      members: {
                        IndexName: {},
                        KeySchema: {
                          shape: "S2o"
                        },
                        Projection: {
                          shape: "S2t"
                        },
                        ProvisionedThroughput: {
                          shape: "S2z"
                        }
                      }
                    },
                    Delete: {
                      type: "structure",
                      required: [
                        "IndexName"
                      ],
                      members: {
                        IndexName: {}
                      }
                    }
                  }
                }
              },
              StreamSpecification: {
                shape: "S31"
              },
              SSESpecification: {
                shape: "S34"
              },
              ReplicaUpdates: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    Create: {
                      type: "structure",
                      required: [
                        "RegionName"
                      ],
                      members: {
                        RegionName: {},
                        KMSMasterKeyId: {},
                        ProvisionedThroughputOverride: {
                          shape: "S2b"
                        },
                        GlobalSecondaryIndexes: {
                          shape: "Sax"
                        },
                        TableClassOverride: {}
                      }
                    },
                    Update: {
                      type: "structure",
                      required: [
                        "RegionName"
                      ],
                      members: {
                        RegionName: {},
                        KMSMasterKeyId: {},
                        ProvisionedThroughputOverride: {
                          shape: "S2b"
                        },
                        GlobalSecondaryIndexes: {
                          shape: "Sax"
                        },
                        TableClassOverride: {}
                      }
                    },
                    Delete: {
                      type: "structure",
                      required: [
                        "RegionName"
                      ],
                      members: {
                        RegionName: {}
                      }
                    }
                  }
                }
              },
              TableClass: {}
            }
          },
          output: {
            type: "structure",
            members: {
              TableDescription: {
                shape: "S3c"
              }
            }
          },
          endpointdiscovery: {}
        },
        UpdateTableReplicaAutoScaling: {
          input: {
            type: "structure",
            required: [
              "TableName"
            ],
            members: {
              GlobalSecondaryIndexUpdates: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    IndexName: {},
                    ProvisionedWriteCapacityAutoScalingUpdate: {
                      shape: "Sa8"
                    }
                  }
                }
              },
              TableName: {},
              ProvisionedWriteCapacityAutoScalingUpdate: {
                shape: "Sa8"
              },
              ReplicaUpdates: {
                type: "list",
                member: {
                  type: "structure",
                  required: [
                    "RegionName"
                  ],
                  members: {
                    RegionName: {},
                    ReplicaGlobalSecondaryIndexUpdates: {
                      type: "list",
                      member: {
                        type: "structure",
                        members: {
                          IndexName: {},
                          ProvisionedReadCapacityAutoScalingUpdate: {
                            shape: "Sa8"
                          }
                        }
                      }
                    },
                    ReplicaProvisionedReadCapacityAutoScalingUpdate: {
                      shape: "Sa8"
                    }
                  }
                }
              }
            }
          },
          output: {
            type: "structure",
            members: {
              TableAutoScalingDescription: {
                shape: "S74"
              }
            }
          }
        },
        UpdateTimeToLive: {
          input: {
            type: "structure",
            required: [
              "TableName",
              "TimeToLiveSpecification"
            ],
            members: {
              TableName: {},
              TimeToLiveSpecification: {
                shape: "Sbb"
              }
            }
          },
          output: {
            type: "structure",
            members: {
              TimeToLiveSpecification: {
                shape: "Sbb"
              }
            }
          },
          endpointdiscovery: {}
        }
      },
      shapes: {
        S5: {
          type: "list",
          member: {
            shape: "S6"
          }
        },
        S6: {
          type: "structure",
          members: {
            S: {},
            N: {},
            B: {
              type: "blob"
            },
            SS: {
              type: "list",
              member: {}
            },
            NS: {
              type: "list",
              member: {}
            },
            BS: {
              type: "list",
              member: {
                type: "blob"
              }
            },
            M: {
              type: "map",
              key: {},
              value: {
                shape: "S6"
              }
            },
            L: {
              type: "list",
              member: {
                shape: "S6"
              }
            },
            NULL: {
              type: "boolean"
            },
            BOOL: {
              type: "boolean"
            }
          }
        },
        Sr: {
          type: "map",
          key: {},
          value: {
            shape: "S6"
          }
        },
        Ss: {
          type: "list",
          member: {
            shape: "St"
          }
        },
        St: {
          type: "structure",
          members: {
            TableName: {},
            CapacityUnits: {
              type: "double"
            },
            ReadCapacityUnits: {
              type: "double"
            },
            WriteCapacityUnits: {
              type: "double"
            },
            Table: {
              shape: "Sv"
            },
            LocalSecondaryIndexes: {
              shape: "Sw"
            },
            GlobalSecondaryIndexes: {
              shape: "Sw"
            }
          }
        },
        Sv: {
          type: "structure",
          members: {
            ReadCapacityUnits: {
              type: "double"
            },
            WriteCapacityUnits: {
              type: "double"
            },
            CapacityUnits: {
              type: "double"
            }
          }
        },
        Sw: {
          type: "map",
          key: {},
          value: {
            shape: "Sv"
          }
        },
        Sz: {
          type: "map",
          key: {},
          value: {
            type: "structure",
            required: [
              "Keys"
            ],
            members: {
              Keys: {
                type: "list",
                member: {
                  shape: "S12"
                }
              },
              AttributesToGet: {
                shape: "S13"
              },
              ConsistentRead: {
                type: "boolean"
              },
              ProjectionExpression: {},
              ExpressionAttributeNames: {
                shape: "S15"
              }
            }
          }
        },
        S12: {
          type: "map",
          key: {},
          value: {
            shape: "S6"
          }
        },
        S13: {
          type: "list",
          member: {}
        },
        S15: {
          type: "map",
          key: {},
          value: {}
        },
        S19: {
          type: "list",
          member: {
            shape: "Sr"
          }
        },
        S1b: {
          type: "map",
          key: {},
          value: {
            type: "list",
            member: {
              type: "structure",
              members: {
                PutRequest: {
                  type: "structure",
                  required: [
                    "Item"
                  ],
                  members: {
                    Item: {
                      shape: "S1f"
                    }
                  }
                },
                DeleteRequest: {
                  type: "structure",
                  required: [
                    "Key"
                  ],
                  members: {
                    Key: {
                      shape: "S12"
                    }
                  }
                }
              }
            }
          }
        },
        S1f: {
          type: "map",
          key: {},
          value: {
            shape: "S6"
          }
        },
        S1j: {
          type: "map",
          key: {},
          value: {
            type: "list",
            member: {
              shape: "S1l"
            }
          }
        },
        S1l: {
          type: "structure",
          members: {
            ItemCollectionKey: {
              type: "map",
              key: {},
              value: {
                shape: "S6"
              }
            },
            SizeEstimateRangeGB: {
              type: "list",
              member: {
                type: "double"
              }
            }
          }
        },
        S1s: {
          type: "structure",
          required: [
            "BackupArn",
            "BackupName",
            "BackupStatus",
            "BackupType",
            "BackupCreationDateTime"
          ],
          members: {
            BackupArn: {},
            BackupName: {},
            BackupSizeBytes: {
              type: "long"
            },
            BackupStatus: {},
            BackupType: {},
            BackupCreationDateTime: {
              type: "timestamp"
            },
            BackupExpiryDateTime: {
              type: "timestamp"
            }
          }
        },
        S20: {
          type: "list",
          member: {
            type: "structure",
            members: {
              RegionName: {}
            }
          }
        },
        S24: {
          type: "structure",
          members: {
            ReplicationGroup: {
              shape: "S25"
            },
            GlobalTableArn: {},
            CreationDateTime: {
              type: "timestamp"
            },
            GlobalTableStatus: {},
            GlobalTableName: {}
          }
        },
        S25: {
          type: "list",
          member: {
            type: "structure",
            members: {
              RegionName: {},
              ReplicaStatus: {},
              ReplicaStatusDescription: {},
              ReplicaStatusPercentProgress: {},
              KMSMasterKeyId: {},
              ProvisionedThroughputOverride: {
                shape: "S2b"
              },
              GlobalSecondaryIndexes: {
                type: "list",
                member: {
                  type: "structure",
                  members: {
                    IndexName: {},
                    ProvisionedThroughputOverride: {
                      shape: "S2b"
                    }
                  }
                }
              },
              ReplicaInaccessibleDateTime: {
                type: "timestamp"
              },
              ReplicaTableClassSummary: {
                shape: "S2f"
              }
            }
          }
        },
        S2b: {
          type: "structure",
          members: {
            ReadCapacityUnits: {
              type: "long"
            }
          }
        },
        S2f: {
          type: "structure",
          members: {
            TableClass: {},
            LastUpdateDateTime: {
              type: "timestamp"
            }
          }
        },
        S2k: {
          type: "list",
          member: {
            type: "structure",
            required: [
              "AttributeName",
              "AttributeType"
            ],
            members: {
              AttributeName: {},
              AttributeType: {}
            }
          }
        },
        S2o: {
          type: "list",
          member: {
            type: "structure",
            required: [
              "AttributeName",
              "KeyType"
            ],
            members: {
              AttributeName: {},
              KeyType: {}
            }
          }
        },
        S2r: {
          type: "list",
          member: {
            type: "structure",
            required: [
              "IndexName",
              "KeySchema",
              "Projection"
            ],
            members: {
              IndexName: {},
              KeySchema: {
                shape: "S2o"
              },
              Projection: {
                shape: "S2t"
              }
            }
          }
        },
        S2t: {
          type: "structure",
          members: {
            ProjectionType: {},
            NonKeyAttributes: {
              type: "list",
              member: {}
            }
          }
        },
        S2x: {
          type: "list",
          member: {
            type: "structure",
            required: [
              "IndexName",
              "KeySchema",
              "Projection"
            ],
            members: {
              IndexName: {},
              KeySchema: {
                shape: "S2o"
              },
              Projection: {
                shape: "S2t"
              },
              ProvisionedThroughput: {
                shape: "S2z"
              }
            }
          }
        },
        S2z: {
          type: "structure",
          required: [
            "ReadCapacityUnits",
            "WriteCapacityUnits"
          ],
          members: {
            ReadCapacityUnits: {
              type: "long"
            },
            WriteCapacityUnits: {
              type: "long"
            }
          }
        },
        S31: {
          type: "structure",
          required: [
            "StreamEnabled"
          ],
          members: {
            StreamEnabled: {
              type: "boolean"
            },
            StreamViewType: {}
          }
        },
        S34: {
          type: "structure",
          members: {
            Enabled: {
              type: "boolean"
            },
            SSEType: {},
            KMSMasterKeyId: {}
          }
        },
        S37: {
          type: "list",
          member: {
            type: "structure",
            required: [
              "Key",
              "Value"
            ],
            members: {
              Key: {},
              Value: {}
            }
          }
        },
        S3c: {
          type: "structure",
          members: {
            AttributeDefinitions: {
              shape: "S2k"
            },
            TableName: {},
            KeySchema: {
              shape: "S2o"
            },
            TableStatus: {},
            CreationDateTime: {
              type: "timestamp"
            },
            ProvisionedThroughput: {
              shape: "S3e"
            },
            TableSizeBytes: {
              type: "long"
            },
            ItemCount: {
              type: "long"
            },
            TableArn: {},
            TableId: {},
            BillingModeSummary: {
              shape: "S3i"
            },
            LocalSecondaryIndexes: {
              type: "list",
              member: {
                type: "structure",
                members: {
                  IndexName: {},
                  KeySchema: {
                    shape: "S2o"
                  },
                  Projection: {
                    shape: "S2t"
                  },
                  IndexSizeBytes: {
                    type: "long"
                  },
                  ItemCount: {
                    type: "long"
                  },
                  IndexArn: {}
                }
              }
            },
            GlobalSecondaryIndexes: {
              type: "list",
              member: {
                type: "structure",
                members: {
                  IndexName: {},
                  KeySchema: {
                    shape: "S2o"
                  },
                  Projection: {
                    shape: "S2t"
                  },
                  IndexStatus: {},
                  Backfilling: {
                    type: "boolean"
                  },
                  ProvisionedThroughput: {
                    shape: "S3e"
                  },
                  IndexSizeBytes: {
                    type: "long"
                  },
                  ItemCount: {
                    type: "long"
                  },
                  IndexArn: {}
                }
              }
            },
            StreamSpecification: {
              shape: "S31"
            },
            LatestStreamLabel: {},
            LatestStreamArn: {},
            GlobalTableVersion: {},
            Replicas: {
              shape: "S25"
            },
            RestoreSummary: {
              type: "structure",
              required: [
                "RestoreDateTime",
                "RestoreInProgress"
              ],
              members: {
                SourceBackupArn: {},
                SourceTableArn: {},
                RestoreDateTime: {
                  type: "timestamp"
                },
                RestoreInProgress: {
                  type: "boolean"
                }
              }
            },
            SSEDescription: {
              shape: "S3t"
            },
            ArchivalSummary: {
              type: "structure",
              members: {
                ArchivalDateTime: {
                  type: "timestamp"
                },
                ArchivalReason: {},
                ArchivalBackupArn: {}
              }
            },
            TableClassSummary: {
              shape: "S2f"
            }
          }
        },
        S3e: {
          type: "structure",
          members: {
            LastIncreaseDateTime: {
              type: "timestamp"
            },
            LastDecreaseDateTime: {
              type: "timestamp"
            },
            NumberOfDecreasesToday: {
              type: "long"
            },
            ReadCapacityUnits: {
              type: "long"
            },
            WriteCapacityUnits: {
              type: "long"
            }
          }
        },
        S3i: {
          type: "structure",
          members: {
            BillingMode: {},
            LastUpdateToPayPerRequestDateTime: {
              type: "timestamp"
            }
          }
        },
        S3t: {
          type: "structure",
          members: {
            Status: {},
            SSEType: {},
            KMSMasterKeyArn: {},
            InaccessibleEncryptionDateTime: {
              type: "timestamp"
            }
          }
        },
        S40: {
          type: "structure",
          members: {
            BackupDetails: {
              shape: "S1s"
            },
            SourceTableDetails: {
              type: "structure",
              required: [
                "TableName",
                "TableId",
                "KeySchema",
                "TableCreationDateTime",
                "ProvisionedThroughput"
              ],
              members: {
                TableName: {},
                TableId: {},
                TableArn: {},
                TableSizeBytes: {
                  type: "long"
                },
                KeySchema: {
                  shape: "S2o"
                },
                TableCreationDateTime: {
                  type: "timestamp"
                },
                ProvisionedThroughput: {
                  shape: "S2z"
                },
                ItemCount: {
                  type: "long"
                },
                BillingMode: {}
              }
            },
            SourceTableFeatureDetails: {
              type: "structure",
              members: {
                LocalSecondaryIndexes: {
                  type: "list",
                  member: {
                    type: "structure",
                    members: {
                      IndexName: {},
                      KeySchema: {
                        shape: "S2o"
                      },
                      Projection: {
                        shape: "S2t"
                      }
                    }
                  }
                },
                GlobalSecondaryIndexes: {
                  type: "list",
                  member: {
                    type: "structure",
                    members: {
                      IndexName: {},
                      KeySchema: {
                        shape: "S2o"
                      },
                      Projection: {
                        shape: "S2t"
                      },
                      ProvisionedThroughput: {
                        shape: "S2z"
                      }
                    }
                  }
                },
                StreamDescription: {
                  shape: "S31"
                },
                TimeToLiveDescription: {
                  shape: "S49"
                },
                SSEDescription: {
                  shape: "S3t"
                }
              }
            }
          }
        },
        S49: {
          type: "structure",
          members: {
            TimeToLiveStatus: {},
            AttributeName: {}
          }
        },
        S4d: {
          type: "map",
          key: {},
          value: {
            type: "structure",
            members: {
              Value: {
                shape: "S6"
              },
              Exists: {
                type: "boolean"
              },
              ComparisonOperator: {},
              AttributeValueList: {
                shape: "S4h"
              }
            }
          }
        },
        S4h: {
          type: "list",
          member: {
            shape: "S6"
          }
        },
        S4l: {
          type: "map",
          key: {},
          value: {
            shape: "S6"
          }
        },
        S4u: {
          type: "structure",
          required: [
            "ContinuousBackupsStatus"
          ],
          members: {
            ContinuousBackupsStatus: {},
            PointInTimeRecoveryDescription: {
              type: "structure",
              members: {
                PointInTimeRecoveryStatus: {},
                EarliestRestorableDateTime: {
                  type: "timestamp"
                },
                LatestRestorableDateTime: {
                  type: "timestamp"
                }
              }
            }
          }
        },
        S5e: {
          type: "structure",
          members: {
            ExportArn: {},
            ExportStatus: {},
            StartTime: {
              type: "timestamp"
            },
            EndTime: {
              type: "timestamp"
            },
            ExportManifest: {},
            TableArn: {},
            TableId: {},
            ExportTime: {
              type: "timestamp"
            },
            ClientToken: {},
            S3Bucket: {},
            S3BucketOwner: {},
            S3Prefix: {},
            S3SseAlgorithm: {},
            S3SseKmsKeyId: {},
            FailureCode: {},
            FailureMessage: {},
            ExportFormat: {},
            BilledSizeBytes: {
              type: "long"
            },
            ItemCount: {
              type: "long"
            }
          }
        },
        S5y: {
          type: "list",
          member: {
            type: "structure",
            required: [
              "RegionName"
            ],
            members: {
              RegionName: {},
              ReplicaStatus: {},
              ReplicaBillingModeSummary: {
                shape: "S3i"
              },
              ReplicaProvisionedReadCapacityUnits: {
                type: "long"
              },
              ReplicaProvisionedReadCapacityAutoScalingSettings: {
                shape: "S60"
              },
              ReplicaProvisionedWriteCapacityUnits: {
                type: "long"
              },
              ReplicaProvisionedWriteCapacityAutoScalingSettings: {
                shape: "S60"
              },
              ReplicaGlobalSecondaryIndexSettings: {
                type: "list",
                member: {
                  type: "structure",
                  required: [
                    "IndexName"
                  ],
                  members: {
                    IndexName: {},
                    IndexStatus: {},
                    ProvisionedReadCapacityUnits: {
                      type: "long"
                    },
                    ProvisionedReadCapacityAutoScalingSettings: {
                      shape: "S60"
                    },
                    ProvisionedWriteCapacityUnits: {
                      type: "long"
                    },
                    ProvisionedWriteCapacityAutoScalingSettings: {
                      shape: "S60"
                    }
                  }
                }
              },
              ReplicaTableClassSummary: {
                shape: "S2f"
              }
            }
          }
        },
        S60: {
          type: "structure",
          members: {
            MinimumUnits: {
              type: "long"
            },
            MaximumUnits: {
              type: "long"
            },
            AutoScalingDisabled: {
              type: "boolean"
            },
            AutoScalingRoleArn: {},
            ScalingPolicies: {
              type: "list",
              member: {
                type: "structure",
                members: {
                  PolicyName: {},
                  TargetTrackingScalingPolicyConfiguration: {
                    type: "structure",
                    required: [
                      "TargetValue"
                    ],
                    members: {
                      DisableScaleIn: {
                        type: "boolean"
                      },
                      ScaleInCooldown: {
                        type: "integer"
                      },
                      ScaleOutCooldown: {
                        type: "integer"
                      },
                      TargetValue: {
                        type: "double"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        S6c: {
          type: "structure",
          members: {
            ImportArn: {},
            ImportStatus: {},
            TableArn: {},
            TableId: {},
            ClientToken: {},
            S3BucketSource: {
              shape: "S6e"
            },
            ErrorCount: {
              type: "long"
            },
            CloudWatchLogGroupArn: {},
            InputFormat: {},
            InputFormatOptions: {
              shape: "S6i"
            },
            InputCompressionType: {},
            TableCreationParameters: {
              shape: "S6o"
            },
            StartTime: {
              type: "timestamp"
            },
            EndTime: {
              type: "timestamp"
            },
            ProcessedSizeBytes: {
              type: "long"
            },
            ProcessedItemCount: {
              type: "long"
            },
            ImportedItemCount: {
              type: "long"
            },
            FailureCode: {},
            FailureMessage: {}
          }
        },
        S6e: {
          type: "structure",
          required: [
            "S3Bucket"
          ],
          members: {
            S3BucketOwner: {},
            S3Bucket: {},
            S3KeyPrefix: {}
          }
        },
        S6i: {
          type: "structure",
          members: {
            Csv: {
              type: "structure",
              members: {
                Delimiter: {},
                HeaderList: {
                  type: "list",
                  member: {}
                }
              }
            }
          }
        },
        S6o: {
          type: "structure",
          required: [
            "TableName",
            "AttributeDefinitions",
            "KeySchema"
          ],
          members: {
            TableName: {},
            AttributeDefinitions: {
              shape: "S2k"
            },
            KeySchema: {
              shape: "S2o"
            },
            BillingMode: {},
            ProvisionedThroughput: {
              shape: "S2z"
            },
            SSESpecification: {
              shape: "S34"
            },
            GlobalSecondaryIndexes: {
              shape: "S2x"
            }
          }
        },
        S74: {
          type: "structure",
          members: {
            TableName: {},
            TableStatus: {},
            Replicas: {
              type: "list",
              member: {
                type: "structure",
                members: {
                  RegionName: {},
                  GlobalSecondaryIndexes: {
                    type: "list",
                    member: {
                      type: "structure",
                      members: {
                        IndexName: {},
                        IndexStatus: {},
                        ProvisionedReadCapacityAutoScalingSettings: {
                          shape: "S60"
                        },
                        ProvisionedWriteCapacityAutoScalingSettings: {
                          shape: "S60"
                        }
                      }
                    }
                  },
                  ReplicaProvisionedReadCapacityAutoScalingSettings: {
                    shape: "S60"
                  },
                  ReplicaProvisionedWriteCapacityAutoScalingSettings: {
                    shape: "S60"
                  },
                  ReplicaStatus: {}
                }
              }
            }
          }
        },
        S7b: {
          type: "structure",
          required: [
            "TableName",
            "StreamArn"
          ],
          members: {
            TableName: {},
            StreamArn: {}
          }
        },
        S7c: {
          type: "structure",
          members: {
            TableName: {},
            StreamArn: {},
            DestinationStatus: {}
          }
        },
        S7m: {
          type: "list",
          member: {
            type: "structure",
            members: {
              Item: {
                shape: "Sr"
              }
            }
          }
        },
        S90: {
          type: "structure",
          required: [
            "ComparisonOperator"
          ],
          members: {
            AttributeValueList: {
              shape: "S4h"
            },
            ComparisonOperator: {}
          }
        },
        S91: {
          type: "map",
          key: {},
          value: {
            shape: "S90"
          }
        },
        Sa8: {
          type: "structure",
          members: {
            MinimumUnits: {
              type: "long"
            },
            MaximumUnits: {
              type: "long"
            },
            AutoScalingDisabled: {
              type: "boolean"
            },
            AutoScalingRoleArn: {},
            ScalingPolicyUpdate: {
              type: "structure",
              required: [
                "TargetTrackingScalingPolicyConfiguration"
              ],
              members: {
                PolicyName: {},
                TargetTrackingScalingPolicyConfiguration: {
                  type: "structure",
                  required: [
                    "TargetValue"
                  ],
                  members: {
                    DisableScaleIn: {
                      type: "boolean"
                    },
                    ScaleInCooldown: {
                      type: "integer"
                    },
                    ScaleOutCooldown: {
                      type: "integer"
                    },
                    TargetValue: {
                      type: "double"
                    }
                  }
                }
              }
            }
          }
        },
        Sax: {
          type: "list",
          member: {
            type: "structure",
            required: [
              "IndexName"
            ],
            members: {
              IndexName: {},
              ProvisionedThroughputOverride: {
                shape: "S2b"
              }
            }
          }
        },
        Sbb: {
          type: "structure",
          required: [
            "Enabled",
            "AttributeName"
          ],
          members: {
            Enabled: {
              type: "boolean"
            },
            AttributeName: {}
          }
        }
      }
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/dynamodb-2012-08-10.paginators.json
var require_dynamodb_2012_08_10_paginators = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/dynamodb-2012-08-10.paginators.json"(exports, module2) {
    module2.exports = {
      pagination: {
        BatchGetItem: {
          input_token: "RequestItems",
          output_token: "UnprocessedKeys"
        },
        ListContributorInsights: {
          input_token: "NextToken",
          limit_key: "MaxResults",
          output_token: "NextToken"
        },
        ListExports: {
          input_token: "NextToken",
          limit_key: "MaxResults",
          output_token: "NextToken"
        },
        ListImports: {
          input_token: "NextToken",
          limit_key: "PageSize",
          output_token: "NextToken"
        },
        ListTables: {
          input_token: "ExclusiveStartTableName",
          limit_key: "Limit",
          output_token: "LastEvaluatedTableName",
          result_key: "TableNames"
        },
        Query: {
          input_token: "ExclusiveStartKey",
          limit_key: "Limit",
          output_token: "LastEvaluatedKey",
          result_key: "Items"
        },
        Scan: {
          input_token: "ExclusiveStartKey",
          limit_key: "Limit",
          output_token: "LastEvaluatedKey",
          result_key: "Items"
        }
      }
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/dynamodb-2012-08-10.waiters2.json
var require_dynamodb_2012_08_10_waiters2 = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/apis/dynamodb-2012-08-10.waiters2.json"(exports, module2) {
    module2.exports = {
      version: 2,
      waiters: {
        TableExists: {
          delay: 20,
          operation: "DescribeTable",
          maxAttempts: 25,
          acceptors: [
            {
              expected: "ACTIVE",
              matcher: "path",
              state: "success",
              argument: "Table.TableStatus"
            },
            {
              expected: "ResourceNotFoundException",
              matcher: "error",
              state: "retry"
            }
          ]
        },
        TableNotExists: {
          delay: 20,
          operation: "DescribeTable",
          maxAttempts: 25,
          acceptors: [
            {
              expected: "ResourceNotFoundException",
              matcher: "error",
              state: "success"
            }
          ]
        }
      }
    };
  }
});

// node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/clients/dynamodb.js
var require_dynamodb2 = __commonJS({
  "node_modules/.pnpm/aws-sdk@2.1319.0/node_modules/aws-sdk/clients/dynamodb.js"(exports, module2) {
    require_node_loader();
    var AWS2 = require_core();
    var Service = AWS2.Service;
    var apiLoader = AWS2.apiLoader;
    apiLoader.services["dynamodb"] = {};
    AWS2.DynamoDB = Service.defineService("dynamodb", ["2011-12-05", "2012-08-10"]);
    require_dynamodb();
    Object.defineProperty(apiLoader.services["dynamodb"], "2011-12-05", {
      get: function get() {
        var model = require_dynamodb_2011_12_05_min();
        model.paginators = require_dynamodb_2011_12_05_paginators().pagination;
        model.waiters = require_dynamodb_2011_12_05_waiters2().waiters;
        return model;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(apiLoader.services["dynamodb"], "2012-08-10", {
      get: function get() {
        var model = require_dynamodb_2012_08_10_min();
        model.paginators = require_dynamodb_2012_08_10_paginators().pagination;
        model.waiters = require_dynamodb_2012_08_10_waiters2().waiters;
        return model;
      },
      enumerable: true,
      configurable: true
    });
    module2.exports = AWS2.DynamoDB;
  }
});

// src/emails/index.ts
var emails_exports = {};
__export(emails_exports, {
  default: () => emails_default
});
module.exports = __toCommonJS(emails_exports);
var DynamoDb = __toESM(require_dynamodb2());

// node_modules/.pnpm/zod@3.20.6/node_modules/zod/lib/index.mjs
var util;
(function(util2) {
  util2.assertEqual = (val) => val;
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var ZodError = class extends Error {
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  get errors() {
    return this.issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(issue.minimum)}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(issue.maximum)}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var overrideErrorMap = errorMap;
function getErrorMap() {
  return overrideErrorMap;
}
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: issueData.message || errorMessage
  };
};
function addIssueToContext(ctx, issueData) {
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      getErrorMap(),
      errorMap
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      syncPairs.push({
        key: await pair.key,
        value: await pair.value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (typeof value.value !== "undefined" || pair.alwaysSet) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    return this._path.concat(this._key);
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    const error = new ZodError(ctx.common.issues);
    return { success: false, error };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    if (typeof ctx.data === "undefined") {
      return { message: required_error !== null && required_error !== void 0 ? required_error : ctx.defaultError };
    }
    return { message: invalid_type_error !== null && invalid_type_error !== void 0 ? invalid_type_error : ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a;
    const ctx = {
      common: {
        issues: [],
        async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
        async: true
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this, this._def);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[a-z][a-z0-9]*$/;
var uuidRegex = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|([^-]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}))$/;
var datetimeRegex = (args) => {
  if (args.precision) {
    if (args.offset) {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
    } else {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}Z$`);
    }
  } else if (args.precision === 0) {
    if (args.offset) {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
    } else {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`);
    }
  } else {
    if (args.offset) {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
    } else {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$`);
    }
  }
};
var ZodString = class extends ZodType {
  constructor() {
    super(...arguments);
    this._regex = (regex, validation, message) => this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
    this.nonempty = (message) => this.min(1, errorUtil.errToObj(message));
    this.trim = () => new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(
        ctx2,
        {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ctx2.parsedType
        }
        //
      );
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (_a) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  datetime(options) {
    var _a;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  var _a;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}
var ZodNumber = class extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null, min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = BigInt(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.bigint,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBigInt.create = (params) => {
  var _a;
  return new ZodBigInt({
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return ZodArray.create(deepPartialify(schema.element));
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    return this._cached = { shape, keys };
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip")
        ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          syncPairs.push({
            key,
            value: await pair.value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          var _a, _b, _c, _d;
          const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    util.objectKeys(mask).forEach((key) => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return Object.keys(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else {
    return null;
  }
};
var ZodDiscriminatedUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key))
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      return OK(async (...args) => {
        const error = new ZodError([]);
        const parsedArgs = await this._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await fn(...parsedArgs);
        const parsedReturns = await this._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      return OK((...args) => {
        const parsedArgs = this._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = fn(...parsedArgs.data);
        const parsedReturns = this._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (this._def.values.indexOf(input.data) === -1) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values) {
    return ZodEnum.create(values);
  }
  exclude(values) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)));
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (nativeEnumValues.indexOf(input.data) === -1) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data);
      if (ctx.common.async) {
        return Promise.resolve(processed).then((processed2) => {
          return this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
        });
      } else {
        return this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
      }
    }
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return base;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return base;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const result = this._def.innerType._parse({
      data: ctx.data,
      path: ctx.path,
      parent: {
        ...ctx,
        common: {
          ...ctx.common,
          issues: []
          // don't collect issues from inner type
        }
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue()
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue()
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;

// src/emails/index.ts
var payloadSchema = objectType({
  email: stringType().email({ message: "Invalid email address" })
});
var tableName = process.env.DYNAMODB_TABLE;
var parseBody = (body) => {
  try {
    return JSON.parse(body);
  } catch {
    return void 0;
  }
};
var response = (result) => ({
  ...result,
  headers: {
    ...result.headers || {},
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  }
});
var handler = async (event) => {
  const body = event.body;
  if (!body) {
    return response({ statusCode: 400, body: "No payload provided" });
  }
  const parsedBody = parseBody(body);
  if (!parsedBody) {
    return response({ statusCode: 400, body: "Invalid JSON payload" });
  }
  const validation = payloadSchema.safeParse(parsedBody);
  if (validation.success) {
    const { email } = validation.data;
    await new DynamoDb.DocumentClient().put({
      Item: {
        email,
        status: "subscribed"
      },
      TableName: tableName
    }).promise();
    return response({ statusCode: 201, body: "OK" });
  } else {
    return response({ statusCode: 400, body: validation.error.message });
  }
};
var emails_default = handler;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*! Bundled license information:

sax/lib/sax.js:
  (*! http://mths.be/fromcodepoint v0.1.0 by @mathias *)
*/
