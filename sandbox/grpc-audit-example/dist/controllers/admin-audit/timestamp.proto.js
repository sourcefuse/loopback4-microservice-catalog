"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = exports.protobufPackage = void 0;
/* eslint-disable */
const minimal_1 = require("protobufjs/minimal");
exports.protobufPackage = "google.protobuf";
const baseTimestamp = { seconds: 0, nanos: 0 };
exports.Timestamp = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.seconds !== 0) {
            writer.uint32(8).int64(message.seconds);
        }
        if (message.nanos !== 0) {
            writer.uint32(16).int32(message.nanos);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.Reader ? input : new minimal_1.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseTimestamp };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.seconds = longToNumber(reader.int64());
                    break;
                case 2:
                    message.nanos = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseTimestamp };
        message.seconds =
            object.seconds !== undefined && object.seconds !== null
                ? Number(object.seconds)
                : 0;
        message.nanos =
            object.nanos !== undefined && object.nanos !== null
                ? Number(object.nanos)
                : 0;
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.seconds !== undefined && (obj.seconds = message.seconds);
        message.nanos !== undefined && (obj.nanos = message.nanos);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = { ...baseTimestamp };
        message.seconds = (_a = object.seconds) !== null && _a !== void 0 ? _a : 0;
        message.nanos = (_b = object.nanos) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
// if (util.Long !== Long) {
//   util.Long = Long as any;
//   configure();
// }
//# sourceMappingURL=timestamp.proto.js.map