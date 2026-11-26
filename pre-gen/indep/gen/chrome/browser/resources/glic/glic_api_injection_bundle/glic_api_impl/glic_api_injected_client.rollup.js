const mojo = {
  internal: { interfaceSupport: {} },
  interfaceControl: {},
  pipeControl: {},
};
// Copyright 2018 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/** @const {number} */
mojo.internal.kArrayHeaderSize = 8;

/** @const {number} */
mojo.internal.kStructHeaderSize = 8;

/** @const {number} */
mojo.internal.kStructHeaderSizeOffset = 0;

/** @const {number} */
mojo.internal.kStructHeaderVersionOffset = 4;

/** @const {number} */
mojo.internal.kUnionHeaderSize = 8;

/** @const {number} */
mojo.internal.kUnionDataSize = 16;

/** @const {number} */
mojo.internal.kMessageV0HeaderSize = 24;

/** @const {number} */
mojo.internal.kMessageV1HeaderSize = 32;

/** @const {number} */
mojo.internal.kMessageV2HeaderSize = 48;

/** @const {number} */
mojo.internal.kMapDataSize = 24;

/** @const {number} */
mojo.internal.kEncodedInvalidHandleValue = 0xffffffff;

/** @const {number} */
mojo.internal.kMessageFlagExpectsResponse = 1 << 0;

/** @const {number} */
mojo.internal.kMessageFlagIsResponse = 1 << 1;

/** @const {number} */
mojo.internal.kInterfaceNamespaceBit = 0x80000000;

/** @const {boolean} */
mojo.internal.kHostLittleEndian = (function() {
  const wordBytes = new Uint8Array(new Uint16Array([1]).buffer);
  return !!wordBytes[0];
})();

/**
 * A lightweight JavaScript wrapper replicating the DataView API over a
 * DataView. Flattening offsets to the root DataView avoids heavy native
 * v8::internal::JSArrayBufferView C++ object allocations.
 *
 * This class is intended to work as a mirror to the actual DataView, to
 * reduce the amount of code change.
 *
 * Each instance of a DataViewWrapper will reference a native DataView as
 * well as its own offset within that DataView.
 *
 * If a DataView is passed in, it will use that as the base DataView.
 *
 * If another instance of DataViewWrapper is passed in, it would reference
 * the underlying native DataView and track its own offset.
 */
mojo.internal.DataViewWrapper = class {
  /**
   * @param {!DataView|!mojo.internal.DataViewWrapper|!ArrayBuffer} view
   * @param {number=} byteOffset
   */
  constructor(view, byteOffset = 0) {
    /** @private {!DataView} */
    this.dataView_;
    /** @type {number} */
    this.byteOffset;

    if (view instanceof mojo.internal.DataViewWrapper) {
      this.dataView_ = view.dataView_;
      this.byteOffset = view.byteOffset + byteOffset;
    } else if (view instanceof DataView) {
      // Flatten to root DataView over view.buffer so this.byteOffset is
      // absolute.
      this.dataView_ = (view.byteOffset === 0 &&
                        view.byteLength === view.buffer.byteLength) ?
          view :
          new DataView(view.buffer);
      this.byteOffset = view.byteOffset + byteOffset;
    } else if (view instanceof ArrayBuffer) {
      this.dataView_ = new DataView(view);
      this.byteOffset = byteOffset;
    } else {
      throw new Error(
          'DataViewWrapper constructor requires a DataViewWrapper, DataView,' +
          ' or ArrayBuffer instance');
    }
  }

  get buffer() {
    return this.dataView_.buffer;
  }

  getUint8(offset) {
    return this.dataView_.getUint8(this.byteOffset + offset);
  }

  getInt8(offset) {
    return this.dataView_.getInt8(this.byteOffset + offset);
  }

  getUint16(offset, littleEndian) {
    return this.dataView_.getUint16(this.byteOffset + offset, littleEndian);
  }

  getInt16(offset, littleEndian) {
    return this.dataView_.getInt16(this.byteOffset + offset, littleEndian);
  }

  getUint32(offset, littleEndian) {
    return this.dataView_.getUint32(this.byteOffset + offset, littleEndian);
  }

  getInt32(offset, littleEndian) {
    return this.dataView_.getInt32(this.byteOffset + offset, littleEndian);
  }

  getFloat32(offset, littleEndian) {
    return this.dataView_.getFloat32(this.byteOffset + offset, littleEndian);
  }

  getFloat64(offset, littleEndian) {
    return this.dataView_.getFloat64(this.byteOffset + offset, littleEndian);
  }

  setUint8(offset, value) {
    this.dataView_.setUint8(this.byteOffset + offset, value);
  }

  setInt8(offset, value) {
    this.dataView_.setInt8(this.byteOffset + offset, value);
  }

  setUint16(offset, value, littleEndian) {
    this.dataView_.setUint16(this.byteOffset + offset, value, littleEndian);
  }

  setInt16(offset, value, littleEndian) {
    this.dataView_.setInt16(this.byteOffset + offset, value, littleEndian);
  }

  setUint32(offset, value, littleEndian) {
    this.dataView_.setUint32(this.byteOffset + offset, value, littleEndian);
  }

  setInt32(offset, value, littleEndian) {
    this.dataView_.setInt32(this.byteOffset + offset, value, littleEndian);
  }

  setFloat32(offset, value, littleEndian) {
    this.dataView_.setFloat32(this.byteOffset + offset, value, littleEndian);
  }

  setFloat64(offset, value, littleEndian) {
    this.dataView_.setFloat64(this.byteOffset + offset, value, littleEndian);
  }
};

/**
 * @param {*} x
 * @return {boolean}
 */
mojo.internal.isNullOrUndefined = function(x) {
  return x === null || x === undefined;
};

/**
 * @param {*} x
 * @return {boolean}
 */
mojo.internal.isNullableValueKindField = function(x) {
  return typeof x.nullableValueKindProperties !== 'undefined';
};

/**
 * @param {number} size
 * @param {number} alignment
 * @return {number}
 */
mojo.internal.align = function(size, alignment) {
  return size + (alignment - (size % alignment)) % alignment;
};

/**
 * @param {!DataView|!mojo.internal.DataViewWrapper} dataView
 * @param {number} byteOffset
 * @param {number|bigint} value
 */
mojo.internal.setInt64 = function(dataView, byteOffset, value) {
  if (mojo.internal.kHostLittleEndian) {
    dataView.setUint32(
        byteOffset, Number(BigInt(value) & BigInt(0xffffffff)),
        mojo.internal.kHostLittleEndian);
    dataView.setInt32(
        byteOffset + 4,
        Number((BigInt(value) >> BigInt(32)) & BigInt(0xffffffff)),
        mojo.internal.kHostLittleEndian);
  } else {
    dataView.setInt32(
        byteOffset, Number((BigInt(value) >> BigInt(32)) & BigInt(0xffffffff)),
        mojo.internal.kHostLittleEndian);
    dataView.setUint32(
        byteOffset + 4, Number(BigInt(value) & BigInt(0xffffffff)),
        mojo.internal.kHostLittleEndian);
  }
};

/**
 * @param {!DataView|!mojo.internal.DataViewWrapper} dataView
 * @param {number} byteOffset
 * @param {number|bigint} value
 */
mojo.internal.setUint64 = function(dataView, byteOffset, value) {
  if (mojo.internal.kHostLittleEndian) {
    dataView.setUint32(
        byteOffset, Number(BigInt(value) & BigInt(0xffffffff)),
        mojo.internal.kHostLittleEndian);
    dataView.setUint32(
        byteOffset + 4,
        Number((BigInt(value) >> BigInt(32)) & BigInt(0xffffffff)),
        mojo.internal.kHostLittleEndian);
  } else {
    dataView.setUint32(
        byteOffset, Number((BigInt(value) >> BigInt(32)) & BigInt(0xffffffff)),
        mojo.internal.kHostLittleEndian);
    dataView.setUint32(
        byteOffset + 4, Number(BigInt(value) & BigInt(0xffffffff)),
        mojo.internal.kHostLittleEndian);
  }
};

/**
 * @param {!DataView|!mojo.internal.DataViewWrapper} dataView
 * @param {number} byteOffset
 * @return {bigint}
 */
mojo.internal.getInt64 = function(dataView, byteOffset) {
  let low, high;
  if (mojo.internal.kHostLittleEndian) {
    low = dataView.getUint32(byteOffset, mojo.internal.kHostLittleEndian);
    high = dataView.getInt32(byteOffset + 4, mojo.internal.kHostLittleEndian);
  } else {
    low = dataView.getUint32(byteOffset + 4, mojo.internal.kHostLittleEndian);
    high = dataView.getInt32(byteOffset, mojo.internal.kHostLittleEndian);
  }
  return (BigInt(high) << BigInt(32)) | BigInt(low);
};

/**
 * @param {!DataView|!mojo.internal.DataViewWrapper} dataView
 * @param {number} byteOffset
 * @return {bigint}
 */
mojo.internal.getUint64 = function(dataView, byteOffset) {
  let low, high;
  if (mojo.internal.kHostLittleEndian) {
    low = dataView.getUint32(byteOffset, mojo.internal.kHostLittleEndian);
    high = dataView.getUint32(byteOffset + 4, mojo.internal.kHostLittleEndian);
  } else {
    low = dataView.getUint32(byteOffset + 4, mojo.internal.kHostLittleEndian);
    high = dataView.getUint32(byteOffset, mojo.internal.kHostLittleEndian);
  }
  return (BigInt(high) << BigInt(32)) | BigInt(low);
};

/**
 * @typedef {{
 *   size: number,
 *   numInterfaceIds: (number|undefined),
 * }}
 */
mojo.internal.MessageDimensions;

/**
 * Gets the field in mojo type for a given value. Note that this method
 * could be relatively expensive if the value is typemapped and its field
 * needs to be converted to mojo types.
 *
 * @param {!*} value
 * @param {!mojo.internal.StructFieldSpec} fieldSpec
 * @returns
 */
mojo.internal.getMojoFieldValue = function(value, fieldSpec) {
  if (!!fieldSpec.fieldGetter) {
    return fieldSpec.fieldGetter(value);
  }

  if (value && mojo.internal.isNullableValueKindField(fieldSpec)) {
    const props = fieldSpec.nullableValueKindProperties;
    const hasValue =
        !mojo.internal.isNullOrUndefined(value[props.originalFieldName]);
    if (props.isPrimary) {
      return hasValue;
    } else if (hasValue) {
      return value[props.originalFieldName];
    } else {
      // Use `defaultValue` to cover the enum case.
      return fieldSpec.defaultValue;
    }
  }
  return value[fieldSpec.name];
};

/**
 * This computes the total amount of buffer space required to hold a struct
 * value and all its fields, including indirect objects like arrays, structs,
 * and nullable unions.
 *
 * @param {!mojo.internal.StructSpec} structSpec
 * @param {!Object} value
 * @return {!mojo.internal.MessageDimensions}
 */
mojo.internal.computeStructDimensions = function(structSpec, value) {
  let size = structSpec.packedSize;
  let numInterfaceIds = 0;
  for (const field of structSpec.fields) {
    let fieldValue = mojo.internal.getMojoFieldValue(value, field);
    if (mojo.internal.isNullOrUndefined(fieldValue)) {
      fieldValue = field.defaultValue;
    }
    if (fieldValue === null) {
      continue;
    }

    if (field.type.$.computeDimensions) {
      const fieldDimensions =
          field.type.$.computeDimensions(fieldValue, field.nullable);
      size += mojo.internal.align(fieldDimensions.size, 8);
      // Only update numInterfaceIds if field.type.$.computeDimensions returns a
      // numInterfaceIds
      if (fieldDimensions.numInterfaceIds) {
        numInterfaceIds += fieldDimensions.numInterfaceIds;
      }
    } else if (field.type.$.hasInterfaceId) {
      numInterfaceIds++;
    }
  }
  return {size, numInterfaceIds};
};

/**
 * @param {!mojo.internal.UnionSpec} unionSpec
 * @param {!Object} value
 * @return {!mojo.internal.MessageDimensions}
 */
mojo.internal.computeUnionDimensions = function(unionSpec, nullable, value) {
  // Unions are normally inlined since they're always a fixed width of 16
  // bytes, but nullable union-typed fields require indirection. Hence this
  // unique special case where a union field requires additional storage
  // beyond the struct's own packed field data only when it's nullable.
  let size = nullable ? mojo.internal.kUnionDataSize : 0;
  let numInterfaceIds = 0;

  const keys = Object.keys(value);
  if (keys.length !== 1) {
    throw new Error(
        `Value for ${unionSpec.name} must be an Object with a ` +
        'single property named one of: ' +
        Object.keys(unionSpec.fields).join(','));
  }

  const tag = keys[0];
  const field = unionSpec.fields[tag];
  const fieldValue = value[tag];
  if (!mojo.internal.isNullOrUndefined(fieldValue)) {
    // Nested unions are always encoded with indirection, which we induce by
    // claiming the field is nullable even if it's not.
    if (field['type'].$.computeDimensions) {
      const nullable = !!field['type'].$.unionSpec || field['nullable'];
      const fieldDimensions =
          field['type'].$.computeDimensions(fieldValue, nullable);
      size += mojo.internal.align(fieldDimensions.size, 8);
      // Only update numInterfaceIds if field['type'].$.computeDimensions
      // returns a numInterfaceIds
      if (fieldDimensions.numInterfaceIds) {
        numInterfaceIds += fieldDimensions.numInterfaceIds;
      }
    } else if (field['type'].$.hasInterfaceId) {
      numInterfaceIds++;
    }
  }

  return {size, numInterfaceIds};
};

/**
 * @param {!mojo.internal.ArraySpec} arraySpec
 * @param {!Array|!Uint8Array} value
 * @return {number}
 */
mojo.internal.computeInlineArraySize = function(arraySpec, value) {
  if (arraySpec.elementType === mojo.internal.Bool) {
    return mojo.internal.kArrayHeaderSize +
        mojo.internal.computeHasValueBitfieldSize(arraySpec, value.length) +
        ((value.length + 7) >> 3);
  } else {
    return mojo.internal.kArrayHeaderSize +
        mojo.internal.computeHasValueBitfieldSize(arraySpec, value.length) +
        value.length *
        arraySpec.elementType.$.arrayElementSize(!!arraySpec.elementNullable);
  }
};

/**
 * @param {!mojo.internal.ArraySpec} arraySpec
 * @param {number} length
 * @return {number} the number of bytes needed for the an array's has-value
 *   bitfield. If the arraySpec does not require a has-value bitfield, this
 *   method will return 0.
 */
mojo.internal.computeHasValueBitfieldSize = function(arraySpec, length) {
    const isNullableValueType = !!arraySpec.elementNullable &&
        !!arraySpec.elementType.$.isValueType;
    if (!isNullableValueType) {
      return 0;
    }
    const element_type_bytes =
        arraySpec.elementType.$.arrayElementSize(/* nullable= */ true);
    const element_type_bits = element_type_bytes * 8;
    const needed_bits = length + element_type_bits - 1;
    // >> 0 to force integer arithmetic.
    return  ((needed_bits/element_type_bits) >> 0)  * element_type_bytes;
};

/**
 * @param {!mojo.internal.ArraySpec} arraySpec
 * @param {!Array|!Uint8Array} value
 * @return {number}
 */
mojo.internal.computeTotalArraySize = function(arraySpec, value) {
  const inlineSize = mojo.internal.computeInlineArraySize(arraySpec, value);
  if (!arraySpec.elementType.$.computeDimensions)
    return inlineSize;

  let totalSize = inlineSize;
  for (let elementValue of value) {
    if (!mojo.internal.isNullOrUndefined(elementValue)) {
      totalSize += mojo.internal.align(
          arraySpec.elementType.$
              .computeDimensions(elementValue, !!arraySpec.elementNullable)
              .size,
          8);
    }
  }

  return totalSize;
};

/** Owns an outgoing message buffer and facilitates serialization. */
mojo.internal.Message = class {
  /**
   * @param {?mojo.internal.interfaceSupport.Endpoint} sender
   * @param {number} interfaceId
   * @param {number} flags
   * @param {number} ordinal
   * @param {number} requestId
   * @param {!mojo.internal.StructSpec} paramStructSpec
   * @param {!Object} value
   * @public
   */
  constructor(
      sender, interfaceId, flags, ordinal, requestId, paramStructSpec, value) {
    const dimensions =
        mojo.internal.computeStructDimensions(paramStructSpec, value);

    let headerSize, version;
    if (dimensions.numInterfaceIds > 0) {
      headerSize = mojo.internal.kMessageV2HeaderSize;
      version = 2;
    } else if (
        (flags &
         (mojo.internal.kMessageFlagExpectsResponse |
          mojo.internal.kMessageFlagIsResponse)) == 0) {
      headerSize = mojo.internal.kMessageV0HeaderSize;
      version = 0;
    } else {
      headerSize = mojo.internal.kMessageV1HeaderSize;
      version = 1;
    }

    const headerWithPayloadSize = headerSize + dimensions.size;
    const interfaceIdsSize = dimensions.numInterfaceIds > 0 ?
        mojo.internal.kArrayHeaderSize + dimensions.numInterfaceIds * 4 :
        0;
    const paddedInterfaceIdsSize = mojo.internal.align(interfaceIdsSize, 8);
    const totalMessageSize = headerWithPayloadSize + paddedInterfaceIdsSize;

    /** @public {!ArrayBuffer} */
    this.buffer = new ArrayBuffer(totalMessageSize);

    /** @public {!Array<MojoHandle>} */
    this.handles = [];

    // Refer to:
    //   //mojo/public/cpp/bindings/lib/message_internal.h
    // For message header format.
    const header = new DataView(this.buffer);
    header.setUint32(0, headerSize, mojo.internal.kHostLittleEndian);
    header.setUint32(4, version, mojo.internal.kHostLittleEndian);
    header.setUint32(8, interfaceId, mojo.internal.kHostLittleEndian);
    header.setUint32(12, ordinal, mojo.internal.kHostLittleEndian);
    header.setUint32(16, flags, mojo.internal.kHostLittleEndian);
    header.setUint32(20, 0);  // Padding
    if (version >= 1) {
      mojo.internal.setUint64(header, 24, requestId);
      if (version >= 2) {
        // Payload offset from this byte.
        mojo.internal.setUint64(header, 32, BigInt(16));
        // Interface IDs array offset from this byte.
        mojo.internal.setUint64(header, 40, BigInt(headerWithPayloadSize - 40));
        // Interface IDs array num_bytes.
        header.setUint32(
            headerWithPayloadSize, interfaceIdsSize,
            mojo.internal.kHostLittleEndian);
        // Interface IDs array num_elements.
        header.setUint32(
            headerWithPayloadSize + 4, dimensions.numInterfaceIds || 0,
            mojo.internal.kHostLittleEndian);
      }
    }

    /** @private {number} */
    this.nextInterfaceIdIndex_ = 0;

    /** @private {?Uint32Array} */
    this.interfaceIds_ = null;

    if (dimensions.numInterfaceIds) {
      this.interfaceIds_ = new Uint32Array(
          this.buffer, headerWithPayloadSize + mojo.internal.kArrayHeaderSize,
          dimensions.numInterfaceIds);
    }

    /** @private {number} */
    this.nextAllocationOffset_ = headerSize;

    const paramStructData = this.allocate(paramStructSpec.packedSize);
    const encoder =
        new mojo.internal.Encoder(this, paramStructData, {endpoint: sender});
    encoder.encodeStructInline(paramStructSpec, value);
  }

  /**
   * @param {number} numBytes
   * @return {!DataView} A view into the allocated message bytes.
   */
  allocate(numBytes) {
    const alignedSize = mojo.internal.align(numBytes, 8);
    const view =
        new DataView(this.buffer, this.nextAllocationOffset_, alignedSize);
    this.nextAllocationOffset_ += alignedSize;
    return view;
  }
};

/**
 * Additional context to aid in encoding and decoding of message data.
 *
 * @typedef {{
 *   endpoint: ?mojo.internal.interfaceSupport.Endpoint,
 * }}
 */
mojo.internal.MessageContext;

/**
 * Helps encode outgoing messages. Encoders may be created recursively to encode
 * parial message fragments indexed by indirect message offsets, as with encoded
 * arrays and nested structs.
 */
mojo.internal.Encoder = class {
  /**
   * @param {!mojo.internal.Message} message
   * @param {!DataView} data
   * @param {?mojo.internal.MessageContext=} context
   * @public
   */
  constructor(message, data, context = null) {
    /** @const {?mojo.internal.MessageContext} */
    this.context_ = context;

    /** @private {!mojo.internal.Message} */
    this.message_ = message;

    /** @private {!DataView} */
    this.data_ = data;
  }

  encodeBool(byteOffset, bitOffset, value) {
    const oldValue = this.data_.getUint8(byteOffset);
    if (value)
      this.data_.setUint8(byteOffset, oldValue | (1 << bitOffset));
    else
      this.data_.setUint8(byteOffset, oldValue & ~(1 << bitOffset));
  }

  encodeInt8(offset, value) {
    this.data_.setInt8(offset, value);
  }

  encodeUint8(offset, value) {
    this.data_.setUint8(offset, value);
  }

  encodeInt16(offset, value) {
    this.data_.setInt16(offset, value, mojo.internal.kHostLittleEndian);
  }

  encodeUint16(offset, value) {
    this.data_.setUint16(offset, value, mojo.internal.kHostLittleEndian);
  }

  encodeInt32(offset, value) {
    this.data_.setInt32(offset, value, mojo.internal.kHostLittleEndian);
  }

  encodeUint32(offset, value) {
    this.data_.setUint32(offset, value, mojo.internal.kHostLittleEndian);
  }

  encodeInt64(offset, value) {
    mojo.internal.setInt64(this.data_, offset, value);
  }

  encodeUint64(offset, value) {
    mojo.internal.setUint64(this.data_, offset, value);
  }

  encodeFloat(offset, value) {
    this.data_.setFloat32(offset, value, mojo.internal.kHostLittleEndian);
  }

  encodeDouble(offset, value) {
    this.data_.setFloat64(offset, value, mojo.internal.kHostLittleEndian);
  }

  encodeHandle(offset, value) {
    this.encodeUint32(offset, this.message_.handles.length);
    this.message_.handles.push(value);
  }

  encodeAssociatedEndpoint(offset, endpoint) {
    console.assert(
        endpoint.isPendingAssociation, 'expected unbound associated endpoint');
    const sender = this.context_.endpoint;
    const id = sender.associatePeerOfOutgoingEndpoint(endpoint);
    const index = this.message_.nextInterfaceIdIndex_++;
    this.encodeUint32(offset, index);
    this.message_.interfaceIds_[index] = id;
  }

  encodeString(offset, value) {
    if (typeof value !== 'string')
      throw new Error('Unxpected non-string value for string field.');
    this.encodeArray(
        {elementType: mojo.internal.Uint8}, offset,
        mojo.internal.Encoder.stringToUtf8Bytes(value));
  }

  encodeOffset(offset, absoluteOffset) {
    this.encodeUint64(offset, absoluteOffset - this.data_.byteOffset - offset);
  }

  /**
   * @param {!mojo.internal.ArraySpec} arraySpec
   * @param {number} offset
   * @param {!Array|!Uint8Array} value
   */
  encodeArray(arraySpec, offset, value) {
    const arraySize = mojo.internal.computeInlineArraySize(arraySpec, value);
    const arrayData = this.message_.allocate(arraySize);
    const arrayEncoder =
        new mojo.internal.Encoder(this.message_, arrayData, this.context_);
    this.encodeOffset(offset, arrayData.byteOffset);

    arrayEncoder.encodeUint32(0, arraySize);
    arrayEncoder.encodeUint32(4, value.length);
    this.maybeEncodeHasValueBitfield(arraySpec, arrayEncoder, 8, value);

    let byteOffset = 8 +
        mojo.internal.computeHasValueBitfieldSize(arraySpec, value.length);
    if (arraySpec.elementType === mojo.internal.Bool) {
      let bitOffset = 0;
      for (const e of value) {
        arrayEncoder.encodeBool(byteOffset, bitOffset, e);
        bitOffset++;
        if (bitOffset == 8) {
          bitOffset = 0;
          byteOffset++;
        }
      }
    } else {
      for (const e of value) {
        if (e === null) {
          if (!arraySpec.elementNullable) {
            throw new Error(
                'Trying to send a null element in an array of ' +
                'non-nullable elements');
          }
          arraySpec.elementType.$.encodeNull(arrayEncoder, byteOffset);
        } else {
          arraySpec.elementType.$.encode(
              e, arrayEncoder, byteOffset, 0, !!arraySpec.elementNullable);
        }
        byteOffset += arraySpec.elementType.$.arrayElementSize(
            !!arraySpec.elementNullable);
      }
    }
  }

  /**
   * Optionally writes a has-value bitfield to the encoder if necessary. If the
   * arraySpec does not require a has-value bitfield, this method call is
   * noop.
   * @param {!mojo.internal.ArraySpec} arraySpec
   * @param {mojo.internal.Encoder} arrayEncoder
   * @param {number} startOffset
   * @param {!Array|!Uint8Array} value
   */
  maybeEncodeHasValueBitfield(arraySpec, arrayEncoder, startOffset, value) {
    if (!arraySpec.elementNullable ||
        !arraySpec.elementType.$.isValueType) {
      return;
    }

    let bitOffset = 0;
    let byteOffset = startOffset;
    for (const e of value) {
      if (e === null || e === undefined) {
        arrayEncoder.encodeBool(byteOffset, bitOffset, false);
      } else {
        arrayEncoder.encodeBool(byteOffset, bitOffset, true);
      }
      bitOffset++;
      if (bitOffset == 8) {
        bitOffset = 0;
        byteOffset++;
      }
    }
  }

  /**
   * @param {!mojo.internal.MapSpec} mapSpec
   * @param {number} offset
   * @param {!Map|!Object} value
   */
  encodeMap(mapSpec, offset, value) {
    let keys, values;
    if (value.constructor.name == 'Map') {
      keys = Array.from(value.keys());
      values = Array.from(value.values());
    } else {
      keys = Object.keys(value);
      values = keys.map(k => value[k]);
    }

    const mapData = this.message_.allocate(mojo.internal.kMapDataSize);
    const mapEncoder =
        new mojo.internal.Encoder(this.message_, mapData, this.context_);
    this.encodeOffset(offset, mapData.byteOffset);

    mapEncoder.encodeUint32(0, mojo.internal.kMapDataSize);
    mapEncoder.encodeUint32(4, 0);
    mapEncoder.encodeArray({elementType: mapSpec.keyType}, 8, keys);
    mapEncoder.encodeArray(
        {
          elementType: mapSpec.valueType,
          elementNullable: mapSpec.valueNullable,
        },
        16, values);
  }

  /**
   * @param {!mojo.internal.StructSpec} structSpec
   * @param {number} offset
   * @param {!Object} value
   */
  encodeStruct(structSpec, offset, value) {
    const structData = this.message_.allocate(structSpec.packedSize);
    const structEncoder =
        new mojo.internal.Encoder(this.message_, structData, this.context_);
    this.encodeOffset(offset, structData.byteOffset);
    structEncoder.encodeStructInline(structSpec, value);
  }

  /**
   * @param {!mojo.internal.StructSpec} structSpec
   * @param {!*} value
   */
  encodeStructInline(structSpec, value) {
    const versions = structSpec.versions;
    this.encodeUint32(0, structSpec.packedSize);
    this.encodeUint32(4, versions[versions.length - 1].version);
    for (const field of structSpec.fields) {
      const byteOffset = mojo.internal.kStructHeaderSize + field.packedOffset;

      const encodeStructField = (field_value) => {
        field.type.$.encode(field_value, this, byteOffset,
                            field.packedBitOffset, field.nullable);
      };

      // Pre-emptively read the field value because typemapping might require
      // us to convert the entire field to the mojo type.
      const fieldValue = mojo.internal.isNullOrUndefined(value) ?
          undefined :
          mojo.internal.getMojoFieldValue(value, field);

      if (!mojo.internal.isNullOrUndefined(value) &&
          !mojo.internal.isNullOrUndefined(fieldValue)) {
        encodeStructField(fieldValue);
        continue;
      }

      if (field.defaultValue !== null) {
        encodeStructField(field.defaultValue);
        continue;
      }

      if (field.nullable) {
        field.type.$.encodeNull(this, byteOffset);
        continue;
      }

      throw new Error(
          structSpec.name + ' missing value for non-nullable ' +
          'field "' + field.name + `", got: "${fieldValue}"...`);
    }
  }

  /**
   * @param {!mojo.internal.UnionSpec} unionSpec
   * @param {number} offset
   * @param {!Object} value
   */
  encodeUnionAsPointer(unionSpec, offset, value) {
    const unionData = this.message_.allocate(mojo.internal.kUnionDataSize);
    const unionEncoder =
        new mojo.internal.Encoder(this.message_, unionData, this.context_);
    this.encodeOffset(offset, unionData.byteOffset);
    unionEncoder.encodeUnion(unionSpec, /*offset=*/0, value);
  }

  /**
   * @param {!mojo.internal.UnionSpec} unionSpec
   * @param {number} offset
   * @param {!Object} value
   */
  encodeUnion(unionSpec, offset, value) {
    const keys = Object.keys(value);
    if (keys.length !== 1) {
      throw new Error(
          `Value for ${unionSpec.name} must be an Object with a ` +
          'single property named one of: ' +
          Object.keys(unionSpec.fields).join(','));
    }

    const tag = keys[0];
    const field = unionSpec.fields[tag];
    this.encodeUint32(offset, mojo.internal.kUnionDataSize);
    this.encodeUint32(offset + 4, field['ordinal']);
    const fieldByteOffset = offset + mojo.internal.kUnionHeaderSize;
    if (typeof field['type'].$.unionSpec !== 'undefined') {
      // Unions are encoded as pointers when inside unions.
      this.encodeUnionAsPointer(field['type'].$.unionSpec,
                                fieldByteOffset,
                                value[tag]);
      return;
    }
    field['type'].$.encode(
        value[tag], this, fieldByteOffset, 0, field['nullable']);
  }

  /**
   * @param {string} value
   * @return {!Uint8Array}
   */
  static stringToUtf8Bytes(value) {
    if (!mojo.internal.Encoder.textEncoder)
      mojo.internal.Encoder.textEncoder = new TextEncoder('utf-8');
    return mojo.internal.Encoder.textEncoder.encode(value);
  }
};

/** @type {TextEncoder} */
mojo.internal.Encoder.textEncoder = null;

/**
 * Helps decode incoming messages. Decoders may be created recursively to
 * decode partial message fragments indexed by indirect message offsets, as with
 * encoded arrays and nested structs.
 */
mojo.internal.Decoder = class {
  /**
   * @param {!mojo.internal.DataViewWrapper|!DataView|!ArrayBuffer} data
   * @param {!Array<MojoHandle>} handles
   * @param {?mojo.internal.MessageContext=} context
   */
  constructor(data, handles, context = null) {
    /** @private {?mojo.internal.MessageContext} */
    this.context_ = context;

    /** @private {!mojo.internal.DataViewWrapper} */
    this.data_ = (data instanceof mojo.internal.DataViewWrapper) ?
        data :
        new mojo.internal.DataViewWrapper(data);

    /** @private {!Array<MojoHandle>} */
    this.handles_ = handles;
  }

  decodeBool(byteOffset, bitOffset) {
    return !!(this.data_.getUint8(byteOffset) & (1 << bitOffset));
  }

  decodeInt8(offset) {
    return this.data_.getInt8(offset);
  }

  decodeUint8(offset) {
    return this.data_.getUint8(offset);
  }

  decodeInt16(offset) {
    return this.data_.getInt16(offset, mojo.internal.kHostLittleEndian);
  }

  decodeUint16(offset) {
    return this.data_.getUint16(offset, mojo.internal.kHostLittleEndian);
  }

  decodeInt32(offset) {
    return this.data_.getInt32(offset, mojo.internal.kHostLittleEndian);
  }

  decodeUint32(offset) {
    return this.data_.getUint32(offset, mojo.internal.kHostLittleEndian);
  }

  decodeInt64(offset) {
    return mojo.internal.getInt64(this.data_, offset);
  }

  decodeUint64(offset) {
    return mojo.internal.getUint64(this.data_, offset);
  }

  decodeFloat(offset) {
    return this.data_.getFloat32(offset, mojo.internal.kHostLittleEndian);
  }

  decodeDouble(offset) {
    return this.data_.getFloat64(offset, mojo.internal.kHostLittleEndian);
  }

  decodeHandle(offset) {
    const index = this.data_.getUint32(offset, mojo.internal.kHostLittleEndian);
    if (index == 0xffffffff)
      return null;
    if (index >= this.handles_.length)
      throw new Error('Decoded invalid handle index');
    return this.handles_[index];
  }

  decodeString(offset) {
    // Absolute from the underlying data buffer, not the current data view.
    const arrayAbsoluteOffset = this.decodeOffset(offset);
    if (!arrayAbsoluteOffset)
      return null;

    if (!mojo.internal.Decoder.textDecoder)
      mojo.internal.Decoder.textDecoder = new TextDecoder('utf-8');

    // Array header is [num_bytes, num_elements]. We want to grab the number
    // of elements. decodeUint32 is a relative method, so we have to translate
    // absolute back to relative.
    const numElements =
        this.decodeUint32((arrayAbsoluteOffset - this.data_.byteOffset) + 4);
    // Fast path.
    if (numElements === 0) {
      return '';
    }
    // 8 bytes accounts for the header.
    const arrayDataAbsoluteOffset = arrayAbsoluteOffset + 8;

    return mojo.internal.Decoder.textDecoder.decode(new Uint8Array(
        this.data_.buffer, arrayDataAbsoluteOffset, numElements));
  }

  decodeOffset(offset) {
    const relativeOffset = this.decodeUint64(offset);
    if (relativeOffset == 0)
      return 0;
    if (relativeOffset > BigInt(Number.MAX_SAFE_INTEGER))
      throw new Error('Mesage offset too large');
    return this.data_.byteOffset + offset + Number(relativeOffset);
  }

  /**
   * @param {!mojo.internal.ArraySpec} arraySpec
   * @return {Array}
   */
  decodeArray(arraySpec, offset) {
    const arrayOffset = this.decodeOffset(offset);
    if (!arrayOffset)
      return null;

    const arrayDecoder = new mojo.internal.Decoder(
        new mojo.internal.DataViewWrapper(
            this.data_, arrayOffset - this.data_.byteOffset),
        this.handles_, this.context_);

    const numElements = arrayDecoder.decodeUint32(4);
    if (!numElements)
      return [];

    // Nullable primitives use a bitfield to represent whether a value at a
    // certain index is set. This is not needed for non-primitive or
    // non-nullable types.
    const isNullableValueType = !!arraySpec.elementNullable &&
        arraySpec.elementType.$.isValueType;
    const elementHasValue = isNullableValueType ? new Array(numElements) : null;

    if (isNullableValueType) {
      let bitfieldByte = 8;
      let bitfieldBit = 0;

      for (let i = 0; i < numElements; ++i) {
        elementHasValue[i] = arrayDecoder.decodeBool(bitfieldByte, bitfieldBit);
        bitfieldBit++;
        if (bitfieldBit === 8) {
          bitfieldBit = 0;
          bitfieldByte++;
        }
      }
    }

    let byteOffset = 8 +
        mojo.internal.computeHasValueBitfieldSize(arraySpec, numElements);
    const result = new Array(numElements);
    if (arraySpec.elementType === mojo.internal.Bool) {
      for (let i = 0; i < numElements; ++i)
        if (isNullableValueType && !elementHasValue[i]) {
          result[i] = null;
        } else {
          result[i] = arrayDecoder.decodeBool(byteOffset + (i >> 3), i % 8);
        }
    } else {
      for (let i = 0; i < numElements; ++i) {
        if (isNullableValueType && !elementHasValue[i]) {
          result[i] = null;
        } else {
          const element = arraySpec.elementType.$.decode(
            arrayDecoder, byteOffset, 0, !!arraySpec.elementNullable);
          if (element === null && !arraySpec.elementNullable)
            throw new Error('Received unexpected array element');
          result[i] = element;
        }
        byteOffset += arraySpec.elementType.$.arrayElementSize(
            !!arraySpec.elementNullable);
      }
    }
    return result;
  }

  /**
   * @param {!mojo.internal.MapSpec} mapSpec
   * @return {Object|Map}
   */
  decodeMap(mapSpec, offset) {
    const mapOffset = this.decodeOffset(offset);
    if (!mapOffset)
      return null;

    const mapDecoder = new mojo.internal.Decoder(
        new mojo.internal.DataViewWrapper(
            this.data_, mapOffset - this.data_.byteOffset),
        this.handles_, this.context_);
    const mapStructSize = mapDecoder.decodeUint32(0);
    const mapStructVersion = mapDecoder.decodeUint32(4);
    if (mapStructSize != mojo.internal.kMapDataSize || mapStructVersion != 0)
      throw new Error('Received invalid map data');

    const keys = mapDecoder.decodeArray({elementType: mapSpec.keyType}, 8);
    const values = mapDecoder.decodeArray(
        {
          elementType: mapSpec.valueType,
          elementNullable: mapSpec.valueNullable
        },
        16);

    if (keys.length != values.length)
      throw new Error('Received invalid map data');
    if (!mapSpec.keyType.$.isValidObjectKeyType) {
      const map = new Map;
      for (let i = 0; i < keys.length; ++i)
        map.set(keys[i], values[i]);
      return map;
    }

    const map = {};
    for (let i = 0; i < keys.length; ++i)
      map[keys[i]] = values[i];
    return map;
  }

  /**
   * @param {!mojo.internal.StructSpec} structSpec
   * @return {Object}
   */
  decodeStruct(structSpec, offset) {
    const structOffset = this.decodeOffset(offset);
    if (!structOffset)
      return null;

    const decoder = new mojo.internal.Decoder(
        new mojo.internal.DataViewWrapper(
            this.data_, structOffset - this.data_.byteOffset),
        this.handles_, this.context_);
    return decoder.decodeStructInline(structSpec);
  }

  /**
   * @param {!mojo.internal.StructSpec} structSpec
   * @param {number} size
   * @param {number} version
   * @return {boolean}
   */
  isStructHeaderValid(structSpec, size, version) {
    const versions = structSpec.versions;
    for (let i = versions.length - 1; i >= 0; --i) {
      const info = versions[i];
      if (version > info.version) {
        // If it's newer than the next newest version we know about, the only
        // requirement is that it's at least large enough to decode that next
        // newest version.
        return size >= info.packedSize;
      }
      if (version == info.version) {
        // If it IS the next newest version we know about, expect an exact size
        // match.
        return size == info.packedSize;
      }
    }

    // This should be effectively unreachable, because we always generate info
    // for version 0, and the `version` parameter here is guaranteed in practice
    // to be a non-negative value.
    throw new Error(
        `Impossible version ${version} for struct ${structSpec.name}`);
  }

  /**
   * Wraps a data buffer into a data view that can decode each field as needed.
   * @param {!mojo.internal.StructSpec} structSpec
   * @param {!number} byteOffset
   * @param {?} dataViewType
   * @returns {*} instance of dataViewType
   */
  wrapStructInDataView(structSpec, byteOffset, dataViewType) {
    const structOffset = this.decodeOffset(byteOffset);
    if (!structOffset)
      return null;

    const decoder = new mojo.internal.Decoder(
        new mojo.internal.DataViewWrapper(
            this.data_, structOffset - this.data_.byteOffset),
        this.handles_, this.context_);

    const size = decoder.decodeUint32(mojo.internal.kStructHeaderSizeOffset);
    const version =
        decoder.decodeUint32(mojo.internal.kStructHeaderVersionOffset);
    if (!decoder.isStructHeaderValid(structSpec, size, version)) {
      throw new Error(
          `Received ${structSpec.name} of invalid size (${size}) and/or ` +
          `version (${version})`);
    }
    return new dataViewType(decoder, version, structSpec.fields);
  }

  /**
   * @param {!mojo.internal.StructSpec} structSpec
   * @return {!Object}
   */
  decodeStructInline(structSpec) {
    const size = this.decodeUint32(mojo.internal.kStructHeaderSizeOffset);
    const version = this.decodeUint32(mojo.internal.kStructHeaderVersionOffset);
    if (!this.isStructHeaderValid(structSpec, size, version)) {
      throw new Error(
          `Received ${structSpec.name} of invalid size (${size}) and/or ` +
          `version (${version})`);
    }

    const result = {};
    for (let i = 0; i < structSpec.fields.length; ++i) {
      const field = structSpec.fields[i];
      if (mojo.internal.isNullableValueKindField(field)) {
        const props = field.nullableValueKindProperties;
        // We only need to decode the two nullable value fields once. Use the
        // primary.
        if (props.isPrimary) {
          const flagFieldSpec = field;
          result[props.originalFieldName] = this.decodeStructNullableValueField(
              flagFieldSpec, structSpec.fields, version);
        } else {
          // Skip deserializing for non-primary.
          continue;
        }
      } else {
        result[field.name] = this.decodeStructField(field, version);
      }
    }

    return result;
  }

  /**
   * Decodes a struct field for a given version
   * @param {!mojo.internal.StructFieldSpec} structField
   * @param {!number} version
   * @return {*}
   */
  decodeStructField(structField, version) {
    if (structField.minVersion > version) {
      return structField.defaultValue;
    }

    const byteOffset =
        mojo.internal.kStructHeaderSize + structField.packedOffset;
    const value = structField.type.$.decode(
        this, byteOffset, structField.packedBitOffset, !!structField.nullable);

    if (value === null && !structField.nullable) {
      throw new Error(
          `Received ${structField.name} with invalid null field ` +
          `"${structField.name}"`);
    }
    return value;
  }

  /**
   * Decodes a struct nullable value field for a given version
   * Nullable value kinds are encoded as two fields on the wire. One for
   * flag and one for value. decodeStructField will decode both then
   * combine them for the correct result. The two fields are linked
   * together by the field properties.
   * @param {!mojo.internal.StructFieldSpec} flagFieldSpec
   * @param {!Array<mojo.internal.StructFieldSpec>} fieldSpecs the full list
   * of specs are needed in order to find the associated value field spec.
   * @param {!number} version
   * @return {*}
   */
  decodeStructNullableValueField(flagFieldSpec, fieldSpecs, version) {
    if (flagFieldSpec.minVersion > version) {
      return null;
    }

    const flagValue = this.decodeStructField(flagFieldSpec, version);
    if (!flagValue) {
      return null;
    }

    const props = flagFieldSpec.nullableValueKindProperties;
    const valueFieldSpec =
        fieldSpecs.find(spec => spec.name === props.linkedValueFieldName);
    if (!valueFieldSpec) {
      throw new Error(
          'could not find the expected value field spec: ' +
          props.linkedValueFieldName);
    }
    return this.decodeStructField(valueFieldSpec, version);
  }

  /**
   * @param {!mojo.internal.UnionSpec} unionSpec
   * @param {number} offset
   */
  decodeUnionFromPointer(unionSpec, offset) {
    const unionOffset = this.decodeOffset(offset);
    if (!unionOffset)
      return null;

    const decoder = new mojo.internal.Decoder(
        new mojo.internal.DataViewWrapper(
            this.data_, unionOffset - this.data_.byteOffset),
        this.handles_, this.context_);
    return decoder.decodeUnion(unionSpec, 0);
  }

  /**
   * @param {!mojo.internal.UnionSpec} unionSpec
   * @param {number} offset
   */
  decodeUnion(unionSpec, offset) {
    const size = this.decodeUint32(offset);
    if (size === 0)
      return null;

    const ordinal = this.decodeUint32(offset + 4);
    for (const fieldName in unionSpec.fields) {
      const field = unionSpec.fields[fieldName];
      if (field['ordinal'] === ordinal) {
        const fieldValue = (() => {
          const fieldByteOffset = offset + mojo.internal.kUnionHeaderSize;
          // Unions are encoded as pointers when inside other
          // unions.
          if (typeof field['type'].$.unionSpec !== 'undefined') {
            return this.decodeUnionFromPointer(
              field['type'].$.unionSpec, fieldByteOffset);
          }
          return field['type'].$.decode(
            this, fieldByteOffset, 0, field['nullable'])
        })();

        if (fieldValue === null && !field['nullable']) {
          throw new Error(
              `Received ${unionSpec.name} with invalid null ` +
              `field: ${field['name']}`);
        }
        const value = {};
        value[fieldName] = fieldValue;
        return value;
      }
    }
  }

  decodeInterfaceProxy(type, offset) {
    const handle = this.decodeHandle(offset);
    // TODO: support versioning
    if (!handle)
      return null;
    return new type(handle);
  }

  decodeInterfaceRequest(type, offset) {
    const handle = this.decodeHandle(offset);
    if (!handle)
      return null;
    return new type(mojo.internal.interfaceSupport.createEndpoint(handle));
  }

  decodeAssociatedEndpoint(offset) {
    if (!this.context_ || !this.context_.endpoint) {
      throw new Error('cannot deserialize associated endpoint without context');
    }
    const receivingEndpoint = this.context_.endpoint;
    const message = new DataView(this.data_.buffer);
    const interfaceIdsOffset = Number(mojo.internal.getUint64(message, 40));
    const numInterfaceIds = message.getUint32(
        interfaceIdsOffset + 44, mojo.internal.kHostLittleEndian);
    const interfaceIds = new Uint32Array(
        message.buffer,
        interfaceIdsOffset + mojo.internal.kArrayHeaderSize + 40,
        numInterfaceIds);
    const index = this.decodeUint32(offset);
    const interfaceId = interfaceIds[index];
    const endpoint = new mojo.internal.interfaceSupport.Endpoint(
        receivingEndpoint.router, interfaceId);
    receivingEndpoint.router.addEndpoint(endpoint, interfaceId);
    return endpoint;
  }
};

/** @type {TextDecoder} */
mojo.internal.Decoder.textDecoder = null;

/**
 * @typedef {{
 *   headerSize: number,
 *   headerVersion: number,
 *   interfaceId: number,
 *   ordinal: number,
 *   flags: number,
 *   requestId: number,
 * }}
 */
mojo.internal.MessageHeader;

/**
 * @param {!mojo.internal.DataViewWrapper} data
 * @return {!mojo.internal.MessageHeader}
 */
mojo.internal.deserializeMessageHeader = function(data) {
  const headerSize = data.getUint32(0, mojo.internal.kHostLittleEndian);
  const headerVersion = data.getUint32(4, mojo.internal.kHostLittleEndian);
  if ((headerVersion == 0 &&
       headerSize != mojo.internal.kMessageV0HeaderSize) ||
      (headerVersion == 1 &&
       headerSize != mojo.internal.kMessageV1HeaderSize) ||
      (headerVersion >= 2 &&
       headerSize < mojo.internal.kMessageV2HeaderSize)) {
    throw new Error('Received invalid message header');
  }
  return {
    headerSize,
    headerVersion,
    interfaceId: data.getUint32(8, mojo.internal.kHostLittleEndian),
    ordinal: data.getUint32(12, mojo.internal.kHostLittleEndian),
    flags: data.getUint32(16, mojo.internal.kHostLittleEndian),
    requestId: (headerVersion < 1) ?
        0 :
        data.getUint32(24, mojo.internal.kHostLittleEndian),
  };
};

/**
 * @typedef {{
 *   encode: function(*, !mojo.internal.Encoder, number, number, boolean),
 *   encodeNull: function(!mojo.internal.Encoder, number),
 *   decode: function(!mojo.internal.Decoder, number, number, boolean):*,
 *   computeDimensions:
 *       ((function(*, boolean):!mojo.internal.MessageDimensions)|undefined),
 *   isValidObjectKeyType: boolean,
 *   hasInterfaceId: (boolean|undefined),
 *   arrayElementSize: ((function(boolean):number)|undefined),
 *   arraySpec: (!mojo.internal.ArraySpec|undefined),
 *   mapSpec: (!mojo.internal.MapSpec|undefined),
 *   structSpec: (!mojo.internal.StructSpec|undefined),
 *   isValueType: boolean
 * }}
 */
mojo.internal.MojomTypeInfo;

/**
 * @typedef {{
 *   $: !mojo.internal.MojomTypeInfo
 * }}
 */
mojo.internal.MojomType;

/**
 * @typedef {{
 *   elementType: !mojo.internal.MojomType,
 *   elementNullable: (boolean|undefined)
 * }}
 */
mojo.internal.ArraySpec;

/**
 * @typedef {{
 *   keyType: !mojo.internal.MojomType,
 *   valueType: !mojo.internal.MojomType,
 *   valueNullable: boolean
 * }}
 */
mojo.internal.MapSpec;

// Use a @record, otherwise Closure Compiler will mangle the property names and
// cause runtime errors.
/** @record */
mojo.internal.NullableValueKindProperties = class {
  constructor() {
    /** @export { boolean } */
    this.isPrimary;
    /** @export { (string|undefined) } */
    this.linkedValueFieldName;
    /** @export { string } */
    this.originalFieldName;
  }
};

/**
 * Getter is a function that returns the value of the field in mojo format. Its
 * only provided parameter should be a non-nullable struct instance. If a getter
 * method is not provided, the field will be retrieved through the field name
 * on the struct instance.
 *
 * @typedef {{
 *   name: string,
 *   packedOffset: number,
 *   packedBitOffset: number,
 *   type: !mojo.internal.MojomType,
 *   defaultValue: *,
 *   nullable: boolean,
 *   minVersion: number,
 *   nullableValueKindProperties:
 *      (mojo.internal.NullableValueKindProperties|undefined),
 *   fieldGetter: ((function(!*): *)|undefined)}}
 */
mojo.internal.StructFieldSpec;

/**
 * @typedef {{
 *   version: number,
 *   packedSize: number,
 * }}
 */
mojo.internal.StructVersionInfo;

/**
 * @typedef {{
 *   name: string,
 *   packedSize: number,
 *   fields: !Array<!mojo.internal.StructFieldSpec>,
 *   versions: !Array<!mojo.internal.StructVersionInfo>,
 * }}
 */
mojo.internal.StructSpec;

/**
 * @typedef {{
 *   name: string,
 *   ordinal: number,
 *   nullable: boolean
 * }}
 */
mojo.internal.UnionFieldSpec;

/**
 * @typedef {{
 *   name: string,
 *   fields: !Object<string, !mojo.internal.UnionFieldSpec>
 * }}
 */
mojo.internal.UnionSpec;

/**
 * @const {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Bool = {
  $: {
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeBool(byteOffset, bitOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {
      throw new Error('encoding bool null from type is not implemented');
    },
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeBool(byteOffset, bitOffset);
    },
    // Bool has specialized serialize/deserialize logic to bit pack. However,
    // memory allocation is still a single byte.
    arrayElementSize: nullable => 1,
    isValidObjectKeyType: true,
    isValueType: true,
  },
};

/**
 * @const {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Int8 = {
  $: {
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeInt8(byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {
      encoder.encodeInt8(byteOffset, 0);
    },
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeInt8(byteOffset);
    },
    arrayElementSize: nullable => 1,
    isValidObjectKeyType: true,
    isValueType: true,
  },
};

/**
 * @const {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Uint8 = {
  $: {
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeUint8(byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {
      encoder.encodeUint8(byteOffset, 0);
    },
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeUint8(byteOffset);
    },
    arrayElementSize: nullable => 1,
    isValidObjectKeyType: true,
    isValueType: true,
  },
};

/**
 * @const {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Int16 = {
  $: {
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeInt16(byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {
      encoder.encodeInt16(byteOffset, 0);
    },
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeInt16(byteOffset);
    },
    arrayElementSize: nullable => 2,
    isValidObjectKeyType: true,
    isValueType: true,
  },
};

/**
 * @const {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Uint16 = {
  $: {
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeUint16(byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {
      encoder.encodeUint16(byteOffset, 0);
    },
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeUint16(byteOffset);
    },
    arrayElementSize: nullable => 2,
    isValidObjectKeyType: true,
    isValueType: true,
  },
};

/**
 * @const {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Int32 = {
  $: {
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeInt32(byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {
      encoder.encodeInt32(byteOffset, 0);
    },
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeInt32(byteOffset);
    },
    arrayElementSize: nullable => 4,
    isValidObjectKeyType: true,
    isValueType: true,
  },
};

/**
 * @const {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Uint32 = {
  $: {
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeUint32(byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {
      encoder.encodeUint32(byteOffset, 0);
    },
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeUint32(byteOffset);
    },
    arrayElementSize: nullable => 4,
    isValidObjectKeyType: true,
    isValueType: true,
  },
};

/**
 * @const {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Int64 = {
  $: {
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeInt64(byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {
      encoder.encodeInt64(byteOffset, 0);
    },
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeInt64(byteOffset);
    },
    arrayElementSize: nullable => 8,
    // TS Compiler does not allow Object maps to have bigint keys.
    isValidObjectKeyType: false,
    isValueType: true,
  },
};

/**
 * @const {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Uint64 = {
  $: {
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeUint64(byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {
      encoder.encodeUint64(byteOffset, 0);
    },
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeUint64(byteOffset);
    },
    arrayElementSize: nullable => 8,
    // TS Compiler does not allow Object maps to have bigint keys.
    isValidObjectKeyType: false,
    isValueType: true,
  },
};

/**
 * @const {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Float = {
  $: {
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeFloat(byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {
      encoder.encodeFloat(byteOffset, 0);
    },
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeFloat(byteOffset);
    },
    arrayElementSize: nullable => 4,
    isValidObjectKeyType: true,
    isValueType: true,
  },
};

/**
 * @const {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Double = {
  $: {
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeDouble(byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {
      encoder.encodeDouble(byteOffset, 0);
    },
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeDouble(byteOffset);
    },
    arrayElementSize: nullable => 8,
    isValidObjectKeyType: true,
    isValueType: true,
  },
};

/**
 * @const {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Handle = {
  $: {
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeHandle(byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {
      encoder.encodeUint32(byteOffset, 0xffffffff);
    },
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeHandle(byteOffset);
    },
    arrayElementSize: nullable => 4,
    isValidObjectKeyType: false,
    isValueType: false,
  },
};

/**
 * @const {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.String = {
  $: {
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeString(byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {},
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeString(byteOffset);
    },
    computeDimensions: function(value, nullable) {
      const size = mojo.internal.computeTotalArraySize(
          {elementType: mojo.internal.Uint8},
          mojo.internal.Encoder.stringToUtf8Bytes(value));
      return {size};
    },
    arrayElementSize: nullable => 8,
    isValidObjectKeyType: true,
    isValueType: false,
  }
};

/**
 * @param {!mojo.internal.MojomType} elementType
 * @param {boolean} elementNullable
 * @return {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Array = function(elementType, elementNullable) {
  /** @type {!mojo.internal.ArraySpec} */
  const arraySpec = {
    elementType: elementType,
    elementNullable: elementNullable,
  };
  return {
    $: {
      arraySpec: arraySpec,
      encode: function(value, encoder, byteOffset, bitOffset, nullable) {
        encoder.encodeArray(arraySpec, byteOffset, value);
      },
      encodeNull: function(encoder, byteOffset) {},
      decode: function(decoder, byteOffset, bitOffset, nullable) {
        return decoder.decodeArray(arraySpec, byteOffset);
      },
      computeDimensions: function(value, nullable) {
        return {size: mojo.internal.computeTotalArraySize(arraySpec, value)};
      },
      arrayElementSize: nullable => 8,
      isValidObjectKeyType: false,
      isValueType: false,
    },
  };
};

/**
 * @param {!mojo.internal.MojomType} keyType
 * @param {!mojo.internal.MojomType} valueType
 * @param {boolean} valueNullable
 * @return {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Map = function(keyType, valueType, valueNullable) {
  /** @type {!mojo.internal.MapSpec} */
  const mapSpec = {
    keyType: keyType,
    valueType: valueType,
    valueNullable: valueNullable,
  };
  return {
    $: {
      mapSpec: mapSpec,
      encode: function(value, encoder, byteOffset, bitOffset, nullable) {
        encoder.encodeMap(mapSpec, byteOffset, value);
      },
      encodeNull: function(encoder, byteOffset) {},
      decode: function(decoder, byteOffset, bitOffset, nullable) {
        return decoder.decodeMap(mapSpec, byteOffset);
      },
      computeDimensions: function(value, nullable) {
        const keys =
            (value.constructor.name == 'Map') ? Array.from(value.keys())
                                              : Object.keys(value);
        const values =
            (value.constructor.name == 'Map') ? Array.from(value.values())
                                              : keys.map(k => value[k]);
        // Size of map is equal to kMapDataSize + 8-byte aligned array for keys
        // + (not necessarily 8-byte aligned) array for values.
        const size = mojo.internal.kMapDataSize +
            mojo.internal.align(
                mojo.internal.computeTotalArraySize(
                    {elementType: keyType}, keys),
              8) +
            mojo.internal.computeTotalArraySize(
                {
                  elementType: valueType,
                  elementNullable: valueNullable,
                },
                values);
        return {size};
      },
      arrayElementSize: nullable => 8,
      isValidObjectKeyType: false,
      isValueType: false,
    },
  };
};

/**
 * @return {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.Enum = function() {
  return {
    $: {
      encode: function(value, encoder, byteOffset, bitOffset, nullable) {
        // TODO: Do some sender-side error checking on the input value.
        encoder.encodeUint32(byteOffset, value);
      },
      encodeNull: function(encoder, byteOffset) {},
      decode: function(decoder, byteOffset, bitOffset, nullable) {
        const value = decoder.decodeInt32(byteOffset);
        // TODO: validate
        return value;
      },
      arrayElementSize: nullable => 4,
      isValidObjectKeyType: true,
      isValueType: true,
    },
  };
};

/**
 * @param {string} name
 * @param {number} packedOffset
 * @param {number} packedBitOffset
 * @param {!mojo.internal.MojomType} type
 * @param {*} defaultValue
 * @param {boolean} nullable
 * @param {number=} minVersion
 * @param {mojo.internal.NullableValueKindProperties=}
     nullableValueKindProperties
 * @param {(function(*): *)=} fieldGetter
 * @return {!mojo.internal.StructFieldSpec}
 * @export
 */
mojo.internal.StructField = function(
    name, packedOffset, packedBitOffset, type, defaultValue, nullable,
    minVersion = 0, nullableValueKindProperties = undefined,
    fieldGetter = undefined) {
  return {
    name: name,
    packedOffset: packedOffset,
    packedBitOffset: packedBitOffset,
    type: type,
    defaultValue: defaultValue,
    nullable: nullable,
    minVersion: minVersion,
    nullableValueKindProperties: nullableValueKindProperties,
    fieldGetter: fieldGetter,
  };
};

/**
 * @param {!Object} objectToBlessAsType
 * @param {string} name
 * @param {!Array<!mojo.internal.StructFieldSpec>} fields
 * @param {Array<!Array<number>>=} versionData
 * @export
 */
mojo.internal.Struct = function(
    objectToBlessAsType, name, fields, versionData) {
  const versions = versionData.map(v => ({version: v[0], packedSize: v[1]}));
  const packedSize = versions[versions.length - 1].packedSize;
  const structSpec = {name, packedSize, fields, versions};
  objectToBlessAsType.$ = {
    structSpec: structSpec,
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeStruct(structSpec, byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {},
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeStruct(structSpec, byteOffset);
    },
    computeDimensions: function(value, nullable) {
      return mojo.internal.computeStructDimensions(structSpec, value);
    },
    arrayElementSize: nullable => 8,
    isValidObjectKeyType: false,
  };
};

/**
 * Represents a struct that has been typemapped.
 * @param {!Object} objectToBlessAsType
 * @param {string} name
 * @param {!typeof Object} dataViewType
 * @param {*} converter
 * @param {!Array<!mojo.internal.StructFieldSpec>} fields
 * @param {Array<!Array<number>>=} versionData
 * @export
 */
mojo.internal.TypemappedStruct = function(
    objectToBlessAsType, name, dataViewType, converter, fields, versionData) {
  const versions = versionData.map(v => ({version: v[0], packedSize: v[1]}));
  const packedSize = versions[versions.length - 1].packedSize;
  const structSpec = {name, packedSize, fields, versions};
  objectToBlessAsType.$ = {
    structSpec: structSpec,
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeStruct(structSpec, byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {},
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      const view =
          decoder.wrapStructInDataView(structSpec, byteOffset, dataViewType);
      // Property access here is used to prevent Closure Compiler from mangling
      // the method name.
      return mojo.internal.isNullOrUndefined(view) ? null :
                                                     converter['convert'](view);
    },
    computeDimensions: function(value, nullable) {
      return mojo.internal.computeStructDimensions(structSpec, value);
    },
    arrayElementSize: nullable => 8,
    isValidObjectKeyType: false,
  };
};

/**
 * @param {!mojo.internal.MojomType} structMojomType
 * @return {!Function}
 * @export
 */
mojo.internal.createStructDeserializer = function(structMojomType) {
  return function(dataView) {
    if (structMojomType.$ == undefined ||
        structMojomType.$.structSpec == undefined) {
      throw new Error('Invalid struct mojom type!');
    }
    const decoder = new mojo.internal.Decoder(dataView, []);
    return decoder.decodeStructInline(structMojomType.$.structSpec);
  };
};

/**
 * @param {!Object} objectToBlessAsUnion
 * @param {string} name
 * @param {!Object} fields
 * @export
 */
mojo.internal.Union = function(objectToBlessAsUnion, name, fields) {
  /** @type {!mojo.internal.UnionSpec} */
  const unionSpec = {
    name: name,
    fields: fields,
  };
  objectToBlessAsUnion.$ = {
    unionSpec: unionSpec,
    encode: function(value, encoder, byteOffset, bitOffset, nullable) {
      encoder.encodeUnion(unionSpec, byteOffset, value);
    },
    encodeNull: function(encoder, byteOffset) {},
    decode: function(decoder, byteOffset, bitOffset, nullable) {
      return decoder.decodeUnion(unionSpec, byteOffset);
    },
    computeDimensions: function(value, nullable) {
      return mojo.internal.computeUnionDimensions(unionSpec, nullable, value);
    },
    arrayElementSize: nullable => (nullable ? 8 : 16),
    isValidObjectKeyType: false,
  };
};

/**
 * @return {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.InterfaceProxy = function(type) {
  return {
    $: {
      encode: function(value, encoder, byteOffset, bitOffset, nullable) {
        const endpoint = value.proxy.unbind();
        console.assert(endpoint, `unexpected null ${type.name}`);

        const pipe = endpoint.releasePipe();
        encoder.encodeHandle(byteOffset, pipe);
        encoder.encodeUint32(byteOffset + 4, 0);  // TODO: Support versioning
      },
      encodeNull: function(encoder, byteOffset) {
        encoder.encodeUint32(byteOffset, 0xffffffff);
      },
      decode: function(decoder, byteOffset, bitOffset, nullable) {
        return decoder.decodeInterfaceProxy(type, byteOffset);
      },
      arrayElementSize: nullable => 8,
      isValidObjectKeyType: false,
      isValueType: false,
    },
  };
};

/**
 * @return {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.InterfaceRequest = function(type) {
  return {
    $: {
      encode: function(value, encoder, byteOffset, bitOffset, nullable) {
        if (!value.handle)
          throw new Error('Unexpected null ' + type.name);

        encoder.encodeHandle(byteOffset, value.handle.releasePipe());
      },
      encodeNull: function(encoder, byteOffset) {
        encoder.encodeUint32(byteOffset, 0xffffffff);
      },
      decode: function(decoder, byteOffset, bitOffset, nullable) {
        return decoder.decodeInterfaceRequest(type, byteOffset);
      },
      arrayElementSize: nullable => 8,
      isValidObjectKeyType: false,
      isValueType: false,
    },
  };
};

/**
 * @return {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.AssociatedInterfaceProxy = function(type) {
  return {
    $: {
      type: type,
      encode: function(value, encoder, byteOffset, bitOffset, nullable) {
        console.assert(
            value.proxy.endpoint && value.proxy.endpoint.isPendingAssociation,
            `expected ${type.name} to be associated and unbound`);
        encoder.encodeAssociatedEndpoint(byteOffset, value.proxy.endpoint);
        encoder.encodeUint32(byteOffset + 4, 0);
      },
      encodeNull: function(encoder, byteOffset) {
        encoder.encodeUint32(byteOffset, 0xffffffff);
        encoder.encodeUint32(byteOffset + 4, 0);
      },
      decode: function(decoder, byteOffset, bitOffset, nullable) {
        return new type(decoder.decodeAssociatedEndpoint(byteOffset));
      },
      arrayElementSize: _ => {
        throw new Error('Arrays of associated endpoints are not yet supported');
      },
      isValidObjectKeyType: false,
      hasInterfaceId: true,
      isValueType: false,
    },
  };
};

/**
 * @return {!mojo.internal.MojomType}
 * @export
 */
mojo.internal.AssociatedInterfaceRequest = function(type) {
  return {
    $: {
      type: type,
      encode: function(value, encoder, byteOffset, bitOffset, nullable) {
        console.assert(
            value.handle && value.handle.isPendingAssociation,
            `expected ${type.name} to be associated and unbound`);

        encoder.encodeAssociatedEndpoint(byteOffset, value.handle);
      },
      encodeNull: function(encoder, byteOffset) {
        encoder.encodeUint32(byteOffset, 0xffffffff);
      },
      decode: function(decoder, byteOffset, bitOffset, nullable) {
        return new type(decoder.decodeAssociatedEndpoint(byteOffset));
      },
      arrayElementSize: _ => {
        throw new Error('Arrays of associated endpoints are not yet supported');
      },
      isValidObjectKeyType: false,
      hasInterfaceId: true,
      isValueType: false,
    },
  };
};

/**
 * A helper function to avoid having to export many of the types and
 * functions in this class. This is used by typemapping.
 * @param {!mojo.internal.Decoder} decoder
 * @param {!mojo.internal.StructFieldSpec} fieldSpec
 * @param {!number} version
 * @return {*}
 * @export
 */
mojo.internal.decodeStructField = function(decoder, fieldSpec, version) {
  return decoder.decodeStructField(fieldSpec, version);
};

/**
 * A helper function to avoid having to export many of the types and
 * functions in this class. This is used by typemapping.
 * The linked value lookup is done here to avoid Closure name mangling.
 * @param {!mojo.internal.Decoder} decoder
 * @param {!mojo.internal.StructFieldSpec} flagFieldSpec
 * @param {!Array<mojo.internal.StructFieldSpec>} fieldSpecs
 * @param {!number} version
 * @return {*}
 * @export
 */
mojo.internal.decodeStructNullableValueField = function(
    decoder, flagFieldSpec, fieldSpecs, version) {
  flagFieldSpec.nullableValueKindProperties.linkedValueFieldName;
  return decoder.decodeStructNullableValueField(
      flagFieldSpec, fieldSpecs, version);
};
// mojo/public/interfaces/bindings/interface_control_messages.mojom-lite.js is auto generated by mojom_bindings_generator.py, do not edit







/**
 * @const { !number }
 * @export
 */
mojo.interfaceControl.RUN_MESSAGE_ID = 0xFFFFFFFF;

/**
 * @const { !number }
 * @export
 */
mojo.interfaceControl.RUN_OR_CLOSE_PIPE_MESSAGE_ID = 0xFFFFFFFE;




/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.interfaceControl.RunMessageParamsSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.interfaceControl.RunResponseMessageParamsSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.interfaceControl.QueryVersionSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.interfaceControl.QueryVersionResultSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.interfaceControl.FlushForTestingSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.interfaceControl.RunOrClosePipeMessageParamsSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.interfaceControl.RequireVersionSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.interfaceControl.EnableIdleTrackingSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.interfaceControl.MessageAckSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.interfaceControl.NotifyIdleSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType} }
 * @export
 */
mojo.interfaceControl.RunInputSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType} }
 * @export
 */
mojo.interfaceControl.RunOutputSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType} }
 * @export
 */
mojo.interfaceControl.RunOrClosePipeInputSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };




mojo.internal.Struct(
    mojo.interfaceControl.RunMessageParamsSpec.$,
    'RunMessageParams',
    [
      mojo.internal.StructField(
        'input', 0,
        0,
        mojo.interfaceControl.RunInputSpec.$,
        null,
        false, /* nullable */
        0 /* minVersion */,
      ),
    ],
    [[0, 24],]);





/** @record */
mojo.interfaceControl.RunMessageParams = class {
  constructor() {
    /** @export { !mojo.interfaceControl.RunInput } */
    this.input;}
};



mojo.internal.Struct(
    mojo.interfaceControl.RunResponseMessageParamsSpec.$,
    'RunResponseMessageParams',
    [
      mojo.internal.StructField(
        'output', 0,
        0,
        mojo.interfaceControl.RunOutputSpec.$,
        null,
        true, /* nullable */
        0 /* minVersion */,
      ),
    ],
    [[0, 24],]);





/** @record */
mojo.interfaceControl.RunResponseMessageParams = class {
  constructor() {
    /** @export { (mojo.interfaceControl.RunOutput|undefined) } */
    this.output;}
};



mojo.internal.Struct(
    mojo.interfaceControl.QueryVersionSpec.$,
    'QueryVersion',
    [
    ],
    [[0, 8],]);





/** @record */
mojo.interfaceControl.QueryVersion = class {
  constructor() {}
};



mojo.internal.Struct(
    mojo.interfaceControl.QueryVersionResultSpec.$,
    'QueryVersionResult',
    [
      mojo.internal.StructField(
        'version', 0,
        0,
        mojo.internal.Uint32,
        0,
        false, /* nullable */
        0 /* minVersion */,
      ),
    ],
    [[0, 16],]);





/** @record */
mojo.interfaceControl.QueryVersionResult = class {
  constructor() {
    /** @export { !number } */
    this.version;}
};



mojo.internal.Struct(
    mojo.interfaceControl.FlushForTestingSpec.$,
    'FlushForTesting',
    [
    ],
    [[0, 8],]);





/** @record */
mojo.interfaceControl.FlushForTesting = class {
  constructor() {}
};



mojo.internal.Struct(
    mojo.interfaceControl.RunOrClosePipeMessageParamsSpec.$,
    'RunOrClosePipeMessageParams',
    [
      mojo.internal.StructField(
        'input', 0,
        0,
        mojo.interfaceControl.RunOrClosePipeInputSpec.$,
        null,
        false, /* nullable */
        0 /* minVersion */,
      ),
    ],
    [[0, 24],]);





/** @record */
mojo.interfaceControl.RunOrClosePipeMessageParams = class {
  constructor() {
    /** @export { !mojo.interfaceControl.RunOrClosePipeInput } */
    this.input;}
};



mojo.internal.Struct(
    mojo.interfaceControl.RequireVersionSpec.$,
    'RequireVersion',
    [
      mojo.internal.StructField(
        'version', 0,
        0,
        mojo.internal.Uint32,
        0,
        false, /* nullable */
        0 /* minVersion */,
      ),
    ],
    [[0, 16],]);





/** @record */
mojo.interfaceControl.RequireVersion = class {
  constructor() {
    /** @export { !number } */
    this.version;}
};



mojo.internal.Struct(
    mojo.interfaceControl.EnableIdleTrackingSpec.$,
    'EnableIdleTracking',
    [
      mojo.internal.StructField(
        'timeoutInMicroseconds', 0,
        0,
        mojo.internal.Int64,
        BigInt(0),
        false, /* nullable */
        0 /* minVersion */,
      ),
    ],
    [[0, 16],]);





/** @record */
mojo.interfaceControl.EnableIdleTracking = class {
  constructor() {
    /** @export { !bigint } */
    this.timeoutInMicroseconds;}
};



mojo.internal.Struct(
    mojo.interfaceControl.MessageAckSpec.$,
    'MessageAck',
    [
    ],
    [[0, 8],]);





/** @record */
mojo.interfaceControl.MessageAck = class {
  constructor() {}
};



mojo.internal.Struct(
    mojo.interfaceControl.NotifyIdleSpec.$,
    'NotifyIdle',
    [
    ],
    [[0, 8],]);





/** @record */
mojo.interfaceControl.NotifyIdle = class {
  constructor() {}
};



mojo.internal.Union(
    mojo.interfaceControl.RunInputSpec.$, 'RunInput',
    {
      'queryVersion': {
        'ordinal': 0,
        'type': mojo.interfaceControl.QueryVersionSpec.$,
      },
      'flushForTesting': {
        'ordinal': 1,
        'type': mojo.interfaceControl.FlushForTestingSpec.$,
      },
    });


mojo.internal.Union(
    mojo.interfaceControl.RunOutputSpec.$, 'RunOutput',
    {
      'queryVersionResult': {
        'ordinal': 0,
        'type': mojo.interfaceControl.QueryVersionResultSpec.$,
      },
    });


mojo.internal.Union(
    mojo.interfaceControl.RunOrClosePipeInputSpec.$, 'RunOrClosePipeInput',
    {
      'requireVersion': {
        'ordinal': 0,
        'type': mojo.interfaceControl.RequireVersionSpec.$,
      },
      'enableIdleTracking': {
        'ordinal': 1,
        'type': mojo.interfaceControl.EnableIdleTrackingSpec.$,
      },
      'messageAck': {
        'ordinal': 2,
        'type': mojo.interfaceControl.MessageAckSpec.$,
      },
      'notifyIdle': {
        'ordinal': 3,
        'type': mojo.interfaceControl.NotifyIdleSpec.$,
      },
    });
// mojo/public/interfaces/bindings/pipe_control_messages.mojom-lite.js is auto generated by mojom_bindings_generator.py, do not edit







/**
 * @const { !number }
 * @export
 */
mojo.pipeControl.RUN_OR_CLOSE_PIPE_MESSAGE_ID = 0xFFFFFFFE;




/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.pipeControl.RunOrClosePipeMessageParamsSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.pipeControl.DisconnectReasonSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.pipeControl.PeerAssociatedEndpointClosedEventSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.pipeControl.PauseUntilFlushCompletesSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType}}
 * @export
 */
mojo.pipeControl.FlushAsyncSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };


/**
 * @const { {$:!mojo.internal.MojomType} }
 * @export
 */
mojo.pipeControl.RunOrClosePipeInputSpec =
    { $: /** @type {!mojo.internal.MojomType} */ ({}) };




mojo.internal.Struct(
    mojo.pipeControl.RunOrClosePipeMessageParamsSpec.$,
    'RunOrClosePipeMessageParams',
    [
      mojo.internal.StructField(
        'input', 0,
        0,
        mojo.pipeControl.RunOrClosePipeInputSpec.$,
        null,
        false, /* nullable */
        0 /* minVersion */,
      ),
    ],
    [[0, 24],]);





/** @record */
mojo.pipeControl.RunOrClosePipeMessageParams = class {
  constructor() {
    /** @export { !mojo.pipeControl.RunOrClosePipeInput } */
    this.input;}
};



mojo.internal.Struct(
    mojo.pipeControl.DisconnectReasonSpec.$,
    'DisconnectReason',
    [
      mojo.internal.StructField(
        'customReason', 0,
        0,
        mojo.internal.Uint32,
        0,
        false, /* nullable */
        0 /* minVersion */,
      ),
      mojo.internal.StructField(
        'description', 8,
        0,
        mojo.internal.String,
        null,
        false, /* nullable */
        0 /* minVersion */,
      ),
    ],
    [[0, 24],]);





/** @record */
mojo.pipeControl.DisconnectReason = class {
  constructor() {
    /** @export { !number } */
    this.customReason;
    /** @export { !string } */
    this.description;}
};



mojo.internal.Struct(
    mojo.pipeControl.PeerAssociatedEndpointClosedEventSpec.$,
    'PeerAssociatedEndpointClosedEvent',
    [
      mojo.internal.StructField(
        'id', 0,
        0,
        mojo.internal.Uint32,
        0,
        false, /* nullable */
        0 /* minVersion */,
      ),
      mojo.internal.StructField(
        'disconnectReason', 8,
        0,
        mojo.pipeControl.DisconnectReasonSpec.$,
        null,
        true, /* nullable */
        0 /* minVersion */,
      ),
    ],
    [[0, 24],]);





/** @record */
mojo.pipeControl.PeerAssociatedEndpointClosedEvent = class {
  constructor() {
    /** @export { !number } */
    this.id;
    /** @export { (mojo.pipeControl.DisconnectReason|undefined) } */
    this.disconnectReason;}
};



mojo.internal.Struct(
    mojo.pipeControl.PauseUntilFlushCompletesSpec.$,
    'PauseUntilFlushCompletes',
    [
      mojo.internal.StructField(
        'flushPipe', 0,
        0,
        mojo.internal.Handle,
        null,
        false, /* nullable */
        0 /* minVersion */,
      ),
    ],
    [[0, 16],]);





/** @record */
mojo.pipeControl.PauseUntilFlushCompletes = class {
  constructor() {
    /** @export { !MojoHandle } */
    this.flushPipe;}
};



mojo.internal.Struct(
    mojo.pipeControl.FlushAsyncSpec.$,
    'FlushAsync',
    [
      mojo.internal.StructField(
        'flusherPipe', 0,
        0,
        mojo.internal.Handle,
        null,
        false, /* nullable */
        0 /* minVersion */,
      ),
    ],
    [[0, 16],]);





/** @record */
mojo.pipeControl.FlushAsync = class {
  constructor() {
    /** @export { !MojoHandle } */
    this.flusherPipe;}
};



mojo.internal.Union(
    mojo.pipeControl.RunOrClosePipeInputSpec.$, 'RunOrClosePipeInput',
    {
      'peerAssociatedEndpointClosedEvent': {
        'ordinal': 0,
        'type': mojo.pipeControl.PeerAssociatedEndpointClosedEventSpec.$,
      },
      'pauseUntilFlushCompletes': {
        'ordinal': 1,
        'type': mojo.pipeControl.PauseUntilFlushCompletesSpec.$,
      },
      'flushAsync': {
        'ordinal': 2,
        'type': mojo.pipeControl.FlushAsyncSpec.$,
      },
    });
// Copyright 2018 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Reprents a message in the router's message queue that is ready for dispatch
 * to an endpoint. This is needed because there are times when the router
 * is not able to dispatch a message (e.g. if an interface client has not been
 * bound yet). In those cases, the router must hold onto the message in its own
 * message queue until dispatch is possible.
 *
 * @typedef {{
 *   header: !mojo.internal.MessageHeader,
 *   buffer: !ArrayBuffer,
 *   handles: !Array<MojoHandle>,
 * }}
 */
mojo.internal.interfaceSupport.RouterMessage;

/**
 * Owns a single message pipe handle and facilitates message sending and routing
 * on behalf of all the pipe's local Endpoints.
 */
mojo.internal.interfaceSupport.Router = class {
  /**
   * @param {!MojoHandle} pipe
   * @param {boolean} setNamespaceBit
   * @public
   */
  constructor(pipe, setNamespaceBit) {
    /** @const {!MojoHandle} */
    this.pipe_ = pipe;

    /** @const {!Array<mojo.internal.interfaceSupport.RouterMessage>}*/
    this.messages_ = [];
    /**
     * Flag used to keep track of message dispatch. This is necessary because
     * it is possible that a message dispatch could trigger additional message
     * dispatch. The dispatch logic should check that this flag is not set
     * before attempting to dispatch messages.
     *
     * @type {boolean}
     */
    this.dispatchInProgress_ = false;

    /** @const {!mojo.internal.interfaceSupport.HandleReader} */
    this.reader_ = new mojo.internal.interfaceSupport.HandleReader(pipe);
    this.reader_.onRead = this.onMessageReceived_.bind(this);
    this.reader_.onError = this.onError_.bind(this);

    /** @const {!Map<number, !mojo.internal.interfaceSupport.Endpoint>} */
    this.endpoints_ = new Map();

    /** @private {number} */
    this.nextInterfaceId_ = 1;

    /** @const {number} */
    this.interfaceIdNamespace_ =
        setNamespaceBit ? mojo.internal.kInterfaceNamespaceBit : 0;

    /** @const {!mojo.internal.interfaceSupport.PipeControlMessageHandler} */
    this.pipeControlHandler_ =
        new mojo.internal.interfaceSupport.PipeControlMessageHandler(
            this, this.onPeerEndpointClosed_.bind(this));
  }

  /** @return {!MojoHandle} */
  get pipe() {
    return this.pipe_;
  }

  /** @return {number} */
  generateInterfaceId() {
    return (this.nextInterfaceId_++ | this.interfaceIdNamespace_) >>> 0;
  }

  /**
   * @param {!mojo.internal.interfaceSupport.Endpoint} endpoint
   * @param {number} interfaceId
   */
  addEndpoint(endpoint, interfaceId) {
    if (interfaceId === 0) {
      this.reader_.start();
    }
    console.assert(
        this.isReading(), 'adding a secondary endpoint with no primary');
    this.endpoints_.set(interfaceId, endpoint);
    this.dispatchMessages_();
  }

  /** @param {number} interfaceId */
  removeEndpoint(interfaceId) {
    this.endpoints_.delete(interfaceId);
    if (interfaceId === 0) {
      this.reader_.stop();
    }
  }

  close() {
    console.assert(
        this.endpoints_.size === 0,
        'closing primary endpoint with secondary endpoints still bound');
    this.reader_.stopAndCloseHandle();
  }

  /** @param {number} interfaceId */
  closeEndpoint(interfaceId) {
    this.removeEndpoint(interfaceId);
    if (interfaceId === 0) {
      this.close();
    } else {
      this.pipeControlHandler_.notifyEndpointClosed(interfaceId);
    }
  }

  /** @return {boolean} */
  isReading() {
    return !this.reader_.isStopped();
  }

  /** @param {!mojo.internal.Message} message */
  send(message) {
    this.pipe_.writeMessage(message.buffer, message.handles);
  }

  /**
   * @param {!ArrayBuffer} buffer
   * @param {!Array<MojoHandle>} handles
   */
  onMessageReceived_(buffer, handles) {
    if (!this.checkSize_(buffer)) {
      return;
    }

    const header = mojo.internal.deserializeMessageHeader(
        new mojo.internal.DataViewWrapper(buffer));
    if (this.pipeControlHandler_.maybeHandleMessage(header, buffer)) {
      return;
    }

    this.messages_.push({
      header: header,
      buffer: buffer,
      handles: handles,
    });

    this.dispatchMessages_();
  }

  /**
   * Does a preliminary check to see if the buffer is a well formed mojo
   * message.
   *
   * @param {ArrayBuffer} buffer
   * @returns true if size is big enough to be a potential mojo message,
   * false otherwise
   */
  checkSize_(buffer) {
    if (buffer.byteLength < mojo.internal.kMessageV0HeaderSize) {
      console.error('Rejecting undersized message');
      this.onError_();
      return false;
    }

    return true
  }

  /**
   * Dispatch all the messages currently in the router's message queue.
   */
  dispatchMessages_() {
    if (this.dispatchInProgress_) {
      return;
    }

    this.dispatchInProgress_ = true;

    while (this.messages_.length > 0) {
      const msg = this.messages_[0];
      const successfullyDispatched = this.dispatch_(msg);
      if (successfullyDispatched) {
        this.messages_.shift();
      } else {
        // Dispatch was unsuccessful, stop message dispatch and wait for
        // another router event before re-attempting dispatch.
        break;
      }
    }

    this.dispatchInProgress_ = false;
  }

  /**
   * Dispatches a single message to the endpoint.
   *
   * @param {mojo.internal.interfaceSupport.RouterMessage} msg
   * @returns true if the message was successfully dispatched, false otherwise.
   */
  dispatch_(msg) {
    const endpoint = this.endpoints_.get(msg.header.interfaceId);
    if (!endpoint) {
      console.error(
          `Received message for unknown endpoint ${msg.header.interfaceId}`);

      return false;
    }
    if (!endpoint.isStarted) {
      // Not client bound for endpoint. This can happen for associated
      // interface endpoint, where the client has not been bound yet.
      return false;
    }

    // Dispatch to the endpoint client.
    endpoint.onMessageReceived(msg.header, msg.buffer, msg.handles);
    return true;
  }


  onError_() {
    for (const endpoint of this.endpoints_.values()) {
      endpoint.onError();
    }
    this.endpoints_.clear();
  }

  /** @param {number} id */
  onPeerEndpointClosed_(id) {
    const endpoint = this.endpoints_.get(id);
    if (endpoint) {
      endpoint.onError();
    }
  }
};

/**
 * Something which can receive notifications from an Endpoint; generally this is
 * the Endpoint's owner.
 * @interface
 */
mojo.internal.interfaceSupport.EndpointClient = class {
  /**
   * @param {!mojo.internal.interfaceSupport.Endpoint} endpoint
   * @param {!mojo.internal.MessageHeader} header
   * @param {!ArrayBuffer} buffer
   * @param {!Array<MojoHandle>} handles
   */
  onMessageReceived(endpoint, header, buffer, handles) {}

  /**
   * @param {!mojo.internal.interfaceSupport.Endpoint} endpoint
   * @param {string=} reason
   */
  onError(endpoint, reason = undefined) {}
};

/**
 * Encapsulates a single interface endpoint on a multiplexed Router object. This
 * may be the primary (possibly only) endpoint on a pipe, or a secondary
 * associated interface endpoint.
 */
mojo.internal.interfaceSupport.Endpoint = class {
  /**
   * @param {mojo.internal.interfaceSupport.Router=} router
   * @param {number=} interfaceId
   */
  constructor(router = null, interfaceId = 0) {
    /** @private {mojo.internal.interfaceSupport.Router} */
    this.router_ = router;

    /** @private {number} */
    this.interfaceId_ = interfaceId;

    /** @private {mojo.internal.interfaceSupport.ControlMessageHandler} */
    this.controlMessageHandler_ =
        new mojo.internal.interfaceSupport.ControlMessageHandler(this);

    /** @private {mojo.internal.interfaceSupport.EndpointClient} */
    this.client_ = null;

    /** @private {number} */
    this.nextRequestId_ = 0;

    /** @private {mojo.internal.interfaceSupport.Endpoint} */
    this.localPeer_ = null;
  }

  /**
   * @return {{
   *   endpoint0: !mojo.internal.interfaceSupport.Endpoint,
   *   endpoint1: !mojo.internal.interfaceSupport.Endpoint,
   * }}
   */
  static createAssociatedPair() {
    const endpoint0 = new mojo.internal.interfaceSupport.Endpoint();
    const endpoint1 = new mojo.internal.interfaceSupport.Endpoint();
    endpoint1.localPeer_ = endpoint0;
    endpoint0.localPeer_ = endpoint1;
    return {endpoint0, endpoint1};
  }

  /** @return {mojo.internal.interfaceSupport.Router} */
  get router() {
    return this.router_;
  }

  /** @return {boolean} */
  isPrimary() {
    return this.router_ !== null && this.interfaceId_ === 0;
  }

  /** @return {!MojoHandle} */
  releasePipe() {
    console.assert(this.isPrimary(), 'secondary endpoint cannot release pipe');
    return this.router_.pipe;
  }

  /** @return {boolean} */
  get isPendingAssociation() {
    return this.localPeer_ !== null;
  }

  /**
   * @param {string} interfaceName
   * @param {string} scope
   */
  bindInBrowser(interfaceName, scope) {
    console.assert(
        this.isPrimary() && !this.router_.isReading(),
        'endpoint is either associated or already bound');
    Mojo.bindInterface(interfaceName, this.router_.pipe, scope);
  }

  /**
   * @param {!mojo.internal.interfaceSupport.Endpoint} endpoint
   * @return {number}
   */
  associatePeerOfOutgoingEndpoint(endpoint) {
    console.assert(this.router_, 'cannot associate with unbound endpoint');
    const peer = endpoint.localPeer_;
    endpoint.localPeer_ = peer.localPeer_ = null;

    const id = this.router_.generateInterfaceId();
    peer.router_ = this.router_;
    peer.interfaceId_ = id;
    if (peer.client_) {
      this.router_.addEndpoint(peer, id);
    }
    return id;
  }

  /** @return {number} */
  generateRequestId() {
    const id = this.nextRequestId_++;
    if (this.nextRequestId_ > 0xffffffff) {
      this.nextRequestId_ = 0;
    }
    return id;
  }

  /**
   * @param {number} ordinal
   * @param {number} requestId
   * @param {number} flags
   * @param {!mojo.internal.MojomType} paramStruct
   * @param {!Object} value
   */
  send(ordinal, requestId, flags, paramStruct, value) {
    const message = new mojo.internal.Message(
        this, this.interfaceId_, flags, ordinal, requestId,
        /** @type {!mojo.internal.StructSpec} */ (paramStruct.$.structSpec),
        value);
    console.assert(
        this.router_, 'cannot send message on unassociated unbound endpoint');
    this.router_.send(message);
  }

  /** @param {mojo.internal.interfaceSupport.EndpointClient} client */
  start(client) {
    console.assert(!this.client_, 'endpoint already started');
    this.client_ = client;
    if (this.router_) {
      this.router_.addEndpoint(this, this.interfaceId_);
    }
  }

  /** @return {boolean} */
  get isStarted() {
    return this.client_ !== null;
  }

  stop() {
    if (this.router_) {
      this.router_.removeEndpoint(this.interfaceId_);
    }
    this.client_ = null;
    this.controlMessageHandler_ = null;
  }

  close() {
    if (this.router_) {
      this.router.closeEndpoint(this.interfaceId_);
    }
    this.client_ = null;
    this.controlMessageHandler_ = null;
  }

  async flushForTesting() {
    return this.controlMessageHandler_.sendRunMessage({'flushForTesting': {}});
  }

  /**
   * @param {!mojo.internal.MessageHeader} header
   * @param {!ArrayBuffer} buffer
   * @param {!Array<MojoHandle>} handles
   */
  onMessageReceived(header, buffer, handles) {
    console.assert(this.client_, 'endpoint has no client');
    const handled =
        this.controlMessageHandler_.maybeHandleControlMessage(header, buffer);
    if (handled) {
      return;
    }

    this.client_.onMessageReceived(this, header, buffer, handles);
  }

  onError() {
    if (this.client_) {
      this.client_.onError(this);
    }
  }
};

/**
 * @param {!mojo.internal.interfaceSupport.Endpoint} endpoint
 * @param {!ArrayBuffer} buffer
 * @export
 */
mojo.internal.interfaceSupport.acceptBufferForTesting = function(
    endpoint, buffer) {
  endpoint.router_.onMessageReceived_(buffer, []);
};

/**
 * Creates a new Endpoint wrapping a given pipe handle.
 *
 * @param {!MojoHandle|!mojo.internal.interfaceSupport.Endpoint}
 *     pipeOrEndpoint
 * @param {boolean=} setNamespaceBit
 * @return {!mojo.internal.interfaceSupport.Endpoint}
 */
mojo.internal.interfaceSupport.createEndpoint = function(
    pipeOrEndpoint, setNamespaceBit = false) {
  // `watch` is defined on MojoHandle but not Endpoint, so if it is not defined
  // we know this is an Endpoint.
  if (pipeOrEndpoint.watch === undefined) {
    return /** @type {!mojo.internal.interfaceSupport.Endpoint} */(
        pipeOrEndpoint);
  }
  return new mojo.internal.interfaceSupport.Endpoint(
      new mojo.internal.interfaceSupport.Router(
          /** @type {!MojoHandle} */(pipeOrEndpoint), setNamespaceBit),
      0);
};

/**
 * Returns its input if given an existing Endpoint. If given a pipe handle,
 * creates a new Endpoint to own it and returns that. This is a helper for
 * generated PendingReceiver constructors since they can accept either type as
 * input.
 *
 * @param {!MojoHandle|!mojo.internal.interfaceSupport.Endpoint} handle
 * @return {!mojo.internal.interfaceSupport.Endpoint}
 * @export
 */
mojo.internal.interfaceSupport.getEndpointForReceiver = function(handle) {
  return mojo.internal.interfaceSupport.createEndpoint(handle);
};

/**
 * @param {!mojo.internal.interfaceSupport.Endpoint} endpoint
 * @param {string} interfaceName
 * @param {string} scope
 * @export
 */
mojo.internal.interfaceSupport.bind = function(endpoint, interfaceName, scope) {
  endpoint.bindInBrowser(interfaceName, scope);
};

mojo.internal.interfaceSupport.PipeControlMessageHandler = class {
  /**
   * @param {!mojo.internal.interfaceSupport.Router} router
   * @param {function(number)} onDisconnect
   */
  constructor(router, onDisconnect) {
    /** @const {!mojo.internal.interfaceSupport.Router} */
    this.router_ = router;

    /** @const {function(number)} */
    this.onDisconnect_ = onDisconnect;
  }

  /**
   * @param {!mojo.pipeControl.RunOrClosePipeInput} input
   */
  send(input) {
    const message = new mojo.internal.Message(
        null, 0xffffffff, 0, mojo.pipeControl.RUN_OR_CLOSE_PIPE_MESSAGE_ID, 0,
        /** @type {!mojo.internal.StructSpec} */
        (mojo.pipeControl.RunOrClosePipeMessageParamsSpec.$.$.structSpec),
        {'input': input});
    this.router_.send(message);
  }

  /**
   * @param {!mojo.internal.MessageHeader} header
   * @param {!ArrayBuffer} buffer
   * @return {boolean}
   */
  maybeHandleMessage(header, buffer) {
    if (header.ordinal !== mojo.pipeControl.RUN_OR_CLOSE_PIPE_MESSAGE_ID) {
      return false;
    }

    const data = new mojo.internal.DataViewWrapper(buffer, header.headerSize);
    const decoder = new mojo.internal.Decoder(data, []);
    const spec = /** @type {!mojo.internal.StructSpec} */ (
        mojo.pipeControl.RunOrClosePipeMessageParamsSpec.$.$.structSpec);
    const input = decoder.decodeStructInline(spec)['input'];
    if (input.hasOwnProperty('peerAssociatedEndpointClosedEvent')) {
      this.onDisconnect_(input['peerAssociatedEndpointClosedEvent']['id']);
      return true;
    }

    return true;
  }

  /**@param {number} interfaceId */
  notifyEndpointClosed(interfaceId) {
    this.send({'peerAssociatedEndpointClosedEvent': {'id': interfaceId}});
  }
};

/**
 * Handles incoming interface control messages on an interface endpoint.
 */
mojo.internal.interfaceSupport.ControlMessageHandler = class {
  /** @param {!mojo.internal.interfaceSupport.Endpoint} endpoint */
  constructor(endpoint) {
    /** @private {!mojo.internal.interfaceSupport.Endpoint} */
    this.endpoint_ = endpoint;

    /** @private {!Map<number, function()>} */
    this.pendingFlushResolvers_ = new Map;
  }

  sendRunMessage(input) {
    const requestId = this.endpoint_.generateRequestId();
    return new Promise(resolve => {
      this.endpoint_.send(
          mojo.interfaceControl.RUN_MESSAGE_ID, requestId,
          mojo.internal.kMessageFlagExpectsResponse,
          mojo.interfaceControl.RunMessageParamsSpec.$, {'input': input});
      this.pendingFlushResolvers_.set(requestId, resolve);
    });
  }

  maybeHandleControlMessage(header, buffer) {
    if (header.ordinal === mojo.interfaceControl.RUN_MESSAGE_ID) {
      const data = new mojo.internal.DataViewWrapper(buffer, header.headerSize);
      const decoder = new mojo.internal.Decoder(data, []);
      if (header.flags & mojo.internal.kMessageFlagExpectsResponse)
        return this.handleRunRequest_(header.requestId, decoder);
      else
        return this.handleRunResponse_(header.requestId, decoder);
    }

    return false;
  }

  handleRunRequest_(requestId, decoder) {
    const input = decoder.decodeStructInline(
        mojo.interfaceControl.RunMessageParamsSpec.$.$.structSpec)['input'];
    if (input.hasOwnProperty('flushForTesting')) {
      this.endpoint_.send(
          mojo.interfaceControl.RUN_MESSAGE_ID, requestId,
          mojo.internal.kMessageFlagIsResponse,
          mojo.interfaceControl.RunResponseMessageParamsSpec.$,
          {'output': null});
      return true;
    }

    return false;
  }

  handleRunResponse_(requestId, decoder) {
    const resolver = this.pendingFlushResolvers_.get(requestId);
    if (!resolver)
      return false;

    resolver();
    return true;
  }
};

/**
 * Captures metadata about a request which was sent by a remote, for which a
 * response is expected.
 *
 * @typedef {{
 *   requestId: number,
 *   ordinal: number,
 *   responseStruct: !mojo.internal.MojomType,
 *   resolve: !Function,
 *   reject: !Function,
 *   useResultResponse: boolean,
 * }}
 */
mojo.internal.interfaceSupport.PendingResponse;

/**
 * Exposed by endpoints to allow observation of remote peer closure. Any number
 * of listeners may be registered on a ConnectionErrorEventRouter, and the
 * router will dispatch at most one event in its lifetime, whenever its endpoint
 * detects peer closure.
 * @export
 */
mojo.internal.interfaceSupport.ConnectionErrorEventRouter = class {
  /** @public */
  constructor() {
    /** @type {!Map<number, !Function>} */
    this.listeners = new Map;

    /** @private {number} */
    this.nextListenerId_ = 0;
  }

  /**
   * @param {!Function} listener
   * @return {number} An ID which can be given to removeListener() to remove
   *     this listener.
   * @export
   */
  addListener(listener) {
    const id = ++this.nextListenerId_;
    this.listeners.set(id, listener);
    return id;
  }

  /**
   * @param {number} id An ID returned by a prior call to addListener.
   * @return {boolean} True iff the identified listener was found and removed.
   * @export
   */
  removeListener(id) {
    return this.listeners.delete(id);
  }

  /**
   * Notifies all listeners of a connection error.
   */
  dispatchErrorEvent() {
    for (const listener of this.listeners.values())
      listener();
  }
};

/**
 * @interface
 * @export
 */
mojo.internal.interfaceSupport.PendingReceiver = class {
  /**
   * @return {!mojo.internal.interfaceSupport.Endpoint}
   * @export
   */
  get handle() {}
};

/**
 * Generic helper used to implement all generated remote classes. Knows how to
 * serialize requests and deserialize their replies, both according to
 * declarative message structure specs.
 *
 * TODO(crbug.com/40102194): Use a bounded generic type instead of
 * mojo.internal.interfaceSupport.PendingReceiver.
 * @implements {mojo.internal.interfaceSupport.EndpointClient}
 * @export
 */
mojo.internal.interfaceSupport.InterfaceRemoteBase = class {
  /**
   * @param {!function(new:mojo.internal.interfaceSupport.PendingReceiver,
   *     !mojo.internal.interfaceSupport.Endpoint)} requestType
   * @param {MojoHandle|mojo.internal.interfaceSupport.Endpoint=} handle
   *     The pipe or endpoint handle to use as a remote endpoint. If omitted,
   *     this object must be bound with bindHandle before it can be used to send
   *     messages.
   * @public
   */
  constructor(requestType, handle = undefined) {
    /** @private {mojo.internal.interfaceSupport.Endpoint} */
    this.endpoint_ = null;

    /**
     * @private {!function(new:mojo.internal.interfaceSupport.PendingReceiver,
     *     !mojo.internal.interfaceSupport.Endpoint)}
     */
    this.requestType_ = requestType;

    /**
     * @private {!Map<number, !mojo.internal.interfaceSupport.PendingResponse>}
     */
    this.pendingResponses_ = new Map;

    /** @const {!mojo.internal.interfaceSupport.ConnectionErrorEventRouter} */
    this.connectionErrorEventRouter_ =
        new mojo.internal.interfaceSupport.ConnectionErrorEventRouter;

    if (handle) {
      this.bindHandle(handle);
    }
  }

  /** @return {mojo.internal.interfaceSupport.Endpoint} */
  get endpoint() {
    return this.endpoint_;
  }

  /**
   * @return {!mojo.internal.interfaceSupport.PendingReceiver}
   */
  bindNewPipeAndPassReceiver() {
    let {handle0, handle1} = Mojo.createMessagePipe();
    this.bindHandle(handle0);
    return new this.requestType_(
        mojo.internal.interfaceSupport.createEndpoint(handle1));
  }

  /**
   * @param {!MojoHandle|!mojo.internal.interfaceSupport.Endpoint} handle
   * @export
   */
  bindHandle(handle) {
    console.assert(!this.endpoint_, 'already bound');
    handle = mojo.internal.interfaceSupport.createEndpoint(
        handle, /* setNamespaceBit */ true);
    this.endpoint_ = handle;
    this.endpoint_.start(this);
    this.pendingResponses_ = new Map;
  }

  /** @export */
  associateAndPassReceiver() {
    console.assert(!this.endpoint_, 'cannot associate when already bound');
    const {endpoint0, endpoint1} =
        mojo.internal.interfaceSupport.Endpoint.createAssociatedPair();
    this.bindHandle(endpoint0);
    return new this.requestType_(endpoint1);
  }

  /**
   * @return {?mojo.internal.interfaceSupport.Endpoint}
   * @export
   */
  unbind() {
    if (!this.endpoint_) {
      return null;
    }
    const endpoint = this.endpoint_;
    this.endpoint_ = null;
    endpoint.stop();
    return endpoint;
  }

  /** @export */
  close() {
    this.cleanupAndFlushPendingResponses_('Message pipe closed.');
    if (this.endpoint_) {
      this.endpoint_.close();
    }
    this.endpoint_ = null;
  }

  /**
   * @return {!mojo.internal.interfaceSupport.ConnectionErrorEventRouter}
   * @export
   */
  getConnectionErrorEventRouter() {
    return this.connectionErrorEventRouter_;
  }

  /**
   * @param {number} ordinal
   * @param {!mojo.internal.MojomType} paramStruct
   * @param {?mojo.internal.MojomType} maybeResponseStruct
   * @param {!Array} args
   * @param {boolean} useResultResponse
   * @return {!Promise}
   * @export
   */
  sendMessage(
      ordinal, paramStruct, maybeResponseStruct, args, useResultResponse) {
    // The pipe has already been closed, so just drop the message.
    if (maybeResponseStruct && (!this.endpoint_ || !this.endpoint_.isStarted)) {
      return Promise.reject(new Error('The pipe has already been closed.'));
    }

    // Turns a functions args into an object where each property corresponds to
    // an argument.
    //
    // Each argument in `args` has a single corresponding field in `fields`
    // except for optional numerics which map to two fields in `fields`. This
    // means args' indexes don't exactly match `fields`'s. As we iterate
    // over the fields we keep track of how many optional numeric args we've
    // seen to get the right `args` index.
    const value = {};
    let nullableValueKindFields = 0;
    paramStruct.$.structSpec.fields.forEach((field, index) => {
      const fieldArgsIndex = index - nullableValueKindFields;
      if (!mojo.internal.isNullableValueKindField(field)) {
        value[field.name] = args[fieldArgsIndex];
        return;
      }

      const props = field.nullableValueKindProperties;
      if (props.isPrimary) {
        nullableValueKindFields++;
        value[props.originalFieldName] = args[fieldArgsIndex];
      }
    });

    const requestId = this.endpoint_.generateRequestId();
    this.endpoint_.send(
      ordinal, requestId,
      maybeResponseStruct ? mojo.internal.kMessageFlagExpectsResponse : 0,
      paramStruct, value);
    if (!maybeResponseStruct) {
      return Promise.resolve();
    }

    const responseStruct =
        /** @type {!mojo.internal.MojomType} */ (maybeResponseStruct);
    return new Promise((resolve, reject) => {
      this.pendingResponses_.set(requestId, {
        requestId,
        ordinal,
        responseStruct,
        resolve,
        reject,
        useResultResponse
      });
    });
  }

  /**
   * @return {!Promise}
   * @export
   */
  flushForTesting() {
    return this.endpoint_.flushForTesting();
  }

  /** @override */
  onMessageReceived(endpoint, header, buffer, handles) {
    if (!(header.flags & mojo.internal.kMessageFlagIsResponse) ||
        header.flags & mojo.internal.kMessageFlagExpectsResponse) {
      return this.onError(endpoint, 'Received unexpected request message');
    }
    const pendingResponse = this.pendingResponses_.get(header.requestId);
    this.pendingResponses_.delete(header.requestId);
    if (!pendingResponse)
      return this.onError(endpoint, 'Received unexpected response message');
    const decoder = new mojo.internal.Decoder(
        new mojo.internal.DataViewWrapper(buffer, header.headerSize), handles,
        {endpoint});
    const responseValue = decoder.decodeStructInline(
        /** @type {!mojo.internal.StructSpec} */ (
            pendingResponse.responseStruct.$.structSpec));
    if (!responseValue)
      return this.onError(endpoint, 'Received malformed response message');
    if (header.ordinal !== pendingResponse.ordinal)
      return this.onError(endpoint, 'Received malformed response message');

    if (pendingResponse.useResultResponse) {
      // Must use property access below to avoid closure name mangling.
      const result = responseValue['result'];
      if (result['success'] !== undefined) {
        pendingResponse.resolve(result['success']);
      } else {
        pendingResponse.reject(result['failure']);
      }
    } else {
      pendingResponse.resolve(responseValue);
    }
  }

  /** @override */
  onError(endpoint, reason = undefined) {
    this.cleanupAndFlushPendingResponses_(reason);
    this.connectionErrorEventRouter_.dispatchErrorEvent();
  }

  /**
   * @param {string=} reason
   * @private
   */
  cleanupAndFlushPendingResponses_(reason = undefined) {
    if (this.endpoint_) {
      this.endpoint_.stop();
    }
    for (const id of this.pendingResponses_.keys()) {
      this.pendingResponses_.get(id).reject(new Error(reason));
    }
    this.pendingResponses_ = new Map;
  }
};

/**
 * Wrapper around mojo.internal.interfaceSupport.InterfaceRemoteBase that
 * exposes the subset of InterfaceRemoteBase's method that users are allowed
 * to use.
 * @template T
 * @export
 */
mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper = class {
  /**
   * @param {!mojo.internal.interfaceSupport.InterfaceRemoteBase<T>} remote
   * @public
   */
  constructor(remote) {
    /** @private {!mojo.internal.interfaceSupport.InterfaceRemoteBase<T>} */
    this.remote_ = remote;
  }

  /**
   * @return {!T}
   * @export
   */
  bindNewPipeAndPassReceiver() {
    return this.remote_.bindNewPipeAndPassReceiver();
  }

  /**
   * @return {!T}
   * @export
   */
  associateAndPassReceiver() {
    return this.remote_.associateAndPassReceiver();
  }

  /**
   * @return {boolean}
   * @export
   */
  isBound() {
    return this.remote_.endpoint_ !== null;
  }

  /** @export */
  close() {
    this.remote_.close();
  }

  /**
   * @return {!Promise}
   * @export
   */
  flushForTesting() {
    return this.remote_.flushForTesting();
  }
};

/**
 * Helper used by generated EventRouter types to dispatch incoming interface
 * messages as Event-like things.
 * @export
 */
mojo.internal.interfaceSupport.CallbackRouter = class {
  constructor() {
    /** @type {!Map<number, !Function>} */
    this.removeCallbacks = new Map;

    /** @private {number} */
    this.nextListenerId_ = 0;
  }

  /** @return {number} */
  getNextId() {
    return ++this.nextListenerId_;
  }

  /**
   * @param {number} id An ID returned by a prior call to addListener.
   * @return {boolean} True iff the identified listener was found and removed.
   * @export
   */
  removeListener(id) {
    this.removeCallbacks.get(id)();
    return this.removeCallbacks.delete(id);
  }
};

/**
 * Helper used by generated CallbackRouter types to dispatch incoming interface
 * messages to listeners.
 * @export
 */
mojo.internal.interfaceSupport.InterfaceCallbackReceiver = class {
  /**
   * @public
   * @param {!mojo.internal.interfaceSupport.CallbackRouter} callbackRouter
   */
  constructor(callbackRouter) {
    /** @private {!Map<number, !Function>} */
    this.listeners_ = new Map;

    /** @private {!mojo.internal.interfaceSupport.CallbackRouter} */
    this.callbackRouter_ = callbackRouter;
  }

  /**
   * @param {!Function} listener
   * @return {number} A unique ID for the added listener.
   * @export
   */
  addListener(listener) {
    const id = this.callbackRouter_.getNextId();
    this.listeners_.set(id, listener);
    this.callbackRouter_.removeCallbacks.set(id, () => {
      return this.listeners_.delete(id);
    });
    return id;
  }

  /**
   * @param {boolean} expectsResponse
   * @return {!Function}
   * @export
   */
  createReceiverHandler(expectsResponse) {
    if (expectsResponse)
      return this.dispatchWithResponse_.bind(this);
    return this.dispatch_.bind(this);
  }

  /**
   * @param {...*} varArgs
   * @private
   */
  dispatch_(varArgs) {
    const args = Array.from(arguments);
    this.listeners_.forEach(listener => listener.apply(null, args));
  }

  /**
   * @param {...*} varArgs
   * @return {?Object}
   * @private
   */
  dispatchWithResponse_(varArgs) {
    const args = Array.from(arguments);
    const returnValues = Array.from(this.listeners_.values())
                             .map(listener => listener.apply(null, args));

    let returnValue;
    for (const value of returnValues) {
      if (value === undefined)
        continue;
      if (returnValue !== undefined)
        throw new Error('Multiple listeners attempted to reply to a message');
      returnValue = value;
    }

    return returnValue;
  }
};

/**
 * Wraps message handlers attached to an InterfaceReceiver.
 *
 * @typedef {{
 *   paramStruct: !mojo.internal.MojomType,
 *   responseStruct: ?mojo.internal.MojomType,
 *   handler: !Function,
 *   useResultResponse: boolean,
 * }}
 */
mojo.internal.interfaceSupport.MessageHandler;

/**
 * Generic helper that listens for incoming request messages on one or more
 * endpoints of the same interface type, dispatching them to registered
 * handlers. Handlers are registered against a specific ordinal message number.
 *
 * @template T
 * @implements {mojo.internal.interfaceSupport.EndpointClient}
 * @export
 */
mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal = class {
  /**
   * @param {!function(new:T,
   *     (!MojoHandle|!mojo.internal.interfaceSupport.Endpoint)=)} remoteType
   * @public
   */
  constructor(remoteType) {
    /** @private {!Set<!mojo.internal.interfaceSupport.Endpoint>} endpoints */
    this.endpoints_ = new Set();

    /**
     * @private {!function(new:T,
     *     (!MojoHandle|!mojo.internal.interfaceSupport.Endpoint)=)}
     */
    this.remoteType_ = remoteType;

    /**
     * @private {!Map<number, !mojo.internal.interfaceSupport.MessageHandler>}
     */
    this.messageHandlers_ = new Map;

    /** @const {!mojo.internal.interfaceSupport.ConnectionErrorEventRouter} */
    this.connectionErrorEventRouter_ =
        new mojo.internal.interfaceSupport.ConnectionErrorEventRouter;
  }

  /**
   * @param {number} ordinal
   * @param {!mojo.internal.MojomType} paramStruct
   * @param {?mojo.internal.MojomType} responseStruct
   * @param {!Function} handler
   * @param {boolean} useResultResponse
   * @export
   */
  registerHandler(
      ordinal, paramStruct, responseStruct, handler, useResultResponse) {
    this.messageHandlers_.set(
        ordinal, {paramStruct, responseStruct, handler, useResultResponse});
  }

  /**
   * @param {!MojoHandle|!mojo.internal.interfaceSupport.Endpoint} handle
   * @export
   */
  bindHandle(handle) {
    handle = mojo.internal.interfaceSupport.createEndpoint(handle);
    this.endpoints_.add(handle);
    handle.start(this);
  }

  /**
   * @return {!T}
   * @export
   */
  bindNewPipeAndPassRemote() {
    let remote = new this.remoteType_();
    this.bindHandle(remote.$.bindNewPipeAndPassReceiver().handle);
    return remote;
  }

  /**
   * @return {!T}
   * @export
   */
  associateAndPassRemote() {
    const {endpoint0, endpoint1} =
        mojo.internal.interfaceSupport.Endpoint.createAssociatedPair();
    this.bindHandle(endpoint0);
    return new this.remoteType_(endpoint1);
  }

  /** @export */
  closeBindings() {
    for (const endpoint of this.endpoints_) {
      endpoint.close();
    }
    this.endpoints_.clear();
  }

  /**
   * @return {!mojo.internal.interfaceSupport.ConnectionErrorEventRouter}
   * @export
   */
  getConnectionErrorEventRouter() {
    return this.connectionErrorEventRouter_;
  }

  /**
   * @return {!Promise}
   * @export
   */
  async flush() {
    for (let endpoint of this.endpoints_) {
      await endpoint.flushForTesting();
    }
  }

  /** @override */
  onMessageReceived(endpoint, header, buffer, handles) {
    if (header.flags & mojo.internal.kMessageFlagIsResponse)
      throw new Error('Received unexpected response on interface receiver');
    const handler = this.messageHandlers_.get(header.ordinal);
    if (!handler)
      throw new Error('Received unknown message');
    const decoder = new mojo.internal.Decoder(
        new mojo.internal.DataViewWrapper(buffer, header.headerSize), handles,
        {endpoint});
    const request = decoder.decodeStructInline(
        /** @type {!mojo.internal.StructSpec} */ (
            handler.paramStruct.$.structSpec));
    if (!request)
      throw new Error('Received malformed message');

    // Each field in `handler.paramStruct.$.structSpec.fields` corresponds to
    // an argument, except for optional numerics where two fields correspond to
    // a single argument.
    const args = [];
    for (const field of handler.paramStruct.$.structSpec.fields) {
      if (!mojo.internal.isNullableValueKindField(field)) {
        args.push(request[field.name]);
        continue;
      }

      const props = field.nullableValueKindProperties;
      if (!props.isPrimary) {
        continue;
      }
      args.push(request[props.originalFieldName]);
    }

    if (handler.useResultResponse) {
      this.handleResultResponseMessage_(endpoint, header, handler, args);
    } else {
      this.handleResponseMessage_(endpoint, header, handler, args);
    }
  }

  /**
   * Handles result response messages. 'result' need more handling because there
   * are more semantics around its type that are more consistent with js
   * promise.
   *
   * Successful "handling" of the incoming message causes in a mojo message
   * that signals a successful response with the associated value. A failure in
   * the message handling would signal failure and propagate the error (if
   * possible).
   *
   * Note that there is still a chance for irrecoverable error here if the type
   * conversion cannot be successfully completed. The success path is mostly
   * immune to this because of strong typing, but the error path is vulnerable
   * to this type of runtime error. To avoid this, use the JsError mojo type for
   * errors originating from javascript.
   * @param {!mojo.internal.interfaceSupport.Endpoint} endpoint
   * @param {!mojo.internal.MessageHeader} header
   * @param {!mojo.internal.interfaceSupport.MessageHandler} handler
   * @param {!Array<*>} args
   * @private
   */
  handleResultResponseMessage_(endpoint, header, handler, args) {
    try {
      let result = handler.handler.apply(null, args);

      if (typeof result != 'object' || result.constructor.name != 'Promise') {
        result = Promise.resolve(result);
      }

      result
          .then(value => {
            endpoint.send(
                header.ordinal, header.requestId,
                mojo.internal.kMessageFlagIsResponse,
                /** @type {!mojo.internal.MojomType} */
                (handler.responseStruct), {'result': {'success': value}});
          })
          .catch(error => {
            endpoint.send(
                header.ordinal, header.requestId,
                mojo.internal.kMessageFlagIsResponse,
                /** @type {!mojo.internal.MojomType} */
                (handler.responseStruct), {'result': {'failure': error}});
          });
    } catch (error) {
      endpoint.send(
          header.ordinal, header.requestId,
          mojo.internal.kMessageFlagIsResponse,
          /** @type {!mojo.internal.MojomType} */
          (handler.responseStruct), {'result': {'failure': error}});
    }
  }

  /**
   * @param {!mojo.internal.interfaceSupport.Endpoint} endpoint
   * @param {!mojo.internal.MessageHeader} header
   * @param {!mojo.internal.interfaceSupport.MessageHandler} handler
   * @param {!Array<*>} args
   * @private
   */
  handleResponseMessage_(endpoint, header, handler, args) {
    let result = handler.handler.apply(null, args);

    // If the message expects a response, the handler must return either a
    // well-formed response object, or a Promise that will eventually yield one.
    if (handler.responseStruct) {
      if (result === undefined) {
        this.onError(endpoint);
        throw new Error(
            'Message expects a reply but its handler did not provide one.');
      }

      if (typeof result != 'object' || result.constructor.name != 'Promise') {
        result = Promise.resolve(result);
      }

      result
          .then(value => {
            endpoint.send(
                header.ordinal, header.requestId,
                mojo.internal.kMessageFlagIsResponse,
                /** @type {!mojo.internal.MojomType} */
                (handler.responseStruct), value);
          })
          .catch(() => {
            // If the handler rejects, that means it didn't like the request's
            // contents for whatever reason. We close the binding to prevent
            // further messages from being received from that client.
            this.onError(endpoint);
          });
    }
  }

  /** @override */
  onError(endpoint, reason = undefined) {
    this.endpoints_.delete(endpoint);
    endpoint.close();
    this.connectionErrorEventRouter_.dispatchErrorEvent();
  }
};

/**
 * Generic helper used to perform operations related to the interface pipe e.g.
 * bind the pipe, close it, flush it for testing, etc. Wraps
 * mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal and exposes a
 * subset of methods that meant to be used by users of a receiver class.
 *
 * @template T
 * @export
 */
mojo.internal.interfaceSupport.InterfaceReceiverHelper = class {
  /**
   * @param {!mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal<T>}
   *     helper_internal
   * @public
   */
  constructor(helper_internal) {
    /**
     * @private {!mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal<T>}
     */
    this.helper_internal_ = helper_internal;
  }

  /**
   * Binds a new handle to this object. Messages which arrive on the handle will
   * be read and dispatched to this object.
   *
   * @param {!MojoHandle|!mojo.internal.interfaceSupport.Endpoint} handle
   * @export
   */
  bindHandle(handle) {
    this.helper_internal_.bindHandle(handle);
  }

  /**
   * @return {!T}
   * @export
   */
  bindNewPipeAndPassRemote() {
    return this.helper_internal_.bindNewPipeAndPassRemote();
  }

  /**
   * @return {!T}
   * @export
   */
  associateAndPassRemote() {
    return this.helper_internal_.associateAndPassRemote();
  }

  /** @export */
  close() {
    this.helper_internal_.closeBindings();
  }

  /**
   * @return {!Promise}
   * @export
   */
  flush() {
    return this.helper_internal_.flush();
  }
};

/**
 * Watches a MojoHandle for readability or peer closure, forwarding either event
 * to one of two callbacks on the reader. Used by both InterfaceRemoteBase and
 * InterfaceReceiverHelperInternal to watch for incoming messages.
 */
mojo.internal.interfaceSupport.HandleReader = class {
  /**
   * @param {!MojoHandle} handle
   * @private
   */
  constructor(handle) {
    /** @private {!MojoHandle} */
    this.handle_ = handle;

    /** @public {?function(!ArrayBuffer, !Array<MojoHandle>)} */
    this.onRead = null;

    /** @public {!Function} */
    this.onError = () => {};

    /** @public {?MojoWatcher} */
    this.watcher_ = null;
  }

  isStopped() {
    return this.watcher_ === null;
  }

  start() {
    this.watcher_ = this.handle_.watch({readable: true}, this.read_.bind(this));
  }

  stop() {
    if (!this.watcher_) {
      return;
    }
    this.watcher_.cancel();
    this.watcher_ = null;
  }

  stopAndCloseHandle() {
    if (this.watcher_) {
      this.stop();
    }
    this.handle_.close();
  }

  /** @private */
  read_(result) {
    for (;;) {
      if (!this.watcher_)
        return;

      const read = this.handle_.readMessage();

      // No messages available.
      if (read.result == Mojo.RESULT_SHOULD_WAIT)
        return;

      // Remote endpoint has been closed *and* no messages available.
      if (read.result == Mojo.RESULT_FAILED_PRECONDITION) {
        this.onError();
        return;
      }

      // Something terrible happened.
      if (read.result != Mojo.RESULT_OK)
        throw new Error('Unexpected error on HandleReader: ' + read.result);

      this.onRead(read.buffer, read.handles);
    }
  }
};

// components/content_settings/core/common/content_settings_types.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const ContentSettingsTypeSpec = { $: mojo.internal.Enum() };
var ContentSettingsType;
(function (ContentSettingsType) {
    ContentSettingsType[ContentSettingsType["MIN_VALUE"] = -1] = "MIN_VALUE";
    ContentSettingsType[ContentSettingsType["MAX_VALUE"] = 120] = "MAX_VALUE";
    ContentSettingsType[ContentSettingsType["DEFAULT"] = -1] = "DEFAULT";
    ContentSettingsType[ContentSettingsType["COOKIES"] = 0] = "COOKIES";
    ContentSettingsType[ContentSettingsType["IMAGES"] = 1] = "IMAGES";
    ContentSettingsType[ContentSettingsType["JAVASCRIPT"] = 2] = "JAVASCRIPT";
    ContentSettingsType[ContentSettingsType["POPUPS"] = 3] = "POPUPS";
    ContentSettingsType[ContentSettingsType["GEOLOCATION"] = 4] = "GEOLOCATION";
    ContentSettingsType[ContentSettingsType["GEOLOCATION_WITH_OPTIONS"] = 5] = "GEOLOCATION_WITH_OPTIONS";
    ContentSettingsType[ContentSettingsType["NOTIFICATIONS"] = 6] = "NOTIFICATIONS";
    ContentSettingsType[ContentSettingsType["AUTO_SELECT_CERTIFICATE"] = 7] = "AUTO_SELECT_CERTIFICATE";
    ContentSettingsType[ContentSettingsType["MIXEDSCRIPT"] = 8] = "MIXEDSCRIPT";
    ContentSettingsType[ContentSettingsType["MEDIASTREAM_MIC"] = 9] = "MEDIASTREAM_MIC";
    ContentSettingsType[ContentSettingsType["MEDIASTREAM_CAMERA"] = 10] = "MEDIASTREAM_CAMERA";
    ContentSettingsType[ContentSettingsType["PROTOCOL_HANDLERS"] = 11] = "PROTOCOL_HANDLERS";
    ContentSettingsType[ContentSettingsType["DEPRECATED_PPAPI_BROKER"] = 12] = "DEPRECATED_PPAPI_BROKER";
    ContentSettingsType[ContentSettingsType["AUTOMATIC_DOWNLOADS"] = 13] = "AUTOMATIC_DOWNLOADS";
    ContentSettingsType[ContentSettingsType["MIDI_SYSEX"] = 14] = "MIDI_SYSEX";
    ContentSettingsType[ContentSettingsType["SSL_CERT_DECISIONS"] = 15] = "SSL_CERT_DECISIONS";
    ContentSettingsType[ContentSettingsType["PROTECTED_MEDIA_IDENTIFIER"] = 16] = "PROTECTED_MEDIA_IDENTIFIER";
    ContentSettingsType[ContentSettingsType["APP_BANNER"] = 17] = "APP_BANNER";
    ContentSettingsType[ContentSettingsType["SITE_ENGAGEMENT"] = 18] = "SITE_ENGAGEMENT";
    ContentSettingsType[ContentSettingsType["PERSISTENT_STORAGE"] = 19] = "PERSISTENT_STORAGE";
    ContentSettingsType[ContentSettingsType["USB_CHOOSER_DATA"] = 20] = "USB_CHOOSER_DATA";
    ContentSettingsType[ContentSettingsType["BLUETOOTH_GUARD"] = 21] = "BLUETOOTH_GUARD";
    ContentSettingsType[ContentSettingsType["BACKGROUND_SYNC"] = 22] = "BACKGROUND_SYNC";
    ContentSettingsType[ContentSettingsType["AUTOPLAY"] = 23] = "AUTOPLAY";
    ContentSettingsType[ContentSettingsType["IMPORTANT_SITE_INFO"] = 24] = "IMPORTANT_SITE_INFO";
    ContentSettingsType[ContentSettingsType["PERMISSION_AUTOBLOCKER_DATA"] = 25] = "PERMISSION_AUTOBLOCKER_DATA";
    ContentSettingsType[ContentSettingsType["ADS"] = 26] = "ADS";
    ContentSettingsType[ContentSettingsType["ADS_DATA"] = 27] = "ADS_DATA";
    ContentSettingsType[ContentSettingsType["MIDI"] = 28] = "MIDI";
    ContentSettingsType[ContentSettingsType["PASSWORD_PROTECTION"] = 29] = "PASSWORD_PROTECTION";
    ContentSettingsType[ContentSettingsType["MEDIA_ENGAGEMENT"] = 30] = "MEDIA_ENGAGEMENT";
    ContentSettingsType[ContentSettingsType["SOUND"] = 31] = "SOUND";
    ContentSettingsType[ContentSettingsType["CLIENT_HINTS"] = 32] = "CLIENT_HINTS";
    ContentSettingsType[ContentSettingsType["SENSORS"] = 33] = "SENSORS";
    ContentSettingsType[ContentSettingsType["DEPRECATED_ACCESSIBILITY_EVENTS"] = 34] = "DEPRECATED_ACCESSIBILITY_EVENTS";
    ContentSettingsType[ContentSettingsType["PAYMENT_HANDLER"] = 35] = "PAYMENT_HANDLER";
    ContentSettingsType[ContentSettingsType["USB_GUARD"] = 36] = "USB_GUARD";
    ContentSettingsType[ContentSettingsType["BACKGROUND_FETCH"] = 37] = "BACKGROUND_FETCH";
    ContentSettingsType[ContentSettingsType["INTENT_PICKER_DISPLAY"] = 38] = "INTENT_PICKER_DISPLAY";
    ContentSettingsType[ContentSettingsType["IDLE_DETECTION"] = 39] = "IDLE_DETECTION";
    ContentSettingsType[ContentSettingsType["SERIAL_GUARD"] = 40] = "SERIAL_GUARD";
    ContentSettingsType[ContentSettingsType["SERIAL_CHOOSER_DATA"] = 41] = "SERIAL_CHOOSER_DATA";
    ContentSettingsType[ContentSettingsType["PERIODIC_BACKGROUND_SYNC"] = 42] = "PERIODIC_BACKGROUND_SYNC";
    ContentSettingsType[ContentSettingsType["BLUETOOTH_SCANNING"] = 43] = "BLUETOOTH_SCANNING";
    ContentSettingsType[ContentSettingsType["HID_GUARD"] = 44] = "HID_GUARD";
    ContentSettingsType[ContentSettingsType["HID_CHOOSER_DATA"] = 45] = "HID_CHOOSER_DATA";
    ContentSettingsType[ContentSettingsType["WAKE_LOCK_SCREEN"] = 46] = "WAKE_LOCK_SCREEN";
    ContentSettingsType[ContentSettingsType["WAKE_LOCK_SYSTEM"] = 47] = "WAKE_LOCK_SYSTEM";
    ContentSettingsType[ContentSettingsType["LEGACY_COOKIE_ACCESS"] = 48] = "LEGACY_COOKIE_ACCESS";
    ContentSettingsType[ContentSettingsType["FILE_SYSTEM_WRITE_GUARD"] = 49] = "FILE_SYSTEM_WRITE_GUARD";
    ContentSettingsType[ContentSettingsType["NFC"] = 50] = "NFC";
    ContentSettingsType[ContentSettingsType["BLUETOOTH_CHOOSER_DATA"] = 51] = "BLUETOOTH_CHOOSER_DATA";
    ContentSettingsType[ContentSettingsType["CLIPBOARD_READ_WRITE"] = 52] = "CLIPBOARD_READ_WRITE";
    ContentSettingsType[ContentSettingsType["CLIPBOARD_SANITIZED_WRITE"] = 53] = "CLIPBOARD_SANITIZED_WRITE";
    ContentSettingsType[ContentSettingsType["SAFE_BROWSING_URL_CHECK_DATA"] = 54] = "SAFE_BROWSING_URL_CHECK_DATA";
    ContentSettingsType[ContentSettingsType["VR"] = 55] = "VR";
    ContentSettingsType[ContentSettingsType["AR"] = 56] = "AR";
    ContentSettingsType[ContentSettingsType["FILE_SYSTEM_READ_GUARD"] = 57] = "FILE_SYSTEM_READ_GUARD";
    ContentSettingsType[ContentSettingsType["STORAGE_ACCESS"] = 58] = "STORAGE_ACCESS";
    ContentSettingsType[ContentSettingsType["CAMERA_PAN_TILT_ZOOM"] = 59] = "CAMERA_PAN_TILT_ZOOM";
    ContentSettingsType[ContentSettingsType["WINDOW_MANAGEMENT"] = 60] = "WINDOW_MANAGEMENT";
    ContentSettingsType[ContentSettingsType["LOCAL_FONTS"] = 61] = "LOCAL_FONTS";
    ContentSettingsType[ContentSettingsType["PERMISSION_AUTOREVOCATION_DATA"] = 62] = "PERMISSION_AUTOREVOCATION_DATA";
    ContentSettingsType[ContentSettingsType["FILE_SYSTEM_LAST_PICKED_DIRECTORY"] = 63] = "FILE_SYSTEM_LAST_PICKED_DIRECTORY";
    ContentSettingsType[ContentSettingsType["DISPLAY_CAPTURE"] = 64] = "DISPLAY_CAPTURE";
    ContentSettingsType[ContentSettingsType["FILE_SYSTEM_ACCESS_CHOOSER_DATA"] = 65] = "FILE_SYSTEM_ACCESS_CHOOSER_DATA";
    ContentSettingsType[ContentSettingsType["FEDERATED_IDENTITY_SHARING"] = 66] = "FEDERATED_IDENTITY_SHARING";
    ContentSettingsType[ContentSettingsType["JAVASCRIPT_JIT"] = 67] = "JAVASCRIPT_JIT";
    ContentSettingsType[ContentSettingsType["HTTP_ALLOWED"] = 68] = "HTTP_ALLOWED";
    ContentSettingsType[ContentSettingsType["FORMFILL_METADATA"] = 69] = "FORMFILL_METADATA";
    ContentSettingsType[ContentSettingsType["DEPRECATED_FEDERATED_IDENTITY_ACTIVE_SESSION"] = 70] = "DEPRECATED_FEDERATED_IDENTITY_ACTIVE_SESSION";
    ContentSettingsType[ContentSettingsType["AUTO_DARK_WEB_CONTENT"] = 71] = "AUTO_DARK_WEB_CONTENT";
    ContentSettingsType[ContentSettingsType["REQUEST_DESKTOP_SITE"] = 72] = "REQUEST_DESKTOP_SITE";
    ContentSettingsType[ContentSettingsType["FEDERATED_IDENTITY_API"] = 73] = "FEDERATED_IDENTITY_API";
    ContentSettingsType[ContentSettingsType["NOTIFICATION_INTERACTIONS"] = 74] = "NOTIFICATION_INTERACTIONS";
    ContentSettingsType[ContentSettingsType["REDUCED_ACCEPT_LANGUAGE"] = 75] = "REDUCED_ACCEPT_LANGUAGE";
    ContentSettingsType[ContentSettingsType["NOTIFICATION_PERMISSION_REVIEW"] = 76] = "NOTIFICATION_PERMISSION_REVIEW";
    ContentSettingsType[ContentSettingsType["FEDERATED_IDENTITY_IDENTITY_PROVIDER_SIGNIN_STATUS"] = 77] = "FEDERATED_IDENTITY_IDENTITY_PROVIDER_SIGNIN_STATUS";
    ContentSettingsType[ContentSettingsType["REVOKED_UNUSED_SITE_PERMISSIONS"] = 78] = "REVOKED_UNUSED_SITE_PERMISSIONS";
    ContentSettingsType[ContentSettingsType["TOP_LEVEL_STORAGE_ACCESS"] = 79] = "TOP_LEVEL_STORAGE_ACCESS";
    ContentSettingsType[ContentSettingsType["FEDERATED_IDENTITY_AUTO_REAUTHN_PERMISSION"] = 80] = "FEDERATED_IDENTITY_AUTO_REAUTHN_PERMISSION";
    ContentSettingsType[ContentSettingsType["FEDERATED_IDENTITY_IDENTITY_PROVIDER_REGISTRATION"] = 81] = "FEDERATED_IDENTITY_IDENTITY_PROVIDER_REGISTRATION";
    ContentSettingsType[ContentSettingsType["ANTI_ABUSE"] = 82] = "ANTI_ABUSE";
    ContentSettingsType[ContentSettingsType["HTTPS_ENFORCED"] = 83] = "HTTPS_ENFORCED";
    ContentSettingsType[ContentSettingsType["ALL_SCREEN_CAPTURE"] = 84] = "ALL_SCREEN_CAPTURE";
    ContentSettingsType[ContentSettingsType["COOKIE_CONTROLS_METADATA"] = 85] = "COOKIE_CONTROLS_METADATA";
    ContentSettingsType[ContentSettingsType["AUTO_PICTURE_IN_PICTURE"] = 86] = "AUTO_PICTURE_IN_PICTURE";
    ContentSettingsType[ContentSettingsType["FILE_SYSTEM_ACCESS_EXTENDED_PERMISSION"] = 87] = "FILE_SYSTEM_ACCESS_EXTENDED_PERMISSION";
    ContentSettingsType[ContentSettingsType["FILE_SYSTEM_ACCESS_RESTORE_PERMISSION"] = 88] = "FILE_SYSTEM_ACCESS_RESTORE_PERMISSION";
    ContentSettingsType[ContentSettingsType["CAPTURED_SURFACE_CONTROL"] = 89] = "CAPTURED_SURFACE_CONTROL";
    ContentSettingsType[ContentSettingsType["SMART_CARD_GUARD"] = 90] = "SMART_CARD_GUARD";
    ContentSettingsType[ContentSettingsType["SMART_CARD_DATA"] = 91] = "SMART_CARD_DATA";
    ContentSettingsType[ContentSettingsType["WEB_PRINTING"] = 92] = "WEB_PRINTING";
    ContentSettingsType[ContentSettingsType["AUTOMATIC_FULLSCREEN"] = 93] = "AUTOMATIC_FULLSCREEN";
    ContentSettingsType[ContentSettingsType["SUB_APP_INSTALLATION_PROMPTS"] = 94] = "SUB_APP_INSTALLATION_PROMPTS";
    ContentSettingsType[ContentSettingsType["SPEAKER_SELECTION"] = 95] = "SPEAKER_SELECTION";
    ContentSettingsType[ContentSettingsType["DIRECT_SOCKETS"] = 96] = "DIRECT_SOCKETS";
    ContentSettingsType[ContentSettingsType["KEYBOARD_LOCK"] = 97] = "KEYBOARD_LOCK";
    ContentSettingsType[ContentSettingsType["POINTER_LOCK"] = 98] = "POINTER_LOCK";
    ContentSettingsType[ContentSettingsType["REVOKED_ABUSIVE_NOTIFICATION_PERMISSIONS"] = 99] = "REVOKED_ABUSIVE_NOTIFICATION_PERMISSIONS";
    ContentSettingsType[ContentSettingsType["DISPLAY_MEDIA_SYSTEM_AUDIO"] = 100] = "DISPLAY_MEDIA_SYSTEM_AUDIO";
    ContentSettingsType[ContentSettingsType["JAVASCRIPT_OPTIMIZER"] = 101] = "JAVASCRIPT_OPTIMIZER";
    ContentSettingsType[ContentSettingsType["HAND_TRACKING"] = 102] = "HAND_TRACKING";
    ContentSettingsType[ContentSettingsType["WEB_APP_INSTALLATION"] = 103] = "WEB_APP_INSTALLATION";
    ContentSettingsType[ContentSettingsType["DEPRECATED_DIRECT_SOCKETS_PRIVATE_NETWORK_ACCESS"] = 104] = "DEPRECATED_DIRECT_SOCKETS_PRIVATE_NETWORK_ACCESS";
    ContentSettingsType[ContentSettingsType["LEGACY_COOKIE_SCOPE"] = 105] = "LEGACY_COOKIE_SCOPE";
    ContentSettingsType[ContentSettingsType["ARE_SUSPICIOUS_NOTIFICATIONS_ALLOWLISTED_BY_USER"] = 106] = "ARE_SUSPICIOUS_NOTIFICATIONS_ALLOWLISTED_BY_USER";
    ContentSettingsType[ContentSettingsType["CONTROLLED_FRAME"] = 107] = "CONTROLLED_FRAME";
    ContentSettingsType[ContentSettingsType["REVOKED_DISRUPTIVE_NOTIFICATION_PERMISSIONS"] = 108] = "REVOKED_DISRUPTIVE_NOTIFICATION_PERMISSIONS";
    ContentSettingsType[ContentSettingsType["LOCAL_NETWORK_ACCESS"] = 109] = "LOCAL_NETWORK_ACCESS";
    ContentSettingsType[ContentSettingsType["LOCAL_NETWORK"] = 110] = "LOCAL_NETWORK";
    ContentSettingsType[ContentSettingsType["LOOPBACK_NETWORK"] = 111] = "LOOPBACK_NETWORK";
    ContentSettingsType[ContentSettingsType["ON_DEVICE_SPEECH_RECOGNITION_LANGUAGES_DOWNLOADED"] = 112] = "ON_DEVICE_SPEECH_RECOGNITION_LANGUAGES_DOWNLOADED";
    ContentSettingsType[ContentSettingsType["INITIALIZED_TRANSLATIONS"] = 113] = "INITIALIZED_TRANSLATIONS";
    ContentSettingsType[ContentSettingsType["SUSPICIOUS_NOTIFICATION_IDS"] = 114] = "SUSPICIOUS_NOTIFICATION_IDS";
    ContentSettingsType[ContentSettingsType["DEVICE_ATTRIBUTES"] = 115] = "DEVICE_ATTRIBUTES";
    ContentSettingsType[ContentSettingsType["PERMISSION_ACTIONS_HISTORY"] = 116] = "PERMISSION_ACTIONS_HISTORY";
    ContentSettingsType[ContentSettingsType["SUSPICIOUS_NOTIFICATION_SHOW_ORIGINAL"] = 117] = "SUSPICIOUS_NOTIFICATION_SHOW_ORIGINAL";
    ContentSettingsType[ContentSettingsType["SUB_APPS_WITHOUT_PROMPTS"] = 118] = "SUB_APPS_WITHOUT_PROMPTS";
    ContentSettingsType[ContentSettingsType["INLINE_CUE_MENU"] = 119] = "INLINE_CUE_MENU";
    ContentSettingsType[ContentSettingsType["SUSPICIOUS_SITE_WARNING_DATA"] = 120] = "SUSPICIOUS_SITE_WARNING_DATA";
})(ContentSettingsType || (ContentSettingsType = {}));

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function enumToClient(val) {
    return val ?? undefined;
}
function enumFromClient(val) {
    return val ?? null;
}

// chrome/common/glic_enums.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const FeatureModeSpec = { $: mojo.internal.Enum() };
var FeatureMode$2;
(function (FeatureMode) {
    FeatureMode[FeatureMode["MIN_VALUE"] = 0] = "MIN_VALUE";
    FeatureMode[FeatureMode["MAX_VALUE"] = 7] = "MAX_VALUE";
    FeatureMode[FeatureMode["kUnspecified"] = 0] = "kUnspecified";
    FeatureMode[FeatureMode["kImageGeneration"] = 1] = "kImageGeneration";
    FeatureMode[FeatureMode["kActuation"] = 2] = "kActuation";
    FeatureMode[FeatureMode["kExperimentalTriggering"] = 3] = "kExperimentalTriggering";
    FeatureMode[FeatureMode["kUniversalCart"] = 4] = "kUniversalCart";
    FeatureMode[FeatureMode["kPromotionPage"] = 5] = "kPromotionPage";
    FeatureMode[FeatureMode["kPasswordChange"] = 6] = "kPasswordChange";
    FeatureMode[FeatureMode["kWebContinuity"] = 7] = "kWebContinuity";
})(FeatureMode$2 || (FeatureMode$2 = {}));
const PanelStateKindSpec = { $: mojo.internal.Enum() };
var PanelStateKind$1;
(function (PanelStateKind) {
    PanelStateKind[PanelStateKind["MIN_VALUE"] = 0] = "MIN_VALUE";
    PanelStateKind[PanelStateKind["MAX_VALUE"] = 2] = "MAX_VALUE";
    PanelStateKind[PanelStateKind["kHidden"] = 0] = "kHidden";
    PanelStateKind[PanelStateKind["kDetached"] = 1] = "kDetached";
    PanelStateKind[PanelStateKind["kAttached"] = 2] = "kAttached";
})(PanelStateKind$1 || (PanelStateKind$1 = {}));
const PlatformSpec = { $: mojo.internal.Enum() };
var Platform$2;
(function (Platform) {
    Platform[Platform["MIN_VALUE"] = 0] = "MIN_VALUE";
    Platform[Platform["MAX_VALUE"] = 5] = "MAX_VALUE";
    Platform[Platform["kUnknown"] = 0] = "kUnknown";
    Platform[Platform["kMacOS"] = 1] = "kMacOS";
    Platform[Platform["kWindows"] = 2] = "kWindows";
    Platform[Platform["kLinux"] = 3] = "kLinux";
    Platform[Platform["kChromeOS"] = 4] = "kChromeOS";
    Platform[Platform["kAndroid"] = 5] = "kAndroid";
})(Platform$2 || (Platform$2 = {}));
const FormFactorSpec = { $: mojo.internal.Enum() };
var FormFactor$1;
(function (FormFactor) {
    FormFactor[FormFactor["MIN_VALUE"] = 0] = "MIN_VALUE";
    FormFactor[FormFactor["MAX_VALUE"] = 3] = "MAX_VALUE";
    FormFactor[FormFactor["kUnknown"] = 0] = "kUnknown";
    FormFactor[FormFactor["kDesktop"] = 1] = "kDesktop";
    FormFactor[FormFactor["kPhone"] = 2] = "kPhone";
    FormFactor[FormFactor["kTablet"] = 3] = "kTablet";
})(FormFactor$1 || (FormFactor$1 = {}));
const FreOverrideSpec = { $: mojo.internal.Enum() };
var FreOverride$1;
(function (FreOverride) {
    FreOverride[FreOverride["MIN_VALUE"] = 0] = "MIN_VALUE";
    FreOverride[FreOverride["MAX_VALUE"] = 3] = "MAX_VALUE";
    FreOverride[FreOverride["kUnspecified"] = 0] = "kUnspecified";
    FreOverride[FreOverride["kTrustFirstText"] = 1] = "kTrustFirstText";
    FreOverride[FreOverride["kTrustFirstClick"] = 2] = "kTrustFirstClick";
    FreOverride[FreOverride["kTrustFirstInline"] = 3] = "kTrustFirstInline";
})(FreOverride$1 || (FreOverride$1 = {}));
const InvocationSourceSpec = { $: mojo.internal.Enum() };
var InvocationSource$1;
(function (InvocationSource) {
    InvocationSource[InvocationSource["MIN_VALUE"] = 0] = "MIN_VALUE";
    InvocationSource[InvocationSource["MAX_VALUE"] = 44] = "MAX_VALUE";
    InvocationSource[InvocationSource["kOsButton"] = 0] = "kOsButton";
    InvocationSource[InvocationSource["kOsButtonMenu"] = 1] = "kOsButtonMenu";
    InvocationSource[InvocationSource["kOsHotkey"] = 2] = "kOsHotkey";
    InvocationSource[InvocationSource["kTopChromeButton"] = 3] = "kTopChromeButton";
    InvocationSource[InvocationSource["kFre"] = 4] = "kFre";
    InvocationSource[InvocationSource["kProfilePicker"] = 5] = "kProfilePicker";
    InvocationSource[InvocationSource["kNudge"] = 6] = "kNudge";
    InvocationSource[InvocationSource["kThreeDotsMenu"] = 7] = "kThreeDotsMenu";
    InvocationSource[InvocationSource["kUnsupported"] = 8] = "kUnsupported";
    InvocationSource[InvocationSource["kWhatsNew"] = 9] = "kWhatsNew";
    InvocationSource[InvocationSource["kAfterSignIn"] = 10] = "kAfterSignIn";
    InvocationSource[InvocationSource["kSharedTab"] = 11] = "kSharedTab";
    InvocationSource[InvocationSource["kActorTaskIcon"] = 12] = "kActorTaskIcon";
    InvocationSource[InvocationSource["kSharedImage"] = 13] = "kSharedImage";
    InvocationSource[InvocationSource["kHandoffButton"] = 14] = "kHandoffButton";
    InvocationSource[InvocationSource["kSkills"] = 15] = "kSkills";
    InvocationSource[InvocationSource["kAutoOpenedByContextualCue"] = 16] = "kAutoOpenedByContextualCue";
    InvocationSource[InvocationSource["kPdfSummarizeButton"] = 17] = "kPdfSummarizeButton";
    InvocationSource[InvocationSource["kNavigationCapture"] = 18] = "kNavigationCapture";
    InvocationSource[InvocationSource["kAutoOpenedForPdf"] = 19] = "kAutoOpenedForPdf";
    InvocationSource[InvocationSource["kCaptureRegionHotkey"] = 20] = "kCaptureRegionHotkey";
    InvocationSource[InvocationSource["kIph"] = 21] = "kIph";
    InvocationSource[InvocationSource["kAnchoredContextualCue"] = 22] = "kAnchoredContextualCue";
    InvocationSource[InvocationSource["kWebContentsContextMenu"] = 23] = "kWebContentsContextMenu";
    InvocationSource[InvocationSource["kTextSelectionNudge"] = 24] = "kTextSelectionNudge";
    InvocationSource[InvocationSource["kTextSelectionWidget"] = 25] = "kTextSelectionWidget";
    InvocationSource[InvocationSource["kZeroStateAutoSummarize"] = 26] = "kZeroStateAutoSummarize";
    InvocationSource[InvocationSource["kUniversalCart"] = 27] = "kUniversalCart";
    InvocationSource[InvocationSource["kExperimentalTriggering"] = 28] = "kExperimentalTriggering";
    InvocationSource[InvocationSource["kPasswordChange"] = 29] = "kPasswordChange";
    InvocationSource[InvocationSource["kAutofill"] = 30] = "kAutofill";
    InvocationSource[InvocationSource["kToolbarButton"] = 31] = "kToolbarButton";
    InvocationSource[InvocationSource["kIndigoPageAction"] = 32] = "kIndigoPageAction";
    InvocationSource[InvocationSource["kWebDragDrop"] = 33] = "kWebDragDrop";
    InvocationSource[InvocationSource["kPromotionPage"] = 34] = "kPromotionPage";
    InvocationSource[InvocationSource["kDaisyChainOnNewTab"] = 35] = "kDaisyChainOnNewTab";
    InvocationSource[InvocationSource["kDaisyChainOnFollowLink"] = 36] = "kDaisyChainOnFollowLink";
    InvocationSource[InvocationSource["kConversationSwitch"] = 37] = "kConversationSwitch";
    InvocationSource[InvocationSource["kDetachAttachButton"] = 38] = "kDetachAttachButton";
    InvocationSource[InvocationSource["kTabRestore"] = 39] = "kTabRestore";
    InvocationSource[InvocationSource["kReshowInactive"] = 40] = "kReshowInactive";
    InvocationSource[InvocationSource["kTabContextMenu"] = 41] = "kTabContextMenu";
    InvocationSource[InvocationSource["kWebContinuity"] = 42] = "kWebContinuity";
    InvocationSource[InvocationSource["kHistoryPageChatLinkout"] = 43] = "kHistoryPageChatLinkout";
    InvocationSource[InvocationSource["kContextHubTopics"] = 44] = "kContextHubTopics";
})(InvocationSource$1 || (InvocationSource$1 = {}));
const ActuationTargetSpec = { $: mojo.internal.Enum() };
var ActuationTarget$1;
(function (ActuationTarget) {
    ActuationTarget[ActuationTarget["MIN_VALUE"] = 0] = "MIN_VALUE";
    ActuationTarget[ActuationTarget["MAX_VALUE"] = 4] = "MAX_VALUE";
    ActuationTarget[ActuationTarget["kUnknown"] = 0] = "kUnknown";
    ActuationTarget[ActuationTarget["kAgentDecides"] = 1] = "kAgentDecides";
    ActuationTarget[ActuationTarget["kCurrentTab"] = 2] = "kCurrentTab";
    ActuationTarget[ActuationTarget["kNewTab"] = 3] = "kNewTab";
    ActuationTarget[ActuationTarget["kTargetSurface"] = 4] = "kTargetSurface";
})(ActuationTarget$1 || (ActuationTarget$1 = {}));

// mojo/public/mojom/base/big_buffer.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const BigBufferSharedMemoryRegionSpec = { $: {} };
const BigBufferSpec = { $: {} };
mojo.internal.Struct(BigBufferSharedMemoryRegionSpec.$, 'BigBufferSharedMemoryRegion', [
    mojo.internal.StructField('bufferHandle', 0, 0, mojo.internal.Handle, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('size', 4, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Union(BigBufferSpec.$, 'BigBuffer', {
    'bytes': {
        'ordinal': 0,
        'type': mojo.internal.Array(mojo.internal.Uint8, false),
    },
    'sharedMemory': {
        'ordinal': 1,
        'type': BigBufferSharedMemoryRegionSpec.$,
    },
    'invalidBuffer': {
        'ordinal': 2,
        'type': mojo.internal.Bool,
    },
});
var BigBufferFieldTags;
(function (BigBufferFieldTags) {
    BigBufferFieldTags[BigBufferFieldTags["BYTES"] = 0] = "BYTES";
    BigBufferFieldTags[BigBufferFieldTags["SHARED_MEMORY"] = 1] = "SHARED_MEMORY";
    BigBufferFieldTags[BigBufferFieldTags["INVALID_BUFFER"] = 2] = "INVALID_BUFFER";
})(BigBufferFieldTags || (BigBufferFieldTags = {}));

// skia/public/mojom/image_info.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const ColorTypeSpec = { $: mojo.internal.Enum() };
var ColorType;
(function (ColorType) {
    ColorType[ColorType["MIN_VALUE"] = 0] = "MIN_VALUE";
    ColorType[ColorType["MAX_VALUE"] = 7] = "MAX_VALUE";
    ColorType[ColorType["UNKNOWN"] = 0] = "UNKNOWN";
    ColorType[ColorType["ALPHA_8"] = 1] = "ALPHA_8";
    ColorType[ColorType["RGB_565"] = 2] = "RGB_565";
    ColorType[ColorType["ARGB_4444"] = 3] = "ARGB_4444";
    ColorType[ColorType["RGBA_8888"] = 4] = "RGBA_8888";
    ColorType[ColorType["BGRA_8888"] = 5] = "BGRA_8888";
    ColorType[ColorType["DEPRECATED_INDEX_8"] = 6] = "DEPRECATED_INDEX_8";
    ColorType[ColorType["GRAY_8"] = 7] = "GRAY_8";
})(ColorType || (ColorType = {}));
const AlphaTypeSpec = { $: mojo.internal.Enum() };
var AlphaType;
(function (AlphaType) {
    AlphaType[AlphaType["MIN_VALUE"] = 0] = "MIN_VALUE";
    AlphaType[AlphaType["MAX_VALUE"] = 3] = "MAX_VALUE";
    AlphaType[AlphaType["UNKNOWN"] = 0] = "UNKNOWN";
    AlphaType[AlphaType["ALPHA_TYPE_OPAQUE"] = 1] = "ALPHA_TYPE_OPAQUE";
    AlphaType[AlphaType["PREMUL"] = 2] = "PREMUL";
    AlphaType[AlphaType["UNPREMUL"] = 3] = "UNPREMUL";
})(AlphaType || (AlphaType = {}));
const ImageInfoSpec$1 = { $: {} };
const BitmapN32ImageInfoSpec = { $: {} };
mojo.internal.Struct(ImageInfoSpec$1.$, 'ImageInfo', [
    mojo.internal.StructField('colorType', 0, 0, ColorTypeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('alphaType', 4, 0, AlphaTypeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('width', 8, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('height', 12, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('colorTransferFunction', 16, 0, mojo.internal.Array(mojo.internal.Float, false), null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('colorToXyzMatrix', 24, 0, mojo.internal.Array(mojo.internal.Float, false), null, true /* nullable */, 0, undefined, undefined),
], [[0, 40],]);
mojo.internal.Struct(BitmapN32ImageInfoSpec.$, 'BitmapN32ImageInfo', [
    mojo.internal.StructField('alphaType', 0, 0, AlphaTypeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('width', 4, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('height', 8, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('colorTransferFunction', 16, 0, mojo.internal.Array(mojo.internal.Float, false), null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('colorToXyzMatrix', 24, 0, mojo.internal.Array(mojo.internal.Float, false), null, true /* nullable */, 0, undefined, undefined),
], [[0, 40],]);

// skia/public/mojom/bitmap.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const BitmapN32Spec = { $: {} };
const BitmapWithArbitraryBppSpec = { $: {} };
const BitmapMappedFromTrustedProcessSpec = { $: {} };
const InlineBitmapSpec = { $: {} };
mojo.internal.Struct(BitmapN32Spec.$, 'BitmapN32', [
    mojo.internal.StructField('imageInfo', 0, 0, BitmapN32ImageInfoSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('pixelData', 8, 0, BigBufferSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(BitmapWithArbitraryBppSpec.$, 'BitmapWithArbitraryBpp', [
    mojo.internal.StructField('imageInfo', 0, 0, ImageInfoSpec$1.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('uNUSEDRowBytes', 8, 0, mojo.internal.Uint64, BigInt(0), false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('pixelData', 16, 0, BigBufferSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 40],]);
mojo.internal.Struct(BitmapMappedFromTrustedProcessSpec.$, 'BitmapMappedFromTrustedProcess', [
    mojo.internal.StructField('imageInfo', 0, 0, ImageInfoSpec$1.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('uNUSEDRowBytes', 8, 0, mojo.internal.Uint64, BigInt(0), false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('pixelData', 16, 0, BigBufferSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 40],]);
mojo.internal.Struct(InlineBitmapSpec.$, 'InlineBitmap', [
    mojo.internal.StructField('imageInfo', 0, 0, BitmapN32ImageInfoSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('pixelData', 8, 0, mojo.internal.Array(mojo.internal.Uint8, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);

// mojo/public/mojom/base/unguessable_token.mojom-converters.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class UnguessableTokenDataView {
    decoder_;
    version_;
    fieldSpecs_;
    constructor(decoder, version, fieldSpecs) {
        this.decoder_ = decoder;
        this.version_ = version;
        this.fieldSpecs_ = fieldSpecs;
    }
    get high() {
        const field = this.fieldSpecs_[0];
        return mojo.internal.decodeStructField(this.decoder_, field, this.version_);
    }
    get low() {
        const field = this.fieldSpecs_[1];
        return mojo.internal.decodeStructField(this.decoder_, field, this.version_);
    }
}

const HEX_BASE = 16;
// Token component is 64 bits, hex is 4 bits. This gives us a necessary
// string length.
const TOKEN_COMPONENT_STR_LENGTH = 64 / 4;
class UnguessableTokenConverter {
    // Field accessors for encoding a typemap to a mojo type.
    validate(token) {
        if (token.length !== (2 * TOKEN_COMPONENT_STR_LENGTH)) {
            throw new Error('token is malformed: ' + token);
        }
        if (token !== token.toUpperCase()) {
            throw new Error('token is not uppercase: ' + token);
        }
    }
    high(token) {
        this.validate(token);
        return BigInt(`0x${token.slice(0, TOKEN_COMPONENT_STR_LENGTH)}`);
    }
    low(token) {
        this.validate(token);
        return BigInt(`0x${token.slice(TOKEN_COMPONENT_STR_LENGTH)}`);
    }
    // Converts a mojo type to the typemap.
    convert(view) {
        return (view.high.toString(HEX_BASE).padStart(TOKEN_COMPONENT_STR_LENGTH, '0') +
            view.low.toString(HEX_BASE).padStart(TOKEN_COMPONENT_STR_LENGTH, '0'))
            .toUpperCase();
    }
}

// mojo/public/mojom/base/unguessable_token.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const UnguessableTokenSpec = { $: {} };
const converterForUnguessableToken = new UnguessableTokenConverter();
mojo.internal.TypemappedStruct(UnguessableTokenSpec.$, 'UnguessableToken', UnguessableTokenDataView, converterForUnguessableToken, [
    mojo.internal.StructField('high', 0, 0, mojo.internal.Uint64, BigInt(0), false /* nullable */, 0, undefined, ((value) => converterForUnguessableToken.high(value))),
    mojo.internal.StructField('low', 8, 0, mojo.internal.Uint64, BigInt(0), false /* nullable */, 0, undefined, ((value) => converterForUnguessableToken.low(value))),
], [[0, 24],]);

// url/mojom/origin.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const OriginSpec = { $: {} };
mojo.internal.Struct(OriginSpec.$, 'Origin', [
    mojo.internal.StructField('scheme', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('host', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('port', 16, 0, mojo.internal.Uint16, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('nonceIfOpaque', 24, 0, UnguessableTokenSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 40],]);

// chrome/common/actor_webui.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const TaskDurationSpec = { $: mojo.internal.Enum() };
var TaskDuration$1;
(function (TaskDuration) {
    TaskDuration[TaskDuration["MIN_VALUE"] = 1] = "MIN_VALUE";
    TaskDuration[TaskDuration["MAX_VALUE"] = 2] = "MAX_VALUE";
    TaskDuration[TaskDuration["kDefault"] = 1] = "kDefault";
    TaskDuration[TaskDuration["kTransient"] = 2] = "kTransient";
})(TaskDuration$1 || (TaskDuration$1 = {}));
const UserGrantedPermissionDurationSpec = { $: mojo.internal.Enum() };
var UserGrantedPermissionDuration$1;
(function (UserGrantedPermissionDuration) {
    UserGrantedPermissionDuration[UserGrantedPermissionDuration["MIN_VALUE"] = 0] = "MIN_VALUE";
    UserGrantedPermissionDuration[UserGrantedPermissionDuration["MAX_VALUE"] = 1] = "MAX_VALUE";
    UserGrantedPermissionDuration[UserGrantedPermissionDuration["kOneTime"] = 0] = "kOneTime";
    UserGrantedPermissionDuration[UserGrantedPermissionDuration["kAlwaysAllow"] = 1] = "kAlwaysAllow";
})(UserGrantedPermissionDuration$1 || (UserGrantedPermissionDuration$1 = {}));
const CredentialTypeSpec = { $: mojo.internal.Enum() };
var CredentialType$1;
(function (CredentialType) {
    CredentialType[CredentialType["MIN_VALUE"] = 0] = "MIN_VALUE";
    CredentialType[CredentialType["MAX_VALUE"] = 1] = "MAX_VALUE";
    CredentialType[CredentialType["kPassword"] = 0] = "kPassword";
    CredentialType[CredentialType["kFederated"] = 1] = "kFederated";
})(CredentialType$1 || (CredentialType$1 = {}));
const SelectCredentialDialogErrorReasonSpec = { $: mojo.internal.Enum() };
var SelectCredentialDialogErrorReason;
(function (SelectCredentialDialogErrorReason) {
    SelectCredentialDialogErrorReason[SelectCredentialDialogErrorReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    SelectCredentialDialogErrorReason[SelectCredentialDialogErrorReason["MAX_VALUE"] = 0] = "MAX_VALUE";
    SelectCredentialDialogErrorReason[SelectCredentialDialogErrorReason["kDialogPromiseNoSubscriber"] = 0] = "kDialogPromiseNoSubscriber";
})(SelectCredentialDialogErrorReason || (SelectCredentialDialogErrorReason = {}));
const SelectAutofillSuggestionsDialogErrorReasonSpec = { $: mojo.internal.Enum() };
var SelectAutofillSuggestionsDialogErrorReason;
(function (SelectAutofillSuggestionsDialogErrorReason) {
    SelectAutofillSuggestionsDialogErrorReason[SelectAutofillSuggestionsDialogErrorReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    SelectAutofillSuggestionsDialogErrorReason[SelectAutofillSuggestionsDialogErrorReason["MAX_VALUE"] = 2] = "MAX_VALUE";
    SelectAutofillSuggestionsDialogErrorReason[SelectAutofillSuggestionsDialogErrorReason["kDialogPromiseNoSubscriber"] = 0] = "kDialogPromiseNoSubscriber";
    SelectAutofillSuggestionsDialogErrorReason[SelectAutofillSuggestionsDialogErrorReason["kMismatchedTaskId"] = 1] = "kMismatchedTaskId";
    SelectAutofillSuggestionsDialogErrorReason[SelectAutofillSuggestionsDialogErrorReason["kNoActorTaskDelegate"] = 2] = "kNoActorTaskDelegate";
})(SelectAutofillSuggestionsDialogErrorReason || (SelectAutofillSuggestionsDialogErrorReason = {}));
const ConfirmationRequestErrorReasonSpec = { $: mojo.internal.Enum() };
var ConfirmationRequestErrorReason;
(function (ConfirmationRequestErrorReason) {
    ConfirmationRequestErrorReason[ConfirmationRequestErrorReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    ConfirmationRequestErrorReason[ConfirmationRequestErrorReason["MAX_VALUE"] = 1] = "MAX_VALUE";
    ConfirmationRequestErrorReason[ConfirmationRequestErrorReason["kRequestPromiseNoSubscriber"] = 0] = "kRequestPromiseNoSubscriber";
    ConfirmationRequestErrorReason[ConfirmationRequestErrorReason["kPreemptedByNewRequest"] = 1] = "kPreemptedByNewRequest";
})(ConfirmationRequestErrorReason || (ConfirmationRequestErrorReason = {}));
const GmailOtpErrorReasonSpec = { $: mojo.internal.Enum() };
var GmailOtpErrorReason;
(function (GmailOtpErrorReason) {
    GmailOtpErrorReason[GmailOtpErrorReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    GmailOtpErrorReason[GmailOtpErrorReason["MAX_VALUE"] = 0] = "MAX_VALUE";
    GmailOtpErrorReason[GmailOtpErrorReason["kRequestPromiseNoSubscriber"] = 0] = "kRequestPromiseNoSubscriber";
})(GmailOtpErrorReason || (GmailOtpErrorReason = {}));
const TaskOptionsSpec = { $: {} };
const CredentialSpec = { $: {} };
const SelectCredentialDialogRequestSpec = { $: {} };
const SelectCredentialDialogResponseSpec = { $: {} };
const AutofillSuggestionSpec = { $: {} };
const FormFillingRequestSpec = { $: {} };
const SelectAutofillSuggestionsDialogRequestSpec = { $: {} };
const FormFillingResponseSpec = { $: {} };
const AutofillSuggestionDialogOnFormPresentedParamsSpec = { $: {} };
const AutofillSuggestionDialogOnFormPreviewChangedParamsSpec = { $: {} };
const AutofillSuggestionDialogOnFormConfirmedParamsSpec = { $: {} };
const SelectAutofillSuggestionsDialogResponseSpec = { $: {} };
const UserConfirmationDialogPayloadSpec = { $: {} };
const UserConfirmationDialogRequestSpec = { $: {} };
const UserConfirmationDialogResponseSpec = { $: {} };
const NavigationConfirmationRequestSpec = { $: {} };
const NavigationConfirmationResponseSpec = { $: {} };
const GmailOtpOptInRequestSpec = { $: {} };
const GmailOtpOptInResponseSpec = { $: {} };
const GmailOtpConfirmationRequestSpec = { $: {} };
const GmailOtpConfirmationResponseSpec = { $: {} };
const SelectAutofillSuggestionsDialogResultSpec = { $: {} };
const UserConfirmationDialogResultSpec = { $: {} };
const ConfirmationRequestResultSpec = { $: {} };
const GmailOtpOptInResultSpec = { $: {} };
const GmailOtpConfirmationResultSpec = { $: {} };
mojo.internal.Struct(TaskOptionsSpec.$, 'TaskOptions', [
    mojo.internal.StructField('title', 0, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('duration_$flag', 8, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "duration_$value",
        originalFieldName: "duration",
    }, undefined),
    mojo.internal.StructField('duration_$value', 12, 0, TaskDurationSpec.$, 1, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "duration",
    }, undefined),
    mojo.internal.StructField('feature_mode_$flag', 8, 1, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "feature_mode_$value",
        originalFieldName: "featureMode",
    }, undefined),
    mojo.internal.StructField('feature_mode_$value', 16, 0, FeatureModeSpec.$, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "featureMode",
    }, undefined),
    mojo.internal.StructField('actuation_tab_id_$flag', 8, 2, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "actuation_tab_id_$value",
        originalFieldName: "actuationTabId",
    }, undefined),
    mojo.internal.StructField('actuation_tab_id_$value', 20, 0, mojo.internal.Int32, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "actuationTabId",
    }, undefined),
], [[0, 32],]);
mojo.internal.Struct(CredentialSpec.$, 'Credential', [
    mojo.internal.StructField('id', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('username', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('sourceSiteOrApp', 16, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('requestOrigin', 24, 0, OriginSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('displayOrigin', 32, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('type', 4, 0, CredentialTypeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('accountPicture', 40, 0, BitmapN32Spec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 56],]);
mojo.internal.Struct(SelectCredentialDialogRequestSpec.$, 'SelectCredentialDialogRequest', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('showDialog', 4, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('credentials', 8, 0, mojo.internal.Array(CredentialSpec.$, false), null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('icons', 16, 0, mojo.internal.Map(mojo.internal.String, BitmapN32Spec.$, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(SelectCredentialDialogResponseSpec.$, 'SelectCredentialDialogResponse', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('error_reason_$flag', 4, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "error_reason_$value",
        originalFieldName: "errorReason",
    }, undefined),
    mojo.internal.StructField('error_reason_$value', 8, 0, SelectCredentialDialogErrorReasonSpec.$, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "errorReason",
    }, undefined),
    mojo.internal.StructField('permission_duration_$flag', 4, 1, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "permission_duration_$value",
        originalFieldName: "permissionDuration",
    }, undefined),
    mojo.internal.StructField('permission_duration_$value', 12, 0, UserGrantedPermissionDurationSpec.$, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "permissionDuration",
    }, undefined),
    mojo.internal.StructField('selected_credential_id_$flag', 4, 2, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "selected_credential_id_$value",
        originalFieldName: "selectedCredentialId",
    }, undefined),
    mojo.internal.StructField('selected_credential_id_$value', 16, 0, mojo.internal.Int32, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "selectedCredentialId",
    }, undefined),
], [[0, 32],]);
mojo.internal.Struct(AutofillSuggestionSpec.$, 'AutofillSuggestion', [
    mojo.internal.StructField('id', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('title', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('details', 16, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('icon', 24, 0, BitmapN32Spec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 40],]);
mojo.internal.Struct(FormFillingRequestSpec.$, 'FormFillingRequest', [
    mojo.internal.StructField('requestedData', 0, 0, mojo.internal.Int64, BigInt(0), false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('formattedRequestOrigin', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('sectionLabel', 16, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('suggestions', 24, 0, mojo.internal.Array(AutofillSuggestionSpec.$, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 40],]);
mojo.internal.Struct(SelectAutofillSuggestionsDialogRequestSpec.$, 'SelectAutofillSuggestionsDialogRequest', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('formFillingRequests', 8, 0, mojo.internal.Array(FormFillingRequestSpec.$, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(FormFillingResponseSpec.$, 'FormFillingResponse', [
    mojo.internal.StructField('selectedSuggestionId', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(AutofillSuggestionDialogOnFormPresentedParamsSpec.$, 'AutofillSuggestionDialogOnFormPresentedParams', [
    mojo.internal.StructField('formFillingRequestIndex', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(AutofillSuggestionDialogOnFormPreviewChangedParamsSpec.$, 'AutofillSuggestionDialogOnFormPreviewChangedParams', [
    mojo.internal.StructField('formFillingRequestIndex', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('response', 8, 0, FormFillingResponseSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AutofillSuggestionDialogOnFormConfirmedParamsSpec.$, 'AutofillSuggestionDialogOnFormConfirmedParams', [
    mojo.internal.StructField('formFillingRequestIndex', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('response', 8, 0, FormFillingResponseSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(SelectAutofillSuggestionsDialogResponseSpec.$, 'SelectAutofillSuggestionsDialogResponse', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('result', 8, 0, SelectAutofillSuggestionsDialogResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(UserConfirmationDialogPayloadSpec.$, 'UserConfirmationDialogPayload', [
    mojo.internal.StructField('navigationOrigin', 0, 0, OriginSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('forBlocklistedOrigin', 8, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(UserConfirmationDialogRequestSpec.$, 'UserConfirmationDialogRequest', [
    mojo.internal.StructField('payload', 0, 0, UserConfirmationDialogPayloadSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(UserConfirmationDialogResponseSpec.$, 'UserConfirmationDialogResponse', [
    mojo.internal.StructField('result', 0, 0, ConfirmationRequestResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(NavigationConfirmationRequestSpec.$, 'NavigationConfirmationRequest', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('navigationOrigin', 8, 0, OriginSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(NavigationConfirmationResponseSpec.$, 'NavigationConfirmationResponse', [
    mojo.internal.StructField('result', 0, 0, ConfirmationRequestResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(GmailOtpOptInRequestSpec.$, 'GmailOtpOptInRequest', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(GmailOtpOptInResponseSpec.$, 'GmailOtpOptInResponse', [
    mojo.internal.StructField('permissionGranted', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(GmailOtpConfirmationRequestSpec.$, 'GmailOtpConfirmationRequest', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('verificationCode', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(GmailOtpConfirmationResponseSpec.$, 'GmailOtpConfirmationResponse', [
    mojo.internal.StructField('permissionGranted', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Union(SelectAutofillSuggestionsDialogResultSpec.$, 'SelectAutofillSuggestionsDialogResult', {
    'errorReason': {
        'ordinal': 0,
        'type': SelectAutofillSuggestionsDialogErrorReasonSpec.$,
    },
    'selectedSuggestions': {
        'ordinal': 1,
        'type': mojo.internal.Array(FormFillingResponseSpec.$, false),
    },
});
var SelectAutofillSuggestionsDialogResultFieldTags;
(function (SelectAutofillSuggestionsDialogResultFieldTags) {
    SelectAutofillSuggestionsDialogResultFieldTags[SelectAutofillSuggestionsDialogResultFieldTags["ERROR_REASON"] = 0] = "ERROR_REASON";
    SelectAutofillSuggestionsDialogResultFieldTags[SelectAutofillSuggestionsDialogResultFieldTags["SELECTED_SUGGESTIONS"] = 1] = "SELECTED_SUGGESTIONS";
})(SelectAutofillSuggestionsDialogResultFieldTags || (SelectAutofillSuggestionsDialogResultFieldTags = {}));
mojo.internal.Union(UserConfirmationDialogResultSpec.$, 'UserConfirmationDialogResult', {
    'permissionGranted': {
        'ordinal': 0,
        'type': mojo.internal.Bool,
    },
    'errorReason': {
        'ordinal': 1,
        'type': ConfirmationRequestErrorReasonSpec.$,
    },
});
var UserConfirmationDialogResultFieldTags;
(function (UserConfirmationDialogResultFieldTags) {
    UserConfirmationDialogResultFieldTags[UserConfirmationDialogResultFieldTags["PERMISSION_GRANTED"] = 0] = "PERMISSION_GRANTED";
    UserConfirmationDialogResultFieldTags[UserConfirmationDialogResultFieldTags["ERROR_REASON"] = 1] = "ERROR_REASON";
})(UserConfirmationDialogResultFieldTags || (UserConfirmationDialogResultFieldTags = {}));
mojo.internal.Union(ConfirmationRequestResultSpec.$, 'ConfirmationRequestResult', {
    'permissionGranted': {
        'ordinal': 0,
        'type': mojo.internal.Bool,
    },
    'errorReason': {
        'ordinal': 1,
        'type': ConfirmationRequestErrorReasonSpec.$,
    },
});
var ConfirmationRequestResultFieldTags;
(function (ConfirmationRequestResultFieldTags) {
    ConfirmationRequestResultFieldTags[ConfirmationRequestResultFieldTags["PERMISSION_GRANTED"] = 0] = "PERMISSION_GRANTED";
    ConfirmationRequestResultFieldTags[ConfirmationRequestResultFieldTags["ERROR_REASON"] = 1] = "ERROR_REASON";
})(ConfirmationRequestResultFieldTags || (ConfirmationRequestResultFieldTags = {}));
mojo.internal.Union(GmailOtpOptInResultSpec.$, 'GmailOtpOptInResult', {
    'response': {
        'ordinal': 0,
        'type': GmailOtpOptInResponseSpec.$,
    },
    'errorReason': {
        'ordinal': 1,
        'type': GmailOtpErrorReasonSpec.$,
    },
});
var GmailOtpOptInResultFieldTags;
(function (GmailOtpOptInResultFieldTags) {
    GmailOtpOptInResultFieldTags[GmailOtpOptInResultFieldTags["RESPONSE"] = 0] = "RESPONSE";
    GmailOtpOptInResultFieldTags[GmailOtpOptInResultFieldTags["ERROR_REASON"] = 1] = "ERROR_REASON";
})(GmailOtpOptInResultFieldTags || (GmailOtpOptInResultFieldTags = {}));
mojo.internal.Union(GmailOtpConfirmationResultSpec.$, 'GmailOtpConfirmationResult', {
    'response': {
        'ordinal': 0,
        'type': GmailOtpConfirmationResponseSpec.$,
    },
    'errorReason': {
        'ordinal': 1,
        'type': GmailOtpErrorReasonSpec.$,
    },
});
var GmailOtpConfirmationResultFieldTags;
(function (GmailOtpConfirmationResultFieldTags) {
    GmailOtpConfirmationResultFieldTags[GmailOtpConfirmationResultFieldTags["RESPONSE"] = 0] = "RESPONSE";
    GmailOtpConfirmationResultFieldTags[GmailOtpConfirmationResultFieldTags["ERROR_REASON"] = 1] = "ERROR_REASON";
})(GmailOtpConfirmationResultFieldTags || (GmailOtpConfirmationResultFieldTags = {}));

// url/mojom/url.mojom-converters.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class UrlDataView {
    decoder_;
    version_;
    fieldSpecs_;
    constructor(decoder, version, fieldSpecs) {
        this.decoder_ = decoder;
        this.version_ = version;
        this.fieldSpecs_ = fieldSpecs;
    }
    get url() {
        const field = this.fieldSpecs_[0];
        return mojo.internal.decodeStructField(this.decoder_, field, this.version_);
    }
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class UrlConverter {
    url(url) {
        return url;
    }
    convert(view) {
        return view.url;
    }
}

// url/mojom/url.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const UrlSpec = { $: {} };
const converterForUrl = new UrlConverter();
mojo.internal.TypemappedStruct(UrlSpec.$, 'Url', UrlDataView, converterForUrl, [
    mojo.internal.StructField('url', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, ((value) => converterForUrl.url(value))),
], [[0, 16],]);

// third_party/blink/public/mojom/content_extraction/ai_page_content_metadata.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const MetaTagSpec = { $: {} };
const FrameMetadataSpec = { $: {} };
const PageMetadataSpec = { $: {} };
mojo.internal.Struct(MetaTagSpec.$, 'MetaTag', [
    mojo.internal.StructField('name', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('content', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(FrameMetadataSpec.$, 'FrameMetadata', [
    mojo.internal.StructField('url', 0, 0, UrlSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('metaTags', 8, 0, mojo.internal.Array(MetaTagSpec.$, false), null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('hasMediaTranscripts', 16, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(PageMetadataSpec.$, 'PageMetadata', [
    mojo.internal.StructField('frameMetadata', 0, 0, mojo.internal.Array(FrameMetadataSpec.$, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);

// chrome/browser/glic/gemini_enterprise/gemini_enterprise.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const OpenSignInTabResultSpec = { $: mojo.internal.Enum() };
var OpenSignInTabResult$1;
(function (OpenSignInTabResult) {
    OpenSignInTabResult[OpenSignInTabResult["MIN_VALUE"] = 0] = "MIN_VALUE";
    OpenSignInTabResult[OpenSignInTabResult["MAX_VALUE"] = 4] = "MAX_VALUE";
    OpenSignInTabResult[OpenSignInTabResult["kUnknown"] = 0] = "kUnknown";
    OpenSignInTabResult[OpenSignInTabResult["kSuccess"] = 1] = "kSuccess";
    OpenSignInTabResult[OpenSignInTabResult["kErrorNoUrl"] = 2] = "kErrorNoUrl";
    OpenSignInTabResult[OpenSignInTabResult["kErrorDisallowedUrl"] = 3] = "kErrorDisallowedUrl";
    OpenSignInTabResult[OpenSignInTabResult["kErrorFailure"] = 4] = "kErrorFailure";
})(OpenSignInTabResult$1 || (OpenSignInTabResult$1 = {}));
const CloseSignInTabResultSpec = { $: mojo.internal.Enum() };
var CloseSignInTabResult$1;
(function (CloseSignInTabResult) {
    CloseSignInTabResult[CloseSignInTabResult["MIN_VALUE"] = 0] = "MIN_VALUE";
    CloseSignInTabResult[CloseSignInTabResult["MAX_VALUE"] = 3] = "MAX_VALUE";
    CloseSignInTabResult[CloseSignInTabResult["kUnknown"] = 0] = "kUnknown";
    CloseSignInTabResult[CloseSignInTabResult["kSuccess"] = 1] = "kSuccess";
    CloseSignInTabResult[CloseSignInTabResult["kAlreadyClosed"] = 2] = "kAlreadyClosed";
    CloseSignInTabResult[CloseSignInTabResult["kNoSignInTab"] = 3] = "kNoSignInTab";
})(CloseSignInTabResult$1 || (CloseSignInTabResult$1 = {}));
class GeminiEnterpriseHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.GeminiEnterpriseHandler', scope);
    }
}
class GeminiEnterpriseHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(GeminiEnterpriseHandlerPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    openSignInTab(options) {
        return this.proxy.sendMessage(545711051, GeminiEnterpriseHandler_OpenSignInTab_ParamsSpec.$, GeminiEnterpriseHandler_OpenSignInTab_ResponseParamsSpec.$, [
            options
        ], false);
    }
    closeSignInTab(options) {
        return this.proxy.sendMessage(1320992435, GeminiEnterpriseHandler_CloseSignInTab_ParamsSpec.$, GeminiEnterpriseHandler_CloseSignInTab_ResponseParamsSpec.$, [
            options
        ], false);
    }
}
/**
 * An object which receives request messages for the GeminiEnterpriseHandler
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class GeminiEnterpriseHandlerReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(GeminiEnterpriseHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(545711051, GeminiEnterpriseHandler_OpenSignInTab_ParamsSpec.$, GeminiEnterpriseHandler_OpenSignInTab_ResponseParamsSpec.$, impl.openSignInTab.bind(impl), false);
        this.helper_internal_.registerHandler(1320992435, GeminiEnterpriseHandler_CloseSignInTab_ParamsSpec.$, GeminiEnterpriseHandler_CloseSignInTab_ResponseParamsSpec.$, impl.closeSignInTab.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the GeminiEnterpriseHandler
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class GeminiEnterpriseHandlerCallbackRouter {
    helper_internal_;
    $;
    router_;
    openSignInTab;
    closeSignInTab;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(GeminiEnterpriseHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.openSignInTab =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(545711051, GeminiEnterpriseHandler_OpenSignInTab_ParamsSpec.$, GeminiEnterpriseHandler_OpenSignInTab_ResponseParamsSpec.$, this.openSignInTab.createReceiverHandler(true /* expectsResponse */), false);
        this.closeSignInTab =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1320992435, GeminiEnterpriseHandler_CloseSignInTab_ParamsSpec.$, GeminiEnterpriseHandler_CloseSignInTab_ResponseParamsSpec.$, this.closeSignInTab.createReceiverHandler(true /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
const OpenSignInTabOptionsSpec = { $: {} };
const CloseSignInTabOptionsSpec = { $: {} };
const GeminiEnterpriseHandler_OpenSignInTab_ParamsSpec = { $: {} };
const GeminiEnterpriseHandler_OpenSignInTab_ResponseParamsSpec = { $: {} };
const GeminiEnterpriseHandler_CloseSignInTab_ParamsSpec = { $: {} };
const GeminiEnterpriseHandler_CloseSignInTab_ResponseParamsSpec = { $: {} };
mojo.internal.Struct(OpenSignInTabOptionsSpec.$, 'OpenSignInTabOptions', [
    mojo.internal.StructField('signinUrl', 0, 0, UrlSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(CloseSignInTabOptionsSpec.$, 'CloseSignInTabOptions', [], [[0, 8],]);
mojo.internal.Struct(GeminiEnterpriseHandler_OpenSignInTab_ParamsSpec.$, 'GeminiEnterpriseHandler_OpenSignInTab_Params', [
    mojo.internal.StructField('options', 0, 0, OpenSignInTabOptionsSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(GeminiEnterpriseHandler_OpenSignInTab_ResponseParamsSpec.$, 'GeminiEnterpriseHandler_OpenSignInTab_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, OpenSignInTabResultSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(GeminiEnterpriseHandler_CloseSignInTab_ParamsSpec.$, 'GeminiEnterpriseHandler_CloseSignInTab_Params', [
    mojo.internal.StructField('options', 0, 0, CloseSignInTabOptionsSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(GeminiEnterpriseHandler_CloseSignInTab_ResponseParamsSpec.$, 'GeminiEnterpriseHandler_CloseSignInTab_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, CloseSignInTabResultSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);

// third_party/blink/public/mojom/dom/dom_node_id.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const DOMNodeIdSpec = { $: {} };
mojo.internal.Struct(DOMNodeIdSpec.$, 'DOMNodeId', [
    mojo.internal.StructField('value', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);

// mojo/public/mojom/base/empty.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const EmptySpec = { $: {} };
mojo.internal.Struct(EmptySpec.$, 'Empty', [], [[0, 8],]);

// chrome/browser/ui/webui/ai_overlay_dialog/tools/tools.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const ScrollGranularitySpec = { $: mojo.internal.Enum() };
var ScrollGranularity;
(function (ScrollGranularity) {
    ScrollGranularity[ScrollGranularity["MIN_VALUE"] = 0] = "MIN_VALUE";
    ScrollGranularity[ScrollGranularity["MAX_VALUE"] = 1] = "MAX_VALUE";
    ScrollGranularity[ScrollGranularity["kDocument"] = 0] = "kDocument";
    ScrollGranularity[ScrollGranularity["kPage"] = 1] = "kPage";
})(ScrollGranularity || (ScrollGranularity = {}));
class AiOverlayToolsPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'ai_overlay_dialog.mojom.AiOverlayTools', scope);
    }
}
class AiOverlayToolsRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(AiOverlayToolsPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    openUrl(url, newTab) {
        return this.proxy.sendMessage(1651053557, AiOverlayTools_OpenUrl_ParamsSpec.$, AiOverlayTools_OpenUrl_ResponseParamsSpec.$, [
            url,
            newTab
        ], true);
    }
    followLink(id) {
        return this.proxy.sendMessage(518834081, AiOverlayTools_FollowLink_ParamsSpec.$, AiOverlayTools_FollowLink_ResponseParamsSpec.$, [
            id
        ], true);
    }
    performSearch(query, newTab) {
        return this.proxy.sendMessage(1507743314, AiOverlayTools_PerformSearch_ParamsSpec.$, AiOverlayTools_PerformSearch_ResponseParamsSpec.$, [
            query,
            newTab
        ], true);
    }
    switchTab(query) {
        return this.proxy.sendMessage(103186779, AiOverlayTools_SwitchTab_ParamsSpec.$, AiOverlayTools_SwitchTab_ResponseParamsSpec.$, [
            query
        ], true);
    }
    closeCurrentTab() {
        return this.proxy.sendMessage(1279592623, AiOverlayTools_CloseCurrentTab_ParamsSpec.$, AiOverlayTools_CloseCurrentTab_ResponseParamsSpec.$, [], true);
    }
    goBack() {
        return this.proxy.sendMessage(990077943, AiOverlayTools_GoBack_ParamsSpec.$, AiOverlayTools_GoBack_ResponseParamsSpec.$, [], true);
    }
    goForward() {
        return this.proxy.sendMessage(1081374392, AiOverlayTools_GoForward_ParamsSpec.$, AiOverlayTools_GoForward_ResponseParamsSpec.$, [], true);
    }
    reloadPage() {
        return this.proxy.sendMessage(1916089797, AiOverlayTools_ReloadPage_ParamsSpec.$, AiOverlayTools_ReloadPage_ResponseParamsSpec.$, [], true);
    }
    findAndHighlight(query) {
        return this.proxy.sendMessage(63385228, AiOverlayTools_FindAndHighlight_ParamsSpec.$, AiOverlayTools_FindAndHighlight_ResponseParamsSpec.$, [
            query
        ], true);
    }
    scroll(granularity, magnitude) {
        return this.proxy.sendMessage(1795697483, AiOverlayTools_Scroll_ParamsSpec.$, AiOverlayTools_Scroll_ResponseParamsSpec.$, [
            granularity,
            magnitude
        ], true);
    }
    playVideo() {
        return this.proxy.sendMessage(659166225, AiOverlayTools_PlayVideo_ParamsSpec.$, AiOverlayTools_PlayVideo_ResponseParamsSpec.$, [], true);
    }
    pauseVideo() {
        return this.proxy.sendMessage(218495199, AiOverlayTools_PauseVideo_ParamsSpec.$, AiOverlayTools_PauseVideo_ResponseParamsSpec.$, [], true);
    }
    seekToTimestamp(timecode) {
        return this.proxy.sendMessage(537270964, AiOverlayTools_SeekToTimestamp_ParamsSpec.$, AiOverlayTools_SeekToTimestamp_ResponseParamsSpec.$, [
            timecode
        ], true);
    }
    translatePage(targetLanguage) {
        return this.proxy.sendMessage(823020573, AiOverlayTools_TranslatePage_ParamsSpec.$, AiOverlayTools_TranslatePage_ResponseParamsSpec.$, [
            targetLanguage
        ], true);
    }
    addBookmark() {
        return this.proxy.sendMessage(1757122569, AiOverlayTools_AddBookmark_ParamsSpec.$, AiOverlayTools_AddBookmark_ResponseParamsSpec.$, [], true);
    }
    removeBookmark() {
        return this.proxy.sendMessage(1493650196, AiOverlayTools_RemoveBookmark_ParamsSpec.$, AiOverlayTools_RemoveBookmark_ResponseParamsSpec.$, [], true);
    }
    openPage(query) {
        return this.proxy.sendMessage(662557193, AiOverlayTools_OpenPage_ParamsSpec.$, AiOverlayTools_OpenPage_ResponseParamsSpec.$, [
            query
        ], true);
    }
    setText(domNodeId, text) {
        return this.proxy.sendMessage(455733469, AiOverlayTools_SetText_ParamsSpec.$, AiOverlayTools_SetText_ResponseParamsSpec.$, [
            domNodeId,
            text
        ], true);
    }
    clickElement(domNodeId) {
        return this.proxy.sendMessage(562896842, AiOverlayTools_ClickElement_ParamsSpec.$, AiOverlayTools_ClickElement_ResponseParamsSpec.$, [
            domNodeId
        ], true);
    }
    setFullscreen(fullscreen) {
        return this.proxy.sendMessage(2023273293, AiOverlayTools_SetFullscreen_ParamsSpec.$, AiOverlayTools_SetFullscreen_ResponseParamsSpec.$, [
            fullscreen
        ], true);
    }
    selectOption(domNodeId, value) {
        return this.proxy.sendMessage(1986864650, AiOverlayTools_SelectOption_ParamsSpec.$, AiOverlayTools_SelectOption_ResponseParamsSpec.$, [
            domNodeId,
            value
        ], true);
    }
    openGeminiPanel(prompt) {
        return this.proxy.sendMessage(894009819, AiOverlayTools_OpenGeminiPanel_ParamsSpec.$, AiOverlayTools_OpenGeminiPanel_ResponseParamsSpec.$, [
            prompt
        ], true);
    }
    closeGeminiPanel() {
        return this.proxy.sendMessage(261721227, AiOverlayTools_CloseGeminiPanel_ParamsSpec.$, AiOverlayTools_CloseGeminiPanel_ResponseParamsSpec.$, [], true);
    }
}
/**
 * An object which receives request messages for the AiOverlayTools
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class AiOverlayToolsReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(AiOverlayToolsRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(1651053557, AiOverlayTools_OpenUrl_ParamsSpec.$, AiOverlayTools_OpenUrl_ResponseParamsSpec.$, impl.openUrl.bind(impl), true);
        this.helper_internal_.registerHandler(518834081, AiOverlayTools_FollowLink_ParamsSpec.$, AiOverlayTools_FollowLink_ResponseParamsSpec.$, impl.followLink.bind(impl), true);
        this.helper_internal_.registerHandler(1507743314, AiOverlayTools_PerformSearch_ParamsSpec.$, AiOverlayTools_PerformSearch_ResponseParamsSpec.$, impl.performSearch.bind(impl), true);
        this.helper_internal_.registerHandler(103186779, AiOverlayTools_SwitchTab_ParamsSpec.$, AiOverlayTools_SwitchTab_ResponseParamsSpec.$, impl.switchTab.bind(impl), true);
        this.helper_internal_.registerHandler(1279592623, AiOverlayTools_CloseCurrentTab_ParamsSpec.$, AiOverlayTools_CloseCurrentTab_ResponseParamsSpec.$, impl.closeCurrentTab.bind(impl), true);
        this.helper_internal_.registerHandler(990077943, AiOverlayTools_GoBack_ParamsSpec.$, AiOverlayTools_GoBack_ResponseParamsSpec.$, impl.goBack.bind(impl), true);
        this.helper_internal_.registerHandler(1081374392, AiOverlayTools_GoForward_ParamsSpec.$, AiOverlayTools_GoForward_ResponseParamsSpec.$, impl.goForward.bind(impl), true);
        this.helper_internal_.registerHandler(1916089797, AiOverlayTools_ReloadPage_ParamsSpec.$, AiOverlayTools_ReloadPage_ResponseParamsSpec.$, impl.reloadPage.bind(impl), true);
        this.helper_internal_.registerHandler(63385228, AiOverlayTools_FindAndHighlight_ParamsSpec.$, AiOverlayTools_FindAndHighlight_ResponseParamsSpec.$, impl.findAndHighlight.bind(impl), true);
        this.helper_internal_.registerHandler(1795697483, AiOverlayTools_Scroll_ParamsSpec.$, AiOverlayTools_Scroll_ResponseParamsSpec.$, impl.scroll.bind(impl), true);
        this.helper_internal_.registerHandler(659166225, AiOverlayTools_PlayVideo_ParamsSpec.$, AiOverlayTools_PlayVideo_ResponseParamsSpec.$, impl.playVideo.bind(impl), true);
        this.helper_internal_.registerHandler(218495199, AiOverlayTools_PauseVideo_ParamsSpec.$, AiOverlayTools_PauseVideo_ResponseParamsSpec.$, impl.pauseVideo.bind(impl), true);
        this.helper_internal_.registerHandler(537270964, AiOverlayTools_SeekToTimestamp_ParamsSpec.$, AiOverlayTools_SeekToTimestamp_ResponseParamsSpec.$, impl.seekToTimestamp.bind(impl), true);
        this.helper_internal_.registerHandler(823020573, AiOverlayTools_TranslatePage_ParamsSpec.$, AiOverlayTools_TranslatePage_ResponseParamsSpec.$, impl.translatePage.bind(impl), true);
        this.helper_internal_.registerHandler(1757122569, AiOverlayTools_AddBookmark_ParamsSpec.$, AiOverlayTools_AddBookmark_ResponseParamsSpec.$, impl.addBookmark.bind(impl), true);
        this.helper_internal_.registerHandler(1493650196, AiOverlayTools_RemoveBookmark_ParamsSpec.$, AiOverlayTools_RemoveBookmark_ResponseParamsSpec.$, impl.removeBookmark.bind(impl), true);
        this.helper_internal_.registerHandler(662557193, AiOverlayTools_OpenPage_ParamsSpec.$, AiOverlayTools_OpenPage_ResponseParamsSpec.$, impl.openPage.bind(impl), true);
        this.helper_internal_.registerHandler(455733469, AiOverlayTools_SetText_ParamsSpec.$, AiOverlayTools_SetText_ResponseParamsSpec.$, impl.setText.bind(impl), true);
        this.helper_internal_.registerHandler(562896842, AiOverlayTools_ClickElement_ParamsSpec.$, AiOverlayTools_ClickElement_ResponseParamsSpec.$, impl.clickElement.bind(impl), true);
        this.helper_internal_.registerHandler(2023273293, AiOverlayTools_SetFullscreen_ParamsSpec.$, AiOverlayTools_SetFullscreen_ResponseParamsSpec.$, impl.setFullscreen.bind(impl), true);
        this.helper_internal_.registerHandler(1986864650, AiOverlayTools_SelectOption_ParamsSpec.$, AiOverlayTools_SelectOption_ResponseParamsSpec.$, impl.selectOption.bind(impl), true);
        this.helper_internal_.registerHandler(894009819, AiOverlayTools_OpenGeminiPanel_ParamsSpec.$, AiOverlayTools_OpenGeminiPanel_ResponseParamsSpec.$, impl.openGeminiPanel.bind(impl), true);
        this.helper_internal_.registerHandler(261721227, AiOverlayTools_CloseGeminiPanel_ParamsSpec.$, AiOverlayTools_CloseGeminiPanel_ResponseParamsSpec.$, impl.closeGeminiPanel.bind(impl), true);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the AiOverlayTools
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class AiOverlayToolsCallbackRouter {
    helper_internal_;
    $;
    router_;
    openUrl;
    followLink;
    performSearch;
    switchTab;
    closeCurrentTab;
    goBack;
    goForward;
    reloadPage;
    findAndHighlight;
    scroll;
    playVideo;
    pauseVideo;
    seekToTimestamp;
    translatePage;
    addBookmark;
    removeBookmark;
    openPage;
    setText;
    clickElement;
    setFullscreen;
    selectOption;
    openGeminiPanel;
    closeGeminiPanel;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(AiOverlayToolsRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.openUrl =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1651053557, AiOverlayTools_OpenUrl_ParamsSpec.$, AiOverlayTools_OpenUrl_ResponseParamsSpec.$, this.openUrl.createReceiverHandler(true /* expectsResponse */), true);
        this.followLink =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(518834081, AiOverlayTools_FollowLink_ParamsSpec.$, AiOverlayTools_FollowLink_ResponseParamsSpec.$, this.followLink.createReceiverHandler(true /* expectsResponse */), true);
        this.performSearch =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1507743314, AiOverlayTools_PerformSearch_ParamsSpec.$, AiOverlayTools_PerformSearch_ResponseParamsSpec.$, this.performSearch.createReceiverHandler(true /* expectsResponse */), true);
        this.switchTab =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(103186779, AiOverlayTools_SwitchTab_ParamsSpec.$, AiOverlayTools_SwitchTab_ResponseParamsSpec.$, this.switchTab.createReceiverHandler(true /* expectsResponse */), true);
        this.closeCurrentTab =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1279592623, AiOverlayTools_CloseCurrentTab_ParamsSpec.$, AiOverlayTools_CloseCurrentTab_ResponseParamsSpec.$, this.closeCurrentTab.createReceiverHandler(true /* expectsResponse */), true);
        this.goBack =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(990077943, AiOverlayTools_GoBack_ParamsSpec.$, AiOverlayTools_GoBack_ResponseParamsSpec.$, this.goBack.createReceiverHandler(true /* expectsResponse */), true);
        this.goForward =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1081374392, AiOverlayTools_GoForward_ParamsSpec.$, AiOverlayTools_GoForward_ResponseParamsSpec.$, this.goForward.createReceiverHandler(true /* expectsResponse */), true);
        this.reloadPage =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1916089797, AiOverlayTools_ReloadPage_ParamsSpec.$, AiOverlayTools_ReloadPage_ResponseParamsSpec.$, this.reloadPage.createReceiverHandler(true /* expectsResponse */), true);
        this.findAndHighlight =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(63385228, AiOverlayTools_FindAndHighlight_ParamsSpec.$, AiOverlayTools_FindAndHighlight_ResponseParamsSpec.$, this.findAndHighlight.createReceiverHandler(true /* expectsResponse */), true);
        this.scroll =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1795697483, AiOverlayTools_Scroll_ParamsSpec.$, AiOverlayTools_Scroll_ResponseParamsSpec.$, this.scroll.createReceiverHandler(true /* expectsResponse */), true);
        this.playVideo =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(659166225, AiOverlayTools_PlayVideo_ParamsSpec.$, AiOverlayTools_PlayVideo_ResponseParamsSpec.$, this.playVideo.createReceiverHandler(true /* expectsResponse */), true);
        this.pauseVideo =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(218495199, AiOverlayTools_PauseVideo_ParamsSpec.$, AiOverlayTools_PauseVideo_ResponseParamsSpec.$, this.pauseVideo.createReceiverHandler(true /* expectsResponse */), true);
        this.seekToTimestamp =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(537270964, AiOverlayTools_SeekToTimestamp_ParamsSpec.$, AiOverlayTools_SeekToTimestamp_ResponseParamsSpec.$, this.seekToTimestamp.createReceiverHandler(true /* expectsResponse */), true);
        this.translatePage =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(823020573, AiOverlayTools_TranslatePage_ParamsSpec.$, AiOverlayTools_TranslatePage_ResponseParamsSpec.$, this.translatePage.createReceiverHandler(true /* expectsResponse */), true);
        this.addBookmark =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1757122569, AiOverlayTools_AddBookmark_ParamsSpec.$, AiOverlayTools_AddBookmark_ResponseParamsSpec.$, this.addBookmark.createReceiverHandler(true /* expectsResponse */), true);
        this.removeBookmark =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1493650196, AiOverlayTools_RemoveBookmark_ParamsSpec.$, AiOverlayTools_RemoveBookmark_ResponseParamsSpec.$, this.removeBookmark.createReceiverHandler(true /* expectsResponse */), true);
        this.openPage =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(662557193, AiOverlayTools_OpenPage_ParamsSpec.$, AiOverlayTools_OpenPage_ResponseParamsSpec.$, this.openPage.createReceiverHandler(true /* expectsResponse */), true);
        this.setText =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(455733469, AiOverlayTools_SetText_ParamsSpec.$, AiOverlayTools_SetText_ResponseParamsSpec.$, this.setText.createReceiverHandler(true /* expectsResponse */), true);
        this.clickElement =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(562896842, AiOverlayTools_ClickElement_ParamsSpec.$, AiOverlayTools_ClickElement_ResponseParamsSpec.$, this.clickElement.createReceiverHandler(true /* expectsResponse */), true);
        this.setFullscreen =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2023273293, AiOverlayTools_SetFullscreen_ParamsSpec.$, AiOverlayTools_SetFullscreen_ResponseParamsSpec.$, this.setFullscreen.createReceiverHandler(true /* expectsResponse */), true);
        this.selectOption =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1986864650, AiOverlayTools_SelectOption_ParamsSpec.$, AiOverlayTools_SelectOption_ResponseParamsSpec.$, this.selectOption.createReceiverHandler(true /* expectsResponse */), true);
        this.openGeminiPanel =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(894009819, AiOverlayTools_OpenGeminiPanel_ParamsSpec.$, AiOverlayTools_OpenGeminiPanel_ResponseParamsSpec.$, this.openGeminiPanel.createReceiverHandler(true /* expectsResponse */), true);
        this.closeGeminiPanel =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(261721227, AiOverlayTools_CloseGeminiPanel_ParamsSpec.$, AiOverlayTools_CloseGeminiPanel_ResponseParamsSpec.$, this.closeGeminiPanel.createReceiverHandler(true /* expectsResponse */), true);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class AiOverlayToolRegistryPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'ai_overlay_dialog.mojom.AiOverlayToolRegistry', scope);
    }
}
class AiOverlayToolRegistryRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(AiOverlayToolRegistryPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    getToolDefinitions() {
        return this.proxy.sendMessage(1905350714, AiOverlayToolRegistry_GetToolDefinitions_ParamsSpec.$, AiOverlayToolRegistry_GetToolDefinitions_ResponseParamsSpec.$, [], false);
    }
}
/**
 * An object which receives request messages for the AiOverlayToolRegistry
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class AiOverlayToolRegistryReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(AiOverlayToolRegistryRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(1905350714, AiOverlayToolRegistry_GetToolDefinitions_ParamsSpec.$, AiOverlayToolRegistry_GetToolDefinitions_ResponseParamsSpec.$, impl.getToolDefinitions.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the AiOverlayToolRegistry
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class AiOverlayToolRegistryCallbackRouter {
    helper_internal_;
    $;
    router_;
    getToolDefinitions;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(AiOverlayToolRegistryRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.getToolDefinitions =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1905350714, AiOverlayToolRegistry_GetToolDefinitions_ParamsSpec.$, AiOverlayToolRegistry_GetToolDefinitions_ResponseParamsSpec.$, this.getToolDefinitions.createReceiverHandler(true /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
const SwitchTabResultSpec = { $: {} };
const AiOverlayTools_OpenUrl_ParamsSpec = { $: {} };
const AiOverlayTools_OpenUrl_ResponseParamsSpec = { $: {} };
const AiOverlayTools_FollowLink_ParamsSpec = { $: {} };
const AiOverlayTools_FollowLink_ResponseParamsSpec = { $: {} };
const AiOverlayTools_PerformSearch_ParamsSpec = { $: {} };
const AiOverlayTools_PerformSearch_ResponseParamsSpec = { $: {} };
const AiOverlayTools_SwitchTab_ParamsSpec = { $: {} };
const AiOverlayTools_SwitchTab_ResponseParamsSpec = { $: {} };
const AiOverlayTools_CloseCurrentTab_ParamsSpec = { $: {} };
const AiOverlayTools_CloseCurrentTab_ResponseParamsSpec = { $: {} };
const AiOverlayTools_GoBack_ParamsSpec = { $: {} };
const AiOverlayTools_GoBack_ResponseParamsSpec = { $: {} };
const AiOverlayTools_GoForward_ParamsSpec = { $: {} };
const AiOverlayTools_GoForward_ResponseParamsSpec = { $: {} };
const AiOverlayTools_ReloadPage_ParamsSpec = { $: {} };
const AiOverlayTools_ReloadPage_ResponseParamsSpec = { $: {} };
const AiOverlayTools_FindAndHighlight_ParamsSpec = { $: {} };
const AiOverlayTools_FindAndHighlight_ResponseParamsSpec = { $: {} };
const AiOverlayTools_Scroll_ParamsSpec = { $: {} };
const AiOverlayTools_Scroll_ResponseParamsSpec = { $: {} };
const AiOverlayTools_PlayVideo_ParamsSpec = { $: {} };
const AiOverlayTools_PlayVideo_ResponseParamsSpec = { $: {} };
const AiOverlayTools_PauseVideo_ParamsSpec = { $: {} };
const AiOverlayTools_PauseVideo_ResponseParamsSpec = { $: {} };
const AiOverlayTools_SeekToTimestamp_ParamsSpec = { $: {} };
const AiOverlayTools_SeekToTimestamp_ResponseParamsSpec = { $: {} };
const AiOverlayTools_TranslatePage_ParamsSpec = { $: {} };
const AiOverlayTools_TranslatePage_ResponseParamsSpec = { $: {} };
const AiOverlayTools_AddBookmark_ParamsSpec = { $: {} };
const AiOverlayTools_AddBookmark_ResponseParamsSpec = { $: {} };
const AiOverlayTools_RemoveBookmark_ParamsSpec = { $: {} };
const AiOverlayTools_RemoveBookmark_ResponseParamsSpec = { $: {} };
const AiOverlayTools_OpenPage_ParamsSpec = { $: {} };
const AiOverlayTools_OpenPage_ResponseParamsSpec = { $: {} };
const AiOverlayTools_SetText_ParamsSpec = { $: {} };
const AiOverlayTools_SetText_ResponseParamsSpec = { $: {} };
const AiOverlayTools_ClickElement_ParamsSpec = { $: {} };
const AiOverlayTools_ClickElement_ResponseParamsSpec = { $: {} };
const AiOverlayTools_SetFullscreen_ParamsSpec = { $: {} };
const AiOverlayTools_SetFullscreen_ResponseParamsSpec = { $: {} };
const AiOverlayTools_SelectOption_ParamsSpec = { $: {} };
const AiOverlayTools_SelectOption_ResponseParamsSpec = { $: {} };
const AiOverlayTools_OpenGeminiPanel_ParamsSpec = { $: {} };
const AiOverlayTools_OpenGeminiPanel_ResponseParamsSpec = { $: {} };
const AiOverlayTools_CloseGeminiPanel_ParamsSpec = { $: {} };
const AiOverlayTools_CloseGeminiPanel_ResponseParamsSpec = { $: {} };
const AiOverlayToolRegistry_GetToolDefinitions_ParamsSpec = { $: {} };
const AiOverlayToolRegistry_GetToolDefinitions_ResponseParamsSpec = { $: {} };
const AiOverlayTools_OpenUrl_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_FollowLink_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_PerformSearch_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_SwitchTab_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_CloseCurrentTab_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_GoBack_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_GoForward_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_ReloadPage_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_FindAndHighlight_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_Scroll_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_PlayVideo_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_PauseVideo_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_SeekToTimestamp_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_TranslatePage_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_AddBookmark_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_RemoveBookmark_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_OpenPage_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_SetText_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_ClickElement_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_SetFullscreen_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_SelectOption_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_OpenGeminiPanel_ResponseParam_ResultSpec = { $: {} };
const AiOverlayTools_CloseGeminiPanel_ResponseParam_ResultSpec = { $: {} };
mojo.internal.Struct(SwitchTabResultSpec.$, 'SwitchTabResult', [
    mojo.internal.StructField('title', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('url', 8, 0, UrlSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('tabId', 16, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(AiOverlayTools_OpenUrl_ParamsSpec.$, 'AiOverlayTools_OpenUrl_Params', [
    mojo.internal.StructField('url', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('newTab', 8, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_OpenUrl_ResponseParamsSpec.$, 'AiOverlayTools_OpenUrl_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_OpenUrl_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_FollowLink_ParamsSpec.$, 'AiOverlayTools_FollowLink_Params', [
    mojo.internal.StructField('id', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(AiOverlayTools_FollowLink_ResponseParamsSpec.$, 'AiOverlayTools_FollowLink_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_FollowLink_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_PerformSearch_ParamsSpec.$, 'AiOverlayTools_PerformSearch_Params', [
    mojo.internal.StructField('query', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('newTab', 8, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_PerformSearch_ResponseParamsSpec.$, 'AiOverlayTools_PerformSearch_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_PerformSearch_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_SwitchTab_ParamsSpec.$, 'AiOverlayTools_SwitchTab_Params', [
    mojo.internal.StructField('query', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(AiOverlayTools_SwitchTab_ResponseParamsSpec.$, 'AiOverlayTools_SwitchTab_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_SwitchTab_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_CloseCurrentTab_ParamsSpec.$, 'AiOverlayTools_CloseCurrentTab_Params', [], [[0, 8],]);
mojo.internal.Struct(AiOverlayTools_CloseCurrentTab_ResponseParamsSpec.$, 'AiOverlayTools_CloseCurrentTab_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_CloseCurrentTab_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_GoBack_ParamsSpec.$, 'AiOverlayTools_GoBack_Params', [], [[0, 8],]);
mojo.internal.Struct(AiOverlayTools_GoBack_ResponseParamsSpec.$, 'AiOverlayTools_GoBack_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_GoBack_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_GoForward_ParamsSpec.$, 'AiOverlayTools_GoForward_Params', [], [[0, 8],]);
mojo.internal.Struct(AiOverlayTools_GoForward_ResponseParamsSpec.$, 'AiOverlayTools_GoForward_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_GoForward_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_ReloadPage_ParamsSpec.$, 'AiOverlayTools_ReloadPage_Params', [], [[0, 8],]);
mojo.internal.Struct(AiOverlayTools_ReloadPage_ResponseParamsSpec.$, 'AiOverlayTools_ReloadPage_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_ReloadPage_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_FindAndHighlight_ParamsSpec.$, 'AiOverlayTools_FindAndHighlight_Params', [
    mojo.internal.StructField('query', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(AiOverlayTools_FindAndHighlight_ResponseParamsSpec.$, 'AiOverlayTools_FindAndHighlight_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_FindAndHighlight_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_Scroll_ParamsSpec.$, 'AiOverlayTools_Scroll_Params', [
    mojo.internal.StructField('granularity', 0, 0, ScrollGranularitySpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('magnitude', 8, 0, mojo.internal.Double, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_Scroll_ResponseParamsSpec.$, 'AiOverlayTools_Scroll_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_Scroll_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_PlayVideo_ParamsSpec.$, 'AiOverlayTools_PlayVideo_Params', [], [[0, 8],]);
mojo.internal.Struct(AiOverlayTools_PlayVideo_ResponseParamsSpec.$, 'AiOverlayTools_PlayVideo_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_PlayVideo_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_PauseVideo_ParamsSpec.$, 'AiOverlayTools_PauseVideo_Params', [], [[0, 8],]);
mojo.internal.Struct(AiOverlayTools_PauseVideo_ResponseParamsSpec.$, 'AiOverlayTools_PauseVideo_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_PauseVideo_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_SeekToTimestamp_ParamsSpec.$, 'AiOverlayTools_SeekToTimestamp_Params', [
    mojo.internal.StructField('timecode', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(AiOverlayTools_SeekToTimestamp_ResponseParamsSpec.$, 'AiOverlayTools_SeekToTimestamp_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_SeekToTimestamp_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_TranslatePage_ParamsSpec.$, 'AiOverlayTools_TranslatePage_Params', [
    mojo.internal.StructField('targetLanguage', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(AiOverlayTools_TranslatePage_ResponseParamsSpec.$, 'AiOverlayTools_TranslatePage_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_TranslatePage_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_AddBookmark_ParamsSpec.$, 'AiOverlayTools_AddBookmark_Params', [], [[0, 8],]);
mojo.internal.Struct(AiOverlayTools_AddBookmark_ResponseParamsSpec.$, 'AiOverlayTools_AddBookmark_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_AddBookmark_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_RemoveBookmark_ParamsSpec.$, 'AiOverlayTools_RemoveBookmark_Params', [], [[0, 8],]);
mojo.internal.Struct(AiOverlayTools_RemoveBookmark_ResponseParamsSpec.$, 'AiOverlayTools_RemoveBookmark_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_RemoveBookmark_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_OpenPage_ParamsSpec.$, 'AiOverlayTools_OpenPage_Params', [
    mojo.internal.StructField('query', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(AiOverlayTools_OpenPage_ResponseParamsSpec.$, 'AiOverlayTools_OpenPage_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_OpenPage_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_SetText_ParamsSpec.$, 'AiOverlayTools_SetText_Params', [
    mojo.internal.StructField('domNodeId', 0, 0, DOMNodeIdSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('text', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_SetText_ResponseParamsSpec.$, 'AiOverlayTools_SetText_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_SetText_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_ClickElement_ParamsSpec.$, 'AiOverlayTools_ClickElement_Params', [
    mojo.internal.StructField('domNodeId', 0, 0, DOMNodeIdSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(AiOverlayTools_ClickElement_ResponseParamsSpec.$, 'AiOverlayTools_ClickElement_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_ClickElement_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_SetFullscreen_ParamsSpec.$, 'AiOverlayTools_SetFullscreen_Params', [
    mojo.internal.StructField('fullscreen', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(AiOverlayTools_SetFullscreen_ResponseParamsSpec.$, 'AiOverlayTools_SetFullscreen_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_SetFullscreen_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_SelectOption_ParamsSpec.$, 'AiOverlayTools_SelectOption_Params', [
    mojo.internal.StructField('domNodeId', 0, 0, DOMNodeIdSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('value', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_SelectOption_ResponseParamsSpec.$, 'AiOverlayTools_SelectOption_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_SelectOption_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_OpenGeminiPanel_ParamsSpec.$, 'AiOverlayTools_OpenGeminiPanel_Params', [
    mojo.internal.StructField('prompt', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(AiOverlayTools_OpenGeminiPanel_ResponseParamsSpec.$, 'AiOverlayTools_OpenGeminiPanel_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_OpenGeminiPanel_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayTools_CloseGeminiPanel_ParamsSpec.$, 'AiOverlayTools_CloseGeminiPanel_Params', [], [[0, 8],]);
mojo.internal.Struct(AiOverlayTools_CloseGeminiPanel_ResponseParamsSpec.$, 'AiOverlayTools_CloseGeminiPanel_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, AiOverlayTools_CloseGeminiPanel_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AiOverlayToolRegistry_GetToolDefinitions_ParamsSpec.$, 'AiOverlayToolRegistry_GetToolDefinitions_Params', [], [[0, 8],]);
mojo.internal.Struct(AiOverlayToolRegistry_GetToolDefinitions_ResponseParamsSpec.$, 'AiOverlayToolRegistry_GetToolDefinitions_ResponseParams', [
    mojo.internal.StructField('jsonDefinitions', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Union(AiOverlayTools_OpenUrl_ResponseParam_ResultSpec.$, 'AiOverlayTools_OpenUrl_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_OpenUrl_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_OpenUrl_ResponseParam_ResultFieldTags) {
    AiOverlayTools_OpenUrl_ResponseParam_ResultFieldTags[AiOverlayTools_OpenUrl_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_OpenUrl_ResponseParam_ResultFieldTags[AiOverlayTools_OpenUrl_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_OpenUrl_ResponseParam_ResultFieldTags || (AiOverlayTools_OpenUrl_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_FollowLink_ResponseParam_ResultSpec.$, 'AiOverlayTools_FollowLink_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_FollowLink_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_FollowLink_ResponseParam_ResultFieldTags) {
    AiOverlayTools_FollowLink_ResponseParam_ResultFieldTags[AiOverlayTools_FollowLink_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_FollowLink_ResponseParam_ResultFieldTags[AiOverlayTools_FollowLink_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_FollowLink_ResponseParam_ResultFieldTags || (AiOverlayTools_FollowLink_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_PerformSearch_ResponseParam_ResultSpec.$, 'AiOverlayTools_PerformSearch_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_PerformSearch_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_PerformSearch_ResponseParam_ResultFieldTags) {
    AiOverlayTools_PerformSearch_ResponseParam_ResultFieldTags[AiOverlayTools_PerformSearch_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_PerformSearch_ResponseParam_ResultFieldTags[AiOverlayTools_PerformSearch_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_PerformSearch_ResponseParam_ResultFieldTags || (AiOverlayTools_PerformSearch_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_SwitchTab_ResponseParam_ResultSpec.$, 'AiOverlayTools_SwitchTab_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': SwitchTabResultSpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_SwitchTab_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_SwitchTab_ResponseParam_ResultFieldTags) {
    AiOverlayTools_SwitchTab_ResponseParam_ResultFieldTags[AiOverlayTools_SwitchTab_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_SwitchTab_ResponseParam_ResultFieldTags[AiOverlayTools_SwitchTab_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_SwitchTab_ResponseParam_ResultFieldTags || (AiOverlayTools_SwitchTab_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_CloseCurrentTab_ResponseParam_ResultSpec.$, 'AiOverlayTools_CloseCurrentTab_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_CloseCurrentTab_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_CloseCurrentTab_ResponseParam_ResultFieldTags) {
    AiOverlayTools_CloseCurrentTab_ResponseParam_ResultFieldTags[AiOverlayTools_CloseCurrentTab_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_CloseCurrentTab_ResponseParam_ResultFieldTags[AiOverlayTools_CloseCurrentTab_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_CloseCurrentTab_ResponseParam_ResultFieldTags || (AiOverlayTools_CloseCurrentTab_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_GoBack_ResponseParam_ResultSpec.$, 'AiOverlayTools_GoBack_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_GoBack_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_GoBack_ResponseParam_ResultFieldTags) {
    AiOverlayTools_GoBack_ResponseParam_ResultFieldTags[AiOverlayTools_GoBack_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_GoBack_ResponseParam_ResultFieldTags[AiOverlayTools_GoBack_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_GoBack_ResponseParam_ResultFieldTags || (AiOverlayTools_GoBack_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_GoForward_ResponseParam_ResultSpec.$, 'AiOverlayTools_GoForward_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_GoForward_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_GoForward_ResponseParam_ResultFieldTags) {
    AiOverlayTools_GoForward_ResponseParam_ResultFieldTags[AiOverlayTools_GoForward_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_GoForward_ResponseParam_ResultFieldTags[AiOverlayTools_GoForward_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_GoForward_ResponseParam_ResultFieldTags || (AiOverlayTools_GoForward_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_ReloadPage_ResponseParam_ResultSpec.$, 'AiOverlayTools_ReloadPage_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_ReloadPage_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_ReloadPage_ResponseParam_ResultFieldTags) {
    AiOverlayTools_ReloadPage_ResponseParam_ResultFieldTags[AiOverlayTools_ReloadPage_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_ReloadPage_ResponseParam_ResultFieldTags[AiOverlayTools_ReloadPage_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_ReloadPage_ResponseParam_ResultFieldTags || (AiOverlayTools_ReloadPage_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_FindAndHighlight_ResponseParam_ResultSpec.$, 'AiOverlayTools_FindAndHighlight_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_FindAndHighlight_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_FindAndHighlight_ResponseParam_ResultFieldTags) {
    AiOverlayTools_FindAndHighlight_ResponseParam_ResultFieldTags[AiOverlayTools_FindAndHighlight_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_FindAndHighlight_ResponseParam_ResultFieldTags[AiOverlayTools_FindAndHighlight_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_FindAndHighlight_ResponseParam_ResultFieldTags || (AiOverlayTools_FindAndHighlight_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_Scroll_ResponseParam_ResultSpec.$, 'AiOverlayTools_Scroll_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_Scroll_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_Scroll_ResponseParam_ResultFieldTags) {
    AiOverlayTools_Scroll_ResponseParam_ResultFieldTags[AiOverlayTools_Scroll_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_Scroll_ResponseParam_ResultFieldTags[AiOverlayTools_Scroll_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_Scroll_ResponseParam_ResultFieldTags || (AiOverlayTools_Scroll_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_PlayVideo_ResponseParam_ResultSpec.$, 'AiOverlayTools_PlayVideo_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_PlayVideo_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_PlayVideo_ResponseParam_ResultFieldTags) {
    AiOverlayTools_PlayVideo_ResponseParam_ResultFieldTags[AiOverlayTools_PlayVideo_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_PlayVideo_ResponseParam_ResultFieldTags[AiOverlayTools_PlayVideo_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_PlayVideo_ResponseParam_ResultFieldTags || (AiOverlayTools_PlayVideo_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_PauseVideo_ResponseParam_ResultSpec.$, 'AiOverlayTools_PauseVideo_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_PauseVideo_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_PauseVideo_ResponseParam_ResultFieldTags) {
    AiOverlayTools_PauseVideo_ResponseParam_ResultFieldTags[AiOverlayTools_PauseVideo_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_PauseVideo_ResponseParam_ResultFieldTags[AiOverlayTools_PauseVideo_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_PauseVideo_ResponseParam_ResultFieldTags || (AiOverlayTools_PauseVideo_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_SeekToTimestamp_ResponseParam_ResultSpec.$, 'AiOverlayTools_SeekToTimestamp_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_SeekToTimestamp_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_SeekToTimestamp_ResponseParam_ResultFieldTags) {
    AiOverlayTools_SeekToTimestamp_ResponseParam_ResultFieldTags[AiOverlayTools_SeekToTimestamp_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_SeekToTimestamp_ResponseParam_ResultFieldTags[AiOverlayTools_SeekToTimestamp_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_SeekToTimestamp_ResponseParam_ResultFieldTags || (AiOverlayTools_SeekToTimestamp_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_TranslatePage_ResponseParam_ResultSpec.$, 'AiOverlayTools_TranslatePage_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_TranslatePage_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_TranslatePage_ResponseParam_ResultFieldTags) {
    AiOverlayTools_TranslatePage_ResponseParam_ResultFieldTags[AiOverlayTools_TranslatePage_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_TranslatePage_ResponseParam_ResultFieldTags[AiOverlayTools_TranslatePage_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_TranslatePage_ResponseParam_ResultFieldTags || (AiOverlayTools_TranslatePage_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_AddBookmark_ResponseParam_ResultSpec.$, 'AiOverlayTools_AddBookmark_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_AddBookmark_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_AddBookmark_ResponseParam_ResultFieldTags) {
    AiOverlayTools_AddBookmark_ResponseParam_ResultFieldTags[AiOverlayTools_AddBookmark_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_AddBookmark_ResponseParam_ResultFieldTags[AiOverlayTools_AddBookmark_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_AddBookmark_ResponseParam_ResultFieldTags || (AiOverlayTools_AddBookmark_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_RemoveBookmark_ResponseParam_ResultSpec.$, 'AiOverlayTools_RemoveBookmark_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_RemoveBookmark_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_RemoveBookmark_ResponseParam_ResultFieldTags) {
    AiOverlayTools_RemoveBookmark_ResponseParam_ResultFieldTags[AiOverlayTools_RemoveBookmark_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_RemoveBookmark_ResponseParam_ResultFieldTags[AiOverlayTools_RemoveBookmark_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_RemoveBookmark_ResponseParam_ResultFieldTags || (AiOverlayTools_RemoveBookmark_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_OpenPage_ResponseParam_ResultSpec.$, 'AiOverlayTools_OpenPage_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': mojo.internal.String,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_OpenPage_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_OpenPage_ResponseParam_ResultFieldTags) {
    AiOverlayTools_OpenPage_ResponseParam_ResultFieldTags[AiOverlayTools_OpenPage_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_OpenPage_ResponseParam_ResultFieldTags[AiOverlayTools_OpenPage_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_OpenPage_ResponseParam_ResultFieldTags || (AiOverlayTools_OpenPage_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_SetText_ResponseParam_ResultSpec.$, 'AiOverlayTools_SetText_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_SetText_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_SetText_ResponseParam_ResultFieldTags) {
    AiOverlayTools_SetText_ResponseParam_ResultFieldTags[AiOverlayTools_SetText_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_SetText_ResponseParam_ResultFieldTags[AiOverlayTools_SetText_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_SetText_ResponseParam_ResultFieldTags || (AiOverlayTools_SetText_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_ClickElement_ResponseParam_ResultSpec.$, 'AiOverlayTools_ClickElement_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_ClickElement_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_ClickElement_ResponseParam_ResultFieldTags) {
    AiOverlayTools_ClickElement_ResponseParam_ResultFieldTags[AiOverlayTools_ClickElement_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_ClickElement_ResponseParam_ResultFieldTags[AiOverlayTools_ClickElement_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_ClickElement_ResponseParam_ResultFieldTags || (AiOverlayTools_ClickElement_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_SetFullscreen_ResponseParam_ResultSpec.$, 'AiOverlayTools_SetFullscreen_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_SetFullscreen_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_SetFullscreen_ResponseParam_ResultFieldTags) {
    AiOverlayTools_SetFullscreen_ResponseParam_ResultFieldTags[AiOverlayTools_SetFullscreen_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_SetFullscreen_ResponseParam_ResultFieldTags[AiOverlayTools_SetFullscreen_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_SetFullscreen_ResponseParam_ResultFieldTags || (AiOverlayTools_SetFullscreen_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_SelectOption_ResponseParam_ResultSpec.$, 'AiOverlayTools_SelectOption_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_SelectOption_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_SelectOption_ResponseParam_ResultFieldTags) {
    AiOverlayTools_SelectOption_ResponseParam_ResultFieldTags[AiOverlayTools_SelectOption_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_SelectOption_ResponseParam_ResultFieldTags[AiOverlayTools_SelectOption_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_SelectOption_ResponseParam_ResultFieldTags || (AiOverlayTools_SelectOption_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_OpenGeminiPanel_ResponseParam_ResultSpec.$, 'AiOverlayTools_OpenGeminiPanel_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': mojo.internal.String,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_OpenGeminiPanel_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_OpenGeminiPanel_ResponseParam_ResultFieldTags) {
    AiOverlayTools_OpenGeminiPanel_ResponseParam_ResultFieldTags[AiOverlayTools_OpenGeminiPanel_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_OpenGeminiPanel_ResponseParam_ResultFieldTags[AiOverlayTools_OpenGeminiPanel_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_OpenGeminiPanel_ResponseParam_ResultFieldTags || (AiOverlayTools_OpenGeminiPanel_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(AiOverlayTools_CloseGeminiPanel_ResponseParam_ResultSpec.$, 'AiOverlayTools_CloseGeminiPanel_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': EmptySpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var AiOverlayTools_CloseGeminiPanel_ResponseParam_ResultFieldTags;
(function (AiOverlayTools_CloseGeminiPanel_ResponseParam_ResultFieldTags) {
    AiOverlayTools_CloseGeminiPanel_ResponseParam_ResultFieldTags[AiOverlayTools_CloseGeminiPanel_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    AiOverlayTools_CloseGeminiPanel_ResponseParam_ResultFieldTags[AiOverlayTools_CloseGeminiPanel_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(AiOverlayTools_CloseGeminiPanel_ResponseParam_ResultFieldTags || (AiOverlayTools_CloseGeminiPanel_ResponseParam_ResultFieldTags = {}));

// mojo/public/mojom/base/absl_status.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const AbslStatusCodeSpec = { $: mojo.internal.Enum() };
var AbslStatusCode;
(function (AbslStatusCode) {
    AbslStatusCode[AbslStatusCode["MIN_VALUE"] = 0] = "MIN_VALUE";
    AbslStatusCode[AbslStatusCode["MAX_VALUE"] = 16] = "MAX_VALUE";
    AbslStatusCode[AbslStatusCode["kOk"] = 0] = "kOk";
    AbslStatusCode[AbslStatusCode["kCancelled"] = 1] = "kCancelled";
    AbslStatusCode[AbslStatusCode["kUnknown"] = 2] = "kUnknown";
    AbslStatusCode[AbslStatusCode["kInvalidArgument"] = 3] = "kInvalidArgument";
    AbslStatusCode[AbslStatusCode["kDeadlineExceeded"] = 4] = "kDeadlineExceeded";
    AbslStatusCode[AbslStatusCode["kNotFound"] = 5] = "kNotFound";
    AbslStatusCode[AbslStatusCode["kAlreadyExists"] = 6] = "kAlreadyExists";
    AbslStatusCode[AbslStatusCode["kPermissionDenied"] = 7] = "kPermissionDenied";
    AbslStatusCode[AbslStatusCode["kResourceExhausted"] = 8] = "kResourceExhausted";
    AbslStatusCode[AbslStatusCode["kFailedPrecondition"] = 9] = "kFailedPrecondition";
    AbslStatusCode[AbslStatusCode["kAborted"] = 10] = "kAborted";
    AbslStatusCode[AbslStatusCode["kOutOfRange"] = 11] = "kOutOfRange";
    AbslStatusCode[AbslStatusCode["kUnimplemented"] = 12] = "kUnimplemented";
    AbslStatusCode[AbslStatusCode["kInternal"] = 13] = "kInternal";
    AbslStatusCode[AbslStatusCode["kUnavailable"] = 14] = "kUnavailable";
    AbslStatusCode[AbslStatusCode["kDataLoss"] = 15] = "kDataLoss";
    AbslStatusCode[AbslStatusCode["kUnauthenticated"] = 16] = "kUnauthenticated";
})(AbslStatusCode || (AbslStatusCode = {}));

// mojo/public/mojom/base/byte_string.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const ByteStringSpec = { $: {} };
mojo.internal.Struct(ByteStringSpec.$, 'ByteString', [
    mojo.internal.StructField('data', 0, 0, mojo.internal.Array(mojo.internal.Uint8, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);

// mojo/public/mojom/base/proto_wrapper.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const ProtoWrapperSpec = { $: {} };
mojo.internal.Struct(ProtoWrapperSpec.$, 'ProtoWrapper', [
    mojo.internal.StructField('protoName', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('smuggled', 8, 0, BigBufferSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);

// mojo/public/mojom/base/time.mojom-converters.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class JSTimeDataView {
    decoder_;
    version_;
    fieldSpecs_;
    constructor(decoder, version, fieldSpecs) {
        this.decoder_ = decoder;
        this.version_ = version;
        this.fieldSpecs_ = fieldSpecs;
    }
    get msec() {
        const field = this.fieldSpecs_[0];
        return mojo.internal.decodeStructField(this.decoder_, field, this.version_);
    }
}

class JsTimeConverter {
    // Encoding
    msec(date) {
        return date.valueOf();
    }
    // Decoding
    convert(view) {
        return new Date(view.msec);
    }
}

// mojo/public/mojom/base/time.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const TimeSpec = { $: {} };
const JSTimeSpec = { $: {} };
const TimeDeltaSpec = { $: {} };
const TimeTicksSpec = { $: {} };
mojo.internal.Struct(TimeSpec.$, 'Time', [
    mojo.internal.StructField('internalValue', 0, 0, mojo.internal.Int64, BigInt(0), false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
const converterForJSTime = new JsTimeConverter();
mojo.internal.TypemappedStruct(JSTimeSpec.$, 'JSTime', JSTimeDataView, converterForJSTime, [
    mojo.internal.StructField('msec', 0, 0, mojo.internal.Double, 0, false /* nullable */, 0, undefined, ((value) => converterForJSTime.msec(value))),
], [[0, 16],]);
mojo.internal.Struct(TimeDeltaSpec.$, 'TimeDelta', [
    mojo.internal.StructField('microseconds', 0, 0, mojo.internal.Int64, BigInt(0), false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(TimeTicksSpec.$, 'TimeTicks', [
    mojo.internal.StructField('internalValue', 0, 0, mojo.internal.Int64, BigInt(0), false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);

// mojo/public/mojom/base/version.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const VersionSpec = { $: {} };
mojo.internal.Struct(VersionSpec.$, 'Version', [
    mojo.internal.StructField('components', 0, 0, mojo.internal.Array(mojo.internal.Uint32, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);

// ui/gfx/geometry/mojom/geometry.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const PointSpec = { $: {} };
const PointFSpec = { $: {} };
const Point3FSpec = { $: {} };
const SizeSpec = { $: {} };
const SizeFSpec = { $: {} };
const RectSpec = { $: {} };
const RectFSpec = { $: {} };
const InsetsSpec = { $: {} };
const InsetsFSpec = { $: {} };
const Vector2dSpec = { $: {} };
const Vector2dFSpec = { $: {} };
const Vector3dFSpec = { $: {} };
const QuaternionSpec = { $: {} };
const QuadFSpec = { $: {} };
const AxisTransform2dSpec = { $: {} };
mojo.internal.Struct(PointSpec.$, 'Point', [
    mojo.internal.StructField('x', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('y', 4, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(PointFSpec.$, 'PointF', [
    mojo.internal.StructField('x', 0, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('y', 4, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(Point3FSpec.$, 'Point3F', [
    mojo.internal.StructField('x', 0, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('y', 4, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('z', 8, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(SizeSpec.$, 'Size', [
    mojo.internal.StructField('width', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('height', 4, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SizeFSpec.$, 'SizeF', [
    mojo.internal.StructField('width', 0, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('height', 4, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(RectSpec.$, 'Rect', [
    mojo.internal.StructField('x', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('y', 4, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('width', 8, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('height', 12, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(RectFSpec.$, 'RectF', [
    mojo.internal.StructField('x', 0, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('y', 4, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('width', 8, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('height', 12, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(InsetsSpec.$, 'Insets', [
    mojo.internal.StructField('top', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('left', 4, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('bottom', 8, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('right', 12, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(InsetsFSpec.$, 'InsetsF', [
    mojo.internal.StructField('top', 0, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('left', 4, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('bottom', 8, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('right', 12, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(Vector2dSpec.$, 'Vector2d', [
    mojo.internal.StructField('x', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('y', 4, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(Vector2dFSpec.$, 'Vector2dF', [
    mojo.internal.StructField('x', 0, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('y', 4, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(Vector3dFSpec.$, 'Vector3dF', [
    mojo.internal.StructField('x', 0, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('y', 4, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('z', 8, 0, mojo.internal.Float, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(QuaternionSpec.$, 'Quaternion', [
    mojo.internal.StructField('x', 0, 0, mojo.internal.Double, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('y', 8, 0, mojo.internal.Double, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('z', 16, 0, mojo.internal.Double, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('w', 24, 0, mojo.internal.Double, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 40],]);
mojo.internal.Struct(QuadFSpec.$, 'QuadF', [
    mojo.internal.StructField('p1', 0, 0, PointFSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('p2', 8, 0, PointFSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('p3', 16, 0, PointFSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('p4', 24, 0, PointFSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 40],]);
mojo.internal.Struct(AxisTransform2dSpec.$, 'AxisTransform2d', [
    mojo.internal.StructField('scale', 0, 0, Vector2dFSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('translation', 8, 0, Vector2dFSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);

// chrome/browser/glic/host/glic.mojom-webui.ts is auto generated by mojom_bindings_generator.py, do not edit
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const FileUploadPolicyStateSpec = { $: mojo.internal.Enum() };
var FileUploadPolicyState$1;
(function (FileUploadPolicyState) {
    FileUploadPolicyState[FileUploadPolicyState["MIN_VALUE"] = 0] = "MIN_VALUE";
    FileUploadPolicyState[FileUploadPolicyState["MAX_VALUE"] = 1] = "MAX_VALUE";
    FileUploadPolicyState[FileUploadPolicyState["kEnabled"] = 0] = "kEnabled";
    FileUploadPolicyState[FileUploadPolicyState["kDisabled"] = 1] = "kDisabled";
})(FileUploadPolicyState$1 || (FileUploadPolicyState$1 = {}));
const MetricUserInputReactionTypeSpec = { $: mojo.internal.Enum() };
var MetricUserInputReactionType$1;
(function (MetricUserInputReactionType) {
    MetricUserInputReactionType[MetricUserInputReactionType["MIN_VALUE"] = 0] = "MIN_VALUE";
    MetricUserInputReactionType[MetricUserInputReactionType["MAX_VALUE"] = 2] = "MAX_VALUE";
    MetricUserInputReactionType[MetricUserInputReactionType["kUnknown"] = 0] = "kUnknown";
    MetricUserInputReactionType[MetricUserInputReactionType["kCanned"] = 1] = "kCanned";
    MetricUserInputReactionType[MetricUserInputReactionType["kModel"] = 2] = "kModel";
})(MetricUserInputReactionType$1 || (MetricUserInputReactionType$1 = {}));
const PerformActionsErrorReasonSpec = { $: mojo.internal.Enum() };
var PerformActionsErrorReason$2;
(function (PerformActionsErrorReason) {
    PerformActionsErrorReason[PerformActionsErrorReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    PerformActionsErrorReason[PerformActionsErrorReason["MAX_VALUE"] = 2] = "MAX_VALUE";
    PerformActionsErrorReason[PerformActionsErrorReason["kUnknown"] = 0] = "kUnknown";
    PerformActionsErrorReason[PerformActionsErrorReason["kInvalidProto"] = 1] = "kInvalidProto";
    PerformActionsErrorReason[PerformActionsErrorReason["kMissingTaskId"] = 2] = "kMissingTaskId";
})(PerformActionsErrorReason$2 || (PerformActionsErrorReason$2 = {}));
const CreateTaskErrorReasonSpec = { $: mojo.internal.Enum() };
var CreateTaskErrorReason$2;
(function (CreateTaskErrorReason) {
    CreateTaskErrorReason[CreateTaskErrorReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    CreateTaskErrorReason[CreateTaskErrorReason["MAX_VALUE"] = 4] = "MAX_VALUE";
    CreateTaskErrorReason[CreateTaskErrorReason["kUnknown"] = 0] = "kUnknown";
    CreateTaskErrorReason[CreateTaskErrorReason["kTaskSystemUnavailable"] = 1] = "kTaskSystemUnavailable";
    CreateTaskErrorReason[CreateTaskErrorReason["kExistingActiveTask"] = 2] = "kExistingActiveTask";
    CreateTaskErrorReason[CreateTaskErrorReason["kBlockedByPolicy"] = 3] = "kBlockedByPolicy";
    CreateTaskErrorReason[CreateTaskErrorReason["kConversationNotRegistered"] = 4] = "kConversationNotRegistered";
})(CreateTaskErrorReason$2 || (CreateTaskErrorReason$2 = {}));
const ActorTaskStateSpec = { $: mojo.internal.Enum() };
var ActorTaskState$2;
(function (ActorTaskState) {
    ActorTaskState[ActorTaskState["MIN_VALUE"] = 0] = "MIN_VALUE";
    ActorTaskState[ActorTaskState["MAX_VALUE"] = 4] = "MAX_VALUE";
    ActorTaskState[ActorTaskState["kUnknown"] = 0] = "kUnknown";
    ActorTaskState[ActorTaskState["kIdle"] = 1] = "kIdle";
    ActorTaskState[ActorTaskState["kActing"] = 2] = "kActing";
    ActorTaskState[ActorTaskState["kPaused"] = 3] = "kPaused";
    ActorTaskState[ActorTaskState["kStopped"] = 4] = "kStopped";
})(ActorTaskState$2 || (ActorTaskState$2 = {}));
const ActorTaskPauseReasonSpec = { $: mojo.internal.Enum() };
var ActorTaskPauseReason$2;
(function (ActorTaskPauseReason) {
    ActorTaskPauseReason[ActorTaskPauseReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    ActorTaskPauseReason[ActorTaskPauseReason["MAX_VALUE"] = 1] = "MAX_VALUE";
    ActorTaskPauseReason[ActorTaskPauseReason["kPausedByModel"] = 0] = "kPausedByModel";
    ActorTaskPauseReason[ActorTaskPauseReason["kPausedByUser"] = 1] = "kPausedByUser";
})(ActorTaskPauseReason$2 || (ActorTaskPauseReason$2 = {}));
const ActorTaskStopReasonSpec = { $: mojo.internal.Enum() };
var ActorTaskStopReason$2;
(function (ActorTaskStopReason) {
    ActorTaskStopReason[ActorTaskStopReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    ActorTaskStopReason[ActorTaskStopReason["MAX_VALUE"] = 4] = "MAX_VALUE";
    ActorTaskStopReason[ActorTaskStopReason["kTaskComplete"] = 0] = "kTaskComplete";
    ActorTaskStopReason[ActorTaskStopReason["kStoppedByUser"] = 1] = "kStoppedByUser";
    ActorTaskStopReason[ActorTaskStopReason["kModelError"] = 2] = "kModelError";
    ActorTaskStopReason[ActorTaskStopReason["kUserStartedNewChat"] = 3] = "kUserStartedNewChat";
    ActorTaskStopReason[ActorTaskStopReason["kUserLoadedPreviousChat"] = 4] = "kUserLoadedPreviousChat";
})(ActorTaskStopReason$2 || (ActorTaskStopReason$2 = {}));
const ActorTaskInterruptReasonSpec = { $: mojo.internal.Enum() };
var ActorTaskInterruptReason$1;
(function (ActorTaskInterruptReason) {
    ActorTaskInterruptReason[ActorTaskInterruptReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    ActorTaskInterruptReason[ActorTaskInterruptReason["MAX_VALUE"] = 8] = "MAX_VALUE";
    ActorTaskInterruptReason[ActorTaskInterruptReason["kUnknownReason"] = 0] = "kUnknownReason";
    ActorTaskInterruptReason[ActorTaskInterruptReason["kTaskComplete"] = 1] = "kTaskComplete";
    ActorTaskInterruptReason[ActorTaskInterruptReason["kWaitingUserInput"] = 2] = "kWaitingUserInput";
    ActorTaskInterruptReason[ActorTaskInterruptReason["kWaitingUserClarification"] = 3] = "kWaitingUserClarification";
    ActorTaskInterruptReason[ActorTaskInterruptReason["kWaitingUserConfirmation"] = 4] = "kWaitingUserConfirmation";
    ActorTaskInterruptReason[ActorTaskInterruptReason["kWaitingUserTakeOver"] = 5] = "kWaitingUserTakeOver";
    ActorTaskInterruptReason[ActorTaskInterruptReason["kWaitingIrrelevantUserInput"] = 6] = "kWaitingIrrelevantUserInput";
    ActorTaskInterruptReason[ActorTaskInterruptReason["kWaitingUnsafeCounterAbuseVerdict"] = 7] = "kWaitingUnsafeCounterAbuseVerdict";
    ActorTaskInterruptReason[ActorTaskInterruptReason["kWaitingForExperimentalTriggeringConsent"] = 8] = "kWaitingForExperimentalTriggeringConsent";
})(ActorTaskInterruptReason$1 || (ActorTaskInterruptReason$1 = {}));
const SbThreatTypeSpec = { $: mojo.internal.Enum() };
var SbThreatType$1;
(function (SbThreatType) {
    SbThreatType[SbThreatType["MIN_VALUE"] = 0] = "MIN_VALUE";
    SbThreatType[SbThreatType["MAX_VALUE"] = 3] = "MAX_VALUE";
    SbThreatType[SbThreatType["kUnspecified"] = 0] = "kUnspecified";
    SbThreatType[SbThreatType["kSocialEngineering"] = 1] = "kSocialEngineering";
    SbThreatType[SbThreatType["kMalware"] = 2] = "kMalware";
    SbThreatType[SbThreatType["kUnwantedSoftware"] = 3] = "kUnwantedSoftware";
})(SbThreatType$1 || (SbThreatType$1 = {}));
const ScreenshotImageFormatSpec = { $: mojo.internal.Enum() };
var ScreenshotImageFormat$1;
(function (ScreenshotImageFormat) {
    ScreenshotImageFormat[ScreenshotImageFormat["MIN_VALUE"] = 0] = "MIN_VALUE";
    ScreenshotImageFormat[ScreenshotImageFormat["MAX_VALUE"] = 2] = "MAX_VALUE";
    ScreenshotImageFormat[ScreenshotImageFormat["kJpeg"] = 0] = "kJpeg";
    ScreenshotImageFormat[ScreenshotImageFormat["kPng"] = 1] = "kPng";
    ScreenshotImageFormat[ScreenshotImageFormat["kWebp"] = 2] = "kWebp";
})(ScreenshotImageFormat$1 || (ScreenshotImageFormat$1 = {}));
const ScreenshotCompressionQualitySpec = { $: mojo.internal.Enum() };
var ScreenshotCompressionQuality$1;
(function (ScreenshotCompressionQuality) {
    ScreenshotCompressionQuality[ScreenshotCompressionQuality["MIN_VALUE"] = 0] = "MIN_VALUE";
    ScreenshotCompressionQuality[ScreenshotCompressionQuality["MAX_VALUE"] = 3] = "MAX_VALUE";
    ScreenshotCompressionQuality[ScreenshotCompressionQuality["kNone"] = 0] = "kNone";
    ScreenshotCompressionQuality[ScreenshotCompressionQuality["kLow"] = 1] = "kLow";
    ScreenshotCompressionQuality[ScreenshotCompressionQuality["kMedium"] = 2] = "kMedium";
    ScreenshotCompressionQuality[ScreenshotCompressionQuality["kHigh"] = 3] = "kHigh";
})(ScreenshotCompressionQuality$1 || (ScreenshotCompressionQuality$1 = {}));
const ScrollToErrorReasonSpec = { $: mojo.internal.Enum() };
var ScrollToErrorReason$2;
(function (ScrollToErrorReason) {
    ScrollToErrorReason[ScrollToErrorReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    ScrollToErrorReason[ScrollToErrorReason["MAX_VALUE"] = 8] = "MAX_VALUE";
    ScrollToErrorReason[ScrollToErrorReason["kNotSupported"] = 0] = "kNotSupported";
    ScrollToErrorReason[ScrollToErrorReason["kNewerScrollToCall"] = 1] = "kNewerScrollToCall";
    ScrollToErrorReason[ScrollToErrorReason["kNoFocusedTab"] = 2] = "kNoFocusedTab";
    ScrollToErrorReason[ScrollToErrorReason["kNoMatchFound"] = 3] = "kNoMatchFound";
    ScrollToErrorReason[ScrollToErrorReason["kFocusedTabChangedOrNavigated"] = 4] = "kFocusedTabChangedOrNavigated";
    ScrollToErrorReason[ScrollToErrorReason["kNoMatchingDocument"] = 5] = "kNoMatchingDocument";
    ScrollToErrorReason[ScrollToErrorReason["kSearchRangeInvalid"] = 6] = "kSearchRangeInvalid";
    ScrollToErrorReason[ScrollToErrorReason["kTabContextPermissionDisabled"] = 7] = "kTabContextPermissionDisabled";
    ScrollToErrorReason[ScrollToErrorReason["kDroppedByWebClient"] = 8] = "kDroppedByWebClient";
})(ScrollToErrorReason$2 || (ScrollToErrorReason$2 = {}));
const SkillSourceSpec = { $: mojo.internal.Enum() };
var SkillSource$1;
(function (SkillSource) {
    SkillSource[SkillSource["MIN_VALUE"] = 0] = "MIN_VALUE";
    SkillSource[SkillSource["MAX_VALUE"] = 5] = "MAX_VALUE";
    SkillSource[SkillSource["kUnknown"] = 0] = "kUnknown";
    SkillSource[SkillSource["kFirstParty"] = 1] = "kFirstParty";
    SkillSource[SkillSource["kUserCreated"] = 2] = "kUserCreated";
    SkillSource[SkillSource["kDerivedFromFirstParty"] = 3] = "kDerivedFromFirstParty";
    SkillSource[SkillSource["kEnterprise"] = 4] = "kEnterprise";
    SkillSource[SkillSource["kDerivedFromEnterprise"] = 5] = "kDerivedFromEnterprise";
})(SkillSource$1 || (SkillSource$1 = {}));
const SkillsWebClientEventSpec = { $: mojo.internal.Enum() };
var SkillsWebClientEvent$1;
(function (SkillsWebClientEvent) {
    SkillsWebClientEvent[SkillsWebClientEvent["MIN_VALUE"] = 0] = "MIN_VALUE";
    SkillsWebClientEvent[SkillsWebClientEvent["MAX_VALUE"] = 22] = "MAX_VALUE";
    SkillsWebClientEvent[SkillsWebClientEvent["kUnknown"] = 0] = "kUnknown";
    SkillsWebClientEvent[SkillsWebClientEvent["kUsedFirstPartySkill"] = 1] = "kUsedFirstPartySkill";
    SkillsWebClientEvent[SkillsWebClientEvent["kUsedUserCreatedSkill"] = 2] = "kUsedUserCreatedSkill";
    SkillsWebClientEvent[SkillsWebClientEvent["kUsedDerivedFirstPartySkill"] = 3] = "kUsedDerivedFirstPartySkill";
    SkillsWebClientEvent[SkillsWebClientEvent["kOpenedMenu"] = 4] = "kOpenedMenu";
    SkillsWebClientEvent[SkillsWebClientEvent["kClickedManageFromMenu"] = 5] = "kClickedManageFromMenu";
    SkillsWebClientEvent[SkillsWebClientEvent["kClickedAddFromMenu"] = 6] = "kClickedAddFromMenu";
    SkillsWebClientEvent[SkillsWebClientEvent["kClickedEditFromMenu"] = 7] = "kClickedEditFromMenu";
    SkillsWebClientEvent[SkillsWebClientEvent["kClickedAddOn1pSkill"] = 8] = "kClickedAddOn1pSkill";
    SkillsWebClientEvent[SkillsWebClientEvent["kClickedSaveAsSkillHoverChip"] = 9] = "kClickedSaveAsSkillHoverChip";
    SkillsWebClientEvent[SkillsWebClientEvent["kClickedEditSkillHoverChip"] = 10] = "kClickedEditSkillHoverChip";
    SkillsWebClientEvent[SkillsWebClientEvent["kClickedBrowseSkillFromPlusMenu"] = 11] = "kClickedBrowseSkillFromPlusMenu";
    SkillsWebClientEvent[SkillsWebClientEvent["kClickedSkillFromPlusMenu"] = 12] = "kClickedSkillFromPlusMenu";
    SkillsWebClientEvent[SkillsWebClientEvent["kClickedManageSkillFromPlusMenu"] = 13] = "kClickedManageSkillFromPlusMenu";
    SkillsWebClientEvent[SkillsWebClientEvent["kClickedMoreFromMenu"] = 14] = "kClickedMoreFromMenu";
    SkillsWebClientEvent[SkillsWebClientEvent["kClickedManageSkillFromMenu"] = 15] = "kClickedManageSkillFromMenu";
    SkillsWebClientEvent[SkillsWebClientEvent["kClickedSkillFromMenu"] = 16] = "kClickedSkillFromMenu";
    SkillsWebClientEvent[SkillsWebClientEvent["kClickedBrowseSkillsFromMenu"] = 17] = "kClickedBrowseSkillsFromMenu";
    SkillsWebClientEvent[SkillsWebClientEvent["kSkillBuilderClickedPromoChip"] = 20] = "kSkillBuilderClickedPromoChip";
    SkillsWebClientEvent[SkillsWebClientEvent["kSkillBuilderPromptGenerated"] = 21] = "kSkillBuilderPromptGenerated";
    SkillsWebClientEvent[SkillsWebClientEvent["kSkillBuilderClickedSaveAsSkill"] = 22] = "kSkillBuilderClickedSaveAsSkill";
})(SkillsWebClientEvent$1 || (SkillsWebClientEvent$1 = {}));
const PinTriggerSpec = { $: mojo.internal.Enum() };
var PinTrigger$1;
(function (PinTrigger) {
    PinTrigger[PinTrigger["MIN_VALUE"] = 0] = "MIN_VALUE";
    PinTrigger[PinTrigger["MAX_VALUE"] = 3] = "MAX_VALUE";
    PinTrigger[PinTrigger["kWebClientUnknown"] = 0] = "kWebClientUnknown";
    PinTrigger[PinTrigger["kCandidatesToggle"] = 1] = "kCandidatesToggle";
    PinTrigger[PinTrigger["kAtMention"] = 2] = "kAtMention";
    PinTrigger[PinTrigger["kActuation"] = 3] = "kActuation";
})(PinTrigger$1 || (PinTrigger$1 = {}));
const UnpinTriggerSpec = { $: mojo.internal.Enum() };
var UnpinTrigger$1;
(function (UnpinTrigger) {
    UnpinTrigger[UnpinTrigger["MIN_VALUE"] = 0] = "MIN_VALUE";
    UnpinTrigger[UnpinTrigger["MAX_VALUE"] = 3] = "MAX_VALUE";
    UnpinTrigger[UnpinTrigger["kWebClientUnknown"] = 0] = "kWebClientUnknown";
    UnpinTrigger[UnpinTrigger["kCandidatesToggle"] = 1] = "kCandidatesToggle";
    UnpinTrigger[UnpinTrigger["kChip"] = 2] = "kChip";
    UnpinTrigger[UnpinTrigger["kActuation"] = 3] = "kActuation";
})(UnpinTrigger$1 || (UnpinTrigger$1 = {}));
const CancelActionsResultSpec = { $: mojo.internal.Enum() };
var CancelActionsResult$1;
(function (CancelActionsResult) {
    CancelActionsResult[CancelActionsResult["MIN_VALUE"] = 0] = "MIN_VALUE";
    CancelActionsResult[CancelActionsResult["MAX_VALUE"] = 3] = "MAX_VALUE";
    CancelActionsResult[CancelActionsResult["kUnknown"] = 0] = "kUnknown";
    CancelActionsResult[CancelActionsResult["kSuccess"] = 1] = "kSuccess";
    CancelActionsResult[CancelActionsResult["kTaskNotFound"] = 2] = "kTaskNotFound";
    CancelActionsResult[CancelActionsResult["kFailed"] = 3] = "kFailed";
})(CancelActionsResult$1 || (CancelActionsResult$1 = {}));
const GlicRequestEventSpec = { $: mojo.internal.Enum() };
var GlicRequestEvent$1;
(function (GlicRequestEvent) {
    GlicRequestEvent[GlicRequestEvent["MIN_VALUE"] = 0] = "MIN_VALUE";
    GlicRequestEvent[GlicRequestEvent["MAX_VALUE"] = 4] = "MAX_VALUE";
    GlicRequestEvent[GlicRequestEvent["kRequestReceived"] = 0] = "kRequestReceived";
    GlicRequestEvent[GlicRequestEvent["kResponseSent"] = 1] = "kResponseSent";
    GlicRequestEvent[GlicRequestEvent["kRequestHandlerException"] = 2] = "kRequestHandlerException";
    GlicRequestEvent[GlicRequestEvent["kRequestReceivedWhileInactive"] = 4] = "kRequestReceivedWhileInactive";
})(GlicRequestEvent$1 || (GlicRequestEvent$1 = {}));
const SwitchConversationErrorReasonSpec = { $: mojo.internal.Enum() };
var SwitchConversationErrorReason$1;
(function (SwitchConversationErrorReason) {
    SwitchConversationErrorReason[SwitchConversationErrorReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    SwitchConversationErrorReason[SwitchConversationErrorReason["MAX_VALUE"] = 0] = "MAX_VALUE";
    SwitchConversationErrorReason[SwitchConversationErrorReason["kUnknown"] = 0] = "kUnknown";
})(SwitchConversationErrorReason$1 || (SwitchConversationErrorReason$1 = {}));
const RegisterConversationErrorReasonSpec = { $: mojo.internal.Enum() };
var RegisterConversationErrorReason$1;
(function (RegisterConversationErrorReason) {
    RegisterConversationErrorReason[RegisterConversationErrorReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    RegisterConversationErrorReason[RegisterConversationErrorReason["MAX_VALUE"] = 1] = "MAX_VALUE";
    RegisterConversationErrorReason[RegisterConversationErrorReason["kUnknown"] = 0] = "kUnknown";
    RegisterConversationErrorReason[RegisterConversationErrorReason["kInstanceAlreadyHasConversationId"] = 1] = "kInstanceAlreadyHasConversationId";
})(RegisterConversationErrorReason$1 || (RegisterConversationErrorReason$1 = {}));
const WebClientModeSpec = { $: mojo.internal.Enum() };
var WebClientMode$2;
(function (WebClientMode) {
    WebClientMode[WebClientMode["MIN_VALUE"] = 0] = "MIN_VALUE";
    WebClientMode[WebClientMode["MAX_VALUE"] = 2] = "MAX_VALUE";
    WebClientMode[WebClientMode["kUnknown"] = 2] = "kUnknown";
    WebClientMode[WebClientMode["kText"] = 0] = "kText";
    WebClientMode[WebClientMode["kAudio"] = 1] = "kAudio";
})(WebClientMode$2 || (WebClientMode$2 = {}));
const PromptTypeSpec = { $: mojo.internal.Enum() };
var PromptType$1;
(function (PromptType) {
    PromptType[PromptType["MIN_VALUE"] = 0] = "MIN_VALUE";
    PromptType[PromptType["MAX_VALUE"] = 4] = "MAX_VALUE";
    PromptType[PromptType["kUnspecified"] = 0] = "kUnspecified";
    PromptType[PromptType["kTypedText"] = 1] = "kTypedText";
    PromptType[PromptType["kZeroStateSuggestions"] = 2] = "kZeroStateSuggestions";
    PromptType[PromptType["kAutoPrompt"] = 3] = "kAutoPrompt";
    PromptType[PromptType["kAudio"] = 4] = "kAudio";
})(PromptType$1 || (PromptType$1 = {}));
const MicrophoneStatusSpec = { $: mojo.internal.Enum() };
var MicrophoneStatus$2;
(function (MicrophoneStatus) {
    MicrophoneStatus[MicrophoneStatus["MIN_VALUE"] = 0] = "MIN_VALUE";
    MicrophoneStatus[MicrophoneStatus["MAX_VALUE"] = 2] = "MAX_VALUE";
    MicrophoneStatus[MicrophoneStatus["kNotListening"] = 0] = "kNotListening";
    MicrophoneStatus[MicrophoneStatus["kListening"] = 1] = "kListening";
    MicrophoneStatus[MicrophoneStatus["kUnknown"] = 2] = "kUnknown";
})(MicrophoneStatus$2 || (MicrophoneStatus$2 = {}));
const WebClientModelSpec = { $: mojo.internal.Enum() };
var WebClientModel$1;
(function (WebClientModel) {
    WebClientModel[WebClientModel["MIN_VALUE"] = 0] = "MIN_VALUE";
    WebClientModel[WebClientModel["MAX_VALUE"] = 1] = "MAX_VALUE";
    WebClientModel[WebClientModel["kDefault"] = 0] = "kDefault";
    WebClientModel[WebClientModel["kActor"] = 1] = "kActor";
})(WebClientModel$1 || (WebClientModel$1 = {}));
({ $: mojo.internal.Enum() });
var WebUseCounter$1;
(function (WebUseCounter) {
    WebUseCounter[WebUseCounter["MIN_VALUE"] = 0] = "MIN_VALUE";
    WebUseCounter[WebUseCounter["MAX_VALUE"] = 6] = "MAX_VALUE";
    WebUseCounter[WebUseCounter["kDefault"] = 0] = "kDefault";
    WebUseCounter[WebUseCounter["kSubmitPromptWithAutoMode"] = 1] = "kSubmitPromptWithAutoMode";
    WebUseCounter[WebUseCounter["kTaskInterruptedForUserConfirmation"] = 2] = "kTaskInterruptedForUserConfirmation";
    WebUseCounter[WebUseCounter["kTaskInterruptedForUserClarification"] = 3] = "kTaskInterruptedForUserClarification";
    WebUseCounter[WebUseCounter["kSelectionToggledViaSharedMenu"] = 4] = "kSelectionToggledViaSharedMenu";
    WebUseCounter[WebUseCounter["kSelectionToggledViaHotKey"] = 5] = "kSelectionToggledViaHotKey";
    WebUseCounter[WebUseCounter["kSubmitPromptWithTextSelectionCue"] = 6] = "kSubmitPromptWithTextSelectionCue";
})(WebUseCounter$1 || (WebUseCounter$1 = {}));
const ClientErrorDialogTypeSpec = { $: mojo.internal.Enum() };
var ClientErrorDialogType$1;
(function (ClientErrorDialogType) {
    ClientErrorDialogType[ClientErrorDialogType["MIN_VALUE"] = 0] = "MIN_VALUE";
    ClientErrorDialogType[ClientErrorDialogType["MAX_VALUE"] = 5] = "MAX_VALUE";
    ClientErrorDialogType[ClientErrorDialogType["kUnknown"] = 0] = "kUnknown";
    ClientErrorDialogType[ClientErrorDialogType["kDisabledByOrganization"] = 1] = "kDisabledByOrganization";
    ClientErrorDialogType[ClientErrorDialogType["kGenericAvailability"] = 2] = "kGenericAvailability";
    ClientErrorDialogType[ClientErrorDialogType["kIneligibleAccount"] = 3] = "kIneligibleAccount";
    ClientErrorDialogType[ClientErrorDialogType["kSignout"] = 4] = "kSignout";
    ClientErrorDialogType[ClientErrorDialogType["kUnsupportedLocation"] = 5] = "kUnsupportedLocation";
})(ClientErrorDialogType$1 || (ClientErrorDialogType$1 = {}));
const ResponseStopCauseSpec = { $: mojo.internal.Enum() };
var ResponseStopCause$1;
(function (ResponseStopCause) {
    ResponseStopCause[ResponseStopCause["MIN_VALUE"] = 0] = "MIN_VALUE";
    ResponseStopCause[ResponseStopCause["MAX_VALUE"] = 2] = "MAX_VALUE";
    ResponseStopCause[ResponseStopCause["kUnknown"] = 0] = "kUnknown";
    ResponseStopCause[ResponseStopCause["kUser"] = 1] = "kUser";
    ResponseStopCause[ResponseStopCause["kOther"] = 2] = "kOther";
})(ResponseStopCause$1 || (ResponseStopCause$1 = {}));
const AdditionalContextSourceSpec = { $: mojo.internal.Enum() };
var AdditionalContextSource$1;
(function (AdditionalContextSource) {
    AdditionalContextSource[AdditionalContextSource["MIN_VALUE"] = 0] = "MIN_VALUE";
    AdditionalContextSource[AdditionalContextSource["MAX_VALUE"] = 5] = "MAX_VALUE";
    AdditionalContextSource[AdditionalContextSource["kUnknown"] = 2] = "kUnknown";
    AdditionalContextSource[AdditionalContextSource["kShareContextMenu"] = 0] = "kShareContextMenu";
    AdditionalContextSource[AdditionalContextSource["kRegionSelection"] = 1] = "kRegionSelection";
    AdditionalContextSource[AdditionalContextSource["kTextSelection"] = 3] = "kTextSelection";
    AdditionalContextSource[AdditionalContextSource["kWebDragDrop"] = 4] = "kWebDragDrop";
    AdditionalContextSource[AdditionalContextSource["kExperimentalTriggering"] = 5] = "kExperimentalTriggering";
})(AdditionalContextSource$1 || (AdditionalContextSource$1 = {}));
const ExperimentalTriggeringUpdateTypeSpec = { $: mojo.internal.Enum() };
var ExperimentalTriggeringUpdateType$1;
(function (ExperimentalTriggeringUpdateType) {
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["MIN_VALUE"] = 0] = "MIN_VALUE";
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["MAX_VALUE"] = 7] = "MAX_VALUE";
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["kUnknown"] = 0] = "kUnknown";
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["kWorklog"] = 1] = "kWorklog";
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["kPaused"] = 2] = "kPaused";
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["kTerminalCompletion"] = 3] = "kTerminalCompletion";
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["kTerminalStopped"] = 4] = "kTerminalStopped";
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["kTerminalFailed"] = 5] = "kTerminalFailed";
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["kYieldToUser"] = 6] = "kYieldToUser";
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["kResumed"] = 7] = "kResumed";
})(ExperimentalTriggeringUpdateType$1 || (ExperimentalTriggeringUpdateType$1 = {}));
const SubscriberObservationTypeSpec = { $: mojo.internal.Enum() };
var SubscriberObservationType;
(function (SubscriberObservationType) {
    SubscriberObservationType[SubscriberObservationType["MIN_VALUE"] = 0] = "MIN_VALUE";
    SubscriberObservationType[SubscriberObservationType["MAX_VALUE"] = 2] = "MAX_VALUE";
    SubscriberObservationType[SubscriberObservationType["kUpdate"] = 0] = "kUpdate";
    SubscriberObservationType[SubscriberObservationType["kComplete"] = 1] = "kComplete";
    SubscriberObservationType[SubscriberObservationType["kError"] = 2] = "kError";
})(SubscriberObservationType || (SubscriberObservationType = {}));
const LightweightPageFeatureSpec = { $: mojo.internal.Enum() };
var LightweightPageFeature$1;
(function (LightweightPageFeature) {
    LightweightPageFeature[LightweightPageFeature["MIN_VALUE"] = 0] = "MIN_VALUE";
    LightweightPageFeature[LightweightPageFeature["MAX_VALUE"] = 1] = "MAX_VALUE";
    LightweightPageFeature[LightweightPageFeature["kUnknown"] = 0] = "kUnknown";
    LightweightPageFeature[LightweightPageFeature["kYtAskButtonPresent"] = 1] = "kYtAskButtonPresent";
})(LightweightPageFeature$1 || (LightweightPageFeature$1 = {}));
const CaptureRegionErrorReasonSpec = { $: mojo.internal.Enum() };
var CaptureRegionErrorReason$2;
(function (CaptureRegionErrorReason) {
    CaptureRegionErrorReason[CaptureRegionErrorReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    CaptureRegionErrorReason[CaptureRegionErrorReason["MAX_VALUE"] = 1] = "MAX_VALUE";
    CaptureRegionErrorReason[CaptureRegionErrorReason["kUnknown"] = 0] = "kUnknown";
    CaptureRegionErrorReason[CaptureRegionErrorReason["kNoFocusableTab"] = 1] = "kNoFocusableTab";
})(CaptureRegionErrorReason$2 || (CaptureRegionErrorReason$2 = {}));
const ScreenshotEncryptionSchemeSpec = { $: mojo.internal.Enum() };
var ScreenshotEncryptionScheme$1;
(function (ScreenshotEncryptionScheme) {
    ScreenshotEncryptionScheme[ScreenshotEncryptionScheme["MIN_VALUE"] = 0] = "MIN_VALUE";
    ScreenshotEncryptionScheme[ScreenshotEncryptionScheme["MAX_VALUE"] = 2] = "MAX_VALUE";
    ScreenshotEncryptionScheme[ScreenshotEncryptionScheme["kUnknown"] = 0] = "kUnknown";
    ScreenshotEncryptionScheme[ScreenshotEncryptionScheme["kNone"] = 1] = "kNone";
    ScreenshotEncryptionScheme[ScreenshotEncryptionScheme["kRfc8291"] = 2] = "kRfc8291";
})(ScreenshotEncryptionScheme$1 || (ScreenshotEncryptionScheme$1 = {}));
const SettingsPageFieldSpec = { $: mojo.internal.Enum() };
var SettingsPageField$1;
(function (SettingsPageField) {
    SettingsPageField[SettingsPageField["MIN_VALUE"] = 0] = "MIN_VALUE";
    SettingsPageField[SettingsPageField["MAX_VALUE"] = 3] = "MAX_VALUE";
    SettingsPageField[SettingsPageField["kNone"] = 0] = "kNone";
    SettingsPageField[SettingsPageField["kOsHotkey"] = 1] = "kOsHotkey";
    SettingsPageField[SettingsPageField["kOsEntrypointToggle"] = 2] = "kOsEntrypointToggle";
    SettingsPageField[SettingsPageField["kLocationPermission"] = 3] = "kLocationPermission";
})(SettingsPageField$1 || (SettingsPageField$1 = {}));
const HostCapabilitySpec = { $: mojo.internal.Enum() };
var HostCapability$2;
(function (HostCapability) {
    HostCapability[HostCapability["MIN_VALUE"] = 0] = "MIN_VALUE";
    HostCapability[HostCapability["MAX_VALUE"] = 19] = "MAX_VALUE";
    HostCapability[HostCapability["kScrollToPdf"] = 0] = "kScrollToPdf";
    HostCapability[HostCapability["kResetSizeAndLocationOnOpen"] = 1] = "kResetSizeAndLocationOnOpen";
    HostCapability[HostCapability["kGetModelQualityClientId"] = 2] = "kGetModelQualityClientId";
    HostCapability[HostCapability["kMultiInstance"] = 3] = "kMultiInstance";
    HostCapability[HostCapability["kTrustFirstOnboardingArm1"] = 4] = "kTrustFirstOnboardingArm1";
    HostCapability[HostCapability["kTrustFirstOnboardingArm2"] = 5] = "kTrustFirstOnboardingArm2";
    HostCapability[HostCapability["kShareAdditionalImageContext"] = 6] = "kShareAdditionalImageContext";
    HostCapability[HostCapability["kPdfZeroState"] = 7] = "kPdfZeroState";
    HostCapability[HostCapability["kInvoke"] = 8] = "kInvoke";
    HostCapability[HostCapability["kNoLiveMode"] = 9] = "kNoLiveMode";
    HostCapability[HostCapability["kAutoLoginSignInWithGoogle"] = 10] = "kAutoLoginSignInWithGoogle";
    HostCapability[HostCapability["kShareImageViaInvoke"] = 11] = "kShareImageViaInvoke";
    HostCapability[HostCapability["kImgWebDragDrop"] = 12] = "kImgWebDragDrop";
    HostCapability[HostCapability["kNoWebUiLoader"] = 13] = "kNoWebUiLoader";
    HostCapability[HostCapability["kEnforcesPasteEligibility"] = 14] = "kEnforcesPasteEligibility";
    HostCapability[HostCapability["kAttemptOtpFilling"] = 15] = "kAttemptOtpFilling";
    HostCapability[HostCapability["kChromeTools"] = 16] = "kChromeTools";
    HostCapability[HostCapability["kSkillsV2"] = 17] = "kSkillsV2";
    HostCapability[HostCapability["kEmbeddedPdfBytesExtraction"] = 18] = "kEmbeddedPdfBytesExtraction";
    HostCapability[HostCapability["kNoWebview"] = 19] = "kNoWebview";
})(HostCapability$2 || (HostCapability$2 = {}));
({ $: mojo.internal.Enum() });
var ClientCapabilities$2;
(function (ClientCapabilities) {
    ClientCapabilities[ClientCapabilities["MIN_VALUE"] = 0] = "MIN_VALUE";
    ClientCapabilities[ClientCapabilities["MAX_VALUE"] = 0] = "MAX_VALUE";
    ClientCapabilities[ClientCapabilities["kIgnoresTabDataFavicons"] = 0] = "kIgnoresTabDataFavicons";
})(ClientCapabilities$2 || (ClientCapabilities$2 = {}));
class PinCandidatesObserverPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.PinCandidatesObserver', scope);
    }
}
class PinCandidatesObserverRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(PinCandidatesObserverPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    onPinCandidatesChanged(candidates) {
        this.proxy.sendMessage(769624344, PinCandidatesObserver_OnPinCandidatesChanged_ParamsSpec.$, null, [
            candidates
        ], false);
    }
}
/**
 * An object which receives request messages for the PinCandidatesObserver
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class PinCandidatesObserverReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(PinCandidatesObserverRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(769624344, PinCandidatesObserver_OnPinCandidatesChanged_ParamsSpec.$, null, impl.onPinCandidatesChanged.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the PinCandidatesObserver
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class PinCandidatesObserverCallbackRouter {
    helper_internal_;
    $;
    router_;
    onPinCandidatesChanged;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(PinCandidatesObserverRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.onPinCandidatesChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(769624344, PinCandidatesObserver_OnPinCandidatesChanged_ParamsSpec.$, null, this.onPinCandidatesChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class ActorClientPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.ActorClient', scope);
    }
}
class ActorClientRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(ActorClientPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    requestToShowCredentialSelectionDialog(request) {
        return this.proxy.sendMessage(47334035, ActorClient_RequestToShowCredentialSelectionDialog_ParamsSpec.$, ActorClient_RequestToShowCredentialSelectionDialog_ResponseParamsSpec.$, [
            request
        ], false);
    }
    requestToShowAutofillSuggestionsDialog(request) {
        return this.proxy.sendMessage(567981627, ActorClient_RequestToShowAutofillSuggestionsDialog_ParamsSpec.$, ActorClient_RequestToShowAutofillSuggestionsDialog_ResponseParamsSpec.$, [
            request
        ], false);
    }
    requestToShowUserConfirmationDialog(request) {
        return this.proxy.sendMessage(2081780891, ActorClient_RequestToShowUserConfirmationDialog_ParamsSpec.$, ActorClient_RequestToShowUserConfirmationDialog_ResponseParamsSpec.$, [
            request
        ], false);
    }
    requestToConfirmNavigation(request) {
        return this.proxy.sendMessage(307549484, ActorClient_RequestToConfirmNavigation_ParamsSpec.$, ActorClient_RequestToConfirmNavigation_ResponseParamsSpec.$, [
            request
        ], false);
    }
    notifyActorTaskStateChanged(taskId, state) {
        this.proxy.sendMessage(1485633282, ActorClient_NotifyActorTaskStateChanged_ParamsSpec.$, null, [
            taskId,
            state
        ], false);
    }
    requestToShowGmailOtpOptInDialog(request) {
        return this.proxy.sendMessage(1125526604, ActorClient_RequestToShowGmailOtpOptInDialog_ParamsSpec.$, ActorClient_RequestToShowGmailOtpOptInDialog_ResponseParamsSpec.$, [
            request
        ], false);
    }
    requestToShowGmailOtpConfirmationDialog(request) {
        return this.proxy.sendMessage(1167269555, ActorClient_RequestToShowGmailOtpConfirmationDialog_ParamsSpec.$, ActorClient_RequestToShowGmailOtpConfirmationDialog_ResponseParamsSpec.$, [
            request
        ], false);
    }
}
/**
 * An object which receives request messages for the ActorClient
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class ActorClientReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(ActorClientRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(47334035, ActorClient_RequestToShowCredentialSelectionDialog_ParamsSpec.$, ActorClient_RequestToShowCredentialSelectionDialog_ResponseParamsSpec.$, impl.requestToShowCredentialSelectionDialog.bind(impl), false);
        this.helper_internal_.registerHandler(567981627, ActorClient_RequestToShowAutofillSuggestionsDialog_ParamsSpec.$, ActorClient_RequestToShowAutofillSuggestionsDialog_ResponseParamsSpec.$, impl.requestToShowAutofillSuggestionsDialog.bind(impl), false);
        this.helper_internal_.registerHandler(2081780891, ActorClient_RequestToShowUserConfirmationDialog_ParamsSpec.$, ActorClient_RequestToShowUserConfirmationDialog_ResponseParamsSpec.$, impl.requestToShowUserConfirmationDialog.bind(impl), false);
        this.helper_internal_.registerHandler(307549484, ActorClient_RequestToConfirmNavigation_ParamsSpec.$, ActorClient_RequestToConfirmNavigation_ResponseParamsSpec.$, impl.requestToConfirmNavigation.bind(impl), false);
        this.helper_internal_.registerHandler(1485633282, ActorClient_NotifyActorTaskStateChanged_ParamsSpec.$, null, impl.notifyActorTaskStateChanged.bind(impl), false);
        this.helper_internal_.registerHandler(1125526604, ActorClient_RequestToShowGmailOtpOptInDialog_ParamsSpec.$, ActorClient_RequestToShowGmailOtpOptInDialog_ResponseParamsSpec.$, impl.requestToShowGmailOtpOptInDialog.bind(impl), false);
        this.helper_internal_.registerHandler(1167269555, ActorClient_RequestToShowGmailOtpConfirmationDialog_ParamsSpec.$, ActorClient_RequestToShowGmailOtpConfirmationDialog_ResponseParamsSpec.$, impl.requestToShowGmailOtpConfirmationDialog.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the ActorClient
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class ActorClientCallbackRouter {
    helper_internal_;
    $;
    router_;
    requestToShowCredentialSelectionDialog;
    requestToShowAutofillSuggestionsDialog;
    requestToShowUserConfirmationDialog;
    requestToConfirmNavigation;
    notifyActorTaskStateChanged;
    requestToShowGmailOtpOptInDialog;
    requestToShowGmailOtpConfirmationDialog;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(ActorClientRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.requestToShowCredentialSelectionDialog =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(47334035, ActorClient_RequestToShowCredentialSelectionDialog_ParamsSpec.$, ActorClient_RequestToShowCredentialSelectionDialog_ResponseParamsSpec.$, this.requestToShowCredentialSelectionDialog.createReceiverHandler(true /* expectsResponse */), false);
        this.requestToShowAutofillSuggestionsDialog =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(567981627, ActorClient_RequestToShowAutofillSuggestionsDialog_ParamsSpec.$, ActorClient_RequestToShowAutofillSuggestionsDialog_ResponseParamsSpec.$, this.requestToShowAutofillSuggestionsDialog.createReceiverHandler(true /* expectsResponse */), false);
        this.requestToShowUserConfirmationDialog =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2081780891, ActorClient_RequestToShowUserConfirmationDialog_ParamsSpec.$, ActorClient_RequestToShowUserConfirmationDialog_ResponseParamsSpec.$, this.requestToShowUserConfirmationDialog.createReceiverHandler(true /* expectsResponse */), false);
        this.requestToConfirmNavigation =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(307549484, ActorClient_RequestToConfirmNavigation_ParamsSpec.$, ActorClient_RequestToConfirmNavigation_ResponseParamsSpec.$, this.requestToConfirmNavigation.createReceiverHandler(true /* expectsResponse */), false);
        this.notifyActorTaskStateChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1485633282, ActorClient_NotifyActorTaskStateChanged_ParamsSpec.$, null, this.notifyActorTaskStateChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.requestToShowGmailOtpOptInDialog =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1125526604, ActorClient_RequestToShowGmailOtpOptInDialog_ParamsSpec.$, ActorClient_RequestToShowGmailOtpOptInDialog_ResponseParamsSpec.$, this.requestToShowGmailOtpOptInDialog.createReceiverHandler(true /* expectsResponse */), false);
        this.requestToShowGmailOtpConfirmationDialog =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1167269555, ActorClient_RequestToShowGmailOtpConfirmationDialog_ParamsSpec.$, ActorClient_RequestToShowGmailOtpConfirmationDialog_ResponseParamsSpec.$, this.requestToShowGmailOtpConfirmationDialog.createReceiverHandler(true /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class ActorHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.ActorHandler', scope);
    }
}
class ActorHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(ActorHandlerPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    autofillSuggestionDialogOnFormPresented(taskId, params) {
        this.proxy.sendMessage(1299730127, ActorHandler_AutofillSuggestionDialogOnFormPresented_ParamsSpec.$, null, [
            taskId,
            params
        ], false);
    }
    autofillSuggestionDialogOnFormPreviewChanged(taskId, params) {
        this.proxy.sendMessage(1753488663, ActorHandler_AutofillSuggestionDialogOnFormPreviewChanged_ParamsSpec.$, null, [
            taskId,
            params
        ], false);
    }
    autofillSuggestionDialogOnFormConfirmed(taskId, params) {
        this.proxy.sendMessage(1833606823, ActorHandler_AutofillSuggestionDialogOnFormConfirmed_ParamsSpec.$, null, [
            taskId,
            params
        ], false);
    }
    getContextForActorFromTab(tabId, options) {
        return this.proxy.sendMessage(616236069, ActorHandler_GetContextForActorFromTab_ParamsSpec.$, ActorHandler_GetContextForActorFromTab_ResponseParamsSpec.$, [
            tabId,
            options
        ], false);
    }
    createTask(taskOptions) {
        return this.proxy.sendMessage(1533177486, ActorHandler_CreateTask_ParamsSpec.$, ActorHandler_CreateTask_ResponseParamsSpec.$, [
            taskOptions
        ], true);
    }
    performActions(actionsProto) {
        return this.proxy.sendMessage(841167280, ActorHandler_PerformActions_ParamsSpec.$, ActorHandler_PerformActions_ResponseParamsSpec.$, [
            actionsProto
        ], true);
    }
    cancelActions(taskId) {
        return this.proxy.sendMessage(1615776639, ActorHandler_CancelActions_ParamsSpec.$, ActorHandler_CancelActions_ResponseParamsSpec.$, [
            taskId
        ], false);
    }
    stopActorTask(taskId, stopReason) {
        this.proxy.sendMessage(1215177192, ActorHandler_StopActorTask_ParamsSpec.$, null, [
            taskId,
            stopReason
        ], false);
    }
    pauseActorTask(taskId, pauseReason, tabId) {
        this.proxy.sendMessage(1357475254, ActorHandler_PauseActorTask_ParamsSpec.$, null, [
            taskId,
            pauseReason,
            tabId
        ], false);
    }
    resumeActorTask(taskId, contextOptions) {
        return this.proxy.sendMessage(1593892497, ActorHandler_ResumeActorTask_ParamsSpec.$, ActorHandler_ResumeActorTask_ResponseParamsSpec.$, [
            taskId,
            contextOptions
        ], false);
    }
    interruptActorTask(taskId, interruptReason) {
        this.proxy.sendMessage(647802592, ActorHandler_InterruptActorTask_ParamsSpec.$, null, [
            taskId,
            interruptReason
        ], false);
    }
    uninterruptActorTask(taskId) {
        this.proxy.sendMessage(173919333, ActorHandler_UninterruptActorTask_ParamsSpec.$, null, [
            taskId
        ], false);
    }
    updateActorTaskStepProgress(taskId, stepProgress) {
        this.proxy.sendMessage(1595393041, ActorHandler_UpdateActorTaskStepProgress_ParamsSpec.$, null, [
            taskId,
            stepProgress
        ], false);
    }
    createActorTab(taskId, options) {
        return this.proxy.sendMessage(1165861457, ActorHandler_CreateActorTab_ParamsSpec.$, ActorHandler_CreateActorTab_ResponseParamsSpec.$, [
            taskId,
            options
        ], false);
    }
    logBeginAsyncEvent(eventAsyncId, taskId, event, details) {
        this.proxy.sendMessage(998752441, ActorHandler_LogBeginAsyncEvent_ParamsSpec.$, null, [
            eventAsyncId,
            taskId,
            event,
            details
        ], false);
    }
    logEndAsyncEvent(eventAsyncId, details) {
        this.proxy.sendMessage(403280313, ActorHandler_LogEndAsyncEvent_ParamsSpec.$, null, [
            eventAsyncId,
            details
        ], false);
    }
    logInstantEvent(taskId, event, details) {
        this.proxy.sendMessage(1336208741, ActorHandler_LogInstantEvent_ParamsSpec.$, null, [
            taskId,
            event,
            details
        ], false);
    }
    journalClear() {
        this.proxy.sendMessage(1118279899, ActorHandler_JournalClear_ParamsSpec.$, null, [], false);
    }
    journalSnapshot(clearJournal) {
        return this.proxy.sendMessage(454625554, ActorHandler_JournalSnapshot_ParamsSpec.$, ActorHandler_JournalSnapshot_ResponseParamsSpec.$, [
            clearJournal
        ], false);
    }
    journalStart(maxBytes, captureScreenshots) {
        this.proxy.sendMessage(1880738429, ActorHandler_JournalStart_ParamsSpec.$, null, [
            maxBytes,
            captureScreenshots
        ], false);
    }
    journalStop() {
        this.proxy.sendMessage(837128095, ActorHandler_JournalStop_ParamsSpec.$, null, [], false);
    }
    journalRecordFeedback(positive, reason) {
        this.proxy.sendMessage(1195285192, ActorHandler_JournalRecordFeedback_ParamsSpec.$, null, [
            positive,
            reason
        ], false);
    }
}
/**
 * An object which receives request messages for the ActorHandler
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class ActorHandlerReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(ActorHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(1299730127, ActorHandler_AutofillSuggestionDialogOnFormPresented_ParamsSpec.$, null, impl.autofillSuggestionDialogOnFormPresented.bind(impl), false);
        this.helper_internal_.registerHandler(1753488663, ActorHandler_AutofillSuggestionDialogOnFormPreviewChanged_ParamsSpec.$, null, impl.autofillSuggestionDialogOnFormPreviewChanged.bind(impl), false);
        this.helper_internal_.registerHandler(1833606823, ActorHandler_AutofillSuggestionDialogOnFormConfirmed_ParamsSpec.$, null, impl.autofillSuggestionDialogOnFormConfirmed.bind(impl), false);
        this.helper_internal_.registerHandler(616236069, ActorHandler_GetContextForActorFromTab_ParamsSpec.$, ActorHandler_GetContextForActorFromTab_ResponseParamsSpec.$, impl.getContextForActorFromTab.bind(impl), false);
        this.helper_internal_.registerHandler(1533177486, ActorHandler_CreateTask_ParamsSpec.$, ActorHandler_CreateTask_ResponseParamsSpec.$, impl.createTask.bind(impl), true);
        this.helper_internal_.registerHandler(841167280, ActorHandler_PerformActions_ParamsSpec.$, ActorHandler_PerformActions_ResponseParamsSpec.$, impl.performActions.bind(impl), true);
        this.helper_internal_.registerHandler(1615776639, ActorHandler_CancelActions_ParamsSpec.$, ActorHandler_CancelActions_ResponseParamsSpec.$, impl.cancelActions.bind(impl), false);
        this.helper_internal_.registerHandler(1215177192, ActorHandler_StopActorTask_ParamsSpec.$, null, impl.stopActorTask.bind(impl), false);
        this.helper_internal_.registerHandler(1357475254, ActorHandler_PauseActorTask_ParamsSpec.$, null, impl.pauseActorTask.bind(impl), false);
        this.helper_internal_.registerHandler(1593892497, ActorHandler_ResumeActorTask_ParamsSpec.$, ActorHandler_ResumeActorTask_ResponseParamsSpec.$, impl.resumeActorTask.bind(impl), false);
        this.helper_internal_.registerHandler(647802592, ActorHandler_InterruptActorTask_ParamsSpec.$, null, impl.interruptActorTask.bind(impl), false);
        this.helper_internal_.registerHandler(173919333, ActorHandler_UninterruptActorTask_ParamsSpec.$, null, impl.uninterruptActorTask.bind(impl), false);
        this.helper_internal_.registerHandler(1595393041, ActorHandler_UpdateActorTaskStepProgress_ParamsSpec.$, null, impl.updateActorTaskStepProgress.bind(impl), false);
        this.helper_internal_.registerHandler(1165861457, ActorHandler_CreateActorTab_ParamsSpec.$, ActorHandler_CreateActorTab_ResponseParamsSpec.$, impl.createActorTab.bind(impl), false);
        this.helper_internal_.registerHandler(998752441, ActorHandler_LogBeginAsyncEvent_ParamsSpec.$, null, impl.logBeginAsyncEvent.bind(impl), false);
        this.helper_internal_.registerHandler(403280313, ActorHandler_LogEndAsyncEvent_ParamsSpec.$, null, impl.logEndAsyncEvent.bind(impl), false);
        this.helper_internal_.registerHandler(1336208741, ActorHandler_LogInstantEvent_ParamsSpec.$, null, impl.logInstantEvent.bind(impl), false);
        this.helper_internal_.registerHandler(1118279899, ActorHandler_JournalClear_ParamsSpec.$, null, impl.journalClear.bind(impl), false);
        this.helper_internal_.registerHandler(454625554, ActorHandler_JournalSnapshot_ParamsSpec.$, ActorHandler_JournalSnapshot_ResponseParamsSpec.$, impl.journalSnapshot.bind(impl), false);
        this.helper_internal_.registerHandler(1880738429, ActorHandler_JournalStart_ParamsSpec.$, null, impl.journalStart.bind(impl), false);
        this.helper_internal_.registerHandler(837128095, ActorHandler_JournalStop_ParamsSpec.$, null, impl.journalStop.bind(impl), false);
        this.helper_internal_.registerHandler(1195285192, ActorHandler_JournalRecordFeedback_ParamsSpec.$, null, impl.journalRecordFeedback.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the ActorHandler
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class ActorHandlerCallbackRouter {
    helper_internal_;
    $;
    router_;
    autofillSuggestionDialogOnFormPresented;
    autofillSuggestionDialogOnFormPreviewChanged;
    autofillSuggestionDialogOnFormConfirmed;
    getContextForActorFromTab;
    createTask;
    performActions;
    cancelActions;
    stopActorTask;
    pauseActorTask;
    resumeActorTask;
    interruptActorTask;
    uninterruptActorTask;
    updateActorTaskStepProgress;
    createActorTab;
    logBeginAsyncEvent;
    logEndAsyncEvent;
    logInstantEvent;
    journalClear;
    journalSnapshot;
    journalStart;
    journalStop;
    journalRecordFeedback;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(ActorHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.autofillSuggestionDialogOnFormPresented =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1299730127, ActorHandler_AutofillSuggestionDialogOnFormPresented_ParamsSpec.$, null, this.autofillSuggestionDialogOnFormPresented.createReceiverHandler(false /* expectsResponse */), false);
        this.autofillSuggestionDialogOnFormPreviewChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1753488663, ActorHandler_AutofillSuggestionDialogOnFormPreviewChanged_ParamsSpec.$, null, this.autofillSuggestionDialogOnFormPreviewChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.autofillSuggestionDialogOnFormConfirmed =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1833606823, ActorHandler_AutofillSuggestionDialogOnFormConfirmed_ParamsSpec.$, null, this.autofillSuggestionDialogOnFormConfirmed.createReceiverHandler(false /* expectsResponse */), false);
        this.getContextForActorFromTab =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(616236069, ActorHandler_GetContextForActorFromTab_ParamsSpec.$, ActorHandler_GetContextForActorFromTab_ResponseParamsSpec.$, this.getContextForActorFromTab.createReceiverHandler(true /* expectsResponse */), false);
        this.createTask =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1533177486, ActorHandler_CreateTask_ParamsSpec.$, ActorHandler_CreateTask_ResponseParamsSpec.$, this.createTask.createReceiverHandler(true /* expectsResponse */), true);
        this.performActions =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(841167280, ActorHandler_PerformActions_ParamsSpec.$, ActorHandler_PerformActions_ResponseParamsSpec.$, this.performActions.createReceiverHandler(true /* expectsResponse */), true);
        this.cancelActions =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1615776639, ActorHandler_CancelActions_ParamsSpec.$, ActorHandler_CancelActions_ResponseParamsSpec.$, this.cancelActions.createReceiverHandler(true /* expectsResponse */), false);
        this.stopActorTask =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1215177192, ActorHandler_StopActorTask_ParamsSpec.$, null, this.stopActorTask.createReceiverHandler(false /* expectsResponse */), false);
        this.pauseActorTask =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1357475254, ActorHandler_PauseActorTask_ParamsSpec.$, null, this.pauseActorTask.createReceiverHandler(false /* expectsResponse */), false);
        this.resumeActorTask =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1593892497, ActorHandler_ResumeActorTask_ParamsSpec.$, ActorHandler_ResumeActorTask_ResponseParamsSpec.$, this.resumeActorTask.createReceiverHandler(true /* expectsResponse */), false);
        this.interruptActorTask =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(647802592, ActorHandler_InterruptActorTask_ParamsSpec.$, null, this.interruptActorTask.createReceiverHandler(false /* expectsResponse */), false);
        this.uninterruptActorTask =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(173919333, ActorHandler_UninterruptActorTask_ParamsSpec.$, null, this.uninterruptActorTask.createReceiverHandler(false /* expectsResponse */), false);
        this.updateActorTaskStepProgress =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1595393041, ActorHandler_UpdateActorTaskStepProgress_ParamsSpec.$, null, this.updateActorTaskStepProgress.createReceiverHandler(false /* expectsResponse */), false);
        this.createActorTab =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1165861457, ActorHandler_CreateActorTab_ParamsSpec.$, ActorHandler_CreateActorTab_ResponseParamsSpec.$, this.createActorTab.createReceiverHandler(true /* expectsResponse */), false);
        this.logBeginAsyncEvent =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(998752441, ActorHandler_LogBeginAsyncEvent_ParamsSpec.$, null, this.logBeginAsyncEvent.createReceiverHandler(false /* expectsResponse */), false);
        this.logEndAsyncEvent =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(403280313, ActorHandler_LogEndAsyncEvent_ParamsSpec.$, null, this.logEndAsyncEvent.createReceiverHandler(false /* expectsResponse */), false);
        this.logInstantEvent =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1336208741, ActorHandler_LogInstantEvent_ParamsSpec.$, null, this.logInstantEvent.createReceiverHandler(false /* expectsResponse */), false);
        this.journalClear =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1118279899, ActorHandler_JournalClear_ParamsSpec.$, null, this.journalClear.createReceiverHandler(false /* expectsResponse */), false);
        this.journalSnapshot =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(454625554, ActorHandler_JournalSnapshot_ParamsSpec.$, ActorHandler_JournalSnapshot_ResponseParamsSpec.$, this.journalSnapshot.createReceiverHandler(true /* expectsResponse */), false);
        this.journalStart =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1880738429, ActorHandler_JournalStart_ParamsSpec.$, null, this.journalStart.createReceiverHandler(false /* expectsResponse */), false);
        this.journalStop =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(837128095, ActorHandler_JournalStop_ParamsSpec.$, null, this.journalStop.createReceiverHandler(false /* expectsResponse */), false);
        this.journalRecordFeedback =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1195285192, ActorHandler_JournalRecordFeedback_ParamsSpec.$, null, this.journalRecordFeedback.createReceiverHandler(false /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class AnnotationHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.AnnotationHandler', scope);
    }
}
class AnnotationHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(AnnotationHandlerPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    scrollTo(params) {
        return this.proxy.sendMessage(533259651, AnnotationHandler_ScrollTo_ParamsSpec.$, AnnotationHandler_ScrollTo_ResponseParamsSpec.$, [
            params
        ], false);
    }
    dropScrollToHighlight() {
        this.proxy.sendMessage(1065489070, AnnotationHandler_DropScrollToHighlight_ParamsSpec.$, null, [], false);
    }
}
/**
 * An object which receives request messages for the AnnotationHandler
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class AnnotationHandlerReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(AnnotationHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(533259651, AnnotationHandler_ScrollTo_ParamsSpec.$, AnnotationHandler_ScrollTo_ResponseParamsSpec.$, impl.scrollTo.bind(impl), false);
        this.helper_internal_.registerHandler(1065489070, AnnotationHandler_DropScrollToHighlight_ParamsSpec.$, null, impl.dropScrollToHighlight.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the AnnotationHandler
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class AnnotationHandlerCallbackRouter {
    helper_internal_;
    $;
    router_;
    scrollTo;
    dropScrollToHighlight;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(AnnotationHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.scrollTo =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(533259651, AnnotationHandler_ScrollTo_ParamsSpec.$, AnnotationHandler_ScrollTo_ResponseParamsSpec.$, this.scrollTo.createReceiverHandler(true /* expectsResponse */), false);
        this.dropScrollToHighlight =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1065489070, AnnotationHandler_DropScrollToHighlight_ParamsSpec.$, null, this.dropScrollToHighlight.createReceiverHandler(false /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class SkillsHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.SkillsHandler', scope);
    }
}
class SkillsHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(SkillsHandlerPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    createSkill(request) {
        return this.proxy.sendMessage(702314565, SkillsHandler_CreateSkill_ParamsSpec.$, SkillsHandler_CreateSkill_ResponseParamsSpec.$, [
            request
        ], false);
    }
    updateSkill(request) {
        return this.proxy.sendMessage(2035779668, SkillsHandler_UpdateSkill_ParamsSpec.$, SkillsHandler_UpdateSkill_ResponseParamsSpec.$, [
            request
        ], false);
    }
    showManageSkillsUi() {
        this.proxy.sendMessage(1279882594, SkillsHandler_ShowManageSkillsUi_ParamsSpec.$, null, [], false);
    }
    showBrowseSkillsUi() {
        this.proxy.sendMessage(818320024, SkillsHandler_ShowBrowseSkillsUi_ParamsSpec.$, null, [], false);
    }
    getSkill(id) {
        return this.proxy.sendMessage(979244194, SkillsHandler_GetSkill_ParamsSpec.$, SkillsHandler_GetSkill_ResponseParamsSpec.$, [
            id
        ], false);
    }
    recordSkillsWebClientEvent(event) {
        this.proxy.sendMessage(44233761, SkillsHandler_RecordSkillsWebClientEvent_ParamsSpec.$, null, [
            event
        ], false);
    }
}
/**
 * An object which receives request messages for the SkillsHandler
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class SkillsHandlerReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(SkillsHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(702314565, SkillsHandler_CreateSkill_ParamsSpec.$, SkillsHandler_CreateSkill_ResponseParamsSpec.$, impl.createSkill.bind(impl), false);
        this.helper_internal_.registerHandler(2035779668, SkillsHandler_UpdateSkill_ParamsSpec.$, SkillsHandler_UpdateSkill_ResponseParamsSpec.$, impl.updateSkill.bind(impl), false);
        this.helper_internal_.registerHandler(1279882594, SkillsHandler_ShowManageSkillsUi_ParamsSpec.$, null, impl.showManageSkillsUi.bind(impl), false);
        this.helper_internal_.registerHandler(818320024, SkillsHandler_ShowBrowseSkillsUi_ParamsSpec.$, null, impl.showBrowseSkillsUi.bind(impl), false);
        this.helper_internal_.registerHandler(979244194, SkillsHandler_GetSkill_ParamsSpec.$, SkillsHandler_GetSkill_ResponseParamsSpec.$, impl.getSkill.bind(impl), false);
        this.helper_internal_.registerHandler(44233761, SkillsHandler_RecordSkillsWebClientEvent_ParamsSpec.$, null, impl.recordSkillsWebClientEvent.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the SkillsHandler
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class SkillsHandlerCallbackRouter {
    helper_internal_;
    $;
    router_;
    createSkill;
    updateSkill;
    showManageSkillsUi;
    showBrowseSkillsUi;
    getSkill;
    recordSkillsWebClientEvent;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(SkillsHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.createSkill =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(702314565, SkillsHandler_CreateSkill_ParamsSpec.$, SkillsHandler_CreateSkill_ResponseParamsSpec.$, this.createSkill.createReceiverHandler(true /* expectsResponse */), false);
        this.updateSkill =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2035779668, SkillsHandler_UpdateSkill_ParamsSpec.$, SkillsHandler_UpdateSkill_ResponseParamsSpec.$, this.updateSkill.createReceiverHandler(true /* expectsResponse */), false);
        this.showManageSkillsUi =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1279882594, SkillsHandler_ShowManageSkillsUi_ParamsSpec.$, null, this.showManageSkillsUi.createReceiverHandler(false /* expectsResponse */), false);
        this.showBrowseSkillsUi =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(818320024, SkillsHandler_ShowBrowseSkillsUi_ParamsSpec.$, null, this.showBrowseSkillsUi.createReceiverHandler(false /* expectsResponse */), false);
        this.getSkill =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(979244194, SkillsHandler_GetSkill_ParamsSpec.$, SkillsHandler_GetSkill_ResponseParamsSpec.$, this.getSkill.createReceiverHandler(true /* expectsResponse */), false);
        this.recordSkillsWebClientEvent =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(44233761, SkillsHandler_RecordSkillsWebClientEvent_ParamsSpec.$, null, this.recordSkillsWebClientEvent.createReceiverHandler(false /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class SkillsClientPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.SkillsClient', scope);
    }
}
class SkillsClientRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(SkillsClientPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    notifySkillPreviewsChanged(skillPreviews) {
        this.proxy.sendMessage(2089726342, SkillsClient_NotifySkillPreviewsChanged_ParamsSpec.$, null, [
            skillPreviews
        ], false);
    }
    notifyContextualSkillPreviewsChanged(skillPreviews) {
        this.proxy.sendMessage(223680432, SkillsClient_NotifyContextualSkillPreviewsChanged_ParamsSpec.$, null, [
            skillPreviews
        ], false);
    }
    notifySkillPreviewChanged(skillPreview) {
        this.proxy.sendMessage(1558584944, SkillsClient_NotifySkillPreviewChanged_ParamsSpec.$, null, [
            skillPreview
        ], false);
    }
    notifySkillDeleted(skillId) {
        this.proxy.sendMessage(1547004519, SkillsClient_NotifySkillDeleted_ParamsSpec.$, null, [
            skillId
        ], false);
    }
    notifySkillsEnabledChanged(enabled) {
        this.proxy.sendMessage(372628726, SkillsClient_NotifySkillsEnabledChanged_ParamsSpec.$, null, [
            enabled
        ], false);
    }
}
/**
 * An object which receives request messages for the SkillsClient
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class SkillsClientReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(SkillsClientRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(2089726342, SkillsClient_NotifySkillPreviewsChanged_ParamsSpec.$, null, impl.notifySkillPreviewsChanged.bind(impl), false);
        this.helper_internal_.registerHandler(223680432, SkillsClient_NotifyContextualSkillPreviewsChanged_ParamsSpec.$, null, impl.notifyContextualSkillPreviewsChanged.bind(impl), false);
        this.helper_internal_.registerHandler(1558584944, SkillsClient_NotifySkillPreviewChanged_ParamsSpec.$, null, impl.notifySkillPreviewChanged.bind(impl), false);
        this.helper_internal_.registerHandler(1547004519, SkillsClient_NotifySkillDeleted_ParamsSpec.$, null, impl.notifySkillDeleted.bind(impl), false);
        this.helper_internal_.registerHandler(372628726, SkillsClient_NotifySkillsEnabledChanged_ParamsSpec.$, null, impl.notifySkillsEnabledChanged.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the SkillsClient
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class SkillsClientCallbackRouter {
    helper_internal_;
    $;
    router_;
    notifySkillPreviewsChanged;
    notifyContextualSkillPreviewsChanged;
    notifySkillPreviewChanged;
    notifySkillDeleted;
    notifySkillsEnabledChanged;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(SkillsClientRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.notifySkillPreviewsChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2089726342, SkillsClient_NotifySkillPreviewsChanged_ParamsSpec.$, null, this.notifySkillPreviewsChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyContextualSkillPreviewsChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(223680432, SkillsClient_NotifyContextualSkillPreviewsChanged_ParamsSpec.$, null, this.notifyContextualSkillPreviewsChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifySkillPreviewChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1558584944, SkillsClient_NotifySkillPreviewChanged_ParamsSpec.$, null, this.notifySkillPreviewChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifySkillDeleted =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1547004519, SkillsClient_NotifySkillDeleted_ParamsSpec.$, null, this.notifySkillDeleted.createReceiverHandler(false /* expectsResponse */), false);
        this.notifySkillsEnabledChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(372628726, SkillsClient_NotifySkillsEnabledChanged_ParamsSpec.$, null, this.notifySkillsEnabledChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class WebClientHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.WebClientHandler', scope);
    }
}
class WebClientHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(WebClientHandlerPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    reportApiRequestCount(requestTypeId, event) {
        this.proxy.sendMessage(325050836, WebClientHandler_ReportApiRequestCount_ParamsSpec.$, null, [
            requestTypeId,
            event
        ], false);
    }
    reportApiRequestLatency(requestType, latency) {
        this.proxy.sendMessage(1142669665, WebClientHandler_ReportApiRequestLatency_ParamsSpec.$, null, [
            requestType,
            latency
        ], false);
    }
    recordSparseValue(name, value) {
        this.proxy.sendMessage(1302555104, WebClientHandler_RecordSparseValue_ParamsSpec.$, null, [
            name,
            value
        ], false);
    }
    webClientCreated(webClient) {
        return this.proxy.sendMessage(960163197, WebClientHandler_WebClientCreated_ParamsSpec.$, WebClientHandler_WebClientCreated_ResponseParamsSpec.$, [
            webClient
        ], false);
    }
    webClientInitialized() {
        this.proxy.sendMessage(1787925370, WebClientHandler_WebClientInitialized_ParamsSpec.$, null, [], false);
    }
    webClientInitializeFailed() {
        this.proxy.sendMessage(560721472, WebClientHandler_WebClientInitializeFailed_ParamsSpec.$, null, [], false);
    }
    createActorHandler(receiver, client) {
        this.proxy.sendMessage(829908158, WebClientHandler_CreateActorHandler_ParamsSpec.$, null, [
            receiver,
            client
        ], false);
    }
    createExperimentalTriggeringClient(client) {
        this.proxy.sendMessage(220544101, WebClientHandler_CreateExperimentalTriggeringClient_ParamsSpec.$, null, [
            client
        ], false);
    }
    createAnnotationHandler(receiver) {
        this.proxy.sendMessage(971268420, WebClientHandler_CreateAnnotationHandler_ParamsSpec.$, null, [
            receiver
        ], false);
    }
    createSkillsHandler(receiver, client) {
        this.proxy.sendMessage(747328774, WebClientHandler_CreateSkillsHandler_ParamsSpec.$, null, [
            receiver,
            client
        ], false);
    }
    createZeroStateSuggestionsHandler(receiver) {
        this.proxy.sendMessage(1404627528, WebClientHandler_CreateZeroStateSuggestionsHandler_ParamsSpec.$, null, [
            receiver
        ], false);
    }
    createAiOverlayTools(receiver) {
        this.proxy.sendMessage(1079365381, WebClientHandler_CreateAiOverlayTools_ParamsSpec.$, null, [
            receiver
        ], false);
    }
    createTab(url, createOptions) {
        return this.proxy.sendMessage(112121078, WebClientHandler_CreateTab_ParamsSpec.$, WebClientHandler_CreateTab_ResponseParamsSpec.$, [
            url,
            createOptions
        ], false);
    }
    activateTabWithUrl(exactUrl, options) {
        return this.proxy.sendMessage(1067468350, WebClientHandler_ActivateTabWithUrl_ParamsSpec.$, WebClientHandler_ActivateTabWithUrl_ResponseParamsSpec.$, [
            exactUrl,
            options
        ], false);
    }
    openLinkInPopup(url, popupWidth, popupHeight) {
        this.proxy.sendMessage(643033935, WebClientHandler_OpenLinkInPopup_ParamsSpec.$, null, [
            url,
            popupWidth,
            popupHeight
        ], false);
    }
    openGlicSettingsPage(options) {
        this.proxy.sendMessage(1750399938, WebClientHandler_OpenGlicSettingsPage_ParamsSpec.$, null, [
            options
        ], false);
    }
    openPasswordManagerSettingsPage() {
        this.proxy.sendMessage(1676992361, WebClientHandler_OpenPasswordManagerSettingsPage_ParamsSpec.$, null, [], false);
    }
    openContactInfoSettingsPage() {
        this.proxy.sendMessage(1318700046, WebClientHandler_OpenContactInfoSettingsPage_ParamsSpec.$, null, [], false);
    }
    enableDragResize(enabled) {
        this.proxy.sendMessage(1818498076, WebClientHandler_EnableDragResize_ParamsSpec.$, null, [
            enabled
        ], false);
    }
    closePanel() {
        this.proxy.sendMessage(1149647711, WebClientHandler_ClosePanel_ParamsSpec.$, null, [], false);
    }
    closePanelAndShutdown() {
        this.proxy.sendMessage(791889119, WebClientHandler_ClosePanelAndShutdown_ParamsSpec.$, null, [], false);
    }
    attachPanel() {
        this.proxy.sendMessage(312413449, WebClientHandler_AttachPanel_ParamsSpec.$, null, [], false);
    }
    detachPanel() {
        this.proxy.sendMessage(1069921036, WebClientHandler_DetachPanel_ParamsSpec.$, null, [], false);
    }
    onModeChange(newMode) {
        this.proxy.sendMessage(1898715240, WebClientHandler_OnModeChange_ParamsSpec.$, null, [
            newMode
        ], false);
    }
    onMicrophoneStatusChange(status) {
        this.proxy.sendMessage(2073688921, WebClientHandler_OnMicrophoneStatusChange_ParamsSpec.$, null, [
            status
        ], false);
    }
    showProfilePicker() {
        this.proxy.sendMessage(950077268, WebClientHandler_ShowProfilePicker_ParamsSpec.$, null, [], false);
    }
    getModelQualityClientId() {
        return this.proxy.sendMessage(1208572382, WebClientHandler_GetModelQualityClientId_ParamsSpec.$, WebClientHandler_GetModelQualityClientId_ResponseParamsSpec.$, [], false);
    }
    getContextFromFocusedTab(options) {
        return this.proxy.sendMessage(915453055, WebClientHandler_GetContextFromFocusedTab_ParamsSpec.$, WebClientHandler_GetContextFromFocusedTab_ResponseParamsSpec.$, [
            options
        ], false);
    }
    getContextFromTab(tabId, options) {
        return this.proxy.sendMessage(2116856695, WebClientHandler_GetContextFromTab_ParamsSpec.$, WebClientHandler_GetContextFromTab_ResponseParamsSpec.$, [
            tabId,
            options
        ], false);
    }
    getImageBytesFromTab(tabId, documentId, domNodeId) {
        return this.proxy.sendMessage(1946376714, WebClientHandler_GetImageBytesFromTab_ParamsSpec.$, WebClientHandler_GetImageBytesFromTab_ResponseParamsSpec.$, [
            tabId,
            documentId,
            domNodeId
        ], false);
    }
    setMaximumNumberOfPinnedTabs(requestedMax) {
        return this.proxy.sendMessage(1931689889, WebClientHandler_SetMaximumNumberOfPinnedTabs_ParamsSpec.$, WebClientHandler_SetMaximumNumberOfPinnedTabs_ResponseParamsSpec.$, [
            requestedMax
        ], false);
    }
    pinTabs(tabIds, options) {
        return this.proxy.sendMessage(1382323391, WebClientHandler_PinTabs_ParamsSpec.$, WebClientHandler_PinTabs_ResponseParamsSpec.$, [
            tabIds,
            options
        ], false);
    }
    unpinTabs(tabIds, options) {
        return this.proxy.sendMessage(509499548, WebClientHandler_UnpinTabs_ParamsSpec.$, WebClientHandler_UnpinTabs_ResponseParamsSpec.$, [
            tabIds,
            options
        ], false);
    }
    unpinAllTabs(options) {
        this.proxy.sendMessage(535420529, WebClientHandler_UnpinAllTabs_ParamsSpec.$, null, [
            options
        ], false);
    }
    subscribeToPinCandidates(options, observer) {
        this.proxy.sendMessage(1280690525, WebClientHandler_SubscribeToPinCandidates_ParamsSpec.$, null, [
            options,
            observer
        ], false);
    }
    openPinnedTabPicker(options) {
        return this.proxy.sendMessage(923504180, WebClientHandler_OpenPinnedTabPicker_ParamsSpec.$, WebClientHandler_OpenPinnedTabPicker_ResponseParamsSpec.$, [
            options
        ], false);
    }
    activateTab(taskId) {
        this.proxy.sendMessage(358841852, WebClientHandler_ActivateTab_ParamsSpec.$, null, [
            taskId
        ], false);
    }
    resizeWidget(size, duration) {
        return this.proxy.sendMessage(1158979943, WebClientHandler_ResizeWidget_ParamsSpec.$, WebClientHandler_ResizeWidget_ResponseParamsSpec.$, [
            size,
            duration
        ], false);
    }
    captureRegion(observer, params) {
        this.proxy.sendMessage(298967405, WebClientHandler_CaptureRegion_ParamsSpec.$, null, [
            observer,
            params
        ], false);
    }
    deleteCapturedRegion(tabId, id) {
        this.proxy.sendMessage(1287710749, WebClientHandler_DeleteCapturedRegion_ParamsSpec.$, null, [
            tabId,
            id
        ], false);
    }
    setAudioDucking(enable) {
        return this.proxy.sendMessage(471855005, WebClientHandler_SetAudioDucking_ParamsSpec.$, WebClientHandler_SetAudioDucking_ResponseParamsSpec.$, [
            enable
        ], false);
    }
    setMinimumPanelSize(size) {
        this.proxy.sendMessage(1970773327, WebClientHandler_SetMinimumPanelSize_ParamsSpec.$, null, [
            size
        ], false);
    }
    setMicrophonePermissionState(enabled) {
        return this.proxy.sendMessage(716124888, WebClientHandler_SetMicrophonePermissionState_ParamsSpec.$, WebClientHandler_SetMicrophonePermissionState_ResponseParamsSpec.$, [
            enabled
        ], false);
    }
    setLocationPermissionState(enabled) {
        return this.proxy.sendMessage(1241469372, WebClientHandler_SetLocationPermissionState_ParamsSpec.$, WebClientHandler_SetLocationPermissionState_ResponseParamsSpec.$, [
            enabled
        ], false);
    }
    setTabContextPermissionState(enabled) {
        return this.proxy.sendMessage(288757505, WebClientHandler_SetTabContextPermissionState_ParamsSpec.$, WebClientHandler_SetTabContextPermissionState_ResponseParamsSpec.$, [
            enabled
        ], false);
    }
    setClosedCaptioningSetting(enabled) {
        return this.proxy.sendMessage(1479802155, WebClientHandler_SetClosedCaptioningSetting_ParamsSpec.$, WebClientHandler_SetClosedCaptioningSetting_ResponseParamsSpec.$, [
            enabled
        ], false);
    }
    setActuationOnWebSetting(enabled) {
        return this.proxy.sendMessage(856753641, WebClientHandler_SetActuationOnWebSetting_ParamsSpec.$, WebClientHandler_SetActuationOnWebSetting_ResponseParamsSpec.$, [
            enabled
        ], false);
    }
    shouldAllowMediaPermissionRequest() {
        return this.proxy.sendMessage(1279887017, WebClientHandler_ShouldAllowMediaPermissionRequest_ParamsSpec.$, WebClientHandler_ShouldAllowMediaPermissionRequest_ResponseParamsSpec.$, [], false);
    }
    shouldAllowGeolocationPermissionRequest() {
        return this.proxy.sendMessage(1147203689, WebClientHandler_ShouldAllowGeolocationPermissionRequest_ParamsSpec.$, WebClientHandler_ShouldAllowGeolocationPermissionRequest_ResponseParamsSpec.$, [], false);
    }
    setContextAccessIndicator(enabled) {
        this.proxy.sendMessage(738470115, WebClientHandler_SetContextAccessIndicator_ParamsSpec.$, null, [
            enabled
        ], false);
    }
    getUserProfileInfo() {
        return this.proxy.sendMessage(544112319, WebClientHandler_GetUserProfileInfo_ParamsSpec.$, WebClientHandler_GetUserProfileInfo_ResponseParamsSpec.$, [], false);
    }
    syncCookies() {
        return this.proxy.sendMessage(1782862117, WebClientHandler_SyncCookies_ParamsSpec.$, WebClientHandler_SyncCookies_ResponseParamsSpec.$, [], false);
    }
    clientErrorDialogStateChanged(shownDialogType) {
        this.proxy.sendMessage(1548550890, WebClientHandler_ClientErrorDialogStateChanged_ParamsSpec.$, null, [
            shownDialogType
        ], false);
    }
    reportClientTransientError(statusCode) {
        this.proxy.sendMessage(738743364, WebClientHandler_ReportClientTransientError_ParamsSpec.$, null, [
            statusCode
        ], false);
    }
    processCounterAbuseVerdict(tabId, verdict) {
        this.proxy.sendMessage(1380826635, WebClientHandler_ProcessCounterAbuseVerdict_ParamsSpec.$, null, [
            tabId,
            verdict
        ], false);
    }
    onOptinImpression() {
        this.proxy.sendMessage(2096922165, WebClientHandler_OnOptinImpression_ParamsSpec.$, null, [], false);
    }
    onUserInputSubmitted(mode, promptType) {
        this.proxy.sendMessage(434261936, WebClientHandler_OnUserInputSubmitted_ParamsSpec.$, null, [
            mode,
            promptType
        ], false);
    }
    onContextUploadStarted() {
        this.proxy.sendMessage(84722430, WebClientHandler_OnContextUploadStarted_ParamsSpec.$, null, [], false);
    }
    onContextUploadCompleted() {
        this.proxy.sendMessage(192951905, WebClientHandler_OnContextUploadCompleted_ParamsSpec.$, null, [], false);
    }
    onReaction(reactionType) {
        this.proxy.sendMessage(1956981756, WebClientHandler_OnReaction_ParamsSpec.$, null, [
            reactionType
        ], false);
    }
    onResponseStarted() {
        this.proxy.sendMessage(1113569315, WebClientHandler_OnResponseStarted_ParamsSpec.$, null, [], false);
    }
    onResponseStopped(details) {
        this.proxy.sendMessage(2056237766, WebClientHandler_OnResponseStopped_ParamsSpec.$, null, [
            details
        ], false);
    }
    onSessionTerminated() {
        this.proxy.sendMessage(1395838110, WebClientHandler_OnSessionTerminated_ParamsSpec.$, null, [], false);
    }
    onTurnCompleted(model, duration) {
        this.proxy.sendMessage(1100736000, WebClientHandler_OnTurnCompleted_ParamsSpec.$, null, [
            model,
            duration
        ], false);
    }
    onResponseRated(positive) {
        this.proxy.sendMessage(176640111, WebClientHandler_OnResponseRated_ParamsSpec.$, null, [
            positive
        ], false);
    }
    onClosedCaptionsShown() {
        this.proxy.sendMessage(1288638793, WebClientHandler_OnClosedCaptionsShown_ParamsSpec.$, null, [], false);
    }
    onActionSubmitted(isRetry) {
        this.proxy.sendMessage(2090467146, WebClientHandler_OnActionSubmitted_ParamsSpec.$, null, [
            isRetry
        ], false);
    }
    setSyntheticExperimentState(trialName, groupName) {
        this.proxy.sendMessage(2036645928, WebClientHandler_SetSyntheticExperimentState_ParamsSpec.$, null, [
            trialName,
            groupName
        ], false);
    }
    openOsPermissionSettingsMenu(type) {
        this.proxy.sendMessage(368000756, WebClientHandler_OpenOsPermissionSettingsMenu_ParamsSpec.$, null, [
            type
        ], false);
    }
    getOsMicrophonePermissionStatus() {
        return this.proxy.sendMessage(186978966, WebClientHandler_GetOsMicrophonePermissionStatus_ParamsSpec.$, WebClientHandler_GetOsMicrophonePermissionStatus_ResponseParamsSpec.$, [], false);
    }
    getZeroStateSuggestionsForFocusedTab(isFirstRun) {
        return this.proxy.sendMessage(343048523, WebClientHandler_GetZeroStateSuggestionsForFocusedTab_ParamsSpec.$, WebClientHandler_GetZeroStateSuggestionsForFocusedTab_ResponseParamsSpec.$, [
            isFirstRun
        ], false);
    }
    maybeRefreshUserStatus() {
        this.proxy.sendMessage(465826492, WebClientHandler_MaybeRefreshUserStatus_ParamsSpec.$, null, [], false);
    }
    isDebuggerAttached() {
        return this.proxy.sendMessage(1947620394, WebClientHandler_IsDebuggerAttached_ParamsSpec.$, WebClientHandler_IsDebuggerAttached_ResponseParamsSpec.$, [], false);
    }
    subscribeToPageMetadata(tabId, names) {
        return this.proxy.sendMessage(1820111387, WebClientHandler_SubscribeToPageMetadata_ParamsSpec.$, WebClientHandler_SubscribeToPageMetadata_ResponseParamsSpec.$, [
            tabId,
            names
        ], false);
    }
    switchConversation(info) {
        return this.proxy.sendMessage(1406230838, WebClientHandler_SwitchConversation_ParamsSpec.$, WebClientHandler_SwitchConversation_ResponseParamsSpec.$, [
            info
        ], false);
    }
    registerConversation(info) {
        return this.proxy.sendMessage(742588378, WebClientHandler_RegisterConversation_ParamsSpec.$, WebClientHandler_RegisterConversation_ResponseParamsSpec.$, [
            info
        ], false);
    }
    setOnboardingCompleted() {
        this.proxy.sendMessage(1826063668, WebClientHandler_SetOnboardingCompleted_ParamsSpec.$, null, [], false);
    }
    subscribeToTabData(tabId, receiver) {
        this.proxy.sendMessage(7527316, WebClientHandler_SubscribeToTabData_ParamsSpec.$, null, [
            tabId,
            receiver
        ], false);
    }
    subscribeToTabFavicon(tabId, receiver) {
        this.proxy.sendMessage(39549950, WebClientHandler_SubscribeToTabFavicon_ParamsSpec.$, null, [
            tabId,
            receiver
        ], false);
    }
    createGeminiEnterpriseHandler(receiver) {
        this.proxy.sendMessage(1303827316, WebClientHandler_CreateGeminiEnterpriseHandler_ParamsSpec.$, null, [
            receiver
        ], false);
    }
}
/**
 * An object which receives request messages for the WebClientHandler
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class WebClientHandlerReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(WebClientHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(325050836, WebClientHandler_ReportApiRequestCount_ParamsSpec.$, null, impl.reportApiRequestCount.bind(impl), false);
        this.helper_internal_.registerHandler(1142669665, WebClientHandler_ReportApiRequestLatency_ParamsSpec.$, null, impl.reportApiRequestLatency.bind(impl), false);
        this.helper_internal_.registerHandler(1302555104, WebClientHandler_RecordSparseValue_ParamsSpec.$, null, impl.recordSparseValue.bind(impl), false);
        this.helper_internal_.registerHandler(960163197, WebClientHandler_WebClientCreated_ParamsSpec.$, WebClientHandler_WebClientCreated_ResponseParamsSpec.$, impl.webClientCreated.bind(impl), false);
        this.helper_internal_.registerHandler(1787925370, WebClientHandler_WebClientInitialized_ParamsSpec.$, null, impl.webClientInitialized.bind(impl), false);
        this.helper_internal_.registerHandler(560721472, WebClientHandler_WebClientInitializeFailed_ParamsSpec.$, null, impl.webClientInitializeFailed.bind(impl), false);
        this.helper_internal_.registerHandler(829908158, WebClientHandler_CreateActorHandler_ParamsSpec.$, null, impl.createActorHandler.bind(impl), false);
        this.helper_internal_.registerHandler(220544101, WebClientHandler_CreateExperimentalTriggeringClient_ParamsSpec.$, null, impl.createExperimentalTriggeringClient.bind(impl), false);
        this.helper_internal_.registerHandler(971268420, WebClientHandler_CreateAnnotationHandler_ParamsSpec.$, null, impl.createAnnotationHandler.bind(impl), false);
        this.helper_internal_.registerHandler(747328774, WebClientHandler_CreateSkillsHandler_ParamsSpec.$, null, impl.createSkillsHandler.bind(impl), false);
        this.helper_internal_.registerHandler(1404627528, WebClientHandler_CreateZeroStateSuggestionsHandler_ParamsSpec.$, null, impl.createZeroStateSuggestionsHandler.bind(impl), false);
        this.helper_internal_.registerHandler(1079365381, WebClientHandler_CreateAiOverlayTools_ParamsSpec.$, null, impl.createAiOverlayTools.bind(impl), false);
        this.helper_internal_.registerHandler(112121078, WebClientHandler_CreateTab_ParamsSpec.$, WebClientHandler_CreateTab_ResponseParamsSpec.$, impl.createTab.bind(impl), false);
        this.helper_internal_.registerHandler(1067468350, WebClientHandler_ActivateTabWithUrl_ParamsSpec.$, WebClientHandler_ActivateTabWithUrl_ResponseParamsSpec.$, impl.activateTabWithUrl.bind(impl), false);
        this.helper_internal_.registerHandler(643033935, WebClientHandler_OpenLinkInPopup_ParamsSpec.$, null, impl.openLinkInPopup.bind(impl), false);
        this.helper_internal_.registerHandler(1750399938, WebClientHandler_OpenGlicSettingsPage_ParamsSpec.$, null, impl.openGlicSettingsPage.bind(impl), false);
        this.helper_internal_.registerHandler(1676992361, WebClientHandler_OpenPasswordManagerSettingsPage_ParamsSpec.$, null, impl.openPasswordManagerSettingsPage.bind(impl), false);
        this.helper_internal_.registerHandler(1318700046, WebClientHandler_OpenContactInfoSettingsPage_ParamsSpec.$, null, impl.openContactInfoSettingsPage.bind(impl), false);
        this.helper_internal_.registerHandler(1818498076, WebClientHandler_EnableDragResize_ParamsSpec.$, null, impl.enableDragResize.bind(impl), false);
        this.helper_internal_.registerHandler(1149647711, WebClientHandler_ClosePanel_ParamsSpec.$, null, impl.closePanel.bind(impl), false);
        this.helper_internal_.registerHandler(791889119, WebClientHandler_ClosePanelAndShutdown_ParamsSpec.$, null, impl.closePanelAndShutdown.bind(impl), false);
        this.helper_internal_.registerHandler(312413449, WebClientHandler_AttachPanel_ParamsSpec.$, null, impl.attachPanel.bind(impl), false);
        this.helper_internal_.registerHandler(1069921036, WebClientHandler_DetachPanel_ParamsSpec.$, null, impl.detachPanel.bind(impl), false);
        this.helper_internal_.registerHandler(1898715240, WebClientHandler_OnModeChange_ParamsSpec.$, null, impl.onModeChange.bind(impl), false);
        this.helper_internal_.registerHandler(2073688921, WebClientHandler_OnMicrophoneStatusChange_ParamsSpec.$, null, impl.onMicrophoneStatusChange.bind(impl), false);
        this.helper_internal_.registerHandler(950077268, WebClientHandler_ShowProfilePicker_ParamsSpec.$, null, impl.showProfilePicker.bind(impl), false);
        this.helper_internal_.registerHandler(1208572382, WebClientHandler_GetModelQualityClientId_ParamsSpec.$, WebClientHandler_GetModelQualityClientId_ResponseParamsSpec.$, impl.getModelQualityClientId.bind(impl), false);
        this.helper_internal_.registerHandler(915453055, WebClientHandler_GetContextFromFocusedTab_ParamsSpec.$, WebClientHandler_GetContextFromFocusedTab_ResponseParamsSpec.$, impl.getContextFromFocusedTab.bind(impl), false);
        this.helper_internal_.registerHandler(2116856695, WebClientHandler_GetContextFromTab_ParamsSpec.$, WebClientHandler_GetContextFromTab_ResponseParamsSpec.$, impl.getContextFromTab.bind(impl), false);
        this.helper_internal_.registerHandler(1946376714, WebClientHandler_GetImageBytesFromTab_ParamsSpec.$, WebClientHandler_GetImageBytesFromTab_ResponseParamsSpec.$, impl.getImageBytesFromTab.bind(impl), false);
        this.helper_internal_.registerHandler(1931689889, WebClientHandler_SetMaximumNumberOfPinnedTabs_ParamsSpec.$, WebClientHandler_SetMaximumNumberOfPinnedTabs_ResponseParamsSpec.$, impl.setMaximumNumberOfPinnedTabs.bind(impl), false);
        this.helper_internal_.registerHandler(1382323391, WebClientHandler_PinTabs_ParamsSpec.$, WebClientHandler_PinTabs_ResponseParamsSpec.$, impl.pinTabs.bind(impl), false);
        this.helper_internal_.registerHandler(509499548, WebClientHandler_UnpinTabs_ParamsSpec.$, WebClientHandler_UnpinTabs_ResponseParamsSpec.$, impl.unpinTabs.bind(impl), false);
        this.helper_internal_.registerHandler(535420529, WebClientHandler_UnpinAllTabs_ParamsSpec.$, null, impl.unpinAllTabs.bind(impl), false);
        this.helper_internal_.registerHandler(1280690525, WebClientHandler_SubscribeToPinCandidates_ParamsSpec.$, null, impl.subscribeToPinCandidates.bind(impl), false);
        this.helper_internal_.registerHandler(923504180, WebClientHandler_OpenPinnedTabPicker_ParamsSpec.$, WebClientHandler_OpenPinnedTabPicker_ResponseParamsSpec.$, impl.openPinnedTabPicker.bind(impl), false);
        this.helper_internal_.registerHandler(358841852, WebClientHandler_ActivateTab_ParamsSpec.$, null, impl.activateTab.bind(impl), false);
        this.helper_internal_.registerHandler(1158979943, WebClientHandler_ResizeWidget_ParamsSpec.$, WebClientHandler_ResizeWidget_ResponseParamsSpec.$, impl.resizeWidget.bind(impl), false);
        this.helper_internal_.registerHandler(298967405, WebClientHandler_CaptureRegion_ParamsSpec.$, null, impl.captureRegion.bind(impl), false);
        this.helper_internal_.registerHandler(1287710749, WebClientHandler_DeleteCapturedRegion_ParamsSpec.$, null, impl.deleteCapturedRegion.bind(impl), false);
        this.helper_internal_.registerHandler(471855005, WebClientHandler_SetAudioDucking_ParamsSpec.$, WebClientHandler_SetAudioDucking_ResponseParamsSpec.$, impl.setAudioDucking.bind(impl), false);
        this.helper_internal_.registerHandler(1970773327, WebClientHandler_SetMinimumPanelSize_ParamsSpec.$, null, impl.setMinimumPanelSize.bind(impl), false);
        this.helper_internal_.registerHandler(716124888, WebClientHandler_SetMicrophonePermissionState_ParamsSpec.$, WebClientHandler_SetMicrophonePermissionState_ResponseParamsSpec.$, impl.setMicrophonePermissionState.bind(impl), false);
        this.helper_internal_.registerHandler(1241469372, WebClientHandler_SetLocationPermissionState_ParamsSpec.$, WebClientHandler_SetLocationPermissionState_ResponseParamsSpec.$, impl.setLocationPermissionState.bind(impl), false);
        this.helper_internal_.registerHandler(288757505, WebClientHandler_SetTabContextPermissionState_ParamsSpec.$, WebClientHandler_SetTabContextPermissionState_ResponseParamsSpec.$, impl.setTabContextPermissionState.bind(impl), false);
        this.helper_internal_.registerHandler(1479802155, WebClientHandler_SetClosedCaptioningSetting_ParamsSpec.$, WebClientHandler_SetClosedCaptioningSetting_ResponseParamsSpec.$, impl.setClosedCaptioningSetting.bind(impl), false);
        this.helper_internal_.registerHandler(856753641, WebClientHandler_SetActuationOnWebSetting_ParamsSpec.$, WebClientHandler_SetActuationOnWebSetting_ResponseParamsSpec.$, impl.setActuationOnWebSetting.bind(impl), false);
        this.helper_internal_.registerHandler(1279887017, WebClientHandler_ShouldAllowMediaPermissionRequest_ParamsSpec.$, WebClientHandler_ShouldAllowMediaPermissionRequest_ResponseParamsSpec.$, impl.shouldAllowMediaPermissionRequest.bind(impl), false);
        this.helper_internal_.registerHandler(1147203689, WebClientHandler_ShouldAllowGeolocationPermissionRequest_ParamsSpec.$, WebClientHandler_ShouldAllowGeolocationPermissionRequest_ResponseParamsSpec.$, impl.shouldAllowGeolocationPermissionRequest.bind(impl), false);
        this.helper_internal_.registerHandler(738470115, WebClientHandler_SetContextAccessIndicator_ParamsSpec.$, null, impl.setContextAccessIndicator.bind(impl), false);
        this.helper_internal_.registerHandler(544112319, WebClientHandler_GetUserProfileInfo_ParamsSpec.$, WebClientHandler_GetUserProfileInfo_ResponseParamsSpec.$, impl.getUserProfileInfo.bind(impl), false);
        this.helper_internal_.registerHandler(1782862117, WebClientHandler_SyncCookies_ParamsSpec.$, WebClientHandler_SyncCookies_ResponseParamsSpec.$, impl.syncCookies.bind(impl), false);
        this.helper_internal_.registerHandler(1548550890, WebClientHandler_ClientErrorDialogStateChanged_ParamsSpec.$, null, impl.clientErrorDialogStateChanged.bind(impl), false);
        this.helper_internal_.registerHandler(738743364, WebClientHandler_ReportClientTransientError_ParamsSpec.$, null, impl.reportClientTransientError.bind(impl), false);
        this.helper_internal_.registerHandler(1380826635, WebClientHandler_ProcessCounterAbuseVerdict_ParamsSpec.$, null, impl.processCounterAbuseVerdict.bind(impl), false);
        this.helper_internal_.registerHandler(2096922165, WebClientHandler_OnOptinImpression_ParamsSpec.$, null, impl.onOptinImpression.bind(impl), false);
        this.helper_internal_.registerHandler(434261936, WebClientHandler_OnUserInputSubmitted_ParamsSpec.$, null, impl.onUserInputSubmitted.bind(impl), false);
        this.helper_internal_.registerHandler(84722430, WebClientHandler_OnContextUploadStarted_ParamsSpec.$, null, impl.onContextUploadStarted.bind(impl), false);
        this.helper_internal_.registerHandler(192951905, WebClientHandler_OnContextUploadCompleted_ParamsSpec.$, null, impl.onContextUploadCompleted.bind(impl), false);
        this.helper_internal_.registerHandler(1956981756, WebClientHandler_OnReaction_ParamsSpec.$, null, impl.onReaction.bind(impl), false);
        this.helper_internal_.registerHandler(1113569315, WebClientHandler_OnResponseStarted_ParamsSpec.$, null, impl.onResponseStarted.bind(impl), false);
        this.helper_internal_.registerHandler(2056237766, WebClientHandler_OnResponseStopped_ParamsSpec.$, null, impl.onResponseStopped.bind(impl), false);
        this.helper_internal_.registerHandler(1395838110, WebClientHandler_OnSessionTerminated_ParamsSpec.$, null, impl.onSessionTerminated.bind(impl), false);
        this.helper_internal_.registerHandler(1100736000, WebClientHandler_OnTurnCompleted_ParamsSpec.$, null, impl.onTurnCompleted.bind(impl), false);
        this.helper_internal_.registerHandler(176640111, WebClientHandler_OnResponseRated_ParamsSpec.$, null, impl.onResponseRated.bind(impl), false);
        this.helper_internal_.registerHandler(1288638793, WebClientHandler_OnClosedCaptionsShown_ParamsSpec.$, null, impl.onClosedCaptionsShown.bind(impl), false);
        this.helper_internal_.registerHandler(2090467146, WebClientHandler_OnActionSubmitted_ParamsSpec.$, null, impl.onActionSubmitted.bind(impl), false);
        this.helper_internal_.registerHandler(2036645928, WebClientHandler_SetSyntheticExperimentState_ParamsSpec.$, null, impl.setSyntheticExperimentState.bind(impl), false);
        this.helper_internal_.registerHandler(368000756, WebClientHandler_OpenOsPermissionSettingsMenu_ParamsSpec.$, null, impl.openOsPermissionSettingsMenu.bind(impl), false);
        this.helper_internal_.registerHandler(186978966, WebClientHandler_GetOsMicrophonePermissionStatus_ParamsSpec.$, WebClientHandler_GetOsMicrophonePermissionStatus_ResponseParamsSpec.$, impl.getOsMicrophonePermissionStatus.bind(impl), false);
        this.helper_internal_.registerHandler(343048523, WebClientHandler_GetZeroStateSuggestionsForFocusedTab_ParamsSpec.$, WebClientHandler_GetZeroStateSuggestionsForFocusedTab_ResponseParamsSpec.$, impl.getZeroStateSuggestionsForFocusedTab.bind(impl), false);
        this.helper_internal_.registerHandler(465826492, WebClientHandler_MaybeRefreshUserStatus_ParamsSpec.$, null, impl.maybeRefreshUserStatus.bind(impl), false);
        this.helper_internal_.registerHandler(1947620394, WebClientHandler_IsDebuggerAttached_ParamsSpec.$, WebClientHandler_IsDebuggerAttached_ResponseParamsSpec.$, impl.isDebuggerAttached.bind(impl), false);
        this.helper_internal_.registerHandler(1820111387, WebClientHandler_SubscribeToPageMetadata_ParamsSpec.$, WebClientHandler_SubscribeToPageMetadata_ResponseParamsSpec.$, impl.subscribeToPageMetadata.bind(impl), false);
        this.helper_internal_.registerHandler(1406230838, WebClientHandler_SwitchConversation_ParamsSpec.$, WebClientHandler_SwitchConversation_ResponseParamsSpec.$, impl.switchConversation.bind(impl), false);
        this.helper_internal_.registerHandler(742588378, WebClientHandler_RegisterConversation_ParamsSpec.$, WebClientHandler_RegisterConversation_ResponseParamsSpec.$, impl.registerConversation.bind(impl), false);
        this.helper_internal_.registerHandler(1826063668, WebClientHandler_SetOnboardingCompleted_ParamsSpec.$, null, impl.setOnboardingCompleted.bind(impl), false);
        this.helper_internal_.registerHandler(7527316, WebClientHandler_SubscribeToTabData_ParamsSpec.$, null, impl.subscribeToTabData.bind(impl), false);
        this.helper_internal_.registerHandler(39549950, WebClientHandler_SubscribeToTabFavicon_ParamsSpec.$, null, impl.subscribeToTabFavicon.bind(impl), false);
        this.helper_internal_.registerHandler(1303827316, WebClientHandler_CreateGeminiEnterpriseHandler_ParamsSpec.$, null, impl.createGeminiEnterpriseHandler.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the WebClientHandler
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class WebClientHandlerCallbackRouter {
    helper_internal_;
    $;
    router_;
    reportApiRequestCount;
    reportApiRequestLatency;
    recordSparseValue;
    webClientCreated;
    webClientInitialized;
    webClientInitializeFailed;
    createActorHandler;
    createExperimentalTriggeringClient;
    createAnnotationHandler;
    createSkillsHandler;
    createZeroStateSuggestionsHandler;
    createAiOverlayTools;
    createTab;
    activateTabWithUrl;
    openLinkInPopup;
    openGlicSettingsPage;
    openPasswordManagerSettingsPage;
    openContactInfoSettingsPage;
    enableDragResize;
    closePanel;
    closePanelAndShutdown;
    attachPanel;
    detachPanel;
    onModeChange;
    onMicrophoneStatusChange;
    showProfilePicker;
    getModelQualityClientId;
    getContextFromFocusedTab;
    getContextFromTab;
    getImageBytesFromTab;
    setMaximumNumberOfPinnedTabs;
    pinTabs;
    unpinTabs;
    unpinAllTabs;
    subscribeToPinCandidates;
    openPinnedTabPicker;
    activateTab;
    resizeWidget;
    captureRegion;
    deleteCapturedRegion;
    setAudioDucking;
    setMinimumPanelSize;
    setMicrophonePermissionState;
    setLocationPermissionState;
    setTabContextPermissionState;
    setClosedCaptioningSetting;
    setActuationOnWebSetting;
    shouldAllowMediaPermissionRequest;
    shouldAllowGeolocationPermissionRequest;
    setContextAccessIndicator;
    getUserProfileInfo;
    syncCookies;
    clientErrorDialogStateChanged;
    reportClientTransientError;
    processCounterAbuseVerdict;
    onOptinImpression;
    onUserInputSubmitted;
    onContextUploadStarted;
    onContextUploadCompleted;
    onReaction;
    onResponseStarted;
    onResponseStopped;
    onSessionTerminated;
    onTurnCompleted;
    onResponseRated;
    onClosedCaptionsShown;
    onActionSubmitted;
    setSyntheticExperimentState;
    openOsPermissionSettingsMenu;
    getOsMicrophonePermissionStatus;
    getZeroStateSuggestionsForFocusedTab;
    maybeRefreshUserStatus;
    isDebuggerAttached;
    subscribeToPageMetadata;
    switchConversation;
    registerConversation;
    setOnboardingCompleted;
    subscribeToTabData;
    subscribeToTabFavicon;
    createGeminiEnterpriseHandler;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(WebClientHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.reportApiRequestCount =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(325050836, WebClientHandler_ReportApiRequestCount_ParamsSpec.$, null, this.reportApiRequestCount.createReceiverHandler(false /* expectsResponse */), false);
        this.reportApiRequestLatency =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1142669665, WebClientHandler_ReportApiRequestLatency_ParamsSpec.$, null, this.reportApiRequestLatency.createReceiverHandler(false /* expectsResponse */), false);
        this.recordSparseValue =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1302555104, WebClientHandler_RecordSparseValue_ParamsSpec.$, null, this.recordSparseValue.createReceiverHandler(false /* expectsResponse */), false);
        this.webClientCreated =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(960163197, WebClientHandler_WebClientCreated_ParamsSpec.$, WebClientHandler_WebClientCreated_ResponseParamsSpec.$, this.webClientCreated.createReceiverHandler(true /* expectsResponse */), false);
        this.webClientInitialized =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1787925370, WebClientHandler_WebClientInitialized_ParamsSpec.$, null, this.webClientInitialized.createReceiverHandler(false /* expectsResponse */), false);
        this.webClientInitializeFailed =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(560721472, WebClientHandler_WebClientInitializeFailed_ParamsSpec.$, null, this.webClientInitializeFailed.createReceiverHandler(false /* expectsResponse */), false);
        this.createActorHandler =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(829908158, WebClientHandler_CreateActorHandler_ParamsSpec.$, null, this.createActorHandler.createReceiverHandler(false /* expectsResponse */), false);
        this.createExperimentalTriggeringClient =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(220544101, WebClientHandler_CreateExperimentalTriggeringClient_ParamsSpec.$, null, this.createExperimentalTriggeringClient.createReceiverHandler(false /* expectsResponse */), false);
        this.createAnnotationHandler =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(971268420, WebClientHandler_CreateAnnotationHandler_ParamsSpec.$, null, this.createAnnotationHandler.createReceiverHandler(false /* expectsResponse */), false);
        this.createSkillsHandler =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(747328774, WebClientHandler_CreateSkillsHandler_ParamsSpec.$, null, this.createSkillsHandler.createReceiverHandler(false /* expectsResponse */), false);
        this.createZeroStateSuggestionsHandler =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1404627528, WebClientHandler_CreateZeroStateSuggestionsHandler_ParamsSpec.$, null, this.createZeroStateSuggestionsHandler.createReceiverHandler(false /* expectsResponse */), false);
        this.createAiOverlayTools =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1079365381, WebClientHandler_CreateAiOverlayTools_ParamsSpec.$, null, this.createAiOverlayTools.createReceiverHandler(false /* expectsResponse */), false);
        this.createTab =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(112121078, WebClientHandler_CreateTab_ParamsSpec.$, WebClientHandler_CreateTab_ResponseParamsSpec.$, this.createTab.createReceiverHandler(true /* expectsResponse */), false);
        this.activateTabWithUrl =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1067468350, WebClientHandler_ActivateTabWithUrl_ParamsSpec.$, WebClientHandler_ActivateTabWithUrl_ResponseParamsSpec.$, this.activateTabWithUrl.createReceiverHandler(true /* expectsResponse */), false);
        this.openLinkInPopup =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(643033935, WebClientHandler_OpenLinkInPopup_ParamsSpec.$, null, this.openLinkInPopup.createReceiverHandler(false /* expectsResponse */), false);
        this.openGlicSettingsPage =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1750399938, WebClientHandler_OpenGlicSettingsPage_ParamsSpec.$, null, this.openGlicSettingsPage.createReceiverHandler(false /* expectsResponse */), false);
        this.openPasswordManagerSettingsPage =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1676992361, WebClientHandler_OpenPasswordManagerSettingsPage_ParamsSpec.$, null, this.openPasswordManagerSettingsPage.createReceiverHandler(false /* expectsResponse */), false);
        this.openContactInfoSettingsPage =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1318700046, WebClientHandler_OpenContactInfoSettingsPage_ParamsSpec.$, null, this.openContactInfoSettingsPage.createReceiverHandler(false /* expectsResponse */), false);
        this.enableDragResize =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1818498076, WebClientHandler_EnableDragResize_ParamsSpec.$, null, this.enableDragResize.createReceiverHandler(false /* expectsResponse */), false);
        this.closePanel =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1149647711, WebClientHandler_ClosePanel_ParamsSpec.$, null, this.closePanel.createReceiverHandler(false /* expectsResponse */), false);
        this.closePanelAndShutdown =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(791889119, WebClientHandler_ClosePanelAndShutdown_ParamsSpec.$, null, this.closePanelAndShutdown.createReceiverHandler(false /* expectsResponse */), false);
        this.attachPanel =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(312413449, WebClientHandler_AttachPanel_ParamsSpec.$, null, this.attachPanel.createReceiverHandler(false /* expectsResponse */), false);
        this.detachPanel =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1069921036, WebClientHandler_DetachPanel_ParamsSpec.$, null, this.detachPanel.createReceiverHandler(false /* expectsResponse */), false);
        this.onModeChange =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1898715240, WebClientHandler_OnModeChange_ParamsSpec.$, null, this.onModeChange.createReceiverHandler(false /* expectsResponse */), false);
        this.onMicrophoneStatusChange =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2073688921, WebClientHandler_OnMicrophoneStatusChange_ParamsSpec.$, null, this.onMicrophoneStatusChange.createReceiverHandler(false /* expectsResponse */), false);
        this.showProfilePicker =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(950077268, WebClientHandler_ShowProfilePicker_ParamsSpec.$, null, this.showProfilePicker.createReceiverHandler(false /* expectsResponse */), false);
        this.getModelQualityClientId =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1208572382, WebClientHandler_GetModelQualityClientId_ParamsSpec.$, WebClientHandler_GetModelQualityClientId_ResponseParamsSpec.$, this.getModelQualityClientId.createReceiverHandler(true /* expectsResponse */), false);
        this.getContextFromFocusedTab =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(915453055, WebClientHandler_GetContextFromFocusedTab_ParamsSpec.$, WebClientHandler_GetContextFromFocusedTab_ResponseParamsSpec.$, this.getContextFromFocusedTab.createReceiverHandler(true /* expectsResponse */), false);
        this.getContextFromTab =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2116856695, WebClientHandler_GetContextFromTab_ParamsSpec.$, WebClientHandler_GetContextFromTab_ResponseParamsSpec.$, this.getContextFromTab.createReceiverHandler(true /* expectsResponse */), false);
        this.getImageBytesFromTab =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1946376714, WebClientHandler_GetImageBytesFromTab_ParamsSpec.$, WebClientHandler_GetImageBytesFromTab_ResponseParamsSpec.$, this.getImageBytesFromTab.createReceiverHandler(true /* expectsResponse */), false);
        this.setMaximumNumberOfPinnedTabs =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1931689889, WebClientHandler_SetMaximumNumberOfPinnedTabs_ParamsSpec.$, WebClientHandler_SetMaximumNumberOfPinnedTabs_ResponseParamsSpec.$, this.setMaximumNumberOfPinnedTabs.createReceiverHandler(true /* expectsResponse */), false);
        this.pinTabs =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1382323391, WebClientHandler_PinTabs_ParamsSpec.$, WebClientHandler_PinTabs_ResponseParamsSpec.$, this.pinTabs.createReceiverHandler(true /* expectsResponse */), false);
        this.unpinTabs =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(509499548, WebClientHandler_UnpinTabs_ParamsSpec.$, WebClientHandler_UnpinTabs_ResponseParamsSpec.$, this.unpinTabs.createReceiverHandler(true /* expectsResponse */), false);
        this.unpinAllTabs =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(535420529, WebClientHandler_UnpinAllTabs_ParamsSpec.$, null, this.unpinAllTabs.createReceiverHandler(false /* expectsResponse */), false);
        this.subscribeToPinCandidates =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1280690525, WebClientHandler_SubscribeToPinCandidates_ParamsSpec.$, null, this.subscribeToPinCandidates.createReceiverHandler(false /* expectsResponse */), false);
        this.openPinnedTabPicker =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(923504180, WebClientHandler_OpenPinnedTabPicker_ParamsSpec.$, WebClientHandler_OpenPinnedTabPicker_ResponseParamsSpec.$, this.openPinnedTabPicker.createReceiverHandler(true /* expectsResponse */), false);
        this.activateTab =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(358841852, WebClientHandler_ActivateTab_ParamsSpec.$, null, this.activateTab.createReceiverHandler(false /* expectsResponse */), false);
        this.resizeWidget =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1158979943, WebClientHandler_ResizeWidget_ParamsSpec.$, WebClientHandler_ResizeWidget_ResponseParamsSpec.$, this.resizeWidget.createReceiverHandler(true /* expectsResponse */), false);
        this.captureRegion =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(298967405, WebClientHandler_CaptureRegion_ParamsSpec.$, null, this.captureRegion.createReceiverHandler(false /* expectsResponse */), false);
        this.deleteCapturedRegion =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1287710749, WebClientHandler_DeleteCapturedRegion_ParamsSpec.$, null, this.deleteCapturedRegion.createReceiverHandler(false /* expectsResponse */), false);
        this.setAudioDucking =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(471855005, WebClientHandler_SetAudioDucking_ParamsSpec.$, WebClientHandler_SetAudioDucking_ResponseParamsSpec.$, this.setAudioDucking.createReceiverHandler(true /* expectsResponse */), false);
        this.setMinimumPanelSize =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1970773327, WebClientHandler_SetMinimumPanelSize_ParamsSpec.$, null, this.setMinimumPanelSize.createReceiverHandler(false /* expectsResponse */), false);
        this.setMicrophonePermissionState =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(716124888, WebClientHandler_SetMicrophonePermissionState_ParamsSpec.$, WebClientHandler_SetMicrophonePermissionState_ResponseParamsSpec.$, this.setMicrophonePermissionState.createReceiverHandler(true /* expectsResponse */), false);
        this.setLocationPermissionState =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1241469372, WebClientHandler_SetLocationPermissionState_ParamsSpec.$, WebClientHandler_SetLocationPermissionState_ResponseParamsSpec.$, this.setLocationPermissionState.createReceiverHandler(true /* expectsResponse */), false);
        this.setTabContextPermissionState =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(288757505, WebClientHandler_SetTabContextPermissionState_ParamsSpec.$, WebClientHandler_SetTabContextPermissionState_ResponseParamsSpec.$, this.setTabContextPermissionState.createReceiverHandler(true /* expectsResponse */), false);
        this.setClosedCaptioningSetting =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1479802155, WebClientHandler_SetClosedCaptioningSetting_ParamsSpec.$, WebClientHandler_SetClosedCaptioningSetting_ResponseParamsSpec.$, this.setClosedCaptioningSetting.createReceiverHandler(true /* expectsResponse */), false);
        this.setActuationOnWebSetting =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(856753641, WebClientHandler_SetActuationOnWebSetting_ParamsSpec.$, WebClientHandler_SetActuationOnWebSetting_ResponseParamsSpec.$, this.setActuationOnWebSetting.createReceiverHandler(true /* expectsResponse */), false);
        this.shouldAllowMediaPermissionRequest =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1279887017, WebClientHandler_ShouldAllowMediaPermissionRequest_ParamsSpec.$, WebClientHandler_ShouldAllowMediaPermissionRequest_ResponseParamsSpec.$, this.shouldAllowMediaPermissionRequest.createReceiverHandler(true /* expectsResponse */), false);
        this.shouldAllowGeolocationPermissionRequest =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1147203689, WebClientHandler_ShouldAllowGeolocationPermissionRequest_ParamsSpec.$, WebClientHandler_ShouldAllowGeolocationPermissionRequest_ResponseParamsSpec.$, this.shouldAllowGeolocationPermissionRequest.createReceiverHandler(true /* expectsResponse */), false);
        this.setContextAccessIndicator =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(738470115, WebClientHandler_SetContextAccessIndicator_ParamsSpec.$, null, this.setContextAccessIndicator.createReceiverHandler(false /* expectsResponse */), false);
        this.getUserProfileInfo =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(544112319, WebClientHandler_GetUserProfileInfo_ParamsSpec.$, WebClientHandler_GetUserProfileInfo_ResponseParamsSpec.$, this.getUserProfileInfo.createReceiverHandler(true /* expectsResponse */), false);
        this.syncCookies =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1782862117, WebClientHandler_SyncCookies_ParamsSpec.$, WebClientHandler_SyncCookies_ResponseParamsSpec.$, this.syncCookies.createReceiverHandler(true /* expectsResponse */), false);
        this.clientErrorDialogStateChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1548550890, WebClientHandler_ClientErrorDialogStateChanged_ParamsSpec.$, null, this.clientErrorDialogStateChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.reportClientTransientError =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(738743364, WebClientHandler_ReportClientTransientError_ParamsSpec.$, null, this.reportClientTransientError.createReceiverHandler(false /* expectsResponse */), false);
        this.processCounterAbuseVerdict =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1380826635, WebClientHandler_ProcessCounterAbuseVerdict_ParamsSpec.$, null, this.processCounterAbuseVerdict.createReceiverHandler(false /* expectsResponse */), false);
        this.onOptinImpression =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2096922165, WebClientHandler_OnOptinImpression_ParamsSpec.$, null, this.onOptinImpression.createReceiverHandler(false /* expectsResponse */), false);
        this.onUserInputSubmitted =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(434261936, WebClientHandler_OnUserInputSubmitted_ParamsSpec.$, null, this.onUserInputSubmitted.createReceiverHandler(false /* expectsResponse */), false);
        this.onContextUploadStarted =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(84722430, WebClientHandler_OnContextUploadStarted_ParamsSpec.$, null, this.onContextUploadStarted.createReceiverHandler(false /* expectsResponse */), false);
        this.onContextUploadCompleted =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(192951905, WebClientHandler_OnContextUploadCompleted_ParamsSpec.$, null, this.onContextUploadCompleted.createReceiverHandler(false /* expectsResponse */), false);
        this.onReaction =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1956981756, WebClientHandler_OnReaction_ParamsSpec.$, null, this.onReaction.createReceiverHandler(false /* expectsResponse */), false);
        this.onResponseStarted =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1113569315, WebClientHandler_OnResponseStarted_ParamsSpec.$, null, this.onResponseStarted.createReceiverHandler(false /* expectsResponse */), false);
        this.onResponseStopped =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2056237766, WebClientHandler_OnResponseStopped_ParamsSpec.$, null, this.onResponseStopped.createReceiverHandler(false /* expectsResponse */), false);
        this.onSessionTerminated =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1395838110, WebClientHandler_OnSessionTerminated_ParamsSpec.$, null, this.onSessionTerminated.createReceiverHandler(false /* expectsResponse */), false);
        this.onTurnCompleted =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1100736000, WebClientHandler_OnTurnCompleted_ParamsSpec.$, null, this.onTurnCompleted.createReceiverHandler(false /* expectsResponse */), false);
        this.onResponseRated =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(176640111, WebClientHandler_OnResponseRated_ParamsSpec.$, null, this.onResponseRated.createReceiverHandler(false /* expectsResponse */), false);
        this.onClosedCaptionsShown =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1288638793, WebClientHandler_OnClosedCaptionsShown_ParamsSpec.$, null, this.onClosedCaptionsShown.createReceiverHandler(false /* expectsResponse */), false);
        this.onActionSubmitted =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2090467146, WebClientHandler_OnActionSubmitted_ParamsSpec.$, null, this.onActionSubmitted.createReceiverHandler(false /* expectsResponse */), false);
        this.setSyntheticExperimentState =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2036645928, WebClientHandler_SetSyntheticExperimentState_ParamsSpec.$, null, this.setSyntheticExperimentState.createReceiverHandler(false /* expectsResponse */), false);
        this.openOsPermissionSettingsMenu =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(368000756, WebClientHandler_OpenOsPermissionSettingsMenu_ParamsSpec.$, null, this.openOsPermissionSettingsMenu.createReceiverHandler(false /* expectsResponse */), false);
        this.getOsMicrophonePermissionStatus =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(186978966, WebClientHandler_GetOsMicrophonePermissionStatus_ParamsSpec.$, WebClientHandler_GetOsMicrophonePermissionStatus_ResponseParamsSpec.$, this.getOsMicrophonePermissionStatus.createReceiverHandler(true /* expectsResponse */), false);
        this.getZeroStateSuggestionsForFocusedTab =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(343048523, WebClientHandler_GetZeroStateSuggestionsForFocusedTab_ParamsSpec.$, WebClientHandler_GetZeroStateSuggestionsForFocusedTab_ResponseParamsSpec.$, this.getZeroStateSuggestionsForFocusedTab.createReceiverHandler(true /* expectsResponse */), false);
        this.maybeRefreshUserStatus =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(465826492, WebClientHandler_MaybeRefreshUserStatus_ParamsSpec.$, null, this.maybeRefreshUserStatus.createReceiverHandler(false /* expectsResponse */), false);
        this.isDebuggerAttached =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1947620394, WebClientHandler_IsDebuggerAttached_ParamsSpec.$, WebClientHandler_IsDebuggerAttached_ResponseParamsSpec.$, this.isDebuggerAttached.createReceiverHandler(true /* expectsResponse */), false);
        this.subscribeToPageMetadata =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1820111387, WebClientHandler_SubscribeToPageMetadata_ParamsSpec.$, WebClientHandler_SubscribeToPageMetadata_ResponseParamsSpec.$, this.subscribeToPageMetadata.createReceiverHandler(true /* expectsResponse */), false);
        this.switchConversation =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1406230838, WebClientHandler_SwitchConversation_ParamsSpec.$, WebClientHandler_SwitchConversation_ResponseParamsSpec.$, this.switchConversation.createReceiverHandler(true /* expectsResponse */), false);
        this.registerConversation =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(742588378, WebClientHandler_RegisterConversation_ParamsSpec.$, WebClientHandler_RegisterConversation_ResponseParamsSpec.$, this.registerConversation.createReceiverHandler(true /* expectsResponse */), false);
        this.setOnboardingCompleted =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1826063668, WebClientHandler_SetOnboardingCompleted_ParamsSpec.$, null, this.setOnboardingCompleted.createReceiverHandler(false /* expectsResponse */), false);
        this.subscribeToTabData =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(7527316, WebClientHandler_SubscribeToTabData_ParamsSpec.$, null, this.subscribeToTabData.createReceiverHandler(false /* expectsResponse */), false);
        this.subscribeToTabFavicon =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(39549950, WebClientHandler_SubscribeToTabFavicon_ParamsSpec.$, null, this.subscribeToTabFavicon.createReceiverHandler(false /* expectsResponse */), false);
        this.createGeminiEnterpriseHandler =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1303827316, WebClientHandler_CreateGeminiEnterpriseHandler_ParamsSpec.$, null, this.createGeminiEnterpriseHandler.createReceiverHandler(false /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class ZeroStateSuggestionsHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.ZeroStateSuggestionsHandler', scope);
    }
}
class ZeroStateSuggestionsHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(ZeroStateSuggestionsHandlerPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    getZeroStateSuggestionsAndSubscribe(client, options) {
        return this.proxy.sendMessage(147619411, ZeroStateSuggestionsHandler_GetZeroStateSuggestionsAndSubscribe_ParamsSpec.$, ZeroStateSuggestionsHandler_GetZeroStateSuggestionsAndSubscribe_ResponseParamsSpec.$, [
            client,
            options
        ], false);
    }
}
/**
 * An object which receives request messages for the ZeroStateSuggestionsHandler
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class ZeroStateSuggestionsHandlerReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(ZeroStateSuggestionsHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(147619411, ZeroStateSuggestionsHandler_GetZeroStateSuggestionsAndSubscribe_ParamsSpec.$, ZeroStateSuggestionsHandler_GetZeroStateSuggestionsAndSubscribe_ResponseParamsSpec.$, impl.getZeroStateSuggestionsAndSubscribe.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the ZeroStateSuggestionsHandler
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class ZeroStateSuggestionsHandlerCallbackRouter {
    helper_internal_;
    $;
    router_;
    getZeroStateSuggestionsAndSubscribe;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(ZeroStateSuggestionsHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.getZeroStateSuggestionsAndSubscribe =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(147619411, ZeroStateSuggestionsHandler_GetZeroStateSuggestionsAndSubscribe_ParamsSpec.$, ZeroStateSuggestionsHandler_GetZeroStateSuggestionsAndSubscribe_ResponseParamsSpec.$, this.getZeroStateSuggestionsAndSubscribe.createReceiverHandler(true /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class ZeroStateSuggestionsClientPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.ZeroStateSuggestionsClient', scope);
    }
}
class ZeroStateSuggestionsClientRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(ZeroStateSuggestionsClientPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    notifyZeroStateSuggestionsChanged(suggestions, options) {
        this.proxy.sendMessage(1717023858, ZeroStateSuggestionsClient_NotifyZeroStateSuggestionsChanged_ParamsSpec.$, null, [
            suggestions,
            options
        ], false);
    }
}
/**
 * An object which receives request messages for the ZeroStateSuggestionsClient
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class ZeroStateSuggestionsClientReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(ZeroStateSuggestionsClientRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(1717023858, ZeroStateSuggestionsClient_NotifyZeroStateSuggestionsChanged_ParamsSpec.$, null, impl.notifyZeroStateSuggestionsChanged.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the ZeroStateSuggestionsClient
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class ZeroStateSuggestionsClientCallbackRouter {
    helper_internal_;
    $;
    router_;
    notifyZeroStateSuggestionsChanged;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(ZeroStateSuggestionsClientRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.notifyZeroStateSuggestionsChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1717023858, ZeroStateSuggestionsClient_NotifyZeroStateSuggestionsChanged_ParamsSpec.$, null, this.notifyZeroStateSuggestionsChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class TabDataHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.TabDataHandler', scope);
    }
}
class TabDataHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(TabDataHandlerPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    onTabDataChanged(tabData) {
        this.proxy.sendMessage(1427389440, TabDataHandler_OnTabDataChanged_ParamsSpec.$, null, [
            tabData
        ], false);
    }
}
/**
 * An object which receives request messages for the TabDataHandler
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class TabDataHandlerReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(TabDataHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(1427389440, TabDataHandler_OnTabDataChanged_ParamsSpec.$, null, impl.onTabDataChanged.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the TabDataHandler
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class TabDataHandlerCallbackRouter {
    helper_internal_;
    $;
    router_;
    onTabDataChanged;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(TabDataHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.onTabDataChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1427389440, TabDataHandler_OnTabDataChanged_ParamsSpec.$, null, this.onTabDataChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class TabFaviconHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.TabFaviconHandler', scope);
    }
}
class TabFaviconHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(TabFaviconHandlerPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    onTabFaviconChanged(favicon) {
        this.proxy.sendMessage(806613817, TabFaviconHandler_OnTabFaviconChanged_ParamsSpec.$, null, [
            favicon
        ], false);
    }
}
/**
 * An object which receives request messages for the TabFaviconHandler
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class TabFaviconHandlerReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(TabFaviconHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(806613817, TabFaviconHandler_OnTabFaviconChanged_ParamsSpec.$, null, impl.onTabFaviconChanged.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the TabFaviconHandler
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class TabFaviconHandlerCallbackRouter {
    helper_internal_;
    $;
    router_;
    onTabFaviconChanged;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(TabFaviconHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.onTabFaviconChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(806613817, TabFaviconHandler_OnTabFaviconChanged_ParamsSpec.$, null, this.onTabFaviconChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class ExperimentalTriggeringUpdatesHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.ExperimentalTriggeringUpdatesHandler', scope);
    }
}
class ExperimentalTriggeringUpdatesHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(ExperimentalTriggeringUpdatesHandlerPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    onUpdate(update, observation) {
        this.proxy.sendMessage(4921753, ExperimentalTriggeringUpdatesHandler_OnUpdate_ParamsSpec.$, null, [
            update,
            observation
        ], false);
    }
}
/**
 * An object which receives request messages for the ExperimentalTriggeringUpdatesHandler
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class ExperimentalTriggeringUpdatesHandlerReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(ExperimentalTriggeringUpdatesHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(4921753, ExperimentalTriggeringUpdatesHandler_OnUpdate_ParamsSpec.$, null, impl.onUpdate.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the ExperimentalTriggeringUpdatesHandler
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class ExperimentalTriggeringUpdatesHandlerCallbackRouter {
    helper_internal_;
    $;
    router_;
    onUpdate;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(ExperimentalTriggeringUpdatesHandlerRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.onUpdate =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(4921753, ExperimentalTriggeringUpdatesHandler_OnUpdate_ParamsSpec.$, null, this.onUpdate.createReceiverHandler(false /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class ExperimentalTriggeringClientPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.ExperimentalTriggeringClient', scope);
    }
}
class ExperimentalTriggeringClientRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(ExperimentalTriggeringClientPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    uploadEncryptedScreenshot(screenshot) {
        return this.proxy.sendMessage(202212312, ExperimentalTriggeringClient_UploadEncryptedScreenshot_ParamsSpec.$, ExperimentalTriggeringClient_UploadEncryptedScreenshot_ResponseParamsSpec.$, [
            screenshot
        ], false);
    }
    getExperimentalTriggeringUpdates(handler) {
        return this.proxy.sendMessage(1832120295, ExperimentalTriggeringClient_GetExperimentalTriggeringUpdates_ParamsSpec.$, ExperimentalTriggeringClient_GetExperimentalTriggeringUpdates_ResponseParamsSpec.$, [
            handler
        ], false);
    }
    submitExperimentalTriggeringConfirmationResponse(response) {
        return this.proxy.sendMessage(1333876813, ExperimentalTriggeringClient_SubmitExperimentalTriggeringConfirmationResponse_ParamsSpec.$, ExperimentalTriggeringClient_SubmitExperimentalTriggeringConfirmationResponse_ResponseParamsSpec.$, [
            response
        ], false);
    }
}
/**
 * An object which receives request messages for the ExperimentalTriggeringClient
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class ExperimentalTriggeringClientReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(ExperimentalTriggeringClientRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(202212312, ExperimentalTriggeringClient_UploadEncryptedScreenshot_ParamsSpec.$, ExperimentalTriggeringClient_UploadEncryptedScreenshot_ResponseParamsSpec.$, impl.uploadEncryptedScreenshot.bind(impl), false);
        this.helper_internal_.registerHandler(1832120295, ExperimentalTriggeringClient_GetExperimentalTriggeringUpdates_ParamsSpec.$, ExperimentalTriggeringClient_GetExperimentalTriggeringUpdates_ResponseParamsSpec.$, impl.getExperimentalTriggeringUpdates.bind(impl), false);
        this.helper_internal_.registerHandler(1333876813, ExperimentalTriggeringClient_SubmitExperimentalTriggeringConfirmationResponse_ParamsSpec.$, ExperimentalTriggeringClient_SubmitExperimentalTriggeringConfirmationResponse_ResponseParamsSpec.$, impl.submitExperimentalTriggeringConfirmationResponse.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the ExperimentalTriggeringClient
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class ExperimentalTriggeringClientCallbackRouter {
    helper_internal_;
    $;
    router_;
    uploadEncryptedScreenshot;
    getExperimentalTriggeringUpdates;
    submitExperimentalTriggeringConfirmationResponse;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(ExperimentalTriggeringClientRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.uploadEncryptedScreenshot =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(202212312, ExperimentalTriggeringClient_UploadEncryptedScreenshot_ParamsSpec.$, ExperimentalTriggeringClient_UploadEncryptedScreenshot_ResponseParamsSpec.$, this.uploadEncryptedScreenshot.createReceiverHandler(true /* expectsResponse */), false);
        this.getExperimentalTriggeringUpdates =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1832120295, ExperimentalTriggeringClient_GetExperimentalTriggeringUpdates_ParamsSpec.$, ExperimentalTriggeringClient_GetExperimentalTriggeringUpdates_ResponseParamsSpec.$, this.getExperimentalTriggeringUpdates.createReceiverHandler(true /* expectsResponse */), false);
        this.submitExperimentalTriggeringConfirmationResponse =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1333876813, ExperimentalTriggeringClient_SubmitExperimentalTriggeringConfirmationResponse_ParamsSpec.$, ExperimentalTriggeringClient_SubmitExperimentalTriggeringConfirmationResponse_ResponseParamsSpec.$, this.submitExperimentalTriggeringConfirmationResponse.createReceiverHandler(true /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class WebClientPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.WebClient', scope);
    }
}
class WebClientRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(WebClientPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    checkResponsive() {
        return this.proxy.sendMessage(1114550869, WebClient_CheckResponsive_ParamsSpec.$, WebClient_CheckResponsive_ResponseParamsSpec.$, [], false);
    }
    notifyPanelWillOpen(panelOpeningData) {
        return this.proxy.sendMessage(318227721, WebClient_NotifyPanelWillOpen_ParamsSpec.$, WebClient_NotifyPanelWillOpen_ResponseParamsSpec.$, [
            panelOpeningData
        ], false);
    }
    notifyPanelWasClosed() {
        return this.proxy.sendMessage(772726572, WebClient_NotifyPanelWasClosed_ParamsSpec.$, WebClient_NotifyPanelWasClosed_ResponseParamsSpec.$, [], false);
    }
    notifyPanelStateChange(panelState) {
        this.proxy.sendMessage(1012298943, WebClient_NotifyPanelStateChange_ParamsSpec.$, null, [
            panelState
        ], false);
    }
    notifyPanelActiveChange(panelActive) {
        this.proxy.sendMessage(746055399, WebClient_NotifyPanelActiveChange_ParamsSpec.$, null, [
            panelActive
        ], false);
    }
    notifyPanelCanAttachChange(canAttach) {
        this.proxy.sendMessage(1825214786, WebClient_NotifyPanelCanAttachChange_ParamsSpec.$, null, [
            canAttach
        ], false);
    }
    notifyMicrophonePermissionStateChanged(enabled) {
        this.proxy.sendMessage(1479136630, WebClient_NotifyMicrophonePermissionStateChanged_ParamsSpec.$, null, [
            enabled
        ], false);
    }
    notifyFileUploadStateChanged(state) {
        this.proxy.sendMessage(244098747, WebClient_NotifyFileUploadStateChanged_ParamsSpec.$, null, [
            state
        ], false);
    }
    stopMicrophone() {
        return this.proxy.sendMessage(1430965533, WebClient_StopMicrophone_ParamsSpec.$, WebClient_StopMicrophone_ResponseParamsSpec.$, [], false);
    }
    notifyLocationPermissionStateChanged(enabled) {
        this.proxy.sendMessage(56992579, WebClient_NotifyLocationPermissionStateChanged_ParamsSpec.$, null, [
            enabled
        ], false);
    }
    notifyTabContextPermissionStateChanged(enabled) {
        this.proxy.sendMessage(1309328746, WebClient_NotifyTabContextPermissionStateChanged_ParamsSpec.$, null, [
            enabled
        ], false);
    }
    notifyOsLocationPermissionStateChanged(enabled) {
        this.proxy.sendMessage(2059846141, WebClient_NotifyOsLocationPermissionStateChanged_ParamsSpec.$, null, [
            enabled
        ], false);
    }
    notifyFocusedTabChanged(focusedTabData) {
        this.proxy.sendMessage(1488950295, WebClient_NotifyFocusedTabChanged_ParamsSpec.$, null, [
            focusedTabData
        ], false);
    }
    notifyManualResizeChanged(resizing) {
        this.proxy.sendMessage(239957995, WebClient_NotifyManualResizeChanged_ParamsSpec.$, null, [
            resizing
        ], false);
    }
    notifyOsHotkeyStateChanged(hotkey) {
        this.proxy.sendMessage(963534021, WebClient_NotifyOsHotkeyStateChanged_ParamsSpec.$, null, [
            hotkey
        ], false);
    }
    notifyBrowserIsOpenChanged(browserIsOpen) {
        this.proxy.sendMessage(1949367966, WebClient_NotifyBrowserIsOpenChanged_ParamsSpec.$, null, [
            browserIsOpen
        ], false);
    }
    notifyZoomLevelChanged(zoomFactor) {
        this.proxy.sendMessage(1838114987, WebClient_NotifyZoomLevelChanged_ParamsSpec.$, null, [
            zoomFactor
        ], false);
    }
    notifyInstanceActivationChanged(instanceActive) {
        this.proxy.sendMessage(1707000017, WebClient_NotifyInstanceActivationChanged_ParamsSpec.$, null, [
            instanceActive
        ], false);
    }
    notifyClosedCaptioningSettingChanged(enabled) {
        this.proxy.sendMessage(1654202187, WebClient_NotifyClosedCaptioningSettingChanged_ParamsSpec.$, null, [
            enabled
        ], false);
    }
    notifyPinnedTabsChanged(tabData) {
        this.proxy.sendMessage(409750188, WebClient_NotifyPinnedTabsChanged_ParamsSpec.$, null, [
            tabData
        ], false);
    }
    notifyPinnedTabDataChanged(tabData) {
        this.proxy.sendMessage(316158918, WebClient_NotifyPinnedTabDataChanged_ParamsSpec.$, null, [
            tabData
        ], false);
    }
    notifyPageMetadataChanged(tabId, metadata) {
        this.proxy.sendMessage(947281480, WebClient_NotifyPageMetadataChanged_ParamsSpec.$, null, [
            tabId,
            metadata
        ], false);
    }
    notifyDefaultTabContextPermissionStateChanged(enabled) {
        this.proxy.sendMessage(744298244, WebClient_NotifyDefaultTabContextPermissionStateChanged_ParamsSpec.$, null, [
            enabled
        ], false);
    }
    notifyAdditionalContext(context) {
        this.proxy.sendMessage(769259696, WebClient_NotifyAdditionalContext_ParamsSpec.$, null, [
            context
        ], false);
    }
    notifyActuationOnWebSettingChanged(enabled) {
        this.proxy.sendMessage(1671214775, WebClient_NotifyActuationOnWebSettingChanged_ParamsSpec.$, null, [
            enabled
        ], false);
    }
    notifyActOnWebCapabilityChanged(canActOnWeb) {
        this.proxy.sendMessage(2057603770, WebClient_NotifyActOnWebCapabilityChanged_ParamsSpec.$, null, [
            canActOnWeb
        ], false);
    }
    notifyOnboardingCompletedChanged(completed) {
        this.proxy.sendMessage(674868712, WebClient_NotifyOnboardingCompletedChanged_ParamsSpec.$, null, [
            completed
        ], false);
    }
    notifyGeminiEnterpriseSettingsChanged(settings) {
        this.proxy.sendMessage(2030425032, WebClient_NotifyGeminiEnterpriseSettingsChanged_ParamsSpec.$, null, [
            settings
        ], false);
    }
    notifyActorTaskListRowClicked(taskId) {
        this.proxy.sendMessage(1012760147, WebClient_NotifyActorTaskListRowClicked_ParamsSpec.$, null, [
            taskId
        ], false);
    }
    invoke(options) {
        return this.proxy.sendMessage(1583692415, WebClient_Invoke_ParamsSpec.$, WebClient_Invoke_ResponseParamsSpec.$, [
            options
        ], false);
    }
}
/**
 * An object which receives request messages for the WebClient
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class WebClientReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(WebClientRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(1114550869, WebClient_CheckResponsive_ParamsSpec.$, WebClient_CheckResponsive_ResponseParamsSpec.$, impl.checkResponsive.bind(impl), false);
        this.helper_internal_.registerHandler(318227721, WebClient_NotifyPanelWillOpen_ParamsSpec.$, WebClient_NotifyPanelWillOpen_ResponseParamsSpec.$, impl.notifyPanelWillOpen.bind(impl), false);
        this.helper_internal_.registerHandler(772726572, WebClient_NotifyPanelWasClosed_ParamsSpec.$, WebClient_NotifyPanelWasClosed_ResponseParamsSpec.$, impl.notifyPanelWasClosed.bind(impl), false);
        this.helper_internal_.registerHandler(1012298943, WebClient_NotifyPanelStateChange_ParamsSpec.$, null, impl.notifyPanelStateChange.bind(impl), false);
        this.helper_internal_.registerHandler(746055399, WebClient_NotifyPanelActiveChange_ParamsSpec.$, null, impl.notifyPanelActiveChange.bind(impl), false);
        this.helper_internal_.registerHandler(1825214786, WebClient_NotifyPanelCanAttachChange_ParamsSpec.$, null, impl.notifyPanelCanAttachChange.bind(impl), false);
        this.helper_internal_.registerHandler(1479136630, WebClient_NotifyMicrophonePermissionStateChanged_ParamsSpec.$, null, impl.notifyMicrophonePermissionStateChanged.bind(impl), false);
        this.helper_internal_.registerHandler(244098747, WebClient_NotifyFileUploadStateChanged_ParamsSpec.$, null, impl.notifyFileUploadStateChanged.bind(impl), false);
        this.helper_internal_.registerHandler(1430965533, WebClient_StopMicrophone_ParamsSpec.$, WebClient_StopMicrophone_ResponseParamsSpec.$, impl.stopMicrophone.bind(impl), false);
        this.helper_internal_.registerHandler(56992579, WebClient_NotifyLocationPermissionStateChanged_ParamsSpec.$, null, impl.notifyLocationPermissionStateChanged.bind(impl), false);
        this.helper_internal_.registerHandler(1309328746, WebClient_NotifyTabContextPermissionStateChanged_ParamsSpec.$, null, impl.notifyTabContextPermissionStateChanged.bind(impl), false);
        this.helper_internal_.registerHandler(2059846141, WebClient_NotifyOsLocationPermissionStateChanged_ParamsSpec.$, null, impl.notifyOsLocationPermissionStateChanged.bind(impl), false);
        this.helper_internal_.registerHandler(1488950295, WebClient_NotifyFocusedTabChanged_ParamsSpec.$, null, impl.notifyFocusedTabChanged.bind(impl), false);
        this.helper_internal_.registerHandler(239957995, WebClient_NotifyManualResizeChanged_ParamsSpec.$, null, impl.notifyManualResizeChanged.bind(impl), false);
        this.helper_internal_.registerHandler(963534021, WebClient_NotifyOsHotkeyStateChanged_ParamsSpec.$, null, impl.notifyOsHotkeyStateChanged.bind(impl), false);
        this.helper_internal_.registerHandler(1949367966, WebClient_NotifyBrowserIsOpenChanged_ParamsSpec.$, null, impl.notifyBrowserIsOpenChanged.bind(impl), false);
        this.helper_internal_.registerHandler(1838114987, WebClient_NotifyZoomLevelChanged_ParamsSpec.$, null, impl.notifyZoomLevelChanged.bind(impl), false);
        this.helper_internal_.registerHandler(1707000017, WebClient_NotifyInstanceActivationChanged_ParamsSpec.$, null, impl.notifyInstanceActivationChanged.bind(impl), false);
        this.helper_internal_.registerHandler(1654202187, WebClient_NotifyClosedCaptioningSettingChanged_ParamsSpec.$, null, impl.notifyClosedCaptioningSettingChanged.bind(impl), false);
        this.helper_internal_.registerHandler(409750188, WebClient_NotifyPinnedTabsChanged_ParamsSpec.$, null, impl.notifyPinnedTabsChanged.bind(impl), false);
        this.helper_internal_.registerHandler(316158918, WebClient_NotifyPinnedTabDataChanged_ParamsSpec.$, null, impl.notifyPinnedTabDataChanged.bind(impl), false);
        this.helper_internal_.registerHandler(947281480, WebClient_NotifyPageMetadataChanged_ParamsSpec.$, null, impl.notifyPageMetadataChanged.bind(impl), false);
        this.helper_internal_.registerHandler(744298244, WebClient_NotifyDefaultTabContextPermissionStateChanged_ParamsSpec.$, null, impl.notifyDefaultTabContextPermissionStateChanged.bind(impl), false);
        this.helper_internal_.registerHandler(769259696, WebClient_NotifyAdditionalContext_ParamsSpec.$, null, impl.notifyAdditionalContext.bind(impl), false);
        this.helper_internal_.registerHandler(1671214775, WebClient_NotifyActuationOnWebSettingChanged_ParamsSpec.$, null, impl.notifyActuationOnWebSettingChanged.bind(impl), false);
        this.helper_internal_.registerHandler(2057603770, WebClient_NotifyActOnWebCapabilityChanged_ParamsSpec.$, null, impl.notifyActOnWebCapabilityChanged.bind(impl), false);
        this.helper_internal_.registerHandler(674868712, WebClient_NotifyOnboardingCompletedChanged_ParamsSpec.$, null, impl.notifyOnboardingCompletedChanged.bind(impl), false);
        this.helper_internal_.registerHandler(2030425032, WebClient_NotifyGeminiEnterpriseSettingsChanged_ParamsSpec.$, null, impl.notifyGeminiEnterpriseSettingsChanged.bind(impl), false);
        this.helper_internal_.registerHandler(1012760147, WebClient_NotifyActorTaskListRowClicked_ParamsSpec.$, null, impl.notifyActorTaskListRowClicked.bind(impl), false);
        this.helper_internal_.registerHandler(1583692415, WebClient_Invoke_ParamsSpec.$, WebClient_Invoke_ResponseParamsSpec.$, impl.invoke.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the WebClient
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class WebClientCallbackRouter {
    helper_internal_;
    $;
    router_;
    checkResponsive;
    notifyPanelWillOpen;
    notifyPanelWasClosed;
    notifyPanelStateChange;
    notifyPanelActiveChange;
    notifyPanelCanAttachChange;
    notifyMicrophonePermissionStateChanged;
    notifyFileUploadStateChanged;
    stopMicrophone;
    notifyLocationPermissionStateChanged;
    notifyTabContextPermissionStateChanged;
    notifyOsLocationPermissionStateChanged;
    notifyFocusedTabChanged;
    notifyManualResizeChanged;
    notifyOsHotkeyStateChanged;
    notifyBrowserIsOpenChanged;
    notifyZoomLevelChanged;
    notifyInstanceActivationChanged;
    notifyClosedCaptioningSettingChanged;
    notifyPinnedTabsChanged;
    notifyPinnedTabDataChanged;
    notifyPageMetadataChanged;
    notifyDefaultTabContextPermissionStateChanged;
    notifyAdditionalContext;
    notifyActuationOnWebSettingChanged;
    notifyActOnWebCapabilityChanged;
    notifyOnboardingCompletedChanged;
    notifyGeminiEnterpriseSettingsChanged;
    notifyActorTaskListRowClicked;
    invoke;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(WebClientRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.checkResponsive =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1114550869, WebClient_CheckResponsive_ParamsSpec.$, WebClient_CheckResponsive_ResponseParamsSpec.$, this.checkResponsive.createReceiverHandler(true /* expectsResponse */), false);
        this.notifyPanelWillOpen =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(318227721, WebClient_NotifyPanelWillOpen_ParamsSpec.$, WebClient_NotifyPanelWillOpen_ResponseParamsSpec.$, this.notifyPanelWillOpen.createReceiverHandler(true /* expectsResponse */), false);
        this.notifyPanelWasClosed =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(772726572, WebClient_NotifyPanelWasClosed_ParamsSpec.$, WebClient_NotifyPanelWasClosed_ResponseParamsSpec.$, this.notifyPanelWasClosed.createReceiverHandler(true /* expectsResponse */), false);
        this.notifyPanelStateChange =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1012298943, WebClient_NotifyPanelStateChange_ParamsSpec.$, null, this.notifyPanelStateChange.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyPanelActiveChange =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(746055399, WebClient_NotifyPanelActiveChange_ParamsSpec.$, null, this.notifyPanelActiveChange.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyPanelCanAttachChange =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1825214786, WebClient_NotifyPanelCanAttachChange_ParamsSpec.$, null, this.notifyPanelCanAttachChange.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyMicrophonePermissionStateChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1479136630, WebClient_NotifyMicrophonePermissionStateChanged_ParamsSpec.$, null, this.notifyMicrophonePermissionStateChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyFileUploadStateChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(244098747, WebClient_NotifyFileUploadStateChanged_ParamsSpec.$, null, this.notifyFileUploadStateChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.stopMicrophone =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1430965533, WebClient_StopMicrophone_ParamsSpec.$, WebClient_StopMicrophone_ResponseParamsSpec.$, this.stopMicrophone.createReceiverHandler(true /* expectsResponse */), false);
        this.notifyLocationPermissionStateChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(56992579, WebClient_NotifyLocationPermissionStateChanged_ParamsSpec.$, null, this.notifyLocationPermissionStateChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyTabContextPermissionStateChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1309328746, WebClient_NotifyTabContextPermissionStateChanged_ParamsSpec.$, null, this.notifyTabContextPermissionStateChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyOsLocationPermissionStateChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2059846141, WebClient_NotifyOsLocationPermissionStateChanged_ParamsSpec.$, null, this.notifyOsLocationPermissionStateChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyFocusedTabChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1488950295, WebClient_NotifyFocusedTabChanged_ParamsSpec.$, null, this.notifyFocusedTabChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyManualResizeChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(239957995, WebClient_NotifyManualResizeChanged_ParamsSpec.$, null, this.notifyManualResizeChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyOsHotkeyStateChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(963534021, WebClient_NotifyOsHotkeyStateChanged_ParamsSpec.$, null, this.notifyOsHotkeyStateChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyBrowserIsOpenChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1949367966, WebClient_NotifyBrowserIsOpenChanged_ParamsSpec.$, null, this.notifyBrowserIsOpenChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyZoomLevelChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1838114987, WebClient_NotifyZoomLevelChanged_ParamsSpec.$, null, this.notifyZoomLevelChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyInstanceActivationChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1707000017, WebClient_NotifyInstanceActivationChanged_ParamsSpec.$, null, this.notifyInstanceActivationChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyClosedCaptioningSettingChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1654202187, WebClient_NotifyClosedCaptioningSettingChanged_ParamsSpec.$, null, this.notifyClosedCaptioningSettingChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyPinnedTabsChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(409750188, WebClient_NotifyPinnedTabsChanged_ParamsSpec.$, null, this.notifyPinnedTabsChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyPinnedTabDataChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(316158918, WebClient_NotifyPinnedTabDataChanged_ParamsSpec.$, null, this.notifyPinnedTabDataChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyPageMetadataChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(947281480, WebClient_NotifyPageMetadataChanged_ParamsSpec.$, null, this.notifyPageMetadataChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyDefaultTabContextPermissionStateChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(744298244, WebClient_NotifyDefaultTabContextPermissionStateChanged_ParamsSpec.$, null, this.notifyDefaultTabContextPermissionStateChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyAdditionalContext =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(769259696, WebClient_NotifyAdditionalContext_ParamsSpec.$, null, this.notifyAdditionalContext.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyActuationOnWebSettingChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1671214775, WebClient_NotifyActuationOnWebSettingChanged_ParamsSpec.$, null, this.notifyActuationOnWebSettingChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyActOnWebCapabilityChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2057603770, WebClient_NotifyActOnWebCapabilityChanged_ParamsSpec.$, null, this.notifyActOnWebCapabilityChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyOnboardingCompletedChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(674868712, WebClient_NotifyOnboardingCompletedChanged_ParamsSpec.$, null, this.notifyOnboardingCompletedChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyGeminiEnterpriseSettingsChanged =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2030425032, WebClient_NotifyGeminiEnterpriseSettingsChanged_ParamsSpec.$, null, this.notifyGeminiEnterpriseSettingsChanged.createReceiverHandler(false /* expectsResponse */), false);
        this.notifyActorTaskListRowClicked =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1012760147, WebClient_NotifyActorTaskListRowClicked_ParamsSpec.$, null, this.notifyActorTaskListRowClicked.createReceiverHandler(false /* expectsResponse */), false);
        this.invoke =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1583692415, WebClient_Invoke_ParamsSpec.$, WebClient_Invoke_ResponseParamsSpec.$, this.invoke.createReceiverHandler(true /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
class CaptureRegionObserverPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle);
    }
    bindInBrowser(scope = 'context') {
        mojo.internal.interfaceSupport.bind(this.handle, 'glic.mojom.CaptureRegionObserver', scope);
    }
}
class CaptureRegionObserverRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy =
            new mojo.internal.interfaceSupport.InterfaceRemoteBase(CaptureRegionObserverPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter();
    }
    onUpdate(result, reason) {
        this.proxy.sendMessage(930807031, CaptureRegionObserver_OnUpdate_ParamsSpec.$, null, [
            result,
            reason
        ], false);
    }
}
/**
 * An object which receives request messages for the CaptureRegionObserver
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
class CaptureRegionObserverReceiver {
    helper_internal_;
    $;
    onConnectionError;
    constructor(impl) {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(CaptureRegionObserverRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.helper_internal_.registerHandler(930807031, CaptureRegionObserver_OnUpdate_ParamsSpec.$, null, impl.onUpdate.bind(impl), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
}
/**
 * An object which receives request messages for the CaptureRegionObserver
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
class CaptureRegionObserverCallbackRouter {
    helper_internal_;
    $;
    router_;
    onUpdate;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(CaptureRegionObserverRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.onUpdate =
            new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(930807031, CaptureRegionObserver_OnUpdate_ParamsSpec.$, null, this.onUpdate.createReceiverHandler(false /* expectsResponse */), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter();
    }
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id) {
        return this.router_.removeListener(id);
    }
}
const GeminiEnterpriseSettingsSpec = { $: {} };
const ZssConfigSpec = { $: {} };
const GetContextResultWithActionResultCodeSpec = { $: {} };
const UserProfileInfoSpec = { $: {} };
const SafeBrowsingVerdictSpec = { $: {} };
const CounterAbuseVerdictSpec = { $: {} };
const WebClientInitialStateSpec = { $: {} };
const ScreenshotCollectionOptionsSpec = { $: {} };
const TabContextOptionsSpec = { $: {} };
const GetPinCandidatesOptionsSpec = { $: {} };
const ScrollToParamsSpec = { $: {} };
const ScrollToTextSelectorSpec = { $: {} };
const ScrollToTextFragmentSelectorSpec = { $: {} };
const ScrollToNodeSelectorSpec = { $: {} };
const SuggestionContentSpec = { $: {} };
const SkillPreviewSpec = { $: {} };
const SkillSpec = { $: {} };
const CreateSkillRequestSpec = { $: {} };
const UpdateSkillRequestSpec = { $: {} };
const ZeroStateSuggestionsSpec = { $: {} };
const ZeroStateSuggestionsV2Spec = { $: {} };
const ZeroStateSuggestionsOptionsSpec = { $: {} };
const PinCandidateSpec = { $: {} };
const PinTabsOptionsSpec = { $: {} };
const UnpinTabsOptionsSpec = { $: {} };
const OpenPinnedTabPickerOptionsSpec = { $: {} };
const CreateActorTabOptionsSpec = { $: {} };
const CaptureRegionParamsSpec = { $: {} };
const ActivateTabOptionsSpec = { $: {} };
const CreateTabOptionsSpec = { $: {} };
const ConversationInfoSpec = { $: {} };
const PanelOpeningDataSpec = { $: {} };
const PanelStateSpec = { $: {} };
const SkillsPayloadSpec = { $: {} };
const UniversalCartPayloadSpec = { $: {} };
const InvokeOptionsSpec = { $: {} };
const OnResponseStoppedDetailsSpec = { $: {} };
const OpenPanelInfoSpec = { $: {} };
const ContextDataSpec = { $: {} };
const ParentConversationMetadataSpec = { $: {} };
const AdditionalContextSpec = { $: {} };
const ExperimentalTriggeringUpdateSpec = { $: {} };
const TabContextResultSpec = { $: {} };
const WebPageDataSpec = { $: {} };
const DocumentDataSpec = { $: {} };
const PdfDocumentDataSpec = { $: {} };
const TabDataSpec = { $: {} };
const NoFocusedTabDataSpec = { $: {} };
const AnnotatedPageDataSpec = { $: {} };
const ImageOriginAnnotationsSpec = { $: {} };
const JournalSpec = { $: {} };
const PendingCapturedRegionSpec = { $: {} };
const CaptureRegionResultSpec = { $: {} };
const ScreenshotSpec = { $: {} };
const ImageInfoSpec = { $: {} };
const ImageBytesResultSpec = { $: {} };
const OpenSettingsOptionsSpec = { $: {} };
const PinCandidatesObserver_OnPinCandidatesChanged_ParamsSpec = { $: {} };
const ActorClient_RequestToShowCredentialSelectionDialog_ParamsSpec = { $: {} };
const ActorClient_RequestToShowCredentialSelectionDialog_ResponseParamsSpec = { $: {} };
const ActorClient_RequestToShowAutofillSuggestionsDialog_ParamsSpec = { $: {} };
const ActorClient_RequestToShowAutofillSuggestionsDialog_ResponseParamsSpec = { $: {} };
const ActorClient_RequestToShowUserConfirmationDialog_ParamsSpec = { $: {} };
const ActorClient_RequestToShowUserConfirmationDialog_ResponseParamsSpec = { $: {} };
const ActorClient_RequestToConfirmNavigation_ParamsSpec = { $: {} };
const ActorClient_RequestToConfirmNavigation_ResponseParamsSpec = { $: {} };
const ActorClient_NotifyActorTaskStateChanged_ParamsSpec = { $: {} };
const ActorClient_RequestToShowGmailOtpOptInDialog_ParamsSpec = { $: {} };
const ActorClient_RequestToShowGmailOtpOptInDialog_ResponseParamsSpec = { $: {} };
const ActorClient_RequestToShowGmailOtpConfirmationDialog_ParamsSpec = { $: {} };
const ActorClient_RequestToShowGmailOtpConfirmationDialog_ResponseParamsSpec = { $: {} };
const ActorHandler_AutofillSuggestionDialogOnFormPresented_ParamsSpec = { $: {} };
const ActorHandler_AutofillSuggestionDialogOnFormPreviewChanged_ParamsSpec = { $: {} };
const ActorHandler_AutofillSuggestionDialogOnFormConfirmed_ParamsSpec = { $: {} };
const ActorHandler_GetContextForActorFromTab_ParamsSpec = { $: {} };
const ActorHandler_GetContextForActorFromTab_ResponseParamsSpec = { $: {} };
const ActorHandler_CreateTask_ParamsSpec = { $: {} };
const ActorHandler_CreateTask_ResponseParamsSpec = { $: {} };
const ActorHandler_PerformActions_ParamsSpec = { $: {} };
const ActorHandler_PerformActions_ResponseParamsSpec = { $: {} };
const ActorHandler_CancelActions_ParamsSpec = { $: {} };
const ActorHandler_CancelActions_ResponseParamsSpec = { $: {} };
const ActorHandler_StopActorTask_ParamsSpec = { $: {} };
const ActorHandler_PauseActorTask_ParamsSpec = { $: {} };
const ActorHandler_ResumeActorTask_ParamsSpec = { $: {} };
const ActorHandler_ResumeActorTask_ResponseParamsSpec = { $: {} };
const ActorHandler_InterruptActorTask_ParamsSpec = { $: {} };
const ActorHandler_UninterruptActorTask_ParamsSpec = { $: {} };
const ActorHandler_UpdateActorTaskStepProgress_ParamsSpec = { $: {} };
const ActorHandler_CreateActorTab_ParamsSpec = { $: {} };
const ActorHandler_CreateActorTab_ResponseParamsSpec = { $: {} };
const ActorHandler_LogBeginAsyncEvent_ParamsSpec = { $: {} };
const ActorHandler_LogEndAsyncEvent_ParamsSpec = { $: {} };
const ActorHandler_LogInstantEvent_ParamsSpec = { $: {} };
const ActorHandler_JournalClear_ParamsSpec = { $: {} };
const ActorHandler_JournalSnapshot_ParamsSpec = { $: {} };
const ActorHandler_JournalSnapshot_ResponseParamsSpec = { $: {} };
const ActorHandler_JournalStart_ParamsSpec = { $: {} };
const ActorHandler_JournalStop_ParamsSpec = { $: {} };
const ActorHandler_JournalRecordFeedback_ParamsSpec = { $: {} };
const AnnotationHandler_ScrollTo_ParamsSpec = { $: {} };
const AnnotationHandler_ScrollTo_ResponseParamsSpec = { $: {} };
const AnnotationHandler_DropScrollToHighlight_ParamsSpec = { $: {} };
const SkillsHandler_CreateSkill_ParamsSpec = { $: {} };
const SkillsHandler_CreateSkill_ResponseParamsSpec = { $: {} };
const SkillsHandler_UpdateSkill_ParamsSpec = { $: {} };
const SkillsHandler_UpdateSkill_ResponseParamsSpec = { $: {} };
const SkillsHandler_ShowManageSkillsUi_ParamsSpec = { $: {} };
const SkillsHandler_ShowBrowseSkillsUi_ParamsSpec = { $: {} };
const SkillsHandler_GetSkill_ParamsSpec = { $: {} };
const SkillsHandler_GetSkill_ResponseParamsSpec = { $: {} };
const SkillsHandler_RecordSkillsWebClientEvent_ParamsSpec = { $: {} };
const SkillsClient_NotifySkillPreviewsChanged_ParamsSpec = { $: {} };
const SkillsClient_NotifyContextualSkillPreviewsChanged_ParamsSpec = { $: {} };
const SkillsClient_NotifySkillPreviewChanged_ParamsSpec = { $: {} };
const SkillsClient_NotifySkillDeleted_ParamsSpec = { $: {} };
const SkillsClient_NotifySkillsEnabledChanged_ParamsSpec = { $: {} };
const WebClientHandler_ReportApiRequestCount_ParamsSpec = { $: {} };
const WebClientHandler_ReportApiRequestLatency_ParamsSpec = { $: {} };
const WebClientHandler_RecordSparseValue_ParamsSpec = { $: {} };
const WebClientHandler_WebClientCreated_ParamsSpec = { $: {} };
const WebClientHandler_WebClientCreated_ResponseParamsSpec = { $: {} };
const WebClientHandler_WebClientInitialized_ParamsSpec = { $: {} };
const WebClientHandler_WebClientInitializeFailed_ParamsSpec = { $: {} };
const WebClientHandler_CreateActorHandler_ParamsSpec = { $: {} };
const WebClientHandler_CreateExperimentalTriggeringClient_ParamsSpec = { $: {} };
const WebClientHandler_CreateAnnotationHandler_ParamsSpec = { $: {} };
const WebClientHandler_CreateSkillsHandler_ParamsSpec = { $: {} };
const WebClientHandler_CreateZeroStateSuggestionsHandler_ParamsSpec = { $: {} };
const WebClientHandler_CreateAiOverlayTools_ParamsSpec = { $: {} };
const WebClientHandler_CreateTab_ParamsSpec = { $: {} };
const WebClientHandler_CreateTab_ResponseParamsSpec = { $: {} };
const WebClientHandler_ActivateTabWithUrl_ParamsSpec = { $: {} };
const WebClientHandler_ActivateTabWithUrl_ResponseParamsSpec = { $: {} };
const WebClientHandler_OpenLinkInPopup_ParamsSpec = { $: {} };
const WebClientHandler_OpenGlicSettingsPage_ParamsSpec = { $: {} };
const WebClientHandler_OpenPasswordManagerSettingsPage_ParamsSpec = { $: {} };
const WebClientHandler_OpenContactInfoSettingsPage_ParamsSpec = { $: {} };
const WebClientHandler_EnableDragResize_ParamsSpec = { $: {} };
const WebClientHandler_ClosePanel_ParamsSpec = { $: {} };
const WebClientHandler_ClosePanelAndShutdown_ParamsSpec = { $: {} };
const WebClientHandler_AttachPanel_ParamsSpec = { $: {} };
const WebClientHandler_DetachPanel_ParamsSpec = { $: {} };
const WebClientHandler_OnModeChange_ParamsSpec = { $: {} };
const WebClientHandler_OnMicrophoneStatusChange_ParamsSpec = { $: {} };
const WebClientHandler_ShowProfilePicker_ParamsSpec = { $: {} };
const WebClientHandler_GetModelQualityClientId_ParamsSpec = { $: {} };
const WebClientHandler_GetModelQualityClientId_ResponseParamsSpec = { $: {} };
const WebClientHandler_GetContextFromFocusedTab_ParamsSpec = { $: {} };
const WebClientHandler_GetContextFromFocusedTab_ResponseParamsSpec = { $: {} };
const WebClientHandler_GetContextFromTab_ParamsSpec = { $: {} };
const WebClientHandler_GetContextFromTab_ResponseParamsSpec = { $: {} };
const WebClientHandler_GetImageBytesFromTab_ParamsSpec = { $: {} };
const WebClientHandler_GetImageBytesFromTab_ResponseParamsSpec = { $: {} };
const WebClientHandler_SetMaximumNumberOfPinnedTabs_ParamsSpec = { $: {} };
const WebClientHandler_SetMaximumNumberOfPinnedTabs_ResponseParamsSpec = { $: {} };
const WebClientHandler_PinTabs_ParamsSpec = { $: {} };
const WebClientHandler_PinTabs_ResponseParamsSpec = { $: {} };
const WebClientHandler_UnpinTabs_ParamsSpec = { $: {} };
const WebClientHandler_UnpinTabs_ResponseParamsSpec = { $: {} };
const WebClientHandler_UnpinAllTabs_ParamsSpec = { $: {} };
const WebClientHandler_SubscribeToPinCandidates_ParamsSpec = { $: {} };
const WebClientHandler_OpenPinnedTabPicker_ParamsSpec = { $: {} };
const WebClientHandler_OpenPinnedTabPicker_ResponseParamsSpec = { $: {} };
const WebClientHandler_ActivateTab_ParamsSpec = { $: {} };
const WebClientHandler_ResizeWidget_ParamsSpec = { $: {} };
const WebClientHandler_ResizeWidget_ResponseParamsSpec = { $: {} };
const WebClientHandler_CaptureRegion_ParamsSpec = { $: {} };
const WebClientHandler_DeleteCapturedRegion_ParamsSpec = { $: {} };
const WebClientHandler_SetAudioDucking_ParamsSpec = { $: {} };
const WebClientHandler_SetAudioDucking_ResponseParamsSpec = { $: {} };
const WebClientHandler_SetMinimumPanelSize_ParamsSpec = { $: {} };
const WebClientHandler_SetMicrophonePermissionState_ParamsSpec = { $: {} };
const WebClientHandler_SetMicrophonePermissionState_ResponseParamsSpec = { $: {} };
const WebClientHandler_SetLocationPermissionState_ParamsSpec = { $: {} };
const WebClientHandler_SetLocationPermissionState_ResponseParamsSpec = { $: {} };
const WebClientHandler_SetTabContextPermissionState_ParamsSpec = { $: {} };
const WebClientHandler_SetTabContextPermissionState_ResponseParamsSpec = { $: {} };
const WebClientHandler_SetClosedCaptioningSetting_ParamsSpec = { $: {} };
const WebClientHandler_SetClosedCaptioningSetting_ResponseParamsSpec = { $: {} };
const WebClientHandler_SetActuationOnWebSetting_ParamsSpec = { $: {} };
const WebClientHandler_SetActuationOnWebSetting_ResponseParamsSpec = { $: {} };
const WebClientHandler_ShouldAllowMediaPermissionRequest_ParamsSpec = { $: {} };
const WebClientHandler_ShouldAllowMediaPermissionRequest_ResponseParamsSpec = { $: {} };
const WebClientHandler_ShouldAllowGeolocationPermissionRequest_ParamsSpec = { $: {} };
const WebClientHandler_ShouldAllowGeolocationPermissionRequest_ResponseParamsSpec = { $: {} };
const WebClientHandler_SetContextAccessIndicator_ParamsSpec = { $: {} };
const WebClientHandler_GetUserProfileInfo_ParamsSpec = { $: {} };
const WebClientHandler_GetUserProfileInfo_ResponseParamsSpec = { $: {} };
const WebClientHandler_SyncCookies_ParamsSpec = { $: {} };
const WebClientHandler_SyncCookies_ResponseParamsSpec = { $: {} };
const WebClientHandler_ClientErrorDialogStateChanged_ParamsSpec = { $: {} };
const WebClientHandler_ReportClientTransientError_ParamsSpec = { $: {} };
const WebClientHandler_ProcessCounterAbuseVerdict_ParamsSpec = { $: {} };
const WebClientHandler_OnOptinImpression_ParamsSpec = { $: {} };
const WebClientHandler_OnUserInputSubmitted_ParamsSpec = { $: {} };
const WebClientHandler_OnContextUploadStarted_ParamsSpec = { $: {} };
const WebClientHandler_OnContextUploadCompleted_ParamsSpec = { $: {} };
const WebClientHandler_OnReaction_ParamsSpec = { $: {} };
const WebClientHandler_OnResponseStarted_ParamsSpec = { $: {} };
const WebClientHandler_OnResponseStopped_ParamsSpec = { $: {} };
const WebClientHandler_OnSessionTerminated_ParamsSpec = { $: {} };
const WebClientHandler_OnTurnCompleted_ParamsSpec = { $: {} };
const WebClientHandler_OnResponseRated_ParamsSpec = { $: {} };
const WebClientHandler_OnClosedCaptionsShown_ParamsSpec = { $: {} };
const WebClientHandler_OnActionSubmitted_ParamsSpec = { $: {} };
const WebClientHandler_SetSyntheticExperimentState_ParamsSpec = { $: {} };
const WebClientHandler_OpenOsPermissionSettingsMenu_ParamsSpec = { $: {} };
const WebClientHandler_GetOsMicrophonePermissionStatus_ParamsSpec = { $: {} };
const WebClientHandler_GetOsMicrophonePermissionStatus_ResponseParamsSpec = { $: {} };
const WebClientHandler_GetZeroStateSuggestionsForFocusedTab_ParamsSpec = { $: {} };
const WebClientHandler_GetZeroStateSuggestionsForFocusedTab_ResponseParamsSpec = { $: {} };
const WebClientHandler_MaybeRefreshUserStatus_ParamsSpec = { $: {} };
const WebClientHandler_IsDebuggerAttached_ParamsSpec = { $: {} };
const WebClientHandler_IsDebuggerAttached_ResponseParamsSpec = { $: {} };
const WebClientHandler_SubscribeToPageMetadata_ParamsSpec = { $: {} };
const WebClientHandler_SubscribeToPageMetadata_ResponseParamsSpec = { $: {} };
const WebClientHandler_SwitchConversation_ParamsSpec = { $: {} };
const WebClientHandler_SwitchConversation_ResponseParamsSpec = { $: {} };
const WebClientHandler_RegisterConversation_ParamsSpec = { $: {} };
const WebClientHandler_RegisterConversation_ResponseParamsSpec = { $: {} };
const WebClientHandler_SetOnboardingCompleted_ParamsSpec = { $: {} };
const WebClientHandler_SubscribeToTabData_ParamsSpec = { $: {} };
const WebClientHandler_SubscribeToTabFavicon_ParamsSpec = { $: {} };
const WebClientHandler_CreateGeminiEnterpriseHandler_ParamsSpec = { $: {} };
const ZeroStateSuggestionsHandler_GetZeroStateSuggestionsAndSubscribe_ParamsSpec = { $: {} };
const ZeroStateSuggestionsHandler_GetZeroStateSuggestionsAndSubscribe_ResponseParamsSpec = { $: {} };
const ZeroStateSuggestionsClient_NotifyZeroStateSuggestionsChanged_ParamsSpec = { $: {} };
const TabDataHandler_OnTabDataChanged_ParamsSpec = { $: {} };
const TabFaviconHandler_OnTabFaviconChanged_ParamsSpec = { $: {} };
const ExperimentalTriggeringUpdatesHandler_OnUpdate_ParamsSpec = { $: {} };
const ExperimentalTriggeringClient_UploadEncryptedScreenshot_ParamsSpec = { $: {} };
const ExperimentalTriggeringClient_UploadEncryptedScreenshot_ResponseParamsSpec = { $: {} };
const ExperimentalTriggeringClient_GetExperimentalTriggeringUpdates_ParamsSpec = { $: {} };
const ExperimentalTriggeringClient_GetExperimentalTriggeringUpdates_ResponseParamsSpec = { $: {} };
const ExperimentalTriggeringClient_SubmitExperimentalTriggeringConfirmationResponse_ParamsSpec = { $: {} };
const ExperimentalTriggeringClient_SubmitExperimentalTriggeringConfirmationResponse_ResponseParamsSpec = { $: {} };
const WebClient_CheckResponsive_ParamsSpec = { $: {} };
const WebClient_CheckResponsive_ResponseParamsSpec = { $: {} };
const WebClient_NotifyPanelWillOpen_ParamsSpec = { $: {} };
const WebClient_NotifyPanelWillOpen_ResponseParamsSpec = { $: {} };
const WebClient_NotifyPanelWasClosed_ParamsSpec = { $: {} };
const WebClient_NotifyPanelWasClosed_ResponseParamsSpec = { $: {} };
const WebClient_NotifyPanelStateChange_ParamsSpec = { $: {} };
const WebClient_NotifyPanelActiveChange_ParamsSpec = { $: {} };
const WebClient_NotifyPanelCanAttachChange_ParamsSpec = { $: {} };
const WebClient_NotifyMicrophonePermissionStateChanged_ParamsSpec = { $: {} };
const WebClient_NotifyFileUploadStateChanged_ParamsSpec = { $: {} };
const WebClient_StopMicrophone_ParamsSpec = { $: {} };
const WebClient_StopMicrophone_ResponseParamsSpec = { $: {} };
const WebClient_NotifyLocationPermissionStateChanged_ParamsSpec = { $: {} };
const WebClient_NotifyTabContextPermissionStateChanged_ParamsSpec = { $: {} };
const WebClient_NotifyOsLocationPermissionStateChanged_ParamsSpec = { $: {} };
const WebClient_NotifyFocusedTabChanged_ParamsSpec = { $: {} };
const WebClient_NotifyManualResizeChanged_ParamsSpec = { $: {} };
const WebClient_NotifyOsHotkeyStateChanged_ParamsSpec = { $: {} };
const WebClient_NotifyBrowserIsOpenChanged_ParamsSpec = { $: {} };
const WebClient_NotifyZoomLevelChanged_ParamsSpec = { $: {} };
const WebClient_NotifyInstanceActivationChanged_ParamsSpec = { $: {} };
const WebClient_NotifyClosedCaptioningSettingChanged_ParamsSpec = { $: {} };
const WebClient_NotifyPinnedTabsChanged_ParamsSpec = { $: {} };
const WebClient_NotifyPinnedTabDataChanged_ParamsSpec = { $: {} };
const WebClient_NotifyPageMetadataChanged_ParamsSpec = { $: {} };
const WebClient_NotifyDefaultTabContextPermissionStateChanged_ParamsSpec = { $: {} };
const WebClient_NotifyAdditionalContext_ParamsSpec = { $: {} };
const WebClient_NotifyActuationOnWebSettingChanged_ParamsSpec = { $: {} };
const WebClient_NotifyActOnWebCapabilityChanged_ParamsSpec = { $: {} };
const WebClient_NotifyOnboardingCompletedChanged_ParamsSpec = { $: {} };
const WebClient_NotifyGeminiEnterpriseSettingsChanged_ParamsSpec = { $: {} };
const WebClient_NotifyActorTaskListRowClicked_ParamsSpec = { $: {} };
const WebClient_Invoke_ParamsSpec = { $: {} };
const WebClient_Invoke_ResponseParamsSpec = { $: {} };
const CaptureRegionObserver_OnUpdate_ParamsSpec = { $: {} };
const GetContextResultSpec = { $: {} };
const ScrollToSelectorSpec = { $: {} };
const InvocationPayloadSpec = { $: {} };
const AdditionalContextPartSpec = { $: {} };
const FocusedTabDataSpec = { $: {} };
const CapturedRegionSpec = { $: {} };
const GetImageBytesResultSpec = { $: {} };
const ActorHandler_CreateTask_ResponseParam_ResultSpec = { $: {} };
const ActorHandler_PerformActions_ResponseParam_ResultSpec = { $: {} };
mojo.internal.Struct(GeminiEnterpriseSettingsSpec.$, 'GeminiEnterpriseSettings', [
    mojo.internal.StructField('projectId', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('appId', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('location', 16, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(ZssConfigSpec.$, 'ZssConfig', [
    mojo.internal.StructField('additionalContent', 0, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(GetContextResultWithActionResultCodeSpec.$, 'GetContextResultWithActionResultCode', [
    mojo.internal.StructField('getContextResult', 0, 0, GetContextResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('action_result_$flag', 16, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "action_result_$value",
        originalFieldName: "actionResult",
    }, undefined),
    mojo.internal.StructField('action_result_$value', 20, 0, mojo.internal.Int32, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "actionResult",
    }, undefined),
], [[0, 32],]);
mojo.internal.Struct(UserProfileInfoSpec.$, 'UserProfileInfo', [
    mojo.internal.StructField('avatarIcon', 0, 0, BitmapN32Spec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('displayName', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('givenName', 16, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('localProfileName', 24, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('email', 32, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('isManaged', 40, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('hasAvatarRing', 40, 1, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 56],]);
mojo.internal.Struct(SafeBrowsingVerdictSpec.$, 'SafeBrowsingVerdict', [
    mojo.internal.StructField('url', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('threatType', 8, 0, SbThreatTypeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('showInterstitial', 12, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(CounterAbuseVerdictSpec.$, 'CounterAbuseVerdict', [
    mojo.internal.StructField('sbVerdictResult', 0, 0, SafeBrowsingVerdictSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientInitialStateSpec.$, 'WebClientInitialState', [
    mojo.internal.StructField('panelState', 0, 0, PanelStateSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('focusedTabData', 8, 0, FocusedTabDataSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('microphonePermissionEnabled', 24, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('locationPermissionEnabled', 24, 1, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('tabContextPermissionEnabled', 24, 2, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('osLocationPermissionEnabled', 24, 3, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('zoomFactor', 32, 0, mojo.internal.Double, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('hotkey', 40, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('chromeVersion', 48, 0, VersionSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('platform', 28, 0, PlatformSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('formFactor', 56, 0, FormFactorSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('canAttach', 24, 4, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('panelIsActive', 24, 5, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('browserIsOpen', 24, 6, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('instanceIsActive', 24, 7, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableZeroStateSuggestions', 25, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableCachedGetUserProfileInfo', 25, 1, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableActInFocusedTab', 25, 2, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableScrollTo', 25, 3, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableDefaultTabContextSettingFeature', 25, 4, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('defaultTabContextSettingEnabled', 25, 5, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('closedCaptioningSettingEnabled', 25, 6, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableMaybeRefreshUserStatus', 25, 7, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableMultiTab', 26, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableGetContextActor', 26, 1, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('hostCapabilities', 64, 0, mojo.internal.Array(HostCapabilitySpec.$, false), null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableGetPageMetadata', 26, 2, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableCaptureRegion', 26, 3, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableWebActuationSettingFeature', 26, 4, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('actuationOnWebSettingEnabled', 26, 5, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('canActOnWeb', 26, 6, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableActivateTab', 26, 7, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableGetTabById', 27, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableOpenPasswordManagerSettingsPage', 27, 1, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableOpenContactInfoSettingsPage', 27, 2, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableTrustFirstOnboarding', 27, 3, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('onboardingCompleted', 27, 4, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableSkills', 27, 5, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableGetTabFaviconById', 27, 6, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableProcessCounterAbuseVerdict', 27, 7, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('geminiEnterpriseSettings', 72, 0, GeminiEnterpriseSettingsSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableGmailOtpOptIn', 60, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enableGmailOtpConfirmation', 60, 1, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('fileUploadPolicyState', 80, 0, FileUploadPolicyStateSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 96],]);
mojo.internal.Struct(ScreenshotCollectionOptionsSpec.$, 'ScreenshotCollectionOptions', [
    mojo.internal.StructField('maxWidth', 0, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('maxHeight', 4, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('screenshotImageFormat', 8, 0, ScreenshotImageFormatSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('screenshotCompressionQuality', 12, 0, ScreenshotCompressionQualitySpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(TabContextOptionsSpec.$, 'TabContextOptions', [
    mojo.internal.StructField('innerText', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('innerTextBytesLimit', 4, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('viewportScreenshot', 0, 1, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('annotatedPageContent', 0, 2, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('maxMetaTags', 8, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('pdfData', 0, 3, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('pdfSizeLimit', 12, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('annotatedPageContentMode', 16, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('screenshotCollectionOptions', 24, 0, ScreenshotCollectionOptionsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 40],]);
mojo.internal.Struct(GetPinCandidatesOptionsSpec.$, 'GetPinCandidatesOptions', [
    mojo.internal.StructField('maxCandidates', 0, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('query', 8, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ScrollToParamsSpec.$, 'ScrollToParams', [
    mojo.internal.StructField('selector', 0, 0, ScrollToSelectorSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('highlight', 16, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('documentId', 24, 0, UnguessableTokenSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('url', 32, 0, UrlSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 48],]);
mojo.internal.Struct(ScrollToTextSelectorSpec.$, 'ScrollToTextSelector', [
    mojo.internal.StructField('text', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('search_range_start_node_id_$flag', 8, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "search_range_start_node_id_$value",
        originalFieldName: "searchRangeStartNodeId",
    }, undefined),
    mojo.internal.StructField('search_range_start_node_id_$value', 12, 0, mojo.internal.Int32, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "searchRangeStartNodeId",
    }, undefined),
], [[0, 24],]);
mojo.internal.Struct(ScrollToTextFragmentSelectorSpec.$, 'ScrollToTextFragmentSelector', [
    mojo.internal.StructField('textStart', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('textEnd', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('search_range_start_node_id_$flag', 16, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "search_range_start_node_id_$value",
        originalFieldName: "searchRangeStartNodeId",
    }, undefined),
    mojo.internal.StructField('search_range_start_node_id_$value', 20, 0, mojo.internal.Int32, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "searchRangeStartNodeId",
    }, undefined),
], [[0, 32],]);
mojo.internal.Struct(ScrollToNodeSelectorSpec.$, 'ScrollToNodeSelector', [
    mojo.internal.StructField('nodeId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SuggestionContentSpec.$, 'SuggestionContent', [
    mojo.internal.StructField('suggestion', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SkillPreviewSpec.$, 'SkillPreview', [
    mojo.internal.StructField('id', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('name', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('icon', 16, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('source', 24, 0, SkillSourceSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('description', 32, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('curatedBy', 40, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('imageUrl', 48, 0, UrlSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('category', 56, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('creationTime', 64, 0, TimeSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('enabled', 28, 0, mojo.internal.Bool, true, false /* nullable */, 0, undefined, undefined),
], [[0, 80],]);
mojo.internal.Struct(SkillSpec.$, 'Skill', [
    mojo.internal.StructField('preview', 0, 0, SkillPreviewSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('prompt', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('sourceSkillId', 16, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(CreateSkillRequestSpec.$, 'CreateSkillRequest', [
    mojo.internal.StructField('id', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('name', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('icon', 16, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('source', 24, 0, SkillSourceSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('prompt', 32, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('description', 40, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 56],]);
mojo.internal.Struct(UpdateSkillRequestSpec.$, 'UpdateSkillRequest', [
    mojo.internal.StructField('id', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ZeroStateSuggestionsSpec.$, 'ZeroStateSuggestions', [
    mojo.internal.StructField('suggestions', 0, 0, mojo.internal.Array(SuggestionContentSpec.$, false), null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('tabId', 8, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('url', 16, 0, UrlSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(ZeroStateSuggestionsV2Spec.$, 'ZeroStateSuggestionsV2', [
    mojo.internal.StructField('suggestions', 0, 0, mojo.internal.Array(SuggestionContentSpec.$, false), null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('isPending', 8, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('invocationSource', 12, 0, InvocationSourceSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ZeroStateSuggestionsOptionsSpec.$, 'ZeroStateSuggestionsOptions', [
    mojo.internal.StructField('isFirstRun', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('supportedTools', 8, 0, mojo.internal.Array(mojo.internal.String, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(PinCandidateSpec.$, 'PinCandidate', [
    mojo.internal.StructField('tabData', 0, 0, TabDataSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(PinTabsOptionsSpec.$, 'PinTabsOptions', [
    mojo.internal.StructField('pinTrigger', 0, 0, PinTriggerSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(UnpinTabsOptionsSpec.$, 'UnpinTabsOptions', [
    mojo.internal.StructField('unpinTrigger', 0, 0, UnpinTriggerSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(OpenPinnedTabPickerOptionsSpec.$, 'OpenPinnedTabPickerOptions', [], [[0, 8],]);
mojo.internal.Struct(CreateActorTabOptionsSpec.$, 'CreateActorTabOptions', [
    mojo.internal.StructField('initiator_tab_id_$flag', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "initiator_tab_id_$value",
        originalFieldName: "initiatorTabId",
    }, undefined),
    mojo.internal.StructField('initiator_tab_id_$value', 4, 0, mojo.internal.Int32, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "initiatorTabId",
    }, undefined),
    mojo.internal.StructField('initiator_window_id_$flag', 0, 1, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "initiator_window_id_$value",
        originalFieldName: "initiatorWindowId",
    }, undefined),
    mojo.internal.StructField('initiator_window_id_$value', 8, 0, mojo.internal.Int32, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "initiatorWindowId",
    }, undefined),
    mojo.internal.StructField('openInBackground', 0, 2, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(CaptureRegionParamsSpec.$, 'CaptureRegionParams', [
    mojo.internal.StructField('tabId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('options', 8, 0, TabContextOptionsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActivateTabOptionsSpec.$, 'ActivateTabOptions', [
    mojo.internal.StructField('pattern', 0, 0, mojo.internal.String, "", false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('fallback_window_id_$flag', 8, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "fallback_window_id_$value",
        originalFieldName: "fallbackWindowId",
    }, undefined),
    mojo.internal.StructField('fallback_window_id_$value', 12, 0, mojo.internal.Int32, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "fallbackWindowId",
    }, undefined),
], [[0, 24],]);
mojo.internal.Struct(CreateTabOptionsSpec.$, 'CreateTabOptions', [
    mojo.internal.StructField('openInBackground', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('window_id_$flag', 0, 1, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "window_id_$value",
        originalFieldName: "windowId",
    }, undefined),
    mojo.internal.StructField('window_id_$value', 4, 0, mojo.internal.Int32, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "windowId",
    }, undefined),
], [[0, 16],]);
mojo.internal.Struct(ConversationInfoSpec.$, 'ConversationInfo', [
    mojo.internal.StructField('conversationId', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('conversationTitle', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('clientData', 16, 0, ByteStringSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('turnId', 24, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
], [[0, 40],]);
mojo.internal.Struct(PanelOpeningDataSpec.$, 'PanelOpeningData', [
    mojo.internal.StructField('panelState', 0, 0, PanelStateSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('invocationSource', 8, 0, InvocationSourceSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('promptSuggestion', 16, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('autoSend', 12, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('skillToInvoke', 24, 0, SkillSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('recentlyActiveConversations', 32, 0, mojo.internal.Array(ConversationInfoSpec.$, false), null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('conversationInfo', 40, 0, ConversationInfoSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('freOverride', 48, 0, FreOverrideSpec.$, FreOverride$1.kUnspecified, false /* nullable */, 0, undefined, undefined),
], [[0, 64],]);
mojo.internal.Struct(PanelStateSpec.$, 'PanelState', [
    mojo.internal.StructField('kind', 0, 0, PanelStateKindSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('window_id_$flag', 4, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "window_id_$value",
        originalFieldName: "windowId",
    }, undefined),
    mojo.internal.StructField('window_id_$value', 8, 0, mojo.internal.Int32, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "windowId",
    }, undefined),
], [[0, 24],]);
mojo.internal.Struct(SkillsPayloadSpec.$, 'SkillsPayload', [
    mojo.internal.StructField('skillId', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('skillName', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('skillIcon', 16, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(UniversalCartPayloadSpec.$, 'UniversalCartPayload', [
    mojo.internal.StructField('serializedMetadata', 0, 0, mojo.internal.Array(mojo.internal.Uint8, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(InvokeOptionsSpec.$, 'InvokeOptions', [
    mojo.internal.StructField('invocationSource', 0, 0, InvocationSourceSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('prompts', 8, 0, mojo.internal.Array(mojo.internal.String, false), null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('context', 16, 0, AdditionalContextSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('autoSubmit', 4, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('featureMode', 24, 0, FeatureModeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('actuationTarget', 28, 0, ActuationTargetSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('disableZeroStateSuggestions', 4, 1, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('skillId', 32, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('zssConfig', 40, 0, ZssConfigSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('payload', 48, 0, InvocationPayloadSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('actuation_tab_id_$flag', 4, 2, mojo.internal.Bool, false, false /* nullable */, 1, {
        isPrimary: true,
        linkedValueFieldName: "actuation_tab_id_$value",
        originalFieldName: "actuationTabId",
    }, undefined),
    mojo.internal.StructField('actuation_tab_id_$value', 64, 0, mojo.internal.Int32, 0, false /* nullable */, 1, {
        isPrimary: false,
        originalFieldName: "actuationTabId",
    }, undefined),
], [[0, 72], [1, 80],]);
mojo.internal.Struct(OnResponseStoppedDetailsSpec.$, 'OnResponseStoppedDetails', [
    mojo.internal.StructField('cause', 0, 0, ResponseStopCauseSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(OpenPanelInfoSpec.$, 'OpenPanelInfo', [
    mojo.internal.StructField('webClientMode', 0, 0, WebClientModeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('panelSize', 8, 0, SizeSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('resizeDuration', 16, 0, TimeDeltaSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('canUserResize', 4, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(ContextDataSpec.$, 'ContextData', [
    mojo.internal.StructField('mimeType', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('data', 8, 0, BigBufferSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('filename', 24, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
], [[0, 40],]);
mojo.internal.Struct(ParentConversationMetadataSpec.$, 'ParentConversationMetadata', [
    mojo.internal.StructField('conversationId', 0, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('conversationTitle', 8, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AdditionalContextSpec.$, 'AdditionalContext', [
    mojo.internal.StructField('source', 0, 0, AdditionalContextSourceSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('name', 8, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('tab_id_$flag', 4, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "tab_id_$value",
        originalFieldName: "tabId",
    }, undefined),
    mojo.internal.StructField('tab_id_$value', 16, 0, mojo.internal.Int32, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "tabId",
    }, undefined),
    mojo.internal.StructField('origin', 24, 0, OriginSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('frameUrl', 32, 0, UrlSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('parts', 40, 0, mojo.internal.Array(AdditionalContextPartSpec.$, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 56],]);
mojo.internal.Struct(ExperimentalTriggeringUpdateSpec.$, 'ExperimentalTriggeringUpdate', [
    mojo.internal.StructField('type', 0, 0, ExperimentalTriggeringUpdateTypeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('data', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('metadata', 16, 0, mojo.internal.Map(mojo.internal.String, mojo.internal.String, false), null, true /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(TabContextResultSpec.$, 'TabContextResult', [
    mojo.internal.StructField('tabData', 0, 0, TabDataSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('webPageData', 8, 0, WebPageDataSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('viewportScreenshot', 16, 0, ScreenshotSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('screenshotInfo', 24, 0, ProtoWrapperSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('pdfDocumentData', 32, 0, PdfDocumentDataSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('annotatedPageData', 40, 0, AnnotatedPageDataSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 56],]);
mojo.internal.Struct(WebPageDataSpec.$, 'WebPageData', [
    mojo.internal.StructField('mainDocument', 0, 0, DocumentDataSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(DocumentDataSpec.$, 'DocumentData', [
    mojo.internal.StructField('origin', 0, 0, OriginSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('innerText', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('innerTextTruncated', 16, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(PdfDocumentDataSpec.$, 'PdfDocumentData', [
    mojo.internal.StructField('origin', 0, 0, OriginSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('pdfData', 8, 0, mojo.internal.Array(mojo.internal.Uint8, false), null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('pdfSizeLimitExceeded', 16, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(TabDataSpec.$, 'TabData', [
    mojo.internal.StructField('tabId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('windowId', 4, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('url', 8, 0, UrlSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('title', 16, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('favicon', 24, 0, BitmapN32Spec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('faviconUrl', 32, 0, UrlSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('documentMimeType', 40, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('is_observable_$flag', 48, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "is_observable_$value",
        originalFieldName: "isObservable",
    }, undefined),
    mojo.internal.StructField('is_observable_$value', 48, 1, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "isObservable",
    }, undefined),
    mojo.internal.StructField('is_media_active_$flag', 48, 2, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "is_media_active_$value",
        originalFieldName: "isMediaActive",
    }, undefined),
    mojo.internal.StructField('is_media_active_$value', 48, 3, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "isMediaActive",
    }, undefined),
    mojo.internal.StructField('is_tab_content_captured_$flag', 48, 4, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "is_tab_content_captured_$value",
        originalFieldName: "isTabContentCaptured",
    }, undefined),
    mojo.internal.StructField('is_tab_content_captured_$value', 48, 5, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "isTabContentCaptured",
    }, undefined),
    mojo.internal.StructField('is_active_in_window_$flag', 48, 6, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "is_active_in_window_$value",
        originalFieldName: "isActiveInWindow",
    }, undefined),
    mojo.internal.StructField('is_active_in_window_$value', 48, 7, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "isActiveInWindow",
    }, undefined),
    mojo.internal.StructField('is_window_active_$flag', 49, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "is_window_active_$value",
        originalFieldName: "isWindowActive",
    }, undefined),
    mojo.internal.StructField('is_window_active_$value', 49, 1, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "isWindowActive",
    }, undefined),
    mojo.internal.StructField('lightweightPageFeatures', 56, 0, mojo.internal.Array(LightweightPageFeatureSpec.$, false), null, true /* nullable */, 0, undefined, undefined),
], [[0, 72],]);
mojo.internal.Struct(NoFocusedTabDataSpec.$, 'NoFocusedTabData', [
    mojo.internal.StructField('activeTabData', 0, 0, TabDataSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('noFocusReason', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AnnotatedPageDataSpec.$, 'AnnotatedPageData', [
    mojo.internal.StructField('annotatedPageContent', 0, 0, ProtoWrapperSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('metadata', 8, 0, PageMetadataSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ImageOriginAnnotationsSpec.$, 'ImageOriginAnnotations', [], [[0, 8],]);
mojo.internal.Struct(JournalSpec.$, 'Journal', [
    mojo.internal.StructField('data', 0, 0, mojo.internal.Array(mojo.internal.Uint8, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(PendingCapturedRegionSpec.$, 'PendingCapturedRegion', [
    mojo.internal.StructField('id', 0, 0, UnguessableTokenSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('region', 8, 0, CapturedRegionSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(CaptureRegionResultSpec.$, 'CaptureRegionResult', [
    mojo.internal.StructField('tabId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('region', 8, 0, CapturedRegionSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(ScreenshotSpec.$, 'Screenshot', [
    mojo.internal.StructField('widthPixels', 0, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('heightPixels', 4, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('data', 8, 0, mojo.internal.Array(mojo.internal.Uint8, false), null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('mimeType', 16, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('originAnnotations', 24, 0, ImageOriginAnnotationsSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('encryptionScheme', 32, 0, ScreenshotEncryptionSchemeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 48],]);
mojo.internal.Struct(ImageInfoSpec.$, 'ImageInfo', [
    mojo.internal.StructField('caption', 0, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('sourceOrigin', 8, 0, OriginSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('url', 16, 0, UrlSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('mimeType', 24, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
], [[0, 40],]);
mojo.internal.Struct(ImageBytesResultSpec.$, 'ImageBytesResult', [
    mojo.internal.StructField('bytes', 0, 0, BigBufferSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('imageInfo', 16, 0, ImageInfoSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(OpenSettingsOptionsSpec.$, 'OpenSettingsOptions', [
    mojo.internal.StructField('highlightField', 0, 0, SettingsPageFieldSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(PinCandidatesObserver_OnPinCandidatesChanged_ParamsSpec.$, 'PinCandidatesObserver_OnPinCandidatesChanged_Params', [
    mojo.internal.StructField('candidates', 0, 0, mojo.internal.Array(PinCandidateSpec.$, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorClient_RequestToShowCredentialSelectionDialog_ParamsSpec.$, 'ActorClient_RequestToShowCredentialSelectionDialog_Params', [
    mojo.internal.StructField('request', 0, 0, SelectCredentialDialogRequestSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorClient_RequestToShowCredentialSelectionDialog_ResponseParamsSpec.$, 'ActorClient_RequestToShowCredentialSelectionDialog_ResponseParams', [
    mojo.internal.StructField('response', 0, 0, SelectCredentialDialogResponseSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorClient_RequestToShowAutofillSuggestionsDialog_ParamsSpec.$, 'ActorClient_RequestToShowAutofillSuggestionsDialog_Params', [
    mojo.internal.StructField('request', 0, 0, SelectAutofillSuggestionsDialogRequestSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorClient_RequestToShowAutofillSuggestionsDialog_ResponseParamsSpec.$, 'ActorClient_RequestToShowAutofillSuggestionsDialog_ResponseParams', [
    mojo.internal.StructField('response', 0, 0, SelectAutofillSuggestionsDialogResponseSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorClient_RequestToShowUserConfirmationDialog_ParamsSpec.$, 'ActorClient_RequestToShowUserConfirmationDialog_Params', [
    mojo.internal.StructField('request', 0, 0, UserConfirmationDialogRequestSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorClient_RequestToShowUserConfirmationDialog_ResponseParamsSpec.$, 'ActorClient_RequestToShowUserConfirmationDialog_ResponseParams', [
    mojo.internal.StructField('response', 0, 0, UserConfirmationDialogResponseSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorClient_RequestToConfirmNavigation_ParamsSpec.$, 'ActorClient_RequestToConfirmNavigation_Params', [
    mojo.internal.StructField('request', 0, 0, NavigationConfirmationRequestSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorClient_RequestToConfirmNavigation_ResponseParamsSpec.$, 'ActorClient_RequestToConfirmNavigation_ResponseParams', [
    mojo.internal.StructField('response', 0, 0, NavigationConfirmationResponseSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorClient_NotifyActorTaskStateChanged_ParamsSpec.$, 'ActorClient_NotifyActorTaskStateChanged_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('state', 4, 0, ActorTaskStateSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorClient_RequestToShowGmailOtpOptInDialog_ParamsSpec.$, 'ActorClient_RequestToShowGmailOtpOptInDialog_Params', [
    mojo.internal.StructField('request', 0, 0, GmailOtpOptInRequestSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorClient_RequestToShowGmailOtpOptInDialog_ResponseParamsSpec.$, 'ActorClient_RequestToShowGmailOtpOptInDialog_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, GmailOtpOptInResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorClient_RequestToShowGmailOtpConfirmationDialog_ParamsSpec.$, 'ActorClient_RequestToShowGmailOtpConfirmationDialog_Params', [
    mojo.internal.StructField('request', 0, 0, GmailOtpConfirmationRequestSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorClient_RequestToShowGmailOtpConfirmationDialog_ResponseParamsSpec.$, 'ActorClient_RequestToShowGmailOtpConfirmationDialog_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, GmailOtpConfirmationResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_AutofillSuggestionDialogOnFormPresented_ParamsSpec.$, 'ActorHandler_AutofillSuggestionDialogOnFormPresented_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('params', 8, 0, AutofillSuggestionDialogOnFormPresentedParamsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_AutofillSuggestionDialogOnFormPreviewChanged_ParamsSpec.$, 'ActorHandler_AutofillSuggestionDialogOnFormPreviewChanged_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('params', 8, 0, AutofillSuggestionDialogOnFormPreviewChangedParamsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_AutofillSuggestionDialogOnFormConfirmed_ParamsSpec.$, 'ActorHandler_AutofillSuggestionDialogOnFormConfirmed_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('params', 8, 0, AutofillSuggestionDialogOnFormConfirmedParamsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_GetContextForActorFromTab_ParamsSpec.$, 'ActorHandler_GetContextForActorFromTab_Params', [
    mojo.internal.StructField('tabId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('options', 8, 0, TabContextOptionsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_GetContextForActorFromTab_ResponseParamsSpec.$, 'ActorHandler_GetContextForActorFromTab_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, GetContextResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_CreateTask_ParamsSpec.$, 'ActorHandler_CreateTask_Params', [
    mojo.internal.StructField('taskOptions', 0, 0, TaskOptionsSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorHandler_CreateTask_ResponseParamsSpec.$, 'ActorHandler_CreateTask_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, ActorHandler_CreateTask_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_PerformActions_ParamsSpec.$, 'ActorHandler_PerformActions_Params', [
    mojo.internal.StructField('actionsProto', 0, 0, mojo.internal.Array(mojo.internal.Uint8, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorHandler_PerformActions_ResponseParamsSpec.$, 'ActorHandler_PerformActions_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, ActorHandler_PerformActions_ResponseParam_ResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_CancelActions_ParamsSpec.$, 'ActorHandler_CancelActions_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorHandler_CancelActions_ResponseParamsSpec.$, 'ActorHandler_CancelActions_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, CancelActionsResultSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorHandler_StopActorTask_ParamsSpec.$, 'ActorHandler_StopActorTask_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('stopReason', 4, 0, ActorTaskStopReasonSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorHandler_PauseActorTask_ParamsSpec.$, 'ActorHandler_PauseActorTask_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('pauseReason', 4, 0, ActorTaskPauseReasonSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('tab_id_$flag', 8, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "tab_id_$value",
        originalFieldName: "tabId",
    }, undefined),
    mojo.internal.StructField('tab_id_$value', 12, 0, mojo.internal.Int32, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "tabId",
    }, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_ResumeActorTask_ParamsSpec.$, 'ActorHandler_ResumeActorTask_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('contextOptions', 8, 0, TabContextOptionsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_ResumeActorTask_ResponseParamsSpec.$, 'ActorHandler_ResumeActorTask_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, GetContextResultWithActionResultCodeSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorHandler_InterruptActorTask_ParamsSpec.$, 'ActorHandler_InterruptActorTask_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('interrupt_reason_$flag', 4, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "interrupt_reason_$value",
        originalFieldName: "interruptReason",
    }, undefined),
    mojo.internal.StructField('interrupt_reason_$value', 8, 0, ActorTaskInterruptReasonSpec.$, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "interruptReason",
    }, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_UninterruptActorTask_ParamsSpec.$, 'ActorHandler_UninterruptActorTask_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorHandler_UpdateActorTaskStepProgress_ParamsSpec.$, 'ActorHandler_UpdateActorTaskStepProgress_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('stepProgress', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_CreateActorTab_ParamsSpec.$, 'ActorHandler_CreateActorTab_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('options', 8, 0, CreateActorTabOptionsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_CreateActorTab_ResponseParamsSpec.$, 'ActorHandler_CreateActorTab_ResponseParams', [
    mojo.internal.StructField('tabData', 0, 0, TabDataSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorHandler_LogBeginAsyncEvent_ParamsSpec.$, 'ActorHandler_LogBeginAsyncEvent_Params', [
    mojo.internal.StructField('eventAsyncId', 0, 0, mojo.internal.Uint64, BigInt(0), false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('taskId', 8, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('event', 16, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('details', 24, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 40],]);
mojo.internal.Struct(ActorHandler_LogEndAsyncEvent_ParamsSpec.$, 'ActorHandler_LogEndAsyncEvent_Params', [
    mojo.internal.StructField('eventAsyncId', 0, 0, mojo.internal.Uint64, BigInt(0), false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('details', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_LogInstantEvent_ParamsSpec.$, 'ActorHandler_LogInstantEvent_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('event', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('details', 16, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 32],]);
mojo.internal.Struct(ActorHandler_JournalClear_ParamsSpec.$, 'ActorHandler_JournalClear_Params', [], [[0, 8],]);
mojo.internal.Struct(ActorHandler_JournalSnapshot_ParamsSpec.$, 'ActorHandler_JournalSnapshot_Params', [
    mojo.internal.StructField('clearJournal', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorHandler_JournalSnapshot_ResponseParamsSpec.$, 'ActorHandler_JournalSnapshot_ResponseParams', [
    mojo.internal.StructField('journal', 0, 0, JournalSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ActorHandler_JournalStart_ParamsSpec.$, 'ActorHandler_JournalStart_Params', [
    mojo.internal.StructField('maxBytes', 0, 0, mojo.internal.Uint64, BigInt(0), false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('captureScreenshots', 8, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ActorHandler_JournalStop_ParamsSpec.$, 'ActorHandler_JournalStop_Params', [], [[0, 8],]);
mojo.internal.Struct(ActorHandler_JournalRecordFeedback_ParamsSpec.$, 'ActorHandler_JournalRecordFeedback_Params', [
    mojo.internal.StructField('positive', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('reason', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(AnnotationHandler_ScrollTo_ParamsSpec.$, 'AnnotationHandler_ScrollTo_Params', [
    mojo.internal.StructField('params', 0, 0, ScrollToParamsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(AnnotationHandler_ScrollTo_ResponseParamsSpec.$, 'AnnotationHandler_ScrollTo_ResponseParams', [
    mojo.internal.StructField('error_reason_$flag', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "error_reason_$value",
        originalFieldName: "errorReason",
    }, undefined),
    mojo.internal.StructField('error_reason_$value', 4, 0, ScrollToErrorReasonSpec.$, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "errorReason",
    }, undefined),
], [[0, 16],]);
mojo.internal.Struct(AnnotationHandler_DropScrollToHighlight_ParamsSpec.$, 'AnnotationHandler_DropScrollToHighlight_Params', [], [[0, 8],]);
mojo.internal.Struct(SkillsHandler_CreateSkill_ParamsSpec.$, 'SkillsHandler_CreateSkill_Params', [
    mojo.internal.StructField('request', 0, 0, CreateSkillRequestSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SkillsHandler_CreateSkill_ResponseParamsSpec.$, 'SkillsHandler_CreateSkill_ResponseParams', [
    mojo.internal.StructField('modalOpened', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SkillsHandler_UpdateSkill_ParamsSpec.$, 'SkillsHandler_UpdateSkill_Params', [
    mojo.internal.StructField('request', 0, 0, UpdateSkillRequestSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SkillsHandler_UpdateSkill_ResponseParamsSpec.$, 'SkillsHandler_UpdateSkill_ResponseParams', [
    mojo.internal.StructField('modalOpened', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SkillsHandler_ShowManageSkillsUi_ParamsSpec.$, 'SkillsHandler_ShowManageSkillsUi_Params', [], [[0, 8],]);
mojo.internal.Struct(SkillsHandler_ShowBrowseSkillsUi_ParamsSpec.$, 'SkillsHandler_ShowBrowseSkillsUi_Params', [], [[0, 8],]);
mojo.internal.Struct(SkillsHandler_GetSkill_ParamsSpec.$, 'SkillsHandler_GetSkill_Params', [
    mojo.internal.StructField('id', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SkillsHandler_GetSkill_ResponseParamsSpec.$, 'SkillsHandler_GetSkill_ResponseParams', [
    mojo.internal.StructField('skill', 0, 0, SkillSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SkillsHandler_RecordSkillsWebClientEvent_ParamsSpec.$, 'SkillsHandler_RecordSkillsWebClientEvent_Params', [
    mojo.internal.StructField('event', 0, 0, SkillsWebClientEventSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SkillsClient_NotifySkillPreviewsChanged_ParamsSpec.$, 'SkillsClient_NotifySkillPreviewsChanged_Params', [
    mojo.internal.StructField('skillPreviews', 0, 0, mojo.internal.Array(SkillPreviewSpec.$, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SkillsClient_NotifyContextualSkillPreviewsChanged_ParamsSpec.$, 'SkillsClient_NotifyContextualSkillPreviewsChanged_Params', [
    mojo.internal.StructField('skillPreviews', 0, 0, mojo.internal.Array(SkillPreviewSpec.$, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SkillsClient_NotifySkillPreviewChanged_ParamsSpec.$, 'SkillsClient_NotifySkillPreviewChanged_Params', [
    mojo.internal.StructField('skillPreview', 0, 0, SkillPreviewSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SkillsClient_NotifySkillDeleted_ParamsSpec.$, 'SkillsClient_NotifySkillDeleted_Params', [
    mojo.internal.StructField('skillId', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(SkillsClient_NotifySkillsEnabledChanged_ParamsSpec.$, 'SkillsClient_NotifySkillsEnabledChanged_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_ReportApiRequestCount_ParamsSpec.$, 'WebClientHandler_ReportApiRequestCount_Params', [
    mojo.internal.StructField('requestTypeId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('event', 4, 0, GlicRequestEventSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_ReportApiRequestLatency_ParamsSpec.$, 'WebClientHandler_ReportApiRequestLatency_Params', [
    mojo.internal.StructField('requestType', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('latency', 8, 0, TimeDeltaSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_RecordSparseValue_ParamsSpec.$, 'WebClientHandler_RecordSparseValue_Params', [
    mojo.internal.StructField('name', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('value', 8, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_WebClientCreated_ParamsSpec.$, 'WebClientHandler_WebClientCreated_Params', [
    mojo.internal.StructField('webClient', 0, 0, mojo.internal.InterfaceProxy(WebClientRemote), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_WebClientCreated_ResponseParamsSpec.$, 'WebClientHandler_WebClientCreated_ResponseParams', [
    mojo.internal.StructField('initialState', 0, 0, WebClientInitialStateSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_WebClientInitialized_ParamsSpec.$, 'WebClientHandler_WebClientInitialized_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_WebClientInitializeFailed_ParamsSpec.$, 'WebClientHandler_WebClientInitializeFailed_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_CreateActorHandler_ParamsSpec.$, 'WebClientHandler_CreateActorHandler_Params', [
    mojo.internal.StructField('receiver', 0, 0, mojo.internal.InterfaceRequest(ActorHandlerPendingReceiver), null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('client', 4, 0, mojo.internal.InterfaceProxy(ActorClientRemote), null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_CreateExperimentalTriggeringClient_ParamsSpec.$, 'WebClientHandler_CreateExperimentalTriggeringClient_Params', [
    mojo.internal.StructField('client', 0, 0, mojo.internal.InterfaceProxy(ExperimentalTriggeringClientRemote), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_CreateAnnotationHandler_ParamsSpec.$, 'WebClientHandler_CreateAnnotationHandler_Params', [
    mojo.internal.StructField('receiver', 0, 0, mojo.internal.InterfaceRequest(AnnotationHandlerPendingReceiver), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_CreateSkillsHandler_ParamsSpec.$, 'WebClientHandler_CreateSkillsHandler_Params', [
    mojo.internal.StructField('receiver', 0, 0, mojo.internal.InterfaceRequest(SkillsHandlerPendingReceiver), null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('client', 4, 0, mojo.internal.InterfaceProxy(SkillsClientRemote), null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_CreateZeroStateSuggestionsHandler_ParamsSpec.$, 'WebClientHandler_CreateZeroStateSuggestionsHandler_Params', [
    mojo.internal.StructField('receiver', 0, 0, mojo.internal.InterfaceRequest(ZeroStateSuggestionsHandlerPendingReceiver), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_CreateAiOverlayTools_ParamsSpec.$, 'WebClientHandler_CreateAiOverlayTools_Params', [
    mojo.internal.StructField('receiver', 0, 0, mojo.internal.InterfaceRequest(AiOverlayToolsPendingReceiver), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_CreateTab_ParamsSpec.$, 'WebClientHandler_CreateTab_Params', [
    mojo.internal.StructField('url', 0, 0, UrlSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('createOptions', 8, 0, CreateTabOptionsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_CreateTab_ResponseParamsSpec.$, 'WebClientHandler_CreateTab_ResponseParams', [
    mojo.internal.StructField('tabData', 0, 0, TabDataSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_ActivateTabWithUrl_ParamsSpec.$, 'WebClientHandler_ActivateTabWithUrl_Params', [
    mojo.internal.StructField('exactUrl', 0, 0, UrlSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('options', 8, 0, ActivateTabOptionsSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_ActivateTabWithUrl_ResponseParamsSpec.$, 'WebClientHandler_ActivateTabWithUrl_ResponseParams', [
    mojo.internal.StructField('tabData', 0, 0, TabDataSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_OpenLinkInPopup_ParamsSpec.$, 'WebClientHandler_OpenLinkInPopup_Params', [
    mojo.internal.StructField('url', 0, 0, UrlSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('popupWidth', 8, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('popupHeight', 12, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_OpenGlicSettingsPage_ParamsSpec.$, 'WebClientHandler_OpenGlicSettingsPage_Params', [
    mojo.internal.StructField('options', 0, 0, OpenSettingsOptionsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_OpenPasswordManagerSettingsPage_ParamsSpec.$, 'WebClientHandler_OpenPasswordManagerSettingsPage_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_OpenContactInfoSettingsPage_ParamsSpec.$, 'WebClientHandler_OpenContactInfoSettingsPage_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_EnableDragResize_ParamsSpec.$, 'WebClientHandler_EnableDragResize_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_ClosePanel_ParamsSpec.$, 'WebClientHandler_ClosePanel_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_ClosePanelAndShutdown_ParamsSpec.$, 'WebClientHandler_ClosePanelAndShutdown_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_AttachPanel_ParamsSpec.$, 'WebClientHandler_AttachPanel_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_DetachPanel_ParamsSpec.$, 'WebClientHandler_DetachPanel_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_OnModeChange_ParamsSpec.$, 'WebClientHandler_OnModeChange_Params', [
    mojo.internal.StructField('newMode', 0, 0, WebClientModeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_OnMicrophoneStatusChange_ParamsSpec.$, 'WebClientHandler_OnMicrophoneStatusChange_Params', [
    mojo.internal.StructField('status', 0, 0, MicrophoneStatusSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_ShowProfilePicker_ParamsSpec.$, 'WebClientHandler_ShowProfilePicker_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_GetModelQualityClientId_ParamsSpec.$, 'WebClientHandler_GetModelQualityClientId_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_GetModelQualityClientId_ResponseParamsSpec.$, 'WebClientHandler_GetModelQualityClientId_ResponseParams', [
    mojo.internal.StructField('modelQualityClientId', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_GetContextFromFocusedTab_ParamsSpec.$, 'WebClientHandler_GetContextFromFocusedTab_Params', [
    mojo.internal.StructField('options', 0, 0, TabContextOptionsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_GetContextFromFocusedTab_ResponseParamsSpec.$, 'WebClientHandler_GetContextFromFocusedTab_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, GetContextResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_GetContextFromTab_ParamsSpec.$, 'WebClientHandler_GetContextFromTab_Params', [
    mojo.internal.StructField('tabId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('options', 8, 0, TabContextOptionsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_GetContextFromTab_ResponseParamsSpec.$, 'WebClientHandler_GetContextFromTab_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, GetContextResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_GetImageBytesFromTab_ParamsSpec.$, 'WebClientHandler_GetImageBytesFromTab_Params', [
    mojo.internal.StructField('tabId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('documentId', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('domNodeId', 4, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_GetImageBytesFromTab_ResponseParamsSpec.$, 'WebClientHandler_GetImageBytesFromTab_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, GetImageBytesResultSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_SetMaximumNumberOfPinnedTabs_ParamsSpec.$, 'WebClientHandler_SetMaximumNumberOfPinnedTabs_Params', [
    mojo.internal.StructField('requestedMax', 0, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SetMaximumNumberOfPinnedTabs_ResponseParamsSpec.$, 'WebClientHandler_SetMaximumNumberOfPinnedTabs_ResponseParams', [
    mojo.internal.StructField('effectiveMax', 0, 0, mojo.internal.Uint32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_PinTabs_ParamsSpec.$, 'WebClientHandler_PinTabs_Params', [
    mojo.internal.StructField('tabIds', 0, 0, mojo.internal.Array(mojo.internal.Int32, false), null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('options', 8, 0, PinTabsOptionsSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_PinTabs_ResponseParamsSpec.$, 'WebClientHandler_PinTabs_ResponseParams', [
    mojo.internal.StructField('pinnedAll', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_UnpinTabs_ParamsSpec.$, 'WebClientHandler_UnpinTabs_Params', [
    mojo.internal.StructField('tabIds', 0, 0, mojo.internal.Array(mojo.internal.Int32, false), null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('options', 8, 0, UnpinTabsOptionsSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_UnpinTabs_ResponseParamsSpec.$, 'WebClientHandler_UnpinTabs_ResponseParams', [
    mojo.internal.StructField('unpinnedAll', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_UnpinAllTabs_ParamsSpec.$, 'WebClientHandler_UnpinAllTabs_Params', [
    mojo.internal.StructField('options', 0, 0, UnpinTabsOptionsSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SubscribeToPinCandidates_ParamsSpec.$, 'WebClientHandler_SubscribeToPinCandidates_Params', [
    mojo.internal.StructField('options', 0, 0, GetPinCandidatesOptionsSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('observer', 8, 0, mojo.internal.InterfaceProxy(PinCandidatesObserverRemote), null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_OpenPinnedTabPicker_ParamsSpec.$, 'WebClientHandler_OpenPinnedTabPicker_Params', [
    mojo.internal.StructField('options', 0, 0, OpenPinnedTabPickerOptionsSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_OpenPinnedTabPicker_ResponseParamsSpec.$, 'WebClientHandler_OpenPinnedTabPicker_ResponseParams', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_ActivateTab_ParamsSpec.$, 'WebClientHandler_ActivateTab_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_ResizeWidget_ParamsSpec.$, 'WebClientHandler_ResizeWidget_Params', [
    mojo.internal.StructField('size', 0, 0, SizeSpec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('duration', 8, 0, TimeDeltaSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_ResizeWidget_ResponseParamsSpec.$, 'WebClientHandler_ResizeWidget_ResponseParams', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_CaptureRegion_ParamsSpec.$, 'WebClientHandler_CaptureRegion_Params', [
    mojo.internal.StructField('observer', 0, 0, mojo.internal.InterfaceProxy(CaptureRegionObserverRemote), null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('params', 8, 0, CaptureRegionParamsSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_DeleteCapturedRegion_ParamsSpec.$, 'WebClientHandler_DeleteCapturedRegion_Params', [
    mojo.internal.StructField('tabId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('id', 8, 0, UnguessableTokenSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_SetAudioDucking_ParamsSpec.$, 'WebClientHandler_SetAudioDucking_Params', [
    mojo.internal.StructField('enable', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SetAudioDucking_ResponseParamsSpec.$, 'WebClientHandler_SetAudioDucking_ResponseParams', [
    mojo.internal.StructField('result', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SetMinimumPanelSize_ParamsSpec.$, 'WebClientHandler_SetMinimumPanelSize_Params', [
    mojo.internal.StructField('size', 0, 0, SizeSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SetMicrophonePermissionState_ParamsSpec.$, 'WebClientHandler_SetMicrophonePermissionState_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SetMicrophonePermissionState_ResponseParamsSpec.$, 'WebClientHandler_SetMicrophonePermissionState_ResponseParams', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_SetLocationPermissionState_ParamsSpec.$, 'WebClientHandler_SetLocationPermissionState_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SetLocationPermissionState_ResponseParamsSpec.$, 'WebClientHandler_SetLocationPermissionState_ResponseParams', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_SetTabContextPermissionState_ParamsSpec.$, 'WebClientHandler_SetTabContextPermissionState_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SetTabContextPermissionState_ResponseParamsSpec.$, 'WebClientHandler_SetTabContextPermissionState_ResponseParams', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_SetClosedCaptioningSetting_ParamsSpec.$, 'WebClientHandler_SetClosedCaptioningSetting_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SetClosedCaptioningSetting_ResponseParamsSpec.$, 'WebClientHandler_SetClosedCaptioningSetting_ResponseParams', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_SetActuationOnWebSetting_ParamsSpec.$, 'WebClientHandler_SetActuationOnWebSetting_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SetActuationOnWebSetting_ResponseParamsSpec.$, 'WebClientHandler_SetActuationOnWebSetting_ResponseParams', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_ShouldAllowMediaPermissionRequest_ParamsSpec.$, 'WebClientHandler_ShouldAllowMediaPermissionRequest_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_ShouldAllowMediaPermissionRequest_ResponseParamsSpec.$, 'WebClientHandler_ShouldAllowMediaPermissionRequest_ResponseParams', [
    mojo.internal.StructField('isAllowed', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_ShouldAllowGeolocationPermissionRequest_ParamsSpec.$, 'WebClientHandler_ShouldAllowGeolocationPermissionRequest_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_ShouldAllowGeolocationPermissionRequest_ResponseParamsSpec.$, 'WebClientHandler_ShouldAllowGeolocationPermissionRequest_ResponseParams', [
    mojo.internal.StructField('isAllowed', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SetContextAccessIndicator_ParamsSpec.$, 'WebClientHandler_SetContextAccessIndicator_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_GetUserProfileInfo_ParamsSpec.$, 'WebClientHandler_GetUserProfileInfo_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_GetUserProfileInfo_ResponseParamsSpec.$, 'WebClientHandler_GetUserProfileInfo_ResponseParams', [
    mojo.internal.StructField('profileInfo', 0, 0, UserProfileInfoSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SyncCookies_ParamsSpec.$, 'WebClientHandler_SyncCookies_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_SyncCookies_ResponseParamsSpec.$, 'WebClientHandler_SyncCookies_ResponseParams', [
    mojo.internal.StructField('success', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_ClientErrorDialogStateChanged_ParamsSpec.$, 'WebClientHandler_ClientErrorDialogStateChanged_Params', [
    mojo.internal.StructField('shown_dialog_type_$flag', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "shown_dialog_type_$value",
        originalFieldName: "shownDialogType",
    }, undefined),
    mojo.internal.StructField('shown_dialog_type_$value', 4, 0, ClientErrorDialogTypeSpec.$, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "shownDialogType",
    }, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_ReportClientTransientError_ParamsSpec.$, 'WebClientHandler_ReportClientTransientError_Params', [
    mojo.internal.StructField('statusCode', 0, 0, AbslStatusCodeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_ProcessCounterAbuseVerdict_ParamsSpec.$, 'WebClientHandler_ProcessCounterAbuseVerdict_Params', [
    mojo.internal.StructField('tabId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('verdict', 8, 0, CounterAbuseVerdictSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_OnOptinImpression_ParamsSpec.$, 'WebClientHandler_OnOptinImpression_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_OnUserInputSubmitted_ParamsSpec.$, 'WebClientHandler_OnUserInputSubmitted_Params', [
    mojo.internal.StructField('mode', 0, 0, WebClientModeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('promptType', 4, 0, PromptTypeSpec.$, 0, false /* nullable */, 1, undefined, undefined),
], [[0, 16], [1, 16],]);
mojo.internal.Struct(WebClientHandler_OnContextUploadStarted_ParamsSpec.$, 'WebClientHandler_OnContextUploadStarted_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_OnContextUploadCompleted_ParamsSpec.$, 'WebClientHandler_OnContextUploadCompleted_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_OnReaction_ParamsSpec.$, 'WebClientHandler_OnReaction_Params', [
    mojo.internal.StructField('reactionType', 0, 0, MetricUserInputReactionTypeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_OnResponseStarted_ParamsSpec.$, 'WebClientHandler_OnResponseStarted_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_OnResponseStopped_ParamsSpec.$, 'WebClientHandler_OnResponseStopped_Params', [
    mojo.internal.StructField('details', 0, 0, OnResponseStoppedDetailsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_OnSessionTerminated_ParamsSpec.$, 'WebClientHandler_OnSessionTerminated_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_OnTurnCompleted_ParamsSpec.$, 'WebClientHandler_OnTurnCompleted_Params', [
    mojo.internal.StructField('model', 0, 0, WebClientModelSpec.$, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('duration', 8, 0, TimeDeltaSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_OnResponseRated_ParamsSpec.$, 'WebClientHandler_OnResponseRated_Params', [
    mojo.internal.StructField('positive', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_OnClosedCaptionsShown_ParamsSpec.$, 'WebClientHandler_OnClosedCaptionsShown_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_OnActionSubmitted_ParamsSpec.$, 'WebClientHandler_OnActionSubmitted_Params', [
    mojo.internal.StructField('isRetry', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SetSyntheticExperimentState_ParamsSpec.$, 'WebClientHandler_SetSyntheticExperimentState_Params', [
    mojo.internal.StructField('trialName', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('groupName', 8, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_OpenOsPermissionSettingsMenu_ParamsSpec.$, 'WebClientHandler_OpenOsPermissionSettingsMenu_Params', [
    mojo.internal.StructField('type', 0, 0, ContentSettingsTypeSpec.$, -1, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_GetOsMicrophonePermissionStatus_ParamsSpec.$, 'WebClientHandler_GetOsMicrophonePermissionStatus_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_GetOsMicrophonePermissionStatus_ResponseParamsSpec.$, 'WebClientHandler_GetOsMicrophonePermissionStatus_ResponseParams', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_GetZeroStateSuggestionsForFocusedTab_ParamsSpec.$, 'WebClientHandler_GetZeroStateSuggestionsForFocusedTab_Params', [
    mojo.internal.StructField('is_first_run_$flag', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "is_first_run_$value",
        originalFieldName: "isFirstRun",
    }, undefined),
    mojo.internal.StructField('is_first_run_$value', 0, 1, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "isFirstRun",
    }, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_GetZeroStateSuggestionsForFocusedTab_ResponseParamsSpec.$, 'WebClientHandler_GetZeroStateSuggestionsForFocusedTab_ResponseParams', [
    mojo.internal.StructField('suggestions', 0, 0, ZeroStateSuggestionsSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_MaybeRefreshUserStatus_ParamsSpec.$, 'WebClientHandler_MaybeRefreshUserStatus_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_IsDebuggerAttached_ParamsSpec.$, 'WebClientHandler_IsDebuggerAttached_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_IsDebuggerAttached_ResponseParamsSpec.$, 'WebClientHandler_IsDebuggerAttached_ResponseParams', [
    mojo.internal.StructField('isAttachedToWebview', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SubscribeToPageMetadata_ParamsSpec.$, 'WebClientHandler_SubscribeToPageMetadata_Params', [
    mojo.internal.StructField('tabId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('names', 8, 0, mojo.internal.Array(mojo.internal.String, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_SubscribeToPageMetadata_ResponseParamsSpec.$, 'WebClientHandler_SubscribeToPageMetadata_ResponseParams', [
    mojo.internal.StructField('success', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SwitchConversation_ParamsSpec.$, 'WebClientHandler_SwitchConversation_Params', [
    mojo.internal.StructField('info', 0, 0, ConversationInfoSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SwitchConversation_ResponseParamsSpec.$, 'WebClientHandler_SwitchConversation_ResponseParams', [
    mojo.internal.StructField('error_reason_$flag', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "error_reason_$value",
        originalFieldName: "errorReason",
    }, undefined),
    mojo.internal.StructField('error_reason_$value', 4, 0, SwitchConversationErrorReasonSpec.$, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "errorReason",
    }, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_RegisterConversation_ParamsSpec.$, 'WebClientHandler_RegisterConversation_Params', [
    mojo.internal.StructField('info', 0, 0, ConversationInfoSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_RegisterConversation_ResponseParamsSpec.$, 'WebClientHandler_RegisterConversation_ResponseParams', [
    mojo.internal.StructField('error_reason_$flag', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "error_reason_$value",
        originalFieldName: "errorReason",
    }, undefined),
    mojo.internal.StructField('error_reason_$value', 4, 0, RegisterConversationErrorReasonSpec.$, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "errorReason",
    }, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClientHandler_SetOnboardingCompleted_ParamsSpec.$, 'WebClientHandler_SetOnboardingCompleted_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClientHandler_SubscribeToTabData_ParamsSpec.$, 'WebClientHandler_SubscribeToTabData_Params', [
    mojo.internal.StructField('tabId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('receiver', 4, 0, mojo.internal.InterfaceProxy(TabDataHandlerRemote), null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_SubscribeToTabFavicon_ParamsSpec.$, 'WebClientHandler_SubscribeToTabFavicon_Params', [
    mojo.internal.StructField('tabId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('receiver', 4, 0, mojo.internal.InterfaceProxy(TabFaviconHandlerRemote), null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClientHandler_CreateGeminiEnterpriseHandler_ParamsSpec.$, 'WebClientHandler_CreateGeminiEnterpriseHandler_Params', [
    mojo.internal.StructField('receiver', 0, 0, mojo.internal.InterfaceRequest(GeminiEnterpriseHandlerPendingReceiver), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ZeroStateSuggestionsHandler_GetZeroStateSuggestionsAndSubscribe_ParamsSpec.$, 'ZeroStateSuggestionsHandler_GetZeroStateSuggestionsAndSubscribe_Params', [
    mojo.internal.StructField('client', 0, 0, mojo.internal.InterfaceProxy(ZeroStateSuggestionsClientRemote), null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('options', 8, 0, ZeroStateSuggestionsOptionsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ZeroStateSuggestionsHandler_GetZeroStateSuggestionsAndSubscribe_ResponseParamsSpec.$, 'ZeroStateSuggestionsHandler_GetZeroStateSuggestionsAndSubscribe_ResponseParams', [
    mojo.internal.StructField('zeroStateSuggestions', 0, 0, ZeroStateSuggestionsV2Spec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ZeroStateSuggestionsClient_NotifyZeroStateSuggestionsChanged_ParamsSpec.$, 'ZeroStateSuggestionsClient_NotifyZeroStateSuggestionsChanged_Params', [
    mojo.internal.StructField('suggestions', 0, 0, ZeroStateSuggestionsV2Spec.$, null, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('options', 8, 0, ZeroStateSuggestionsOptionsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(TabDataHandler_OnTabDataChanged_ParamsSpec.$, 'TabDataHandler_OnTabDataChanged_Params', [
    mojo.internal.StructField('tabData', 0, 0, TabDataSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(TabFaviconHandler_OnTabFaviconChanged_ParamsSpec.$, 'TabFaviconHandler_OnTabFaviconChanged_Params', [
    mojo.internal.StructField('favicon', 0, 0, BitmapN32Spec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ExperimentalTriggeringUpdatesHandler_OnUpdate_ParamsSpec.$, 'ExperimentalTriggeringUpdatesHandler_OnUpdate_Params', [
    mojo.internal.StructField('update', 0, 0, ExperimentalTriggeringUpdateSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('observation', 8, 0, SubscriberObservationTypeSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(ExperimentalTriggeringClient_UploadEncryptedScreenshot_ParamsSpec.$, 'ExperimentalTriggeringClient_UploadEncryptedScreenshot_Params', [
    mojo.internal.StructField('screenshot', 0, 0, ScreenshotSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ExperimentalTriggeringClient_UploadEncryptedScreenshot_ResponseParamsSpec.$, 'ExperimentalTriggeringClient_UploadEncryptedScreenshot_ResponseParams', [
    mojo.internal.StructField('fileToken', 0, 0, mojo.internal.String, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ExperimentalTriggeringClient_GetExperimentalTriggeringUpdates_ParamsSpec.$, 'ExperimentalTriggeringClient_GetExperimentalTriggeringUpdates_Params', [
    mojo.internal.StructField('handler', 0, 0, mojo.internal.InterfaceProxy(ExperimentalTriggeringUpdatesHandlerRemote), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ExperimentalTriggeringClient_GetExperimentalTriggeringUpdates_ResponseParamsSpec.$, 'ExperimentalTriggeringClient_GetExperimentalTriggeringUpdates_ResponseParams', [
    mojo.internal.StructField('success', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ExperimentalTriggeringClient_SubmitExperimentalTriggeringConfirmationResponse_ParamsSpec.$, 'ExperimentalTriggeringClient_SubmitExperimentalTriggeringConfirmationResponse_Params', [
    mojo.internal.StructField('response', 0, 0, mojo.internal.Array(mojo.internal.Uint8, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(ExperimentalTriggeringClient_SubmitExperimentalTriggeringConfirmationResponse_ResponseParamsSpec.$, 'ExperimentalTriggeringClient_SubmitExperimentalTriggeringConfirmationResponse_ResponseParams', [
    mojo.internal.StructField('accepted', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_CheckResponsive_ParamsSpec.$, 'WebClient_CheckResponsive_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClient_CheckResponsive_ResponseParamsSpec.$, 'WebClient_CheckResponsive_ResponseParams', [], [[0, 8],]);
mojo.internal.Struct(WebClient_NotifyPanelWillOpen_ParamsSpec.$, 'WebClient_NotifyPanelWillOpen_Params', [
    mojo.internal.StructField('panelOpeningData', 0, 0, PanelOpeningDataSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyPanelWillOpen_ResponseParamsSpec.$, 'WebClient_NotifyPanelWillOpen_ResponseParams', [
    mojo.internal.StructField('openPanelInfo', 0, 0, OpenPanelInfoSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyPanelWasClosed_ParamsSpec.$, 'WebClient_NotifyPanelWasClosed_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClient_NotifyPanelWasClosed_ResponseParamsSpec.$, 'WebClient_NotifyPanelWasClosed_ResponseParams', [], [[0, 8],]);
mojo.internal.Struct(WebClient_NotifyPanelStateChange_ParamsSpec.$, 'WebClient_NotifyPanelStateChange_Params', [
    mojo.internal.StructField('panelState', 0, 0, PanelStateSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyPanelActiveChange_ParamsSpec.$, 'WebClient_NotifyPanelActiveChange_Params', [
    mojo.internal.StructField('panelActive', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyPanelCanAttachChange_ParamsSpec.$, 'WebClient_NotifyPanelCanAttachChange_Params', [
    mojo.internal.StructField('canAttach', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyMicrophonePermissionStateChanged_ParamsSpec.$, 'WebClient_NotifyMicrophonePermissionStateChanged_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyFileUploadStateChanged_ParamsSpec.$, 'WebClient_NotifyFileUploadStateChanged_Params', [
    mojo.internal.StructField('state', 0, 0, FileUploadPolicyStateSpec.$, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_StopMicrophone_ParamsSpec.$, 'WebClient_StopMicrophone_Params', [], [[0, 8],]);
mojo.internal.Struct(WebClient_StopMicrophone_ResponseParamsSpec.$, 'WebClient_StopMicrophone_ResponseParams', [], [[0, 8],]);
mojo.internal.Struct(WebClient_NotifyLocationPermissionStateChanged_ParamsSpec.$, 'WebClient_NotifyLocationPermissionStateChanged_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyTabContextPermissionStateChanged_ParamsSpec.$, 'WebClient_NotifyTabContextPermissionStateChanged_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyOsLocationPermissionStateChanged_ParamsSpec.$, 'WebClient_NotifyOsLocationPermissionStateChanged_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyFocusedTabChanged_ParamsSpec.$, 'WebClient_NotifyFocusedTabChanged_Params', [
    mojo.internal.StructField('focusedTabData', 0, 0, FocusedTabDataSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClient_NotifyManualResizeChanged_ParamsSpec.$, 'WebClient_NotifyManualResizeChanged_Params', [
    mojo.internal.StructField('resizing', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyOsHotkeyStateChanged_ParamsSpec.$, 'WebClient_NotifyOsHotkeyStateChanged_Params', [
    mojo.internal.StructField('hotkey', 0, 0, mojo.internal.String, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyBrowserIsOpenChanged_ParamsSpec.$, 'WebClient_NotifyBrowserIsOpenChanged_Params', [
    mojo.internal.StructField('browserIsOpen', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyZoomLevelChanged_ParamsSpec.$, 'WebClient_NotifyZoomLevelChanged_Params', [
    mojo.internal.StructField('zoomFactor', 0, 0, mojo.internal.Double, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyInstanceActivationChanged_ParamsSpec.$, 'WebClient_NotifyInstanceActivationChanged_Params', [
    mojo.internal.StructField('instanceActive', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyClosedCaptioningSettingChanged_ParamsSpec.$, 'WebClient_NotifyClosedCaptioningSettingChanged_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyPinnedTabsChanged_ParamsSpec.$, 'WebClient_NotifyPinnedTabsChanged_Params', [
    mojo.internal.StructField('tabData', 0, 0, mojo.internal.Array(TabDataSpec.$, false), null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyPinnedTabDataChanged_ParamsSpec.$, 'WebClient_NotifyPinnedTabDataChanged_Params', [
    mojo.internal.StructField('tabData', 0, 0, TabDataSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyPageMetadataChanged_ParamsSpec.$, 'WebClient_NotifyPageMetadataChanged_Params', [
    mojo.internal.StructField('tabId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('metadata', 8, 0, PageMetadataSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 24],]);
mojo.internal.Struct(WebClient_NotifyDefaultTabContextPermissionStateChanged_ParamsSpec.$, 'WebClient_NotifyDefaultTabContextPermissionStateChanged_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyAdditionalContext_ParamsSpec.$, 'WebClient_NotifyAdditionalContext_Params', [
    mojo.internal.StructField('context', 0, 0, AdditionalContextSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyActuationOnWebSettingChanged_ParamsSpec.$, 'WebClient_NotifyActuationOnWebSettingChanged_Params', [
    mojo.internal.StructField('enabled', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyActOnWebCapabilityChanged_ParamsSpec.$, 'WebClient_NotifyActOnWebCapabilityChanged_Params', [
    mojo.internal.StructField('canActOnWeb', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyOnboardingCompletedChanged_ParamsSpec.$, 'WebClient_NotifyOnboardingCompletedChanged_Params', [
    mojo.internal.StructField('completed', 0, 0, mojo.internal.Bool, false, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyGeminiEnterpriseSettingsChanged_ParamsSpec.$, 'WebClient_NotifyGeminiEnterpriseSettingsChanged_Params', [
    mojo.internal.StructField('settings', 0, 0, GeminiEnterpriseSettingsSpec.$, null, true /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_NotifyActorTaskListRowClicked_ParamsSpec.$, 'WebClient_NotifyActorTaskListRowClicked_Params', [
    mojo.internal.StructField('taskId', 0, 0, mojo.internal.Int32, 0, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_Invoke_ParamsSpec.$, 'WebClient_Invoke_Params', [
    mojo.internal.StructField('options', 0, 0, InvokeOptionsSpec.$, null, false /* nullable */, 0, undefined, undefined),
], [[0, 16],]);
mojo.internal.Struct(WebClient_Invoke_ResponseParamsSpec.$, 'WebClient_Invoke_ResponseParams', [], [[0, 8],]);
mojo.internal.Struct(CaptureRegionObserver_OnUpdate_ParamsSpec.$, 'CaptureRegionObserver_OnUpdate_Params', [
    mojo.internal.StructField('result', 0, 0, CaptureRegionResultSpec.$, null, true /* nullable */, 0, undefined, undefined),
    mojo.internal.StructField('reason_$flag', 8, 0, mojo.internal.Bool, false, false /* nullable */, 0, {
        isPrimary: true,
        linkedValueFieldName: "reason_$value",
        originalFieldName: "reason",
    }, undefined),
    mojo.internal.StructField('reason_$value', 12, 0, CaptureRegionErrorReasonSpec.$, 0, false /* nullable */, 0, {
        isPrimary: false,
        originalFieldName: "reason",
    }, undefined),
], [[0, 24],]);
mojo.internal.Union(GetContextResultSpec.$, 'GetContextResult', {
    'errorReason': {
        'ordinal': 0,
        'type': mojo.internal.String,
    },
    'tabContext': {
        'ordinal': 1,
        'type': TabContextResultSpec.$,
    },
});
var GetContextResultFieldTags;
(function (GetContextResultFieldTags) {
    GetContextResultFieldTags[GetContextResultFieldTags["ERROR_REASON"] = 0] = "ERROR_REASON";
    GetContextResultFieldTags[GetContextResultFieldTags["TAB_CONTEXT"] = 1] = "TAB_CONTEXT";
})(GetContextResultFieldTags || (GetContextResultFieldTags = {}));
mojo.internal.Union(ScrollToSelectorSpec.$, 'ScrollToSelector', {
    'exactText': {
        'ordinal': 0,
        'type': ScrollToTextSelectorSpec.$,
    },
    'textFragment': {
        'ordinal': 1,
        'type': ScrollToTextFragmentSelectorSpec.$,
    },
    'node': {
        'ordinal': 2,
        'type': ScrollToNodeSelectorSpec.$,
    },
});
var ScrollToSelectorFieldTags;
(function (ScrollToSelectorFieldTags) {
    ScrollToSelectorFieldTags[ScrollToSelectorFieldTags["EXACT_TEXT"] = 0] = "EXACT_TEXT";
    ScrollToSelectorFieldTags[ScrollToSelectorFieldTags["TEXT_FRAGMENT"] = 1] = "TEXT_FRAGMENT";
    ScrollToSelectorFieldTags[ScrollToSelectorFieldTags["NODE"] = 2] = "NODE";
})(ScrollToSelectorFieldTags || (ScrollToSelectorFieldTags = {}));
mojo.internal.Union(InvocationPayloadSpec.$, 'InvocationPayload', {
    'universalCart': {
        'ordinal': 0,
        'type': UniversalCartPayloadSpec.$,
    },
    'skillsPayload': {
        'ordinal': 1,
        'type': SkillsPayloadSpec.$,
    },
});
var InvocationPayloadFieldTags;
(function (InvocationPayloadFieldTags) {
    InvocationPayloadFieldTags[InvocationPayloadFieldTags["UNIVERSAL_CART"] = 0] = "UNIVERSAL_CART";
    InvocationPayloadFieldTags[InvocationPayloadFieldTags["SKILLS_PAYLOAD"] = 1] = "SKILLS_PAYLOAD";
})(InvocationPayloadFieldTags || (InvocationPayloadFieldTags = {}));
mojo.internal.Union(AdditionalContextPartSpec.$, 'AdditionalContextPart', {
    'data': {
        'ordinal': 0,
        'type': ContextDataSpec.$,
    },
    'screenshot': {
        'ordinal': 1,
        'type': ScreenshotSpec.$,
    },
    'webPageData': {
        'ordinal': 2,
        'type': WebPageDataSpec.$,
    },
    'annotatedPageData': {
        'ordinal': 3,
        'type': AnnotatedPageDataSpec.$,
    },
    'pdfDocumentData': {
        'ordinal': 4,
        'type': PdfDocumentDataSpec.$,
    },
    'tabContext': {
        'ordinal': 5,
        'type': TabContextResultSpec.$,
    },
    'region': {
        'ordinal': 6,
        'type': CapturedRegionSpec.$,
    },
    'pendingRegion': {
        'ordinal': 7,
        'type': PendingCapturedRegionSpec.$,
    },
    'parentConversationMetadata': {
        'ordinal': 8,
        'type': ParentConversationMetadataSpec.$,
    },
});
var AdditionalContextPartFieldTags;
(function (AdditionalContextPartFieldTags) {
    AdditionalContextPartFieldTags[AdditionalContextPartFieldTags["DATA"] = 0] = "DATA";
    AdditionalContextPartFieldTags[AdditionalContextPartFieldTags["SCREENSHOT"] = 1] = "SCREENSHOT";
    AdditionalContextPartFieldTags[AdditionalContextPartFieldTags["WEB_PAGE_DATA"] = 2] = "WEB_PAGE_DATA";
    AdditionalContextPartFieldTags[AdditionalContextPartFieldTags["ANNOTATED_PAGE_DATA"] = 3] = "ANNOTATED_PAGE_DATA";
    AdditionalContextPartFieldTags[AdditionalContextPartFieldTags["PDF_DOCUMENT_DATA"] = 4] = "PDF_DOCUMENT_DATA";
    AdditionalContextPartFieldTags[AdditionalContextPartFieldTags["TAB_CONTEXT"] = 5] = "TAB_CONTEXT";
    AdditionalContextPartFieldTags[AdditionalContextPartFieldTags["REGION"] = 6] = "REGION";
    AdditionalContextPartFieldTags[AdditionalContextPartFieldTags["PENDING_REGION"] = 7] = "PENDING_REGION";
    AdditionalContextPartFieldTags[AdditionalContextPartFieldTags["PARENT_CONVERSATION_METADATA"] = 8] = "PARENT_CONVERSATION_METADATA";
})(AdditionalContextPartFieldTags || (AdditionalContextPartFieldTags = {}));
mojo.internal.Union(FocusedTabDataSpec.$, 'FocusedTabData', {
    'focusedTab': {
        'ordinal': 0,
        'type': TabDataSpec.$,
    },
    'noFocusedTabData': {
        'ordinal': 1,
        'type': NoFocusedTabDataSpec.$,
    },
});
var FocusedTabDataFieldTags;
(function (FocusedTabDataFieldTags) {
    FocusedTabDataFieldTags[FocusedTabDataFieldTags["FOCUSED_TAB"] = 0] = "FOCUSED_TAB";
    FocusedTabDataFieldTags[FocusedTabDataFieldTags["NO_FOCUSED_TAB_DATA"] = 1] = "NO_FOCUSED_TAB_DATA";
})(FocusedTabDataFieldTags || (FocusedTabDataFieldTags = {}));
mojo.internal.Union(CapturedRegionSpec.$, 'CapturedRegion', {
    'rect': {
        'ordinal': 0,
        'type': RectSpec.$,
    },
    'polyline': {
        'ordinal': 1,
        'type': mojo.internal.Array(PointSpec.$, false),
    },
});
var CapturedRegionFieldTags;
(function (CapturedRegionFieldTags) {
    CapturedRegionFieldTags[CapturedRegionFieldTags["RECT"] = 0] = "RECT";
    CapturedRegionFieldTags[CapturedRegionFieldTags["POLYLINE"] = 1] = "POLYLINE";
})(CapturedRegionFieldTags || (CapturedRegionFieldTags = {}));
mojo.internal.Union(GetImageBytesResultSpec.$, 'GetImageBytesResult', {
    'imageBytes': {
        'ordinal': 0,
        'type': ImageBytesResultSpec.$,
    },
    'errorReason': {
        'ordinal': 1,
        'type': mojo.internal.String,
    },
});
var GetImageBytesResultFieldTags;
(function (GetImageBytesResultFieldTags) {
    GetImageBytesResultFieldTags[GetImageBytesResultFieldTags["IMAGE_BYTES"] = 0] = "IMAGE_BYTES";
    GetImageBytesResultFieldTags[GetImageBytesResultFieldTags["ERROR_REASON"] = 1] = "ERROR_REASON";
})(GetImageBytesResultFieldTags || (GetImageBytesResultFieldTags = {}));
mojo.internal.Union(ActorHandler_CreateTask_ResponseParam_ResultSpec.$, 'ActorHandler_CreateTask_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': mojo.internal.Int32,
    },
    'failure': {
        'ordinal': 1,
        'type': CreateTaskErrorReasonSpec.$,
    },
});
var ActorHandler_CreateTask_ResponseParam_ResultFieldTags;
(function (ActorHandler_CreateTask_ResponseParam_ResultFieldTags) {
    ActorHandler_CreateTask_ResponseParam_ResultFieldTags[ActorHandler_CreateTask_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    ActorHandler_CreateTask_ResponseParam_ResultFieldTags[ActorHandler_CreateTask_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(ActorHandler_CreateTask_ResponseParam_ResultFieldTags || (ActorHandler_CreateTask_ResponseParam_ResultFieldTags = {}));
mojo.internal.Union(ActorHandler_PerformActions_ResponseParam_ResultSpec.$, 'ActorHandler_PerformActions_ResponseParam_Result', {
    'success': {
        'ordinal': 0,
        'type': ProtoWrapperSpec.$,
    },
    'failure': {
        'ordinal': 1,
        'type': PerformActionsErrorReasonSpec.$,
    },
});
var ActorHandler_PerformActions_ResponseParam_ResultFieldTags;
(function (ActorHandler_PerformActions_ResponseParam_ResultFieldTags) {
    ActorHandler_PerformActions_ResponseParam_ResultFieldTags[ActorHandler_PerformActions_ResponseParam_ResultFieldTags["SUCCESS"] = 0] = "SUCCESS";
    ActorHandler_PerformActions_ResponseParam_ResultFieldTags[ActorHandler_PerformActions_ResponseParam_ResultFieldTags["FAILURE"] = 1] = "FAILURE";
})(ActorHandler_PerformActions_ResponseParam_ResultFieldTags || (ActorHandler_PerformActions_ResponseParam_ResultFieldTags = {}));

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var OpenSignInTabResult;
(function (OpenSignInTabResult) {
    OpenSignInTabResult[OpenSignInTabResult["UNKNOWN"] = 0] = "UNKNOWN";
    // The sign-in tab was opened (or an existing one reactivated).
    OpenSignInTabResult[OpenSignInTabResult["SUCCESS"] = 1] = "SUCCESS";
    // No sign-in URL was provided in options.
    OpenSignInTabResult[OpenSignInTabResult["ERROR_NO_URL"] = 2] = "ERROR_NO_URL";
    // The provided sign-in URL was disallowed.
    OpenSignInTabResult[OpenSignInTabResult["ERROR_DISALLOWED_URL"] = 3] = "ERROR_DISALLOWED_URL";
    // Failed to open the tab (e.g. off-the-record profile, no browser window).
    OpenSignInTabResult[OpenSignInTabResult["ERROR_FAILURE"] = 4] = "ERROR_FAILURE";
})(OpenSignInTabResult || (OpenSignInTabResult = {}));
var CloseSignInTabResult;
(function (CloseSignInTabResult) {
    CloseSignInTabResult[CloseSignInTabResult["UNKNOWN"] = 0] = "UNKNOWN";
    // The sign-in tab was found and closed.
    CloseSignInTabResult[CloseSignInTabResult["SUCCESS"] = 1] = "SUCCESS";
    // A sign-in tab was previously opened, but had already been closed.
    CloseSignInTabResult[CloseSignInTabResult["ALREADY_CLOSED"] = 2] = "ALREADY_CLOSED";
    // No sign-in tab was open or tracked.
    CloseSignInTabResult[CloseSignInTabResult["NO_SIGN_IN_TAB"] = 3] = "NO_SIGN_IN_TAB";
})(CloseSignInTabResult || (CloseSignInTabResult = {}));
var FileUploadPolicyState;
(function (FileUploadPolicyState) {
    FileUploadPolicyState[FileUploadPolicyState["ENABLED"] = 0] = "ENABLED";
    FileUploadPolicyState[FileUploadPolicyState["DISABLED"] = 1] = "DISABLED";
})(FileUploadPolicyState || (FileUploadPolicyState = {}));
// The type of user input reaction.
var MetricUserInputReactionType;
(function (MetricUserInputReactionType) {
    // An unknown reaction type.
    MetricUserInputReactionType[MetricUserInputReactionType["UNKNOWN"] = 0] = "UNKNOWN";
    // A canned reaction which can be presented without communication with the
    // server.
    MetricUserInputReactionType[MetricUserInputReactionType["CANNED"] = 1] = "CANNED";
    // A reaction which requires some generic modeling to produce.
    MetricUserInputReactionType[MetricUserInputReactionType["MODEL"] = 2] = "MODEL";
})(MetricUserInputReactionType || (MetricUserInputReactionType = {}));
// Reason for failure while acting.
var PerformActionsErrorReason$1;
(function (PerformActionsErrorReason) {
    PerformActionsErrorReason[PerformActionsErrorReason["UNKNOWN"] = 0] = "UNKNOWN";
    // The serialized actions proto failed to parse.
    PerformActionsErrorReason[PerformActionsErrorReason["INVALID_ACTION_PROTO"] = 1] = "INVALID_ACTION_PROTO";
})(PerformActionsErrorReason$1 || (PerformActionsErrorReason$1 = {}));
// Reason for failure when creating an actor task.
var CreateTaskErrorReason$1;
(function (CreateTaskErrorReason) {
    CreateTaskErrorReason[CreateTaskErrorReason["UNKNOWN"] = 0] = "UNKNOWN";
    // The host does not support the actor task system.
    CreateTaskErrorReason[CreateTaskErrorReason["TASK_SYSTEM_UNAVAILABLE"] = 1] = "TASK_SYSTEM_UNAVAILABLE";
    // The host already has an existing task in progress. The client must stop it
    // before requesting a new task.
    CreateTaskErrorReason[CreateTaskErrorReason["EXISTING_ACTIVE_TASK"] = 2] = "EXISTING_ACTIVE_TASK";
    // The user's browser policy or account settings prevent creating actor tasks.
    CreateTaskErrorReason[CreateTaskErrorReason["BLOCKED_BY_POLICY"] = 3] = "BLOCKED_BY_POLICY";
    // CreateTask was called on a Glic instance which does not have a registered
    // conversation.
    CreateTaskErrorReason[CreateTaskErrorReason["CONVERSATION_NOT_REGISTERED"] = 4] = "CONVERSATION_NOT_REGISTERED";
})(CreateTaskErrorReason$1 || (CreateTaskErrorReason$1 = {}));
// The state of an actor task.
var ActorTaskState$1;
(function (ActorTaskState) {
    ActorTaskState[ActorTaskState["UNKNOWN"] = 0] = "UNKNOWN";
    // The actor task is idle and waiting for the next action instruction.
    ActorTaskState[ActorTaskState["IDLE"] = 1] = "IDLE";
    // The actor task is performing an action.
    ActorTaskState[ActorTaskState["ACTING"] = 2] = "ACTING";
    // The actor task is paused and waiting to be resumed or stopped.
    ActorTaskState[ActorTaskState["PAUSED"] = 3] = "PAUSED";
    // The actor task is stopped and going away.
    ActorTaskState[ActorTaskState["STOPPED"] = 4] = "STOPPED";
})(ActorTaskState$1 || (ActorTaskState$1 = {}));
// The reason/source of why an actor task was paused.
var ActorTaskPauseReason$1;
(function (ActorTaskPauseReason) {
    // Actor task was paused by the model.
    ActorTaskPauseReason[ActorTaskPauseReason["PAUSED_BY_MODEL"] = 0] = "PAUSED_BY_MODEL";
    // Actor task was puased by the user.
    ActorTaskPauseReason[ActorTaskPauseReason["PAUSED_BY_USER"] = 1] = "PAUSED_BY_USER";
})(ActorTaskPauseReason$1 || (ActorTaskPauseReason$1 = {}));
// The reason/source of why an actor task was stopped.
var ActorTaskStopReason$1;
(function (ActorTaskStopReason) {
    // Actor task is complete.
    ActorTaskStopReason[ActorTaskStopReason["TASK_COMPLETE"] = 0] = "TASK_COMPLETE";
    // Actor task was stopped by the user.
    ActorTaskStopReason[ActorTaskStopReason["STOPPED_BY_USER"] = 1] = "STOPPED_BY_USER";
    // Actor task was stopped because the model reported a failure.
    ActorTaskStopReason[ActorTaskStopReason["MODEL_ERROR"] = 2] = "MODEL_ERROR";
    // Actor task was stopped by choosing a new conversation.
    ActorTaskStopReason[ActorTaskStopReason["USER_STARTED_NEW_CHAT"] = 3] = "USER_STARTED_NEW_CHAT";
    // Actor task was stopped by choosing a previous conversation.
    ActorTaskStopReason[ActorTaskStopReason["USER_LOADED_PREVIOUS_CHAT"] = 4] = "USER_LOADED_PREVIOUS_CHAT";
})(ActorTaskStopReason$1 || (ActorTaskStopReason$1 = {}));
// The reason/source of why an actor task was interrupted.
var ActorTaskInterruptReason;
(function (ActorTaskInterruptReason) {
    // Actor task is interrupted for an unknown reason.
    ActorTaskInterruptReason[ActorTaskInterruptReason["UNKNOWN_REASON"] = 0] = "UNKNOWN_REASON";
    // Actor task is complete.
    ActorTaskInterruptReason[ActorTaskInterruptReason["TASK_COMPLETE"] = 1] = "TASK_COMPLETE";
    // Actor task was waiting for user input.
    ActorTaskInterruptReason[ActorTaskInterruptReason["WAITING_USER_INPUT"] = 2] = "WAITING_USER_INPUT";
    // Actor task was waiting for user to provide clarifications on the current
    // task.
    ActorTaskInterruptReason[ActorTaskInterruptReason["WAITING_USER_CLARIFICATION"] = 3] = "WAITING_USER_CLARIFICATION";
    // Actor task was waiting for user to confirm an action.
    ActorTaskInterruptReason[ActorTaskInterruptReason["WAITING_USER_CONFIRMATION"] = 4] = "WAITING_USER_CONFIRMATION";
    // Actor task was waiting for user to take over.
    ActorTaskInterruptReason[ActorTaskInterruptReason["WAITING_USER_TAKE_OVER"] = 5] = "WAITING_USER_TAKE_OVER";
    // Actor task was waiting for irrelevant user input.
    ActorTaskInterruptReason[ActorTaskInterruptReason["WAITING_IRRELEVANT_USER_INPUT"] = 6] = "WAITING_IRRELEVANT_USER_INPUT";
    // Actor task was waiting for user to respond to unsafe counter-abuse verdict.
    ActorTaskInterruptReason[ActorTaskInterruptReason["WAITING_UNSAFE_COUNTER_ABUSE_VERDICT"] = 7] = "WAITING_UNSAFE_COUNTER_ABUSE_VERDICT";
    // Actor task was waiting for user to consent on experimental triggering.
    ActorTaskInterruptReason[ActorTaskInterruptReason["WAITING_FOR_EXPERIMENTAL_TRIGGERING_CONSENT"] = 8] = "WAITING_FOR_EXPERIMENTAL_TRIGGERING_CONSENT";
})(ActorTaskInterruptReason || (ActorTaskInterruptReason = {}));
// Safe Browsing Threat Type.
var SbThreatType;
(function (SbThreatType) {
    // Default value.
    SbThreatType[SbThreatType["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    SbThreatType[SbThreatType["SOCIAL_ENGINEERING"] = 1] = "SOCIAL_ENGINEERING";
    SbThreatType[SbThreatType["MALWARE"] = 2] = "MALWARE";
    SbThreatType[SbThreatType["UNWANTED_SOFTWARE"] = 3] = "UNWANTED_SOFTWARE";
})(SbThreatType || (SbThreatType = {}));
// Enum to specify the image format of the screenshot.
var ScreenshotImageFormat;
(function (ScreenshotImageFormat) {
    // JPEG screenshot format. This is the default format.
    ScreenshotImageFormat[ScreenshotImageFormat["JPEG"] = 0] = "JPEG";
    // PNG screenshot format.
    ScreenshotImageFormat[ScreenshotImageFormat["PNG"] = 1] = "PNG";
    // WEBP screenshot format.
    ScreenshotImageFormat[ScreenshotImageFormat["WEBP"] = 2] = "WEBP";
})(ScreenshotImageFormat || (ScreenshotImageFormat = {}));
// Enum to specify the compression quality of the screenshot. Depending on
// screenshot format, the compression quality may not be respected or may mean
// something different.
var ScreenshotCompressionQuality;
(function (ScreenshotCompressionQuality) {
    // No compression.
    ScreenshotCompressionQuality[ScreenshotCompressionQuality["NONE"] = 0] = "NONE";
    // Low compression quality.
    ScreenshotCompressionQuality[ScreenshotCompressionQuality["LOW"] = 1] = "LOW";
    // Medium compression quality.
    ScreenshotCompressionQuality[ScreenshotCompressionQuality["MEDIUM"] = 2] = "MEDIUM";
    // High compression quality.
    ScreenshotCompressionQuality[ScreenshotCompressionQuality["HIGH"] = 3] = "HIGH";
})(ScreenshotCompressionQuality || (ScreenshotCompressionQuality = {}));
// Reason why scrollTo() failed.
var ScrollToErrorReason$1;
(function (ScrollToErrorReason) {
    // Invalid params were provided to scrollTo(), or the browser doesn't support
    // scrollTo() yet.
    ScrollToErrorReason[ScrollToErrorReason["NOT_SUPPORTED"] = 0] = "NOT_SUPPORTED";
    // scrollTo() was called again before this call finished processing.
    ScrollToErrorReason[ScrollToErrorReason["NEWER_SCROLL_TO_CALL"] = 1] = "NEWER_SCROLL_TO_CALL";
    // There is no tab currently in focus.
    ScrollToErrorReason[ScrollToErrorReason["NO_FOCUSED_TAB"] = 2] = "NO_FOCUSED_TAB";
    // The input selector did not match any content in the document or a given
    // range.
    ScrollToErrorReason[ScrollToErrorReason["NO_MATCH_FOUND"] = 3] = "NO_MATCH_FOUND";
    // The currently focused tab changed or navigated while processing the
    // scrollTo() call.
    ScrollToErrorReason[ScrollToErrorReason["FOCUSED_TAB_CHANGED_OR_NAVIGATED"] = 4] = "FOCUSED_TAB_CHANGED_OR_NAVIGATED";
    // The document_id or url provided doesn't match the active document in the
    // primary main frame of the currently focused tab. The document may have been
    // navigated away, may not currently be in focus, or may not be in a primary
    // main frame (we don't currently support iframes).
    ScrollToErrorReason[ScrollToErrorReason["NO_MATCHING_DOCUMENT"] = 5] = "NO_MATCHING_DOCUMENT";
    // The search range starting from DOMNodeId did not result in a valid range.
    ScrollToErrorReason[ScrollToErrorReason["SEARCH_RANGE_INVALID"] = 6] = "SEARCH_RANGE_INVALID";
    // Page context access is disabled.
    ScrollToErrorReason[ScrollToErrorReason["TAB_CONTEXT_PERMISSION_DISABLED"] = 7] = "TAB_CONTEXT_PERMISSION_DISABLED";
    // The web client requested to drop the highlight via
    // `dropScrollToHighlight()`.
    ScrollToErrorReason[ScrollToErrorReason["DROPPED_BY_WEB_CLIENT"] = 8] = "DROPPED_BY_WEB_CLIENT";
})(ScrollToErrorReason$1 || (ScrollToErrorReason$1 = {}));
// Enum to specify the source of the Skill.
var SkillSource;
(function (SkillSource) {
    SkillSource[SkillSource["UNKNOWN"] = 0] = "UNKNOWN";
    // Skill created by Google.
    SkillSource[SkillSource["FIRST_PARTY"] = 1] = "FIRST_PARTY";
    // Skill created by an end-user.
    SkillSource[SkillSource["USER_CREATED"] = 2] = "USER_CREATED";
    // Skill derived from a first party skill.
    SkillSource[SkillSource["DERIVED_FROM_FIRST_PARTY"] = 3] = "DERIVED_FROM_FIRST_PARTY";
    // Skill sourced from the EnterprisePublishedSkills enterprise policy.
    SkillSource[SkillSource["ENTERPRISE"] = 4] = "ENTERPRISE";
    // Skill derived from an enterprise skill.
    SkillSource[SkillSource["DERIVED_FROM_ENTERPRISE"] = 5] = "DERIVED_FROM_ENTERPRISE";
})(SkillSource || (SkillSource = {}));
// Enum to specify the skills web client event for metrics recording.
// Includes both direct user interactions and WebClient state
// transitions to track feature funnels.
var SkillsWebClientEvent;
(function (SkillsWebClientEvent) {
    // Default value for unknown or uninitialized actions.
    SkillsWebClientEvent[SkillsWebClientEvent["UNKNOWN"] = 0] = "UNKNOWN";
    // User invoked a first-party skill.
    SkillsWebClientEvent[SkillsWebClientEvent["USED_FIRST_PARTY_SKILL"] = 1] = "USED_FIRST_PARTY_SKILL";
    // User invoked a skill they created themselves.
    SkillsWebClientEvent[SkillsWebClientEvent["USED_USER_CREATED_SKILL"] = 2] = "USED_USER_CREATED_SKILL";
    // User invoked a skill that was remix/derived from a first-party skill.
    SkillsWebClientEvent[SkillsWebClientEvent["USED_DERIVED_FIRST_PARTY_SKILL"] = 3] = "USED_DERIVED_FIRST_PARTY_SKILL";
    // User typed '/' or triggered the skills menu.
    SkillsWebClientEvent[SkillsWebClientEvent["OPENED_MENU"] = 4] = "OPENED_MENU";
    // User clicked the 'Manage skills' button from the slash menu.
    SkillsWebClientEvent[SkillsWebClientEvent["CLICKED_MANAGE_FROM_MENU"] = 5] = "CLICKED_MANAGE_FROM_MENU";
    // User clicked the 'Add skill' button from the slash menu.
    SkillsWebClientEvent[SkillsWebClientEvent["CLICKED_ADD_FROM_MENU"] = 6] = "CLICKED_ADD_FROM_MENU";
    // User clicked the edit button on an existing skill preview.
    SkillsWebClientEvent[SkillsWebClientEvent["CLICKED_EDIT_FROM_MENU"] = 7] = "CLICKED_EDIT_FROM_MENU";
    // User clicked the generic '+' button on a 1P skill preview.
    SkillsWebClientEvent[SkillsWebClientEvent["CLICKED_ADD_ON1P_SKILL"] = 8] = "CLICKED_ADD_ON1P_SKILL";
    // User clicked the 'Save as Skill' chip that appears on hover.
    SkillsWebClientEvent[SkillsWebClientEvent["CLICKED_SAVE_AS_SKILL_HOVER_CHIP"] = 9] = "CLICKED_SAVE_AS_SKILL_HOVER_CHIP";
    // User clicked the 'Edit Skill' chip that appears on hover.
    SkillsWebClientEvent[SkillsWebClientEvent["CLICKED_EDIT_SKILL_HOVER_CHIP"] = 10] = "CLICKED_EDIT_SKILL_HOVER_CHIP";
    // User clicked the 'Browse skills' button from the plus menu.
    SkillsWebClientEvent[SkillsWebClientEvent["CLICKED_BROWSE_SKILL_FROM_PLUS_MENU"] = 11] = "CLICKED_BROWSE_SKILL_FROM_PLUS_MENU";
    // User clicked a skill from the plus menu.
    SkillsWebClientEvent[SkillsWebClientEvent["CLICKED_SKILL_FROM_PLUS_MENU"] = 12] = "CLICKED_SKILL_FROM_PLUS_MENU";
    // User clicked the 'Manage skills' button from the plus menu.
    SkillsWebClientEvent[SkillsWebClientEvent["CLICKED_MANAGE_SKILL_FROM_PLUS_MENU"] = 13] = "CLICKED_MANAGE_SKILL_FROM_PLUS_MENU";
    // User clicked the 'More' button from the slash menu.
    SkillsWebClientEvent[SkillsWebClientEvent["CLICKED_MORE_FROM_MENU"] = 14] = "CLICKED_MORE_FROM_MENU";
    // User clicked the 'Manage skills' button from the slash skills submenu.
    // Deprecated. Use kClickedManageFromMenu instead.
    SkillsWebClientEvent[SkillsWebClientEvent["CLICKED_MANAGE_SKILL_FROM_MENU"] = 15] = "CLICKED_MANAGE_SKILL_FROM_MENU";
    // User clicked a skill from the slash menu.
    SkillsWebClientEvent[SkillsWebClientEvent["CLICKED_SKILL_FROM_MENU"] = 16] = "CLICKED_SKILL_FROM_MENU";
    // User clicked the 'Browse skills' button from the slash menu.
    SkillsWebClientEvent[SkillsWebClientEvent["CLICKED_BROWSE_SKILLS_FROM_MENU"] = 17] = "CLICKED_BROWSE_SKILLS_FROM_MENU";
    // Skill Builder Step 1: User clicked the promo chip to start the flow.
    SkillsWebClientEvent[SkillsWebClientEvent["SKILL_BUILDER_CLICKED_PROMO_CHIP"] = 20] = "SKILL_BUILDER_CLICKED_PROMO_CHIP";
    // Skill Builder Step 2: A draft skill was successfully generated by the AI.
    SkillsWebClientEvent[SkillsWebClientEvent["SKILL_BUILDER_PROMPT_GENERATED"] = 21] = "SKILL_BUILDER_PROMPT_GENERATED";
    // Skill Builder Step 3: User clicked save on the generated draft.
    SkillsWebClientEvent[SkillsWebClientEvent["SKILL_BUILDER_CLICKED_SAVE_AS_SKILL"] = 22] = "SKILL_BUILDER_CLICKED_SAVE_AS_SKILL";
})(SkillsWebClientEvent || (SkillsWebClientEvent = {}));
// Describes what triggered the pin.
var PinTrigger;
(function (PinTrigger) {
    // The pin occurred for unknown reasons. Specifies 'web client' to align with
    // `GlicPinTrigger` enum (which disambiguates from unknown triggers
    // originating elsewhere).
    PinTrigger[PinTrigger["WEB_CLIENT_UNKNOWN"] = 0] = "WEB_CLIENT_UNKNOWN";
    // The pin was triggered by the toggle UI for pin candidates.
    PinTrigger[PinTrigger["CANDIDATES_TOGGLE"] = 1] = "CANDIDATES_TOGGLE";
    // The pin was triggered by the inline '@' mention feature.
    PinTrigger[PinTrigger["AT_MENTION"] = 2] = "AT_MENTION";
    // The pin was triggered as part of actor/actuation behavior.
    PinTrigger[PinTrigger["ACTUATION"] = 3] = "ACTUATION";
})(PinTrigger || (PinTrigger = {}));
// Describes what triggered the unpin.
var UnpinTrigger;
(function (UnpinTrigger) {
    // The unpin occurred for unknown reasons. Specifies 'web client' to align
    // with `GlicUnpinTrigger` enum (which disambiguates from unknown triggers
    // originating elsewhere).
    UnpinTrigger[UnpinTrigger["WEB_CLIENT_UNKNOWN"] = 0] = "WEB_CLIENT_UNKNOWN";
    // The unpin was triggered by the toggle UI for pin candidates.
    UnpinTrigger[UnpinTrigger["CANDIDATES_TOGGLE"] = 1] = "CANDIDATES_TOGGLE";
    // The unpin was triggered by a chip.
    UnpinTrigger[UnpinTrigger["CHIP"] = 2] = "CHIP";
    // The unpin was triggered as part of actor/actuation behavior.
    UnpinTrigger[UnpinTrigger["ACTUATION"] = 3] = "ACTUATION";
})(UnpinTrigger || (UnpinTrigger = {}));
// Result of CancelActions().
var CancelActionsResult;
(function (CancelActionsResult) {
    // Do not manually use this value. Fail safe when an old client receives an
    // extended new enum.
    CancelActionsResult[CancelActionsResult["UNKNOWN"] = 0] = "UNKNOWN";
    // Actions were successfully cancelled.
    CancelActionsResult[CancelActionsResult["SUCCESS"] = 1] = "SUCCESS";
    // The task was not found.
    CancelActionsResult[CancelActionsResult["TASK_NOT_FOUND"] = 2] = "TASK_NOT_FOUND";
    // Could not cancel the actions for other reasons (e.g., the task is already
    // completed).
    CancelActionsResult[CancelActionsResult["FAILED"] = 3] = "FAILED";
})(CancelActionsResult || (CancelActionsResult = {}));
// Reason for failure when switching a conversation.
var SwitchConversationErrorReason;
(function (SwitchConversationErrorReason) {
    SwitchConversationErrorReason[SwitchConversationErrorReason["UNKNOWN"] = 0] = "UNKNOWN";
})(SwitchConversationErrorReason || (SwitchConversationErrorReason = {}));
// Reason for failure when registering a conversation.
var RegisterConversationErrorReason;
(function (RegisterConversationErrorReason) {
    RegisterConversationErrorReason[RegisterConversationErrorReason["UNKNOWN"] = 0] = "UNKNOWN";
    // The instance already has a conversation ID.
    RegisterConversationErrorReason[RegisterConversationErrorReason["INSTANCE_ALREADY_HAS_CONVERSATION_ID"] = 1] = "INSTANCE_ALREADY_HAS_CONVERSATION_ID";
})(RegisterConversationErrorReason || (RegisterConversationErrorReason = {}));
// Web client's operation modes.
var WebClientMode$1;
(function (WebClientMode) {
    // Text operation mode.
    WebClientMode[WebClientMode["TEXT"] = 0] = "TEXT";
    // Audio operation mode.
    WebClientMode[WebClientMode["AUDIO"] = 1] = "AUDIO";
})(WebClientMode$1 || (WebClientMode$1 = {}));
// Prompt submission type.
var PromptType;
(function (PromptType) {
    // Default value when prompt type is unspecified or unknown.
    PromptType[PromptType["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    // User typed text in the prompt input field.
    PromptType[PromptType["TYPED_TEXT"] = 1] = "TYPED_TEXT";
    // User selected a Zero State Suggestion (ZSS).
    PromptType[PromptType["ZERO_STATE_SUGGESTIONS"] = 2] = "ZERO_STATE_SUGGESTIONS";
    // Auto-submitted prompt (e.g. contextual cueing auto-submit).
    PromptType[PromptType["AUTO_PROMPT"] = 3] = "AUTO_PROMPT";
    // Audio input prompt.
    PromptType[PromptType["AUDIO"] = 4] = "AUDIO";
})(PromptType || (PromptType = {}));
// Microphone status.
var MicrophoneStatus$1;
(function (MicrophoneStatus) {
    MicrophoneStatus[MicrophoneStatus["NOT_LISTENING"] = 0] = "NOT_LISTENING";
    MicrophoneStatus[MicrophoneStatus["LISTENING"] = 1] = "LISTENING";
    MicrophoneStatus[MicrophoneStatus["UNKNOWN"] = 2] = "UNKNOWN";
})(MicrophoneStatus$1 || (MicrophoneStatus$1 = {}));
// Web client's operation model.
var WebClientModel;
(function (WebClientModel) {
    // Default model.
    WebClientModel[WebClientModel["DEFAULT"] = 0] = "DEFAULT";
    // Actor operation mode.
    WebClientModel[WebClientModel["ACTOR"] = 1] = "ACTOR";
})(WebClientModel || (WebClientModel = {}));
// Web client's user counter.
var WebUseCounter;
(function (WebUseCounter) {
    // Default counter. Never used.
    WebUseCounter[WebUseCounter["DEFAULT"] = 0] = "DEFAULT";
    WebUseCounter[WebUseCounter["SUBMIT_PROMPT_WITH_AUTO_MODE"] = 1] = "SUBMIT_PROMPT_WITH_AUTO_MODE";
    WebUseCounter[WebUseCounter["TASK_INTERRUPTED_FOR_USER_CONFIRMATION"] = 2] = "TASK_INTERRUPTED_FOR_USER_CONFIRMATION";
    WebUseCounter[WebUseCounter["TASK_INTERRUPTED_FOR_USER_CLARIFICATION"] = 3] = "TASK_INTERRUPTED_FOR_USER_CLARIFICATION";
    WebUseCounter[WebUseCounter["SELECTION_TOGGLED_VIA_SHARED_MENU"] = 4] = "SELECTION_TOGGLED_VIA_SHARED_MENU";
    WebUseCounter[WebUseCounter["SELECTION_TOGGLED_VIA_HOT_KEY"] = 5] = "SELECTION_TOGGLED_VIA_HOT_KEY";
    WebUseCounter[WebUseCounter["SUBMIT_PROMPT_WITH_TEXT_SELECTION_CUE"] = 6] = "SUBMIT_PROMPT_WITH_TEXT_SELECTION_CUE";
})(WebUseCounter || (WebUseCounter = {}));
// Client error dialog types.
var ClientErrorDialogType;
(function (ClientErrorDialogType) {
    ClientErrorDialogType[ClientErrorDialogType["UNKNOWN"] = 0] = "UNKNOWN";
    ClientErrorDialogType[ClientErrorDialogType["DISABLED_BY_ORGANIZATION"] = 1] = "DISABLED_BY_ORGANIZATION";
    ClientErrorDialogType[ClientErrorDialogType["GENERIC_AVAILABILITY"] = 2] = "GENERIC_AVAILABILITY";
    ClientErrorDialogType[ClientErrorDialogType["INELIGIBLE_ACCOUNT"] = 3] = "INELIGIBLE_ACCOUNT";
    ClientErrorDialogType[ClientErrorDialogType["SIGNOUT"] = 4] = "SIGNOUT";
    ClientErrorDialogType[ClientErrorDialogType["UNSUPPORTED_LOCATION"] = 5] = "UNSUPPORTED_LOCATION";
})(ClientErrorDialogType || (ClientErrorDialogType = {}));
var AdditionalContextSource;
(function (AdditionalContextSource) {
    AdditionalContextSource[AdditionalContextSource["UNKNOWN"] = 2] = "UNKNOWN";
    AdditionalContextSource[AdditionalContextSource["SHARE_CONTEXT_MENU"] = 0] = "SHARE_CONTEXT_MENU";
    AdditionalContextSource[AdditionalContextSource["REGION_SELECTION"] = 1] = "REGION_SELECTION";
    AdditionalContextSource[AdditionalContextSource["TEXT_SELECTION"] = 3] = "TEXT_SELECTION";
    AdditionalContextSource[AdditionalContextSource["WEB_DRAG_DROP"] = 4] = "WEB_DRAG_DROP";
    AdditionalContextSource[AdditionalContextSource["EXPERIMENTAL_TRIGGERING"] = 5] = "EXPERIMENTAL_TRIGGERING";
})(AdditionalContextSource || (AdditionalContextSource = {}));
// Types of updates that may be relayed back by the web client.
var ExperimentalTriggeringUpdateType;
(function (ExperimentalTriggeringUpdateType) {
    // An unknown, non-terminal update type.
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["UNKNOWN"] = 0] = "UNKNOWN";
    // A log entry describing internal steps or "thought" process.
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["WORKLOG"] = 1] = "WORKLOG";
    // The interaction was paused.
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["PAUSED"] = 2] = "PAUSED";
    // A final status update or metadata about the completed task.
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["TERMINAL_COMPLETION"] = 3] = "TERMINAL_COMPLETION";
    // The interaction was stopped or cancelled.
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["TERMINAL_STOPPED"] = 4] = "TERMINAL_STOPPED";
    // The interaction failed.
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["TERMINAL_FAILED"] = 5] = "TERMINAL_FAILED";
    // The interaction yielded to the user.
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["YIELD_TO_USER"] = 6] = "YIELD_TO_USER";
    // The interaction has resumed after a pause or wait state.
    ExperimentalTriggeringUpdateType[ExperimentalTriggeringUpdateType["RESUMED"] = 7] = "RESUMED";
})(ExperimentalTriggeringUpdateType || (ExperimentalTriggeringUpdateType = {}));
// Lightweight page features detected on the page.
var LightweightPageFeature;
(function (LightweightPageFeature) {
    LightweightPageFeature[LightweightPageFeature["UNKNOWN"] = 0] = "UNKNOWN";
    // The YouTube "Ask" button is visible.
    LightweightPageFeature[LightweightPageFeature["YT_ASK_BUTTON_PRESENT"] = 1] = "YT_ASK_BUTTON_PRESENT";
})(LightweightPageFeature || (LightweightPageFeature = {}));
// Reason for `captureRegion` error.
var CaptureRegionErrorReason$1;
(function (CaptureRegionErrorReason) {
    CaptureRegionErrorReason[CaptureRegionErrorReason["UNKNOWN"] = 0] = "UNKNOWN";
    // There is no focused tab that can be used for region capture.
    CaptureRegionErrorReason[CaptureRegionErrorReason["NO_FOCUSABLE_TAB"] = 1] = "NO_FOCUSABLE_TAB";
})(CaptureRegionErrorReason$1 || (CaptureRegionErrorReason$1 = {}));
// Specifies the encryption scheme used for the screenshot data.
var ScreenshotEncryptionScheme;
(function (ScreenshotEncryptionScheme) {
    // Unknown or unrecognized scheme across version boundaries.
    ScreenshotEncryptionScheme[ScreenshotEncryptionScheme["UNKNOWN"] = 0] = "UNKNOWN";
    // Unencrypted screenshot data.
    ScreenshotEncryptionScheme[ScreenshotEncryptionScheme["NONE"] = 1] = "NONE";
    // Encrypted according to RFC 8291 (Web Push message encryption), combining an
    // ephemeral ECDH P-256 public key share header with RFC 8188 record
    // encryption.
    ScreenshotEncryptionScheme[ScreenshotEncryptionScheme["RFC8291"] = 2] = "RFC8291";
})(ScreenshotEncryptionScheme || (ScreenshotEncryptionScheme = {}));
// Fields of interest from the Glic settings page.
var SettingsPageField;
(function (SettingsPageField) {
    // The OS hotkey configuration field.
    SettingsPageField[SettingsPageField["OS_HOTKEY"] = 1] = "OS_HOTKEY";
    // The OS entrypoint enabling field.
    SettingsPageField[SettingsPageField["OS_ENTRYPOINT_TOGGLE"] = 2] = "OS_ENTRYPOINT_TOGGLE";
    // The location permission field.
    SettingsPageField[SettingsPageField["LOCATION_PERMISSION"] = 3] = "LOCATION_PERMISSION";
})(SettingsPageField || (SettingsPageField = {}));
// Describes the capability of the glic host.
var HostCapability$1;
(function (HostCapability) {
    // Glic host supports scrollTo() with PDF documents.
    HostCapability[HostCapability["SCROLL_TO_PDF"] = 0] = "SCROLL_TO_PDF";
    // Glic host will reset panel size and location on open.
    HostCapability[HostCapability["RESET_SIZE_AND_LOCATION_ON_OPEN"] = 1] = "RESET_SIZE_AND_LOCATION_ON_OPEN";
    // The glic host's getModelQualityClientId() is enabled and can be called
    // safely.
    HostCapability[HostCapability["GET_MODEL_QUALITY_CLIENT_ID"] = 2] = "GET_MODEL_QUALITY_CLIENT_ID";
    // Glic is in multi-instance mode.
    HostCapability[HostCapability["MULTI_INSTANCE"] = 3] = "MULTI_INSTANCE";
    // Enables the experimental "Trust First" (Arm 1 - "Start Chat") onboarding
    // UI flow, bypassing the standard FRE flow.
    HostCapability[HostCapability["TRUST_FIRST_ONBOARDING_ARM1"] = 4] = "TRUST_FIRST_ONBOARDING_ARM1";
    // Enables the experimental "Trust First" (Arm 2 - "Welcome Screen")
    // onboarding UI flow, bypassing the standard FRE flow.
    HostCapability[HostCapability["TRUST_FIRST_ONBOARDING_ARM2"] = 5] = "TRUST_FIRST_ONBOARDING_ARM2";
    // Glic host supports sharing additional image context.
    HostCapability[HostCapability["SHARE_ADDITIONAL_IMAGE_CONTEXT"] = 6] = "SHARE_ADDITIONAL_IMAGE_CONTEXT";
    // Enables the PDF Zero State Web UI.
    HostCapability[HostCapability["PDF_ZERO_STATE"] = 7] = "PDF_ZERO_STATE";
    // Indicates that the host supports the invoke mechanism.
    HostCapability[HostCapability["INVOKE"] = 8] = "INVOKE";
    // Indicates that the host does not support Live Mode.
    HostCapability[HostCapability["NO_LIVE_MODE"] = 9] = "NO_LIVE_MODE";
    // Indicates that the host supports auto browse attempting login using Sign in
    // with Google.
    HostCapability[HostCapability["AUTO_LOGIN_SIGN_IN_WITH_GOOGLE"] = 10] = "AUTO_LOGIN_SIGN_IN_WITH_GOOGLE";
    // Indicates that the host supports sharing images via the invoke mechanism.
    HostCapability[HostCapability["SHARE_IMAGE_VIA_INVOKE"] = 11] = "SHARE_IMAGE_VIA_INVOKE";
    // Indicates that the host supports image drag and drop from the web
    HostCapability[HostCapability["IMG_WEB_DRAG_DROP"] = 12] = "IMG_WEB_DRAG_DROP";
    // Indicates that the host does not show the WebUi preloader.
    HostCapability[HostCapability["NO_WEB_UI_LOADER"] = 13] = "NO_WEB_UI_LOADER";
    // Indicates that the host enforces paste eligibility checks.
    HostCapability[HostCapability["ENFORCES_PASTE_ELIGIBILITY"] = 14] = "ENFORCES_PASTE_ELIGIBILITY";
    // Indicates that the host supports autofilling OTPs.
    HostCapability[HostCapability["ATTEMPT_OTP_FILLING"] = 15] = "ATTEMPT_OTP_FILLING";
    // Indicates that the host supports exposing Chrome-defined tools.
    HostCapability[HostCapability["CHROME_TOOLS"] = 16] = "CHROME_TOOLS";
    // Indicates that skills V2 are supported.
    HostCapability[HostCapability["SKILLS_V2"] = 17] = "SKILLS_V2";
    // Indicates that the host supports bytes extraction of embedded PDF rendered
    // in the Chrome PDF viewer.
    HostCapability[HostCapability["EMBEDDED_PDF_BYTES_EXTRACTION"] = 18] = "EMBEDDED_PDF_BYTES_EXTRACTION";
    // Indicates that the host operates in NoWebview mode.
    HostCapability[HostCapability["NO_WEBVIEW"] = 19] = "NO_WEBVIEW";
})(HostCapability$1 || (HostCapability$1 = {}));
// Lists capabilities that the glic web client may support.
var ClientCapabilities$1;
(function (ClientCapabilities) {
    // The glic web client does not use favicons in TabData, so they can
    // be omitted from TabData.
    ClientCapabilities[ClientCapabilities["IGNORES_TAB_DATA_FAVICONS"] = 0] = "IGNORES_TAB_DATA_FAVICONS";
})(ClientCapabilities$1 || (ClientCapabilities$1 = {}));
// Describes the duration of the actions in the task.  This is used by the actor
// to customize the task UI.
var TaskDuration;
(function (TaskDuration) {
    // The task has actions that permit user observation and intervention in the
    // browser.
    TaskDuration[TaskDuration["DEFAULT"] = 1] = "DEFAULT";
    // The task has fast actions that do not permit observation and intervention.
    TaskDuration[TaskDuration["TRANSIENT"] = 2] = "TRANSIENT";
})(TaskDuration || (TaskDuration = {}));
// Describes how long the user grants the actor with the permission to actuate.
// Used when the actor is to actuate with sensitive data, such as entering
// payment information or login credentials.
var UserGrantedPermissionDuration;
(function (UserGrantedPermissionDuration) {
    // The user only grants a one-time permission. The user will be asked again.
    // This is the default behavior.
    UserGrantedPermissionDuration[UserGrantedPermissionDuration["ONE_TIME"] = 0] = "ONE_TIME";
    // The user grants a permission to always allow the actor to actuate with
    // sensitive data. The persistence of this permission is defined differently
    // for different features.
    UserGrantedPermissionDuration[UserGrantedPermissionDuration["ALWAYS_ALLOW"] = 1] = "ALWAYS_ALLOW";
})(UserGrantedPermissionDuration || (UserGrantedPermissionDuration = {}));
// Describes the login method for the credential.
var CredentialType;
(function (CredentialType) {
    // Used to fill in a username/password form.
    CredentialType[CredentialType["PASSWORD"] = 0] = "PASSWORD";
    // Used with an identity provider (e.g. Sign in with Google).
    CredentialType[CredentialType["FEDERATED"] = 1] = "FEDERATED";
})(CredentialType || (CredentialType = {}));
// Mode for specific feature behaviors.
var FeatureMode$1;
(function (FeatureMode) {
    FeatureMode[FeatureMode["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    FeatureMode[FeatureMode["IMAGE_GENERATION"] = 1] = "IMAGE_GENERATION";
    FeatureMode[FeatureMode["ACTUATION"] = 2] = "ACTUATION";
    // Client feature mode to initiate actuation for Experimental Triggering.
    FeatureMode[FeatureMode["EXPERIMENTAL_TRIGGERING"] = 3] = "EXPERIMENTAL_TRIGGERING";
    // Client feature mode to initiate actuation for Universal Cart.
    FeatureMode[FeatureMode["UNIVERSAL_CART"] = 4] = "UNIVERSAL_CART";
    // Client feature mode for Promotion Page.
    FeatureMode[FeatureMode["PROMOTION_PAGE"] = 5] = "PROMOTION_PAGE";
    // Client feature mode to initiate actuation for Password Change.
    FeatureMode[FeatureMode["PASSWORD_CHANGE"] = 6] = "PASSWORD_CHANGE";
    // Client feature mode for Web Continuity.
    FeatureMode[FeatureMode["WEB_CONTINUITY"] = 7] = "WEB_CONTINUITY";
})(FeatureMode$1 || (FeatureMode$1 = {}));
// The panel can be in one of these three states.
var PanelStateKind;
(function (PanelStateKind) {
    // The panel is hidden.
    PanelStateKind[PanelStateKind["HIDDEN"] = 0] = "HIDDEN";
    // The panel is a floating window, detached from any browser window.
    PanelStateKind[PanelStateKind["DETACHED"] = 1] = "DETACHED";
    // The panel is a side panel, attached to a browser window.
    PanelStateKind[PanelStateKind["ATTACHED"] = 2] = "ATTACHED";
})(PanelStateKind || (PanelStateKind = {}));
// The platform glic is running on.
var Platform$1;
(function (Platform) {
    Platform[Platform["UNKNOWN"] = 0] = "UNKNOWN";
    Platform[Platform["MAC_OS"] = 1] = "MAC_OS";
    Platform[Platform["WINDOWS"] = 2] = "WINDOWS";
    Platform[Platform["LINUX"] = 3] = "LINUX";
    Platform[Platform["CHROME_OS"] = 4] = "CHROME_OS";
    Platform[Platform["ANDROID"] = 5] = "ANDROID";
})(Platform$1 || (Platform$1 = {}));
// The form factor of the device glic is running on.
var FormFactor;
(function (FormFactor) {
    FormFactor[FormFactor["UNKNOWN"] = 0] = "UNKNOWN";
    FormFactor[FormFactor["DESKTOP"] = 1] = "DESKTOP";
    FormFactor[FormFactor["PHONE"] = 2] = "PHONE";
    FormFactor[FormFactor["TABLET"] = 3] = "TABLET";
})(FormFactor || (FormFactor = {}));
// Represents an override of the First Run Experience (FRE).
var FreOverride;
(function (FreOverride) {
    FreOverride[FreOverride["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    // Deprecated: No longer used.
    // Variation that requires text input from the user to unlock full client.
    FreOverride[FreOverride["TRUST_FIRST_TEXT"] = 1] = "TRUST_FIRST_TEXT";
    // Variation that requires mouse click from the user to unlock full client.
    FreOverride[FreOverride["TRUST_FIRST_CLICK"] = 2] = "TRUST_FIRST_CLICK";
    // Variation that starts with full client unlocked and shows inline consent.
    FreOverride[FreOverride["TRUST_FIRST_INLINE"] = 3] = "TRUST_FIRST_INLINE";
})(FreOverride || (FreOverride = {}));
// Entry points that can trigger the opening of the panel.
var InvocationSource;
(function (InvocationSource) {
    // Button in the OS.
    InvocationSource[InvocationSource["OS_BUTTON"] = 0] = "OS_BUTTON";
    // Menu from button in the OS.
    InvocationSource[InvocationSource["OS_BUTTON_MENU"] = 1] = "OS_BUTTON_MENU";
    // OS-level hotkey.
    InvocationSource[InvocationSource["OS_HOTKEY"] = 2] = "OS_HOTKEY";
    // Button in top-chrome.
    InvocationSource[InvocationSource["TOP_CHROME_BUTTON"] = 3] = "TOP_CHROME_BUTTON";
    // First run experience.
    InvocationSource[InvocationSource["FRE"] = 4] = "FRE";
    // From the profile picker.
    InvocationSource[InvocationSource["PROFILE_PICKER"] = 5] = "PROFILE_PICKER";
    // From tab strip nudge.
    InvocationSource[InvocationSource["NUDGE"] = 6] = "NUDGE";
    // From 3-dot menu.
    InvocationSource[InvocationSource["THREE_DOTS_MENU"] = 7] = "THREE_DOTS_MENU";
    // An unsupported/unknown source.
    InvocationSource[InvocationSource["UNSUPPORTED"] = 8] = "UNSUPPORTED";
    // From the What's New page.
    InvocationSource[InvocationSource["WHATS_NEW"] = 9] = "WHATS_NEW";
    // User clicked the sign-in button and signed in.
    InvocationSource[InvocationSource["AFTER_SIGN_IN"] = 10] = "AFTER_SIGN_IN";
    // User shared a tab via the tab context menu.
    InvocationSource[InvocationSource["SHARED_TAB"] = 11] = "SHARED_TAB";
    // From the actor task icon.
    InvocationSource[InvocationSource["ACTOR_TASK_ICON"] = 12] = "ACTOR_TASK_ICON";
    // User shared an image via the context menu.
    InvocationSource[InvocationSource["SHARED_IMAGE"] = 13] = "SHARED_IMAGE";
    // From the handoff button.
    InvocationSource[InvocationSource["HANDOFF_BUTTON"] = 14] = "HANDOFF_BUTTON";
    // From invoking skills.
    InvocationSource[InvocationSource["SKILLS"] = 15] = "SKILLS";
    // Automatically opened from contextual cueing.
    InvocationSource[InvocationSource["AUTO_OPENED_BY_CONTEXTUAL_CUE"] = 16] = "AUTO_OPENED_BY_CONTEXTUAL_CUE";
    // User clicked the summarize button in the PDF viewer.
    InvocationSource[InvocationSource["PDF_SUMMARIZE_BUTTON"] = 17] = "PDF_SUMMARIZE_BUTTON";
    // From a navigation capture.
    InvocationSource[InvocationSource["NAVIGATION_CAPTURE"] = 18] = "NAVIGATION_CAPTURE";
    // Automatically opened for a PDF.
    InvocationSource[InvocationSource["AUTO_OPENED_FOR_PDF"] = 19] = "AUTO_OPENED_FOR_PDF";
    // Selection hotkey.
    InvocationSource[InvocationSource["CAPTURE_REGION_HOTKEY"] = 20] = "CAPTURE_REGION_HOTKEY";
    // From the in-product-help (IPH) entrypoint.
    InvocationSource[InvocationSource["IPH"] = 21] = "IPH";
    // User clicked an anchored contextual cue chip.
    InvocationSource[InvocationSource["ANCHORED_CONTEXTUAL_CUE"] = 22] = "ANCHORED_CONTEXTUAL_CUE";
    // From the context menu.
    InvocationSource[InvocationSource["WEB_CONTENTS_CONTEXT_MENU"] = 23] = "WEB_CONTENTS_CONTEXT_MENU";
    // User clicked on text selection nudge.
    InvocationSource[InvocationSource["TEXT_SELECTION_NUDGE"] = 24] = "TEXT_SELECTION_NUDGE";
    // User clicked on text selection widget.
    InvocationSource[InvocationSource["TEXT_SELECTION_WIDGET"] = 25] = "TEXT_SELECTION_WIDGET";
    // Automatic summarization upon opening.
    // Deprecated.
    InvocationSource[InvocationSource["ZERO_STATE_AUTO_SUMMARIZE"] = 26] = "ZERO_STATE_AUTO_SUMMARIZE";
    // From the universal cart.
    InvocationSource[InvocationSource["UNIVERSAL_CART"] = 27] = "UNIVERSAL_CART";
    // Used exclusively for invocations originating from the
    // GlicExperimentalTriggeringMessageHandler.
    InvocationSource[InvocationSource["EXPERIMENTAL_TRIGGERING"] = 28] = "EXPERIMENTAL_TRIGGERING";
    // Actuation triggered by the password change feature.
    InvocationSource[InvocationSource["PASSWORD_CHANGE"] = 29] = "PASSWORD_CHANGE";
    // From an Autofill action.
    InvocationSource[InvocationSource["AUTOFILL"] = 30] = "AUTOFILL";
    // Button in the toolbar.
    InvocationSource[InvocationSource["TOOLBAR_BUTTON"] = 31] = "TOOLBAR_BUTTON";
    // User clicked on an Indigo page action.
    InvocationSource[InvocationSource["INDIGO_PAGE_ACTION"] = 32] = "INDIGO_PAGE_ACTION";
    // User dropped a file/image onto the GLIC panel.
    InvocationSource[InvocationSource["WEB_DRAG_DROP"] = 33] = "WEB_DRAG_DROP";
    // From the promotion page.
    InvocationSource[InvocationSource["PROMOTION_PAGE"] = 34] = "PROMOTION_PAGE";
    // Side panel remained open on a new tab.
    InvocationSource[InvocationSource["DAISY_CHAIN_ON_NEW_TAB"] = 35] = "DAISY_CHAIN_ON_NEW_TAB";
    // Side panel remained open on a follow-link.
    InvocationSource[InvocationSource["DAISY_CHAIN_ON_FOLLOW_LINK"] = 36] = "DAISY_CHAIN_ON_FOLLOW_LINK";
    // User switched conversation.
    InvocationSource[InvocationSource["CONVERSATION_SWITCH"] = 37] = "CONVERSATION_SWITCH";
    // User detached or attached the panel.
    InvocationSource[InvocationSource["DETACH_ATTACH_BUTTON"] = 38] = "DETACH_ATTACH_BUTTON";
    // Restarted from a restored tab.
    InvocationSource[InvocationSource["TAB_RESTORE"] = 39] = "TAB_RESTORE";
    // Implicitly focused or revealed, e.g., on tab switch or re-focus.
    InvocationSource[InvocationSource["RESHOW_INACTIVE"] = 40] = "RESHOW_INACTIVE";
    // From the tab context menu.
    InvocationSource[InvocationSource["TAB_CONTEXT_MENU"] = 41] = "TAB_CONTEXT_MENU";
    // From Web Continuity.
    InvocationSource[InvocationSource["WEB_CONTINUITY"] = 42] = "WEB_CONTINUITY";
    // From the history page chat linkout.
    InvocationSource[InvocationSource["HISTORY_PAGE_CHAT_LINKOUT"] = 43] = "HISTORY_PAGE_CHAT_LINKOUT";
    // From the Context Hub topics UI.
    InvocationSource[InvocationSource["CONTEXT_HUB_TOPICS"] = 44] = "CONTEXT_HUB_TOPICS";
})(InvocationSource || (InvocationSource = {}));
// Target for actuation.
var ActuationTarget;
(function (ActuationTarget) {
    // Will default to the agent if the target is unknown.
    ActuationTarget[ActuationTarget["UNKNOWN"] = 0] = "UNKNOWN";
    // Agent infers the best location based on the prompt.
    ActuationTarget[ActuationTarget["AGENT_DECIDES"] = 1] = "AGENT_DECIDES";
    // Forces actuation on the initiating tab.
    ActuationTarget[ActuationTarget["CURRENT_TAB"] = 2] = "CURRENT_TAB";
    // Forces actuation in a new tab.
    ActuationTarget[ActuationTarget["NEW_TAB"] = 3] = "NEW_TAB";
    // Forces actuation on the target surface, if the surface is a valid tab.
    // Note: kTargetSurface can be different than kCurrentTab if the target
    // surface is not the foregrounded tab. This option has no effect if the
    // surface does not resolve to a valid tab.
    ActuationTarget[ActuationTarget["TARGET_SURFACE"] = 4] = "TARGET_SURFACE";
})(ActuationTarget || (ActuationTarget = {}));

// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// API between the Chrome browser and the Glic web client.
//
// Follow some notes providing more context about the Glic API and guidelines on
// how the web client code should be constructed around it. Check the internal
// documentation at http://shortn/_xFTHEnFhDV for more details.
//
// - There may be multiple instances of the web client running at a time, all
//   sharing the same local web storage space. Whenever one is started or
//   restarted, the initialization steps will be repeated.
// - The defined functions and interfaces can be "evolved" to provide more
//   functionality and data, as needed, but must be kept backwards compatible.
// - Functions are documented with their known behavior. Exceptions and promise
//   failures should be documented only if they are expected.
// - As in TypeScript all `number`s are 64 bit floating points, we decided to
//   make all identifier values be of the `string` type (e.g. for a window or a
//   tab).
// - The browser provided tab and window IDs are based on the browser's
//   SessionID values, which are not stable between Chrome restarts, and should
//   not be saved to persisted storage for later reuse. See:
//   https://crsrc.org/c/components/sessions/core/session_id.h
// - URLs can be arbitrarily long but any URL sent or received through this API
//   will be silently made empty if exceeding the 2 MiB length limit imposed by
//   Mojo's URL implementation. See:
//   https://crsrc.org/c/url/mojom/url.mojom
// - Avoid doing exhaustive checks against enums defined by the API, as their
//   values may evolve over time.
/// BEGIN_GENERATED - DO NOT MODIFY BELOW
var ActorTaskPauseReason = ActorTaskPauseReason$1;
var ActorTaskState = ActorTaskState$1;
var ActorTaskStopReason = ActorTaskStopReason$1;
var CaptureRegionErrorReason = CaptureRegionErrorReason$1;
var ClientCapabilities = ClientCapabilities$1;
var CreateTaskErrorReason = CreateTaskErrorReason$1;
var FeatureMode = FeatureMode$1;
var HostCapability = HostCapability$1;
var MicrophoneStatus = MicrophoneStatus$1;
var PerformActionsErrorReason = PerformActionsErrorReason$1;
var Platform = Platform$1;
var ScrollToErrorReason = ScrollToErrorReason$1;
var WebClientMode = WebClientMode$1;
/**
 * Provides measurement-related functionality to the Glic web client.
 *
 * The typical sequence of events should be either:
 *  (onUserInputSubmitted -> (onResponseStarted ->
 *                            onResponseStopped)*
 *  )*
 * or
 *  onUserInputSubmitted -> onResponseStopped -> * (repeat)
 *
 * This is the core flow for metrics and the web client should do its best to
 * provide accurate and timely callbacks.
 *
 * The concepts of session and rating are less well defined. There are
 * intentionally no constraints on when or how often they are called.
 */
/**
 * Specifies whether a tool execution blocks the conversation or runs
 * asynchronously.
 */
var ChromeToolBlockingBehavior;
(function (ChromeToolBlockingBehavior) {
    ChromeToolBlockingBehavior[ChromeToolBlockingBehavior["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    ChromeToolBlockingBehavior[ChromeToolBlockingBehavior["BLOCKING"] = 1] = "BLOCKING";
    ChromeToolBlockingBehavior[ChromeToolBlockingBehavior["NON_BLOCKING"] = 2] = "NON_BLOCKING";
})(ChromeToolBlockingBehavior || (ChromeToolBlockingBehavior = {}));
/**
 * Reason for failure when executing a host tool.
 */
var ExecuteToolErrorReason;
(function (ExecuteToolErrorReason) {
    ExecuteToolErrorReason[ExecuteToolErrorReason["UNKNOWN"] = 0] = "UNKNOWN";
    ExecuteToolErrorReason[ExecuteToolErrorReason["TOOL_NOT_FOUND"] = 1] = "TOOL_NOT_FOUND";
    ExecuteToolErrorReason[ExecuteToolErrorReason["INVALID_ARGUMENTS"] = 2] = "INVALID_ARGUMENTS";
    ExecuteToolErrorReason[ExecuteToolErrorReason["EXECUTION_FAILED"] = 3] = "EXECUTION_FAILED";
})(ExecuteToolErrorReason || (ExecuteToolErrorReason = {}));
/**
 * Specifies whether the tool result should be announced verbally over TTS or
 * handled silently.
 */
var ChromeToolResponseScheduling;
(function (ChromeToolResponseScheduling) {
    /** Default scheduling behavior. */
    ChromeToolResponseScheduling[ChromeToolResponseScheduling["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    /**
     * The tool result was handled (e.g. navigation performed) and does not need
     * verbal speech output or interruption.
     */
    ChromeToolResponseScheduling[ChromeToolResponseScheduling["SILENT"] = 1] = "SILENT";
    /**
     * The tool result requires immediate verbal notification and should interrupt
     * current speech synthesis output.
     */
    ChromeToolResponseScheduling[ChromeToolResponseScheduling["INTERRUPT"] = 2] = "INTERRUPT";
})(ChromeToolResponseScheduling || (ChromeToolResponseScheduling = {}));
var ResponseStopCause;
(function (ResponseStopCause) {
    /** User cancelled response. */
    ResponseStopCause[ResponseStopCause["USER"] = 0] = "USER";
    /** System cancelled response for another reason. */
    ResponseStopCause[ResponseStopCause["OTHER"] = 1] = "OTHER";
})(ResponseStopCause || (ResponseStopCause = {}));
/** The default value of TabContextOptions.pdfSizeLimit. */
const DEFAULT_PDF_SIZE_LIMIT = 64 * 1024 * 1024;
/** The default value of TabContextOptions.innerTextBytesLimit. */
const DEFAULT_INNER_TEXT_BYTES_LIMIT = 20000;
/** Reason why the web client could not initialize. */
var WebClientInitializeErrorReason;
(function (WebClientInitializeErrorReason) {
    /**
     * Unknown reason. The user can manually retry loading, which reloads the
     * entire webview.
     */
    WebClientInitializeErrorReason[WebClientInitializeErrorReason["UNKNOWN"] = 0] = "UNKNOWN";
    /** This list will be expanded later. */
})(WebClientInitializeErrorReason || (WebClientInitializeErrorReason = {}));
/** Reason for failure while acting in the focused tab. */
var ActInFocusedTabErrorReason;
(function (ActInFocusedTabErrorReason) {
    ActInFocusedTabErrorReason[ActInFocusedTabErrorReason["UNKNOWN"] = 0] = "UNKNOWN";
    /** Context could not be gathered after acting. */
    ActInFocusedTabErrorReason[ActInFocusedTabErrorReason["GET_CONTEXT_FAILED"] = 1] = "GET_CONTEXT_FAILED";
    /** The action proto is invalid. */
    ActInFocusedTabErrorReason[ActInFocusedTabErrorReason["INVALID_ACTION_PROTO"] = 2] = "INVALID_ACTION_PROTO";
    /** Action target is not found. */
    ActInFocusedTabErrorReason[ActInFocusedTabErrorReason["TARGET_NOT_FOUND"] = 3] = "TARGET_NOT_FOUND";
    /** Failed to start a new task. */
    ActInFocusedTabErrorReason[ActInFocusedTabErrorReason["FAILED_TO_START_TASK"] = 4] = "FAILED_TO_START_TASK";
})(ActInFocusedTabErrorReason || (ActInFocusedTabErrorReason = {}));

// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Note: this code is made to conform to glic_api's Observable, but can also be
// used independently.
function assertNotReachedCase(_param, message) {
    throw new Error('Assertion failed' + (message ? `: ${message}` : ''));
}
class ObservableSubscription {
    observer;
    onUnsubscribe;
    constructor(observer, onUnsubscribe) {
        this.observer = observer;
        this.onUnsubscribe = onUnsubscribe;
    }
    unsubscribe() {
        this.onUnsubscribe(this);
    }
}
/**
 * A base class for observables that handles subscribers.
 */
class ObservableBase {
    subscribers = new Set();
    state_ = 'active';
    errorValue;
    next(value) {
        switch (this.state_) {
            case 'active':
                break;
            case 'complete':
            case 'error':
                throw new Error('Observable is not active');
            default:
                assertNotReachedCase(this.state_);
        }
        this.subscribers.forEach((sub) => {
            // Ignore if removed since forEach was called.
            if (this.subscribers.has(sub)) {
                try {
                    sub.observer.next?.(value);
                }
                catch (e) {
                    console.warn(e);
                }
            }
        });
    }
    error(e) {
        switch (this.state_) {
            case 'active':
                this.state_ = 'error';
                this.errorValue = e;
                break;
            case 'complete':
            case 'error':
                throw new Error('Observable is not active');
            default:
                assertNotReachedCase(this.state_);
        }
        let loggedWarning = false;
        const hadSubscribers = this.hasActiveSubscription();
        this.subscribers.forEach((sub) => {
            // Ignore if removed since forEach was called.
            if (this.subscribers.has(sub)) {
                if (sub.observer.error) {
                    try {
                        sub.observer.error(e);
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
                else {
                    if (!loggedWarning) {
                        console.warn('unhandled error: ', e);
                        loggedWarning = true;
                    }
                }
            }
        });
        this.subscribers.clear();
        if (hadSubscribers) {
            this.activeSubscriptionChanged(false);
        }
    }
    complete() {
        switch (this.state_) {
            case 'active':
                this.state_ = 'complete';
                break;
            case 'complete':
            case 'error':
                throw new Error('Observable is not active');
            default:
                assertNotReachedCase(this.state_);
        }
        const hadSubscribers = this.hasActiveSubscription();
        this.subscribers.forEach((sub) => {
            // Ignore if removed since forEach was called.
            if (this.subscribers.has(sub)) {
                try {
                    sub.observer.complete?.();
                }
                catch (e) {
                    console.warn(e);
                }
            }
        });
        this.subscribers.clear();
        if (hadSubscribers) {
            this.activeSubscriptionChanged(false);
        }
    }
    isStopped() {
        return this.state_ !== 'active';
    }
    subscribe(changeOrObserver) {
        if (typeof changeOrObserver === 'function') {
            return this.subscribeObserver({
                next: (value) => {
                    changeOrObserver(value);
                },
            });
        }
        else {
            return this.subscribeObserver(changeOrObserver);
        }
    }
    /**
     * Subscribe to changes with an Observer.
     * This API was added in later, and provided as a separate function for Glic
     * API discovery purposes.
     */
    subscribeObserver(observer) {
        switch (this.state_) {
            case 'active':
                break;
            case 'complete':
                observer.complete?.();
                return { unsubscribe: () => { } };
            case 'error':
                observer.error?.(this.errorValue);
                return { unsubscribe: () => { } };
            default:
                assertNotReachedCase(this.state_);
        }
        const newSub = new ObservableSubscription(observer, this.onUnsubscribe.bind(this));
        if (this.subscribers.size === 0) {
            this.activeSubscriptionChanged(true);
        }
        this.subscribers.add(newSub);
        this.subscriberAdded(newSub);
        return newSub;
    }
    onUnsubscribe(sub) {
        if (!this.subscribers) {
            return;
        }
        if (this.subscribers.size === 0) {
            return;
        }
        this.subscribers.delete(sub);
        if (this.subscribers.size === 0) {
            this.activeSubscriptionChanged(false);
        }
    }
    subscriberAdded(_sub) { }
    activeSubscriptionChanged(_hasActiveSubscription) { }
    hasActiveSubscription() {
        return this.subscribers.size > 0;
    }
}
/**
 * A simple observable with no memory of previous values.
 */
class Subject extends ObservableBase {
    next(value) {
        super.next(value);
    }
}
/**
 * A observable value that can change over time. If value is initialized, sends
 * it to new subscribers upon subscribe().
 */
class ObservableValue extends Subject {
    isSet;
    value;
    hasActiveSubscriptionCallback;
    constructor(isSet, value, hasActiveSubscriptionCallback) {
        super();
        this.isSet = isSet;
        this.value = value;
        this.hasActiveSubscriptionCallback = hasActiveSubscriptionCallback;
    }
    /**
     * Create an ObservableValue which has an initial value. Optionally a
     * `hasActiveSubscriptionCallback` can be added which will be called with
     * `true` when this observable has its first subscriber and `false` when there
     * are no longer any subscribers to this observable.
     */
    static withValue(value, hasActiveSubscriptionCallback) {
        return new ObservableValue(true, value, hasActiveSubscriptionCallback);
    }
    /**
     * Create an ObservableValue which has no initial value. Subscribers will not
     * be called until after assignAndSignal() is called the first time.
     * Optionally a `hasActiveSubscriptionCallback` can be added which will be
     * called with `true` when this observable has its first subscriber and
     * false` when there are no longer any subscribers to this observable.
     */
    static withNoValue(hasActiveSubscriptionCallback) {
        return new ObservableValue(false, undefined, hasActiveSubscriptionCallback);
    }
    /**
     * Assigns a new value to the ObservableValue and signals all subscribers.
     * Does nothing if the value is unchanged.
     */
    assignAndSignal(v, force = false) {
        if (this.isStopped()) {
            throw new Error('ObservableValue is not active');
        }
        const send = !this.isSet || this.value !== v || force;
        this.isSet = true;
        this.value = v;
        if (!send) {
            return;
        }
        super.next(v);
    }
    /** Returns the current value, or undefined if not initialized. */
    getCurrentValue() {
        return this.value;
    }
    /**
     * Asynchronously waits until the ObservableValue's current value satisfies a
     * given criteria.
     */
    async waitUntil(criteria) {
        const { promise, resolve, reject } = Promise.withResolvers();
        const sub = this.subscribe({
            next(newValue) {
                if (criteria(newValue)) {
                    resolve(newValue);
                }
            },
            error: reject,
            complete() {
                reject(new Error('Observable completed'));
            },
        });
        let resultValue;
        try {
            resultValue = await promise;
        }
        finally {
            sub.unsubscribe();
        }
        return resultValue;
    }
    subscriberAdded(sub) {
        if (this.isSet) {
            sub.observer.next?.(this.value);
        }
    }
    activeSubscriptionChanged(hasActiveSubscription) {
        super.activeSubscriptionChanged(hasActiveSubscription);
        this.hasActiveSubscriptionCallback?.(hasActiveSubscription);
    }
}

// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class OneShotTimer {
    delayMs;
    timerId;
    promiseReject;
    constructor(delayMs) {
        this.delayMs = delayMs;
    }
    // Cancels any running timer.
    reset() {
        if (this.timerId !== undefined) {
            clearTimeout(this.timerId);
            this.timerId = undefined;
            if (this.promiseReject) {
                this.promiseReject(new Error('Timer reset'));
                this.promiseReject = undefined;
            }
        }
    }
    // Cancels any running timer, starts a new one. Callback is only
    // run if the timer is not reset first.
    start(callback) {
        this.startPromise().then(callback).catch(() => {
            // Catch and ignore timer reset.
        });
    }
    // Cancels any running timer, starts a new one. Resolves when
    // complete, rejects if canceled.
    startPromise() {
        this.reset();
        return new Promise((resolve, reject) => {
            this.promiseReject = reject;
            this.timerId = setTimeout(() => {
                this.timerId = undefined;
                resolve();
                this.promiseReject = undefined;
            }, this.delayMs);
        });
    }
}

// Copyright 2022 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Verify |value| is truthy.
 * @param value A value to check for truthiness. Note that this
 *     may be used to test whether |value| is defined or not, and we don't want
 *     to force a cast to boolean.
 */
function assert(value, message) {
    if (value) {
        return;
    }
    throw new Error('Assertion failed' + (message ? `: ${message}` : ''));
}
/**
 * Call this from places in the code that should never be reached.
 *
 * For example, handling all the values of enum with a switch() like this:
 *
 *   function getValueFromEnum(enum) {
 *     switch (enum) {
 *       case ENUM_FIRST_OF_TWO:
 *         return first
 *       case ENUM_LAST_OF_TWO:
 *         return last;
 *     }
 *     assertNotReached();
 *   }
 *
 * This code should only be hit in the case of serious programmer error or
 * unexpected input.
 */
function assertNotReached(message = 'Unreachable code hit') {
    assert(false, message);
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class ResponseExtras {
    transfers = [];
    // Add objects to transfer when sending the response over postMessage.
    addTransfer(...transfers) {
        this.transfers.push(...transfers);
    }
}
// Defines a message type. Ensures the message is structured cloneable.
// Currently returns undefined, as no information about the message is retained
// at runtime.
function defMessage() {
    return undefined;
}
function defInterface(def) {
    const tidyRequest = (m) => {
        const id = m.histogram?.id;
        if (id === undefined) {
            return m;
        }
        let name = m.histogram.name;
        if (name === undefined) {
            name = m.name.charAt(0).toUpperCase() + m.name.slice(1);
        }
        return { ...m, histogram: { name, id } };
    };
    return {
        ...def,
        methodMap: new Map(def.methods.map(m => [m.name, tidyRequest(m)])),
    };
}

// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/*
This file defines messages sent over postMessage in-between the Glic WebUI
and the Glic web client.

Most requests closely match signatures of API methods. Where possible, name
messages by concatenating the interface name with the method name. This helps
readability, and ensures that each name is unique.
*/
const WebClientHostDef = defInterface({
    name: 'WebClientHost',
    methods: [
        {
            name: 'webClientInitialized',
            request: defMessage(),
        },
        {
            name: 'getModelQualityClientId',
            response: defMessage(),
            histogram: { id: 8 },
        },
        {
            name: 'switchConversation',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 64 },
        },
        {
            name: 'registerConversation',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 65 },
        },
        {
            name: 'getContextFromFocusedTab',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 9 },
        },
        {
            name: 'getContextFromTab',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 10 },
        },
        {
            name: 'getImageBytesFromTab',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 101 },
        },
        {
            name: 'setMaximumNumberOfPinnedTabs',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 12 },
        },
        {
            name: 'activateTab',
            request: defMessage(),
            histogram: { id: 76 },
        },
        {
            name: 'resizeWindow',
            request: defMessage(),
            histogram: { id: 17 },
        },
        {
            name: 'enableDragResize',
            request: defMessage(),
            histogram: { id: 18 },
        },
        {
            name: 'setMinimumWidgetSize',
            request: defMessage(),
            histogram: { id: 20 },
        },
        {
            name: 'setMicrophonePermissionState',
            request: defMessage(),
            histogram: { id: 21 },
        },
        {
            name: 'setLocationPermissionState',
            request: defMessage(),
            histogram: { id: 22 },
        },
        {
            name: 'setTabContextPermissionState',
            request: defMessage(),
            histogram: { id: 23 },
        },
        {
            name: 'setClosedCaptioningSetting',
            request: defMessage(),
            histogram: { id: 56 },
        },
        {
            name: 'setActuationOnWebSetting',
            request: defMessage(),
            histogram: { id: 69 },
        },
        {
            name: 'getUserProfileInfo',
            response: defMessage(),
            histogram: { id: 25 },
        },
        {
            name: 'refreshSignInCookies',
            response: defMessage(),
            histogram: { id: 26 },
        },
        {
            name: 'setAudioDucking',
            request: defMessage(),
            histogram: { id: 29 },
        },
        {
            name: 'onUserInputSubmitted',
            request: defMessage(),
            histogram: { id: 38 },
        },
        {
            name: 'onReaction',
            request: defMessage(),
            histogram: { id: 66 },
        },
        {
            name: 'onOptinImpression',
            histogram: { id: 99 },
        },
        {
            name: 'onContextUploadStarted',
            histogram: { id: 68 },
        },
        {
            name: 'onContextUploadCompleted',
            histogram: { id: 67 },
        },
        {
            name: 'onResponseStarted',
            histogram: { id: 40 },
        },
        {
            name: 'onResponseStopped',
            request: defMessage(),
            histogram: { id: 41 },
        },
        {
            name: 'onSessionTerminated',
            histogram: { id: 42 },
        },
        {
            name: 'onTurnCompleted',
            request: defMessage(),
            histogram: { id: 43 },
        },
        {
            name: 'onResponseRated',
            request: defMessage(),
            histogram: { id: 39 },
        },
        {
            name: 'onClosedCaptionsShown',
            histogram: { id: 59 },
        },
        {
            name: 'onActionSubmitted',
            request: defMessage(),
            histogram: { id: 93 },
        },
        {
            name: 'setSyntheticExperimentState',
            request: defMessage(),
            histogram: { id: 46 },
        },
        {
            name: 'getOsMicrophonePermissionStatus',
            response: defMessage(),
            histogram: { id: 48 },
        },
        {
            name: 'pinTabs',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 49 },
        },
        {
            name: 'unpinTabs',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 50 },
        },
        {
            name: 'unpinAllTabs',
            request: defMessage(),
            histogram: { id: 51 },
        },
        {
            name: 'openPinnedTabPicker',
            request: defMessage(),
            histogram: { id: 104 },
        },
        {
            name: 'deleteCapturedRegion',
            request: defMessage(),
            histogram: { id: 92 },
        },
        {
            name: 'getZeroStateSuggestionsForFocusedTab',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 54 },
        },
        {
            name: 'maybeRefreshUserStatus',
            histogram: { id: 58 },
        },
        {
            name: 'subscribeToPageMetadata',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 63 },
        },
        {
            name: 'onModeChange',
            request: defMessage(),
            histogram: { id: 70 },
        },
        {
            name: 'setOnboardingCompleted',
            histogram: { id: 80 },
        },
        {
            name: 'subscribeToTabData',
            request: defMessage(),
            histogram: { id: 81 },
        },
        {
            name: 'onMicrophoneStatusChange',
            request: defMessage(),
            histogram: { id: 90 },
        },
        {
            name: 'recordHistogram',
            request: defMessage(),
        },
        {
            name: 'setErrorDialogState',
            request: defMessage(),
        },
        {
            name: 'reportClientTransientError',
            request: defMessage(),
        },
        {
            name: 'processCounterAbuseVerdict',
            request: defMessage(),
            histogram: { id: 100 },
        },
    ],
});
// Types of requests to the GlicWebClient.
const WebClientDef = defInterface({
    name: 'WebClient',
    methods: [],
});
const WebClientTabDataObserverDef = defInterface({
    name: 'WebClientTabDataObserver',
    methods: [
        {
            name: 'tabDataChanged',
            request: defMessage(),
        },
    ],
});
// Note: We are migrating API request reporting to C++. This list should be
// trimmed down and fully deleted eventually.
// See chrome/browser/glic/public/glic_api_metrics.h.
const RECORDED_REQUEST_IDS = {
    // Do not reuse deleted request ID: 1,
    // Do not reuse deleted request ID: 2,
    // Do not reuse deleted request ID: 3,
    // Do not reuse deleted request ID: 4,
    // Do not reuse deleted request ID: 5,
    // Do not reuse deleted request ID: 6,
    // Do not reuse deleted request ID: 7,
    GetModelQualityClientId: 8,
    GetContextFromFocusedTab: 9,
    GetContextFromTab: 10,
    // Do not reuse deleted request ID: 11,
    SetMaximumNumberOfPinnedTabs: 12,
    // Do not reuse deleted request ID: 13,
    // Do not reuse deleted request ID: 14,
    // Do not reuse deleted request ID: 15,
    // Do not reuse deleted request ID: 16,
    ResizeWindow: 17,
    EnableDragResize: 18,
    // Do not reuse deleted request ID: 19,
    SetMinimumWidgetSize: 20,
    SetMicrophonePermissionState: 21,
    SetLocationPermissionState: 22,
    SetTabContextPermissionState: 23,
    // Do not reuse deleted request ID: 24,
    GetUserProfileInfo: 25,
    RefreshSignInCookies: 26,
    // Do not reuse deleted request ID: 27,
    // Do not reuse deleted request ID: 28,
    SetAudioDucking: 29,
    // Do not reuse deleted request ID: 30,
    // Do not reuse deleted request ID: 31,
    // Do not reuse deleted request ID: 32,
    // Do not reuse deleted request ID: 33,
    // Do not reuse deleted request ID: 34,
    // Do not reuse deleted request ID: 35,
    // Do not reuse deleted request ID: 36,
    // Do not reuse deleted request ID: 37,
    OnUserInputSubmitted: 38,
    OnResponseRated: 39,
    OnResponseStarted: 40,
    OnResponseStopped: 41,
    OnSessionTerminated: 42,
    OnTurnCompleted: 43,
    // Do not reuse deleted request ID: 44,
    // Do not reuse deleted request ID: 45,
    SetSyntheticExperimentState: 46,
    // Do not reuse deleted request ID: 47,
    GetOsMicrophonePermissionStatus: 48,
    PinTabs: 49,
    UnpinTabs: 50,
    UnpinAllTabs: 51,
    // Do not reuse deleted request ID: 52,
    // Do not reuse deleted request ID: 53,
    GetZeroStateSuggestionsForFocusedTab: 54,
    // Do not reuse deleted request ID: 55,
    SetClosedCaptioningSetting: 56,
    // Do not reuse deleted request ID: 57,
    MaybeRefreshUserStatus: 58,
    OnClosedCaptionsShown: 59,
    // Do not reuse deleted request ID: 60,
    // Do not reuse deleted request ID: 61,
    // Do not reuse deleted request ID: 62,
    SubscribeToPageMetadata: 63,
    SwitchConversation: 64,
    RegisterConversation: 65,
    OnReaction: 66,
    OnContextUploadCompleted: 67,
    OnContextUploadStarted: 68,
    SetActuationOnWebSetting: 69,
    OnModeChange: 70,
    // Do not reuse deleted request ID: 71,
    // Do not reuse deleted request ID: 72,
    // Do not reuse deleted request ID: 73,
    // Do not reuse deleted request ID: 74,
    // Do not reuse deleted request ID: 75,
    ActivateTab: 76,
    // Do not reuse deleted request ID: 77,
    // Do not reuse deleted request ID: 78,
    SetOnboardingCompleted: 80,
    SubscribeToTabData: 81,
    // Do not reuse deleted request ID: 82,
    // Do not reuse deleted request ID: 83,
    // Do not reuse deleted request ID: 84,
    // Do not reuse deleted request ID: 85,
    // Do not reuse deleted request ID: 86,
    // Do not reuse deleted request ID: 87,
    // Do not reuse deleted request ID: 88,
    // Do not reuse deleted request ID: 89,
    OnMicrophoneStatusChange: 90,
    // Do not reuse deleted request ID: 91,
    DeleteCapturedRegion: 92,
    OnActionSubmitted: 93,
    // Do not reuse deleted request ID: 94,
    // Do not reuse deleted request ID: 95,
    // Do not reuse deleted request ID: 96,
    // Do not reuse deleted request ID: 97,
    // Do not reuse deleted request ID: 98,
    OnOptinImpression: 99,
    ProcessCounterAbuseVerdict: 100,
    GetImageBytesFromTab: 101,
    // Do not reuse deleted request ID: 102,
    // Do not reuse deleted request ID: 103,
    OpenPinnedTabPicker: 104,
    // Do not reuse deleted request ID: 105,
};
Math.max(...Object.values(RECORDED_REQUEST_IDS));
function getHostRequestHistogramInfo(requestType, interfaceDef) {
    if (!interfaceDef) {
        return undefined;
    }
    const method = interfaceDef.methodMap?.get(requestType);
    if (!method || !method.histogram) {
        return undefined;
    }
    const name = method.histogram.name ??
        (requestType.charAt(0).toUpperCase() + requestType.slice(1));
    return {
        name,
        id: method.histogram.id,
    };
}
var ImageAlphaType;
(function (ImageAlphaType) {
    // RGB values are unmodified.
    ImageAlphaType[ImageAlphaType["UNPREMUL"] = 0] = "UNPREMUL";
    // RGB values have been premultiplied by alpha.
    ImageAlphaType[ImageAlphaType["PREMUL"] = 1] = "PREMUL";
})(ImageAlphaType || (ImageAlphaType = {}));
// Chromium currently only uses a single color type for BitmapN32.
var ImageColorType;
(function (ImageColorType) {
    ImageColorType[ImageColorType["BGRA"] = 0] = "BGRA";
    ImageColorType[ImageColorType["RGBA"] = 1] = "RGBA";
})(ImageColorType || (ImageColorType = {}));
class ErrorWithReasonImpl extends Error {
    reasonType;
    reason;
    constructor(reasonType, reason, message) {
        super(message ?? `${reasonType} Error: ${reason}`);
        this.reasonType = reasonType;
        this.reason = reason;
    }
}
// Constructs an exception from a TransferableException.
function exceptionFromTransferable(e) {
    // Error types are serializable, but they do not serialize all members.
    // If exceptionReason is provided, we use it to reconstruct a
    // ErrorWithReason by just setting additional fields after
    // serialization.
    if (e.exceptionReason !== undefined) {
        const withReason = e.exception;
        withReason.reason = e.exceptionReason.reason;
        withReason.reasonType = e.exceptionReason.reasonType;
    }
    return e.exception;
}
// Transform an Error into a TransferableException.
function newTransferableException(e) {
    let exceptionReason = undefined;
    const maybeWithReason = e;
    if (maybeWithReason.reasonType !== undefined &&
        maybeWithReason.reason !== undefined) {
        exceptionReason = {
            reason: maybeWithReason.reason,
            reasonType: maybeWithReason.reasonType,
        };
    }
    return { exception: e, exceptionReason };
}
const ERROR_CODEC = {
    serialize: newTransferableException,
    deserialize: exceptionFromTransferable,
};

// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class BitmapHeaderGenerator {
    colorType;
    template;
    bytesPerPixel = 4;
    fileHeaderSize = 14;
    // Offsets of each field. 14 bytes total.
    // https://en.wikipedia.org/wiki/BMP_file_format#Bitmap_file_header
    bitmapFileHeaderFields = {
        'bfType': 0, // 2 bytes
        'bFileSize': 2, // 4 bytes
        // 'bReserved1': 6, // 2 bytes
        // 'bReserved2': 8, // 2 bytes
        'bOffBits': 10, // 4 bytes
    };
    // Offsets of each header field, 124 bytes total.
    // https://learn.microsoft.com/en-us/windows/win32/api/wingdi/ns-wingdi-bitmapv5header
    bitmapv5HeaderFields = {
        'bV5Size': 0, // 4 bytes
        'bV5Width': 4, // 4 bytes
        'bV5Height': 8, // 4 bytes
        'bV5Planes': 12, // 2 bytes
        'bV5BitCount': 14, // 2 bytes
        'bV5Compression': 16, // 4 bytes
        // 'bV5SizeImage': 20, // 4 bytes
        // 'bV5XPelsPerMeter': 24, // 4 bytes
        // 'bV5YPelsPerMeter': 28, // 4 bytes
        // 'bV5ClrUsed': 32, // 4 bytes
        // 'bV5ClrImportant': 36, // 4 bytes
        'bV5RedMask': 40, // 4 bytes
        'bV5GreenMask': 44, // 4 bytes
        'bV5BlueMask': 48, // 4 bytes
        'bV5AlphaMask': 52, // 4 bytes
        'bV5CSType': 56, // 4 bytes
        // 'bV5Endpoints': 60, // 36 bytes
        // 'bV5GammaRed': 96, // 4 bytes
        // 'bV5GammaGreen': 100, // 4 bytes
        // 'bV5GammaBlue': 104, // 4 bytes
        'bV5Intent': 108, // 4 bytes
        // 'bV5ProfileData': 112, // 4 bytes
        // 'bV5ProfileSize': 116, // 4 bytes
        // 'bV5Reserved': 120, // 4 bytes
    };
    totalHeaderSize = 138; // 14 + 124
    constructor(colorType) {
        this.colorType = colorType;
        this.template = this.createTemplate();
    }
    createBmpHeader(width, height) {
        // Copy the template.
        const buffer = this.template.slice(0);
        const dataView = new DataView(buffer);
        const pixelSize = Math.abs(width * height * this.bytesPerPixel);
        {
            const F = this.bitmapFileHeaderFields;
            dataView.setUint32(F.bFileSize, this.totalHeaderSize + pixelSize, true);
        }
        {
            const F = this.bitmapv5HeaderFields;
            const OFFSET = this.fileHeaderSize;
            dataView.setInt32(OFFSET + F.bV5Width, width, true);
            dataView.setInt32(OFFSET + F.bV5Height, height, true);
            if (this.colorType === ImageColorType.RGBA) {
                dataView.setUint32(OFFSET + F.bV5RedMask, 0x000000ff, true);
                dataView.setUint32(OFFSET + F.bV5GreenMask, 0x0000ff00, true);
                dataView.setUint32(OFFSET + F.bV5BlueMask, 0x00ff0000, true);
            }
        }
        return buffer;
    }
    // Creates a template for the bitmap header, which sets fields that
    // will not change depending on the image.
    createTemplate() {
        // Values here should match those in
        // skia/ext/skia_utils_win.cc.
        // Create the buffer for the header
        const buffer = new ArrayBuffer(this.totalHeaderSize);
        // Use a DataView to write bytes into the buffer.
        // In setUint*(), true = use little-endian
        const dataView = new DataView(buffer);
        {
            const F = this.bitmapFileHeaderFields;
            dataView.setUint8(F.bfType, 0x42); // 'B'
            dataView.setUint8(F.bfType + 1, 0x4D); // 'M'
            dataView.setUint32(F.bOffBits, this.totalHeaderSize, true);
        }
        {
            const F = this.bitmapv5HeaderFields;
            const OFFSET = this.fileHeaderSize;
            dataView.setUint32(OFFSET + F.bV5Size, 124, true);
            dataView.setUint16(OFFSET + F.bV5Planes, 1, true);
            dataView.setUint16(OFFSET + F.bV5BitCount, 32, true);
            dataView.setUint32(OFFSET + F.bV5Compression, this.colorType === ImageColorType.RGBA ? 3 /*BI_BITFIELDS*/ :
                0 /*BI_RGB*/, true);
            dataView.setUint32(OFFSET + F.bV5AlphaMask, 0xff000000, true);
            dataView.setUint32(OFFSET + F.bV5CSType, 0x57696E20 /*LCS_WINDOWS_COLOR_SPACE*/, true);
            dataView.setUint32(OFFSET + F.bV5Intent, 4 /*LCS_GM_IMAGES*/, true);
        }
        return buffer;
    }
}
const bitmapHeaderGenerators = [undefined, undefined];
// Converts an RgbaImage into a Blob. Output is a BMP.
function rgbaImageToBlob(image) {
    // It would be abnormal to see more than one color type, but we handle it
    // for safety.
    let headerGenerator = bitmapHeaderGenerators[image.colorType];
    if (!headerGenerator) {
        headerGenerator = new BitmapHeaderGenerator(image.colorType);
        bitmapHeaderGenerators[image.colorType] = headerGenerator;
    }
    return new Blob([
        // Note: A negative height indicates the pixel data's first row is at
        // the top of the image instead of the bottom.
        headerGenerator.createBmpHeader(image.width, -image.height),
        image.dataRGBA,
    ], {
        type: 'image/bmp',
    });
}

// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Helper function to shallow-copy an object and replace some properties.
// Useful to convert from these private types to public types. This will fail to
// compile if a property is missed.
function replaceProperties(original, replacements) {
    return Object.assign({}, original, replacements);
}

// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const conversionSettings = {
    platform: undefined,
    omitFaviconInTabData: false,
};
function idToClient(windowId) {
    if (windowId === null) {
        return undefined;
    }
    if (Number.isNaN(windowId)) {
        return '0';
    }
    return `${windowId}`;
}
function idFromClient(windowId) {
    if (windowId === undefined) {
        return null;
    }
    const parsed = parseInt(windowId);
    if (Number.isNaN(parsed)) {
        return 0;
    }
    return parsed;
}
function screenshotToClient(screenshot, extras) {
    if (!screenshot) {
        return undefined;
    }
    const screenshotArray = new Uint8Array(screenshot.data);
    const buffer = screenshotArray.buffer;
    extras.addTransfer(buffer);
    return {
        widthPixels: screenshot.widthPixels,
        heightPixels: screenshot.heightPixels,
        data: buffer,
        mimeType: screenshot.mimeType,
        originAnnotations: {},
        encryptionScheme: enumToClient(screenshot.encryptionScheme),
    };
}
function webPageDataToClient(webPageData) {
    if (!webPageData) {
        return undefined;
    }
    return {
        mainDocument: {
            origin: originToClient(webPageData.mainDocument.origin),
            innerText: webPageData.mainDocument.innerText,
            innerTextTruncated: webPageData.mainDocument.innerTextTruncated,
        },
    };
}
function pdfDocumentDataToClient(pdfDocumentData, extras) {
    if (!pdfDocumentData) {
        return undefined;
    }
    const pdfData = pdfDocumentData.pdfData ?
        new Uint8Array(pdfDocumentData.pdfData).buffer :
        undefined;
    if (pdfData) {
        extras.addTransfer(pdfData);
    }
    return {
        origin: originToClient(pdfDocumentData.origin),
        pdfSizeLimitExceeded: pdfDocumentData.pdfSizeLimitExceeded,
        pdfData,
    };
}
function protoWrapperToClient(protoWrapper, extras) {
    if (!protoWrapper) {
        return undefined;
    }
    const buffer = getArrayBufferFromBigBuffer(protoWrapper.smuggled);
    if (buffer) {
        extras.addTransfer(buffer);
    }
    return buffer;
}
function annotatedPageDataToClient(annotatedPageData, extras) {
    if (!annotatedPageData) {
        return undefined;
    }
    const annotatedPageContent = protoWrapperToClient(annotatedPageData.annotatedPageContent, extras);
    let metadata = undefined;
    if (annotatedPageData.metadata) {
        metadata = {
            frameMetadata: annotatedPageData.metadata.frameMetadata.map(m => replaceProperties(m, { url: urlToClient(m.url) })),
        };
    }
    return { annotatedPageContent, metadata };
}
function optionalToClient(value) {
    if (value === null) {
        return undefined;
    }
    return value;
}
function optionalFromClient(value) {
    if (value === undefined) {
        return null;
    }
    return value;
}
function urlToClient(url) {
    if (url === null) {
        return undefined;
    }
    return url;
}
function urlFromClient(url) {
    return url;
}
function originToClient(origin) {
    if (!origin) {
        return undefined;
    }
    if (!origin.scheme) {
        return '';
    }
    const originBase = `${origin.scheme}://${origin.host}`;
    if (origin.port) {
        return `${originBase}:${origin.port}`;
    }
    return originBase;
}
function originToClientOpaqueAsNull(origin) {
    if (origin?.nonceIfOpaque) {
        return 'null';
    }
    return originToClient(origin);
}
function tabDataToPrivate(tabData, extras) {
    if (!tabData) {
        return undefined;
    }
    let favicon = undefined;
    if (tabData.favicon && !conversionSettings.omitFaviconInTabData) {
        favicon = bitmapN32ToRGBAImage(tabData.favicon);
        if (favicon) {
            extras.addTransfer(favicon.dataRGBA);
        }
    }
    const isObservable = optionalToClient(tabData.isObservable);
    const isMediaActive = optionalToClient(tabData.isMediaActive);
    const isTabContentCaptured = optionalToClient(tabData.isTabContentCaptured);
    const isActiveInWindow = optionalToClient(tabData.isActiveInWindow);
    const isWindowActive = optionalToClient(tabData.isWindowActive);
    return {
        tabId: idToClient(tabData.tabId),
        windowId: idToClient(tabData.windowId),
        url: urlToClient(tabData.url),
        title: optionalToClient(tabData.title),
        favicon,
        faviconUrl: urlToClient(tabData.faviconUrl),
        documentMimeType: tabData.documentMimeType,
        isObservable,
        isMediaActive,
        isTabContentCaptured,
        isActiveInWindow,
        isWindowActive,
        lightweightPageFeatures: tabData.lightweightPageFeatures?.map(feature => enumToClient(feature)),
    };
}
function tabDataToClient(tabData) {
    if (!tabData) {
        return undefined;
    }
    let faviconResult;
    const bitmap = tabData.favicon;
    const getFavicon = (bitmap && !conversionSettings.omitFaviconInTabData) ? async () => {
        if (!faviconResult) {
            const rgbaImage = bitmapN32ToRGBAImage(bitmap);
            if (rgbaImage) {
                faviconResult = Promise.resolve(rgbaImageToBlob(rgbaImage));
            }
        }
        return faviconResult;
    } : undefined;
    return {
        tabId: idToClient(tabData.tabId),
        windowId: idToClient(tabData.windowId),
        url: urlToClient(tabData.url),
        title: optionalToClient(tabData.title),
        favicon: getFavicon,
        faviconUrl: urlToClient(tabData.faviconUrl),
        documentMimeType: tabData.documentMimeType,
        isObservable: optionalToClient(tabData.isObservable),
        isMediaActive: optionalToClient(tabData.isMediaActive),
        isTabContentCaptured: optionalToClient(tabData.isTabContentCaptured),
        isActiveInWindow: optionalToClient(tabData.isActiveInWindow),
        isWindowActive: optionalToClient(tabData.isWindowActive),
        lightweightPageFeatures: tabData.lightweightPageFeatures?.map(feature => enumToClient(feature)),
    };
}
function pinCandidateToClient(candidate) {
    return {
        tabData: tabDataToClient(candidate.tabData),
    };
}
// Microseconds between Windows epoch (1601-01-01 00:00:00 UTC) used by
// base::Time / mojo_base.mojom.Time and Unix epoch (1970-01-01 00:00:00 UTC)
// used by JS Date.
// See also:
// - chrome/browser/resources/new_tab_page/modules/calendar/common.ts
// - chrome/browser/resources/context_hub/memory_banks/memory_banks.ts
// - ui/webui/resources/cr_components/history_clusters/clusters.ts
const WINDOWS_TO_UNIX_EPOCH_OFFSET_US = 11644473600000000n;
function timeToClient(time) {
    if (!time || time.internalValue === 0n) {
        return undefined;
    }
    const unixEpochMs = Number((time.internalValue - WINDOWS_TO_UNIX_EPOCH_OFFSET_US) / 1000n);
    return new Date(unixEpochMs);
}
function focusedTabDataToClient(focusedTabData, extras) {
    if (focusedTabData.focusedTab) {
        return {
            hasFocus: { tabData: tabDataToPrivate(focusedTabData.focusedTab, extras) },
        };
    }
    if (focusedTabData.noFocusedTabData) {
        return {
            hasNoFocus: {
                tabFocusCandidateData: tabDataToPrivate(focusedTabData.noFocusedTabData.activeTabData, extras),
                noFocusReason: focusedTabData.noFocusedTabData.noFocusReason,
            },
        };
    }
    console.error('Invalid FocusedTabDataMojo');
    return {};
}
function getArrayBufferFromBigBuffer(bigBuffer) {
    if (bigBuffer.bytes !== undefined) {
        return new Uint8Array(bigBuffer.bytes).buffer;
    }
    return bigBuffer.sharedMemory?.bufferHandle
        .mapBuffer(0, bigBuffer.sharedMemory.size)
        .buffer;
}
function bitmapN32ToRGBAImage(bitmap) {
    if (bitmap.imageInfo.width === 0 || bitmap.imageInfo.height === 0) {
        return undefined;
    }
    const bytes = getArrayBufferFromBigBuffer(bitmap.pixelData);
    if (!bytes || bytes.byteLength === 0) {
        return undefined;
    }
    // Color type on Android is different from other platforms. Because color type
    // isn't transmitted over mojo, we need use platform to detect it here.
    const colorType = conversionSettings.platform === Platform.ANDROID ?
        ImageColorType.RGBA :
        ImageColorType.BGRA;
    return {
        width: bitmap.imageInfo.width,
        height: bitmap.imageInfo.height,
        dataRGBA: bytes,
        alphaType: bitmap.imageInfo.alphaType === AlphaType.PREMUL ?
            ImageAlphaType.PREMUL :
            ImageAlphaType.UNPREMUL,
        colorType,
    };
}
function panelOpeningDataToClient(panelOpeningData) {
    const conversationInfo = conversationInfoToClient(panelOpeningData.conversationInfo);
    return {
        panelState: panelStateToClient(panelOpeningData.panelState),
        invocationSource: enumToClient(panelOpeningData.invocationSource),
        conversationId: conversationInfo?.conversationId || undefined,
        promptSuggestion: optionalToClient(panelOpeningData.promptSuggestion),
        autoSend: panelOpeningData.autoSend && !!panelOpeningData.promptSuggestion,
        recentlyActiveConversations: panelOpeningData.recentlyActiveConversations ?
            panelOpeningData.recentlyActiveConversations.map(conversationInfoToClient) :
            undefined,
        conversationInfo,
        freOverride: enumToClient(panelOpeningData.freOverride),
    };
}
function conversationInfoToClient(conversationInfo) {
    return {
        conversationId: conversationInfo.conversationId,
        conversationTitle: conversationInfo.conversationTitle,
        clientData: conversationInfo.clientData ?
            new TextDecoder().decode(new Uint8Array(conversationInfo.clientData.data)) :
            undefined,
        turnId: optionalToClient(conversationInfo.turnId),
    };
}
function conversationInfoFromClient(conversationInfo) {
    return {
        conversationId: conversationInfo.conversationId,
        conversationTitle: conversationInfo.conversationTitle,
        clientData: conversationInfo.clientData ? {
            data: Array.from(new TextEncoder().encode(conversationInfo.clientData)),
        } :
            null,
        turnId: optionalFromClient(conversationInfo.turnId),
    };
}
function counterAbuseVerdictFromClient(verdict) {
    return {
        sbVerdictResult: {
            url: verdict.sbVerdictResult.url,
            threatType: enumFromClient(verdict.sbVerdictResult.threatType),
            showInterstitial: verdict.sbVerdictResult.showInterstitial,
        },
    };
}
function panelStateToClient(panelState) {
    return {
        kind: enumToClient(panelState.kind),
        windowId: idToClient(panelState.windowId),
    };
}
function pageMetadataToClient(metadata) {
    if (!metadata) {
        return null;
    }
    return {
        frameMetadata: metadata.frameMetadata.map(m => replaceProperties(m, { url: urlToClient(m.url) })),
    };
}
/** Takes a time value in milliseconds and converts to a Mojo TimeDelta. */
function timeDeltaFromClient(durationMs = 0) {
    if (!Number.isFinite(durationMs)) {
        throw new Error('Invalid duration value: ' + durationMs);
    }
    return { microseconds: BigInt(Math.floor(durationMs * 1000)) };
}
function tabContextToClient(tabContext, extras) {
    const tabData = tabDataToPrivate(tabContext.tabData, extras);
    const webPageData = webPageDataToClient(tabContext.webPageData);
    const viewportScreenshot = screenshotToClient(tabContext.viewportScreenshot, extras);
    const screenshotInfo = protoWrapperToClient(tabContext.screenshotInfo, extras);
    const pdfDocumentData = pdfDocumentDataToClient(tabContext.pdfDocumentData, extras);
    const annotatedPageData = annotatedPageDataToClient(tabContext.annotatedPageData, extras);
    return {
        tabData,
        webPageData,
        viewportScreenshot,
        screenshotInfo,
        pdfDocumentData,
        annotatedPageData,
    };
}
function tabContextOptionsFromClient(options) {
    return {
        innerText: options.innerText ?? false,
        innerTextBytesLimit: options.innerTextBytesLimit ?? DEFAULT_INNER_TEXT_BYTES_LIMIT,
        viewportScreenshot: options.viewportScreenshot === true ||
            options.screenshotCollectionOptions !== undefined,
        pdfData: options.pdfData ?? false,
        annotatedPageContent: options.annotatedPageContent ?? false,
        maxMetaTags: options.maxMetaTags ?? 0,
        pdfSizeLimit: options.pdfSizeLimit === undefined ?
            DEFAULT_PDF_SIZE_LIMIT :
            Math.min(Number.MAX_SAFE_INTEGER, options.pdfSizeLimit),
        annotatedPageContentMode: options.annotatedPageContentMode === undefined ?
            0 :
            options.annotatedPageContentMode,
        screenshotCollectionOptions: screenshotCollectionOptionsFromClient(options.screenshotCollectionOptions),
    };
}
// Taken from mojo_type_utils.ts
function getPinCandidatesOptionsFromClient(options) {
    return {
        maxCandidates: options.maxCandidates,
        query: options.query ?? null,
    };
}
function pinTriggerToMojo(trigger) {
    return (trigger ?? PinTrigger$1.kWebClientUnknown);
}
function pinTabsOptionsToMojo(options) {
    if (!options) {
        return null;
    }
    return {
        pinTrigger: pinTriggerToMojo(options.pinTrigger),
    };
}
function unpinTriggerToMojo(trigger) {
    return (trigger ?? UnpinTrigger$1.kWebClientUnknown);
}
function unpinTabsOptionsToMojo(options) {
    if (!options) {
        return null;
    }
    return {
        unpinTrigger: unpinTriggerToMojo(options.unpinTrigger),
    };
}
function openPinnedTabPickerOptionsToMojo(options) {
    if (!options) {
        return null;
    }
    return {};
}
function createTabOptionsFromClient(options = {}) {
    return {
        openInBackground: options.openInBackground ?? false,
        windowId: idFromClient(options.windowId),
    };
}
function byteArrayFromClient(buffer) {
    const byteArray = new Uint8Array(buffer);
    return Array.from(byteArray);
}
function hostCapabilitiesToClient(capabilities) {
    return capabilities.map(capability => enumToClient(capability));
}
function webClientModeToMojo(mode) {
    switch (mode) {
        case WebClientMode.AUDIO:
            return WebClientMode$2.kAudio;
        case WebClientMode.TEXT:
            return WebClientMode$2.kText;
        default:
            return WebClientMode$2.kUnknown;
    }
}
function microphoneStatusToMojo(status) {
    switch (status) {
        case MicrophoneStatus.LISTENING:
            return MicrophoneStatus$2.kListening;
        case MicrophoneStatus.NOT_LISTENING:
            return MicrophoneStatus$2.kNotListening;
        case MicrophoneStatus.UNKNOWN:
        default:
            return MicrophoneStatus$2.kUnknown;
    }
}
function captureRegionResultToClient(result) {
    if (!result) {
        return undefined;
    }
    const region = result.region.rect ? { rect: result.region.rect } :
        result.region.polyline ? { polyline: result.region.polyline } :
            undefined;
    return {
        tabId: idToClient(result.tabId),
        region,
    };
}
function zeroStateSuggestionsToClient(zeroStateSuggestions) {
    return {
        suggestions: zeroStateSuggestions.suggestions,
        isPending: zeroStateSuggestions.isPending,
        invocationSource: enumToClient(zeroStateSuggestions.invocationSource),
    };
}
function zssConfigToClient(zssConfig) {
    return {
        additionalContent: zssConfig.additionalContent || undefined,
    };
}
function skillsPayloadToClient(payload) {
    return {
        skillId: payload.skillId || '',
        skillName: payload.skillName,
        skillIcon: payload.skillIcon,
    };
}
function invokeOptionsToClient(options, extras) {
    return {
        invocationSource: enumToClient(options.invocationSource),
        prompts: options.prompts || undefined,
        context: options.context ?
            additionalContextToClient(options.context, extras) :
            undefined,
        autoSubmit: options.autoSubmit,
        featureMode: enumToClient(options.featureMode),
        actuationTarget: enumToClient(options.actuationTarget),
        disableZeroStateSuggestions: options.disableZeroStateSuggestions,
        skillId: options.skillId || undefined,
        zssConfig: options.zssConfig ? zssConfigToClient(options.zssConfig) :
            undefined,
        payload: invocationPayloadToClient(options.payload, extras),
        actuationTabId: idToClient(options.actuationTabId),
    };
}
function invocationPayloadToClient(payload, extras) {
    if (!payload) {
        return undefined;
    }
    if (payload.universalCart) {
        const buffer = new Uint8Array(payload.universalCart.serializedMetadata).buffer;
        extras.addTransfer(buffer);
        return {
            universalCart: {
                serializedMetadata: buffer,
            },
        };
    }
    if (payload.skillsPayload) {
        return {
            skillsPayload: skillsPayloadToClient(payload.skillsPayload),
        };
    }
    throw new Error('Unknown payload type');
}
function additionalContextToClient(context, extras) {
    const parts = context.parts ?
        context.parts.map(p => additionalContextPartToClient(p, extras)) :
        [];
    // Filter out undefined parts if any.
    const validParts = [];
    for (const p of parts) {
        if (p) {
            validParts.push(p);
        }
    }
    return {
        source: enumToClient(context.source),
        name: context.name || undefined,
        tabId: idToClient(context.tabId),
        origin: context.origin ? originToClient(context.origin) : undefined,
        frameUrl: context.frameUrl ? urlToClient(context.frameUrl) : undefined,
        parts: validParts,
    };
}
function additionalContextPartToClient(part, extras) {
    const result = {};
    if (part.data) {
        result.data = {
            mimeType: part.data.mimeType,
            data: getArrayBufferFromBigBuffer(part.data.data),
        };
        result.filename = optionalToClient(part.data.filename);
        extras.addTransfer(result.data.data);
    }
    else if (part.screenshot) {
        result.screenshot = screenshotToClient(part.screenshot, extras);
    }
    else if (part.webPageData) {
        result.webPageData = webPageDataToClient(part.webPageData);
    }
    else if (part.annotatedPageData) {
        result.annotatedPageData =
            annotatedPageDataToClient(part.annotatedPageData, extras);
    }
    else if (part.pdfDocumentData) {
        result.pdf = pdfDocumentDataToClient(part.pdfDocumentData, extras);
    }
    else if (part.tabContext) {
        result.tabContext = tabContextToClient(part.tabContext, extras);
    }
    else if (part.region) {
        const regionMojo = part.region;
        if (regionMojo) {
            return {
                region: {
                    rect: regionMojo.rect,
                    polyline: regionMojo.polyline,
                },
            };
        }
    }
    else if (part.pendingRegion) {
        const regionMojo = part.pendingRegion.region;
        if (regionMojo) {
            return {
                pendingRegion: {
                    id: part.pendingRegion.id,
                    region: {
                        rect: regionMojo.rect,
                        polyline: regionMojo.polyline,
                    },
                },
            };
        }
    }
    else if (part.parentConversationMetadata) {
        result.parentConversationMetadata = {
            conversationId: optionalToClient(part.parentConversationMetadata.conversationId),
            conversationTitle: optionalToClient(part.parentConversationMetadata.conversationTitle),
        };
    }
    return result;
}
function screenshotCollectionOptionsFromClient(options) {
    return {
        maxWidth: options?.maxWidth ?? 0,
        maxHeight: options?.maxHeight ?? 0,
        screenshotImageFormat: options?.screenshotImageFormat ?
            enumFromClient(options.screenshotImageFormat) :
            ScreenshotImageFormat$1.kJpeg,
        screenshotCompressionQuality: options?.screenshotCompressionQuality ?
            enumFromClient(options.screenshotCompressionQuality) :
            ScreenshotCompressionQuality$1.kMedium,
    };
}
function imageInfoToClient(info) {
    return {
        caption: optionalToClient(info.caption),
        sourceOrigin: originToClientOpaqueAsNull(info.sourceOrigin),
        url: urlToClient(info.url),
        mimeType: optionalToClient(info.mimeType),
    };
}
function imageBytesResultToClient(result, extras) {
    const buffer = getArrayBufferFromBigBuffer(result.bytes);
    if (!buffer) {
        return null;
    }
    extras.addTransfer(buffer);
    return {
        bytes: buffer,
        imageInfo: imageInfoToClient(result.imageInfo),
    };
}
function fileUploadPolicyStateToClient(state) {
    return enumToClient(state);
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function getGuestLoadTimeData() {
    return window.glicGuestLoadTimeData ??
        {};
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const MAX_ARRAY_LENGTH = 10;
/**
 * Converts a value to a JSON string for debug logging.
 *
 * Inclusively serializes primitive types, BigInt, plain objects, Arrays, Maps,
 * Sets, and ArrayBuffers, while preventing traversal into arbitrary class
 * instances and circular structures. Long arrays are truncated with '...'.
 */
function toDebugJson(v) {
    try {
        const seen = new WeakSet();
        return JSON.stringify(v, (_key, value) => {
            if (typeof value === 'bigint') {
                return value.toString();
            }
            if (typeof value !== 'object' || value === null) {
                return value;
            }
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
            if (Array.isArray(value)) {
                if (value.length > MAX_ARRAY_LENGTH) {
                    return [...value.slice(0, MAX_ARRAY_LENGTH), '...'];
                }
                return value;
            }
            if (value instanceof Set) {
                const arr = Array.from(value);
                if (arr.length > MAX_ARRAY_LENGTH) {
                    return [...arr.slice(0, MAX_ARRAY_LENGTH), '...'];
                }
                return arr;
            }
            if (value instanceof Map) {
                try {
                    return Object.fromEntries(value.entries());
                }
                catch {
                    return Array.from(value.entries());
                }
            }
            if (value instanceof ArrayBuffer) {
                return `ArrayBuffer(${value.byteLength})`;
            }
            if (ArrayBuffer.isView(value)) {
                return `${value.constructor.name}(${value.byteLength})`;
            }
            if (value instanceof Error) {
                return `${value.name}: ${value.message}`;
            }
            if (value instanceof Date || value instanceof RegExp) {
                return value;
            }
            const proto = Object.getPrototypeOf(value);
            if (proto === Object.prototype || proto === null) {
                return value;
            }
            // For any other object or class instance, avoid traversing internal
            // state.
            return `[${value.constructor?.name || 'Object'}]`;
        });
    }
    catch (err) {
        return String(v);
    }
}
/**
 * Wraps a Mojo Remote or Receiver handler object in a logging Proxy if logging
 * is enabled (either via `options.enabled` or
 * `getGuestLoadTimeData().loggingEnabled`). If logging is disabled, returns
 * `target` directly with no wrapper or performance overhead.
 */
function maybeWrapWithLogging(target, options = {}) {
    const enabled = options.enabled ?? (getGuestLoadTimeData().loggingEnabled ?? false);
    if (!enabled) {
        return target;
    }
    const ignoreMethods = options.ignoreMethods ?? new Set(['checkResponsive']);
    const prefix = options.prefix ?? target.constructor?.name ?? 'Mojo';
    return new Proxy(target, {
        get(targetObj, prop, receiver) {
            const origValue = Reflect.get(targetObj, prop, receiver);
            // Do not intercept Mojo internals (e.g. `remote.$`) or non-functions.
            if (typeof origValue !== 'function' || typeof prop === 'symbol' ||
                prop.startsWith('$')) {
                return origValue;
            }
            const methodName = String(prop);
            if (ignoreMethods.has(methodName)) {
                return origValue.bind(targetObj);
            }
            return function (...args) {
                console.info(`${prefix} [${methodName}] sending request: ${toDebugJson(args)}`, args);
                try {
                    const result = origValue.apply(targetObj, args);
                    if (result instanceof Promise) {
                        return result.then((response) => {
                            console.info(`${prefix} [${methodName}] received response: ${toDebugJson(response)}`, response);
                            return response;
                        }, (error) => {
                            console.warn(`${prefix} [${methodName}] received error:`, error);
                            throw error;
                        });
                    }
                    return result;
                }
                catch (error) {
                    console.warn(`${prefix} [${methodName}] threw error synchronously:`, error);
                    throw error;
                }
            };
        },
    });
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Web client side actor message handler.
// Implements actor-specific methods on GlicBrowserHost.
class GlicBrowserHostActor {
    actorHandler;
    actorClientReceiver;
    userConfirmationDialogRequestSubject = new Subject();
    selectCredentialDialogRequestSubject = new Subject();
    navigationConfirmationRequestSubject = new Subject();
    actorTaskState = new Map();
    selectAutofillSuggestionsDialogRequestSubject = new Subject();
    selectGmailOtpOptInRequestSubject = new Subject();
    selectGmailOtpConfirmationRequestSubject = new Subject();
    journalHost;
    actOnWebCapabilityValue = ObservableValue.withNoValue();
    actorTaskListRowClickedSubject = new Subject();
    // TODO: Remove this from the API.
    actInFocusedTab = undefined;
    initialize(initialState, handler) {
        if (!initialState.enableActInFocusedTab || !handler) {
            this.selectUserConfirmationDialogRequestHandler = undefined;
            this.selectCredentialDialogRequestHandler = undefined;
            this.selectNavigationConfirmationRequestHandler = undefined;
            this.selectAutofillSuggestionsDialogRequestHandler = undefined;
            this.getContextForActorFromTab = undefined;
            this.createTask = undefined;
            this.performActions = undefined;
            this.cancelActions = undefined;
            this.stopActorTask = undefined;
            this.pauseActorTask = undefined;
            this.resumeActorTask = undefined;
            this.interruptActorTask = undefined;
            this.uninterruptActorTask = undefined;
            this.updateActorTaskStepProgress = undefined;
            this.getActorTaskState = undefined;
            this.createActorTab = undefined;
            this.getActOnWebCapability = undefined;
            this.actorTaskListRowClicked = undefined;
            this.getJournalHost = undefined;
            return;
        }
        this.actorHandler = maybeWrapWithLogging(new ActorHandlerRemote(), { prefix: 'ActorHandler' });
        this.actorClientReceiver = new ActorClientReceiver(this);
        handler.createActorHandler(this.actorHandler.$.bindNewPipeAndPassReceiver(), this.actorClientReceiver.$.bindNewPipeAndPassRemote());
        this.journalHost = new GlicBrowserHostJournalImpl(this.actorHandler);
        if (!initialState.enableGmailOtpOptIn) {
            this.selectGmailOtpOptInRequestHandler = undefined;
        }
        if (!initialState.enableGmailOtpConfirmation) {
            this.selectGmailOtpConfirmationRequestHandler = undefined;
        }
        if (!initialState.enableGetContextActor) {
            // MOJO_RUNTIME_FEATURE_GATED GetContextForActorFromTab
            this.getContextForActorFromTab = undefined;
        }
    }
    destroyActor() {
        if (this.actorHandler) {
            this.actorHandler.$.close();
            this.actorHandler = undefined;
        }
        if (this.actorClientReceiver) {
            this.actorClientReceiver.$.close();
            this.actorClientReceiver = undefined;
        }
    }
    setActorTaskState(taskId, state) {
        const stateObs = this.getActorTaskState?.(taskId);
        stateObs?.assignAndSignal(state);
        if (state === ActorTaskState.STOPPED) {
            this.actorTaskState.delete(taskId);
        }
    }
    selectUserConfirmationDialogRequestHandler() {
        return this.userConfirmationDialogRequestSubject;
    }
    selectCredentialDialogRequestHandler() {
        return this.selectCredentialDialogRequestSubject;
    }
    selectNavigationConfirmationRequestHandler() {
        return this.navigationConfirmationRequestSubject;
    }
    selectGmailOtpOptInRequestHandler() {
        return this.selectGmailOtpOptInRequestSubject;
    }
    selectGmailOtpConfirmationRequestHandler() {
        return this.selectGmailOtpConfirmationRequestSubject;
    }
    selectAutofillSuggestionsDialogRequestHandler() {
        return this.selectAutofillSuggestionsDialogRequestSubject;
    }
    autofillSuggestionDialogOnFormPresented(taskId, params) {
        this.actorHandler?.autofillSuggestionDialogOnFormPresented(taskId, params);
    }
    autofillSuggestionDialogOnFormPreviewChanged(taskId, params) {
        this.actorHandler?.autofillSuggestionDialogOnFormPreviewChanged(taskId, {
            formFillingRequestIndex: params.formFillingRequestIndex,
            response: params.response ?? null,
        });
    }
    autofillSuggestionDialogOnFormConfirmed(taskId, params) {
        this.actorHandler?.autofillSuggestionDialogOnFormConfirmed(taskId, params);
    }
    async getContextForActorFromTab(tabId, options) {
        assert(this.actorHandler);
        const { result: { errorReason, tabContext } } = await this.actorHandler.getContextForActorFromTab(idFromClient(tabId), tabContextOptionsFromClient(options));
        if (!tabContext) {
            throw new Error(`tabContext failed: ${errorReason}`);
        }
        const tabContextResult = tabContextToClient(tabContext, new ResponseExtras());
        return convertTabContextResultFromPrivate(tabContextResult);
    }
    async createTask(taskOptions) {
        assert(this.actorHandler);
        try {
            return await this.actorHandler.createTask(taskOptionsToMojo(taskOptions));
        }
        catch (errorReason) {
            throw new ErrorWithReasonImpl('createTask', errorReason ??
                CreateTaskErrorReason.UNKNOWN);
        }
    }
    async performActions(actions) {
        assert(this.actorHandler);
        try {
            const resultProto = await this.actorHandler.performActions(byteArrayFromClient(actions));
            const buffer = getArrayBufferFromBigBuffer(resultProto.smuggled);
            if (!buffer) {
                throw PerformActionsErrorReason.UNKNOWN;
            }
            return buffer;
        }
        catch (errorReason) {
            throw new ErrorWithReasonImpl('performActions', errorReason ??
                PerformActionsErrorReason.UNKNOWN);
        }
    }
    async cancelActions(taskId) {
        assert(this.actorHandler);
        const cancelResult = await this.actorHandler.cancelActions(taskId);
        return enumToClient(cancelResult.result);
    }
    stopActorTask(taskId, stopReason) {
        this.actorHandler?.stopActorTask(taskId ?? 0, enumFromClient(stopReason ?? ActorTaskStopReason.TASK_COMPLETE));
    }
    pauseActorTask(taskId, pauseReason, tabId) {
        this.actorHandler?.pauseActorTask(taskId, enumFromClient(pauseReason ?? ActorTaskPauseReason.PAUSED_BY_MODEL), idFromClient(tabId));
    }
    async resumeActorTask(taskId, tabContextOptions) {
        assert(this.actorHandler);
        const { result: { getContextResult, actionResult, }, } = await this.actorHandler.resumeActorTask(taskId, tabContextOptionsFromClient(tabContextOptions));
        if (!getContextResult.tabContext || actionResult === null) {
            throw new Error(`resumeActorTask failed: ${getContextResult.errorReason}`);
        }
        const extras = new ResponseExtras();
        const resumeActorTaskResult = resumeActorTaskResultToClient(getContextResult.tabContext, actionResult, extras);
        return convertTabContextResultFromPrivate(resumeActorTaskResult);
    }
    interruptActorTask(taskId, interruptReason) {
        this.actorHandler?.interruptActorTask(taskId, enumFromClient(interruptReason));
    }
    uninterruptActorTask(taskId) {
        this.actorHandler?.uninterruptActorTask(taskId);
    }
    updateActorTaskStepProgress(taskId, stepProgress) {
        this.actorHandler?.updateActorTaskStepProgress(taskId, stepProgress);
    }
    getActorTaskState(taskId) {
        const stateObs = this.actorTaskState.get(taskId);
        if (stateObs) {
            return stateObs;
        }
        // TODO(mcnee): The client could pass an id that will never have
        // state updates (e.g. the task already finished and we cleared the old
        // observable in setActorTaskState). Consider removing these cases from the
        // map when all subscribers are removed.
        const newObs = ObservableValue.withNoValue();
        this.actorTaskState.set(taskId, newObs);
        return newObs;
    }
    async createActorTab(taskId, options) {
        assert(this.actorHandler);
        const response = await this.actorHandler.createActorTab(taskId, {
            initiatorTabId: idFromClient(options.initiatorTabId),
            initiatorWindowId: idFromClient(options.initiatorWindowId),
            openInBackground: options.openInBackground === true,
        });
        const tabData = response.tabData;
        if (tabData) {
            return convertTabDataFromPrivate({
                tabId: idToClient(tabData.tabId),
                windowId: idToClient(tabData.windowId),
                url: urlToClient(tabData.url),
                title: optionalToClient(tabData.title),
            });
        }
        throw new Error('createActorTab: failed');
    }
    getActOnWebCapability() {
        return this.actOnWebCapabilityValue;
    }
    actorTaskListRowClicked() {
        return this.actorTaskListRowClickedSubject;
    }
    getJournalHost() {
        assert(this.journalHost);
        return this.journalHost;
    }
    // ActorClientInterface implementation:
    notifyActorTaskStateChanged(taskId, state) {
        this.setActorTaskState(taskId, enumToClient(state));
    }
    async requestToShowCredentialSelectionDialog(request) {
        return new Promise(resolve => {
            if (!this.selectCredentialDialogRequestSubject.hasActiveSubscription()) {
                window.console.warn('GlicWebClient: no subscriber for ' +
                    'selectCredentialDialogRequest()!');
                resolve({
                    response: {
                        taskId: request.taskId,
                        errorReason: SelectCredentialDialogErrorReason
                            .kDialogPromiseNoSubscriber,
                        permissionDuration: null,
                        selectedCredentialId: null,
                    },
                });
                return;
            }
            const iconsGetter = new Map();
            if (request.icons) {
                for (const [id, value] of Object.entries(request.icons)) {
                    let promise;
                    iconsGetter.set(id, () => {
                        if (!promise) {
                            const rgbaImage = bitmapN32ToRGBAImage(value);
                            promise = Promise.resolve(rgbaImage ? rgbaImageToBlob(rgbaImage) : new Blob());
                        }
                        return promise;
                    });
                }
            }
            const credentials = request.credentials.map(credential => {
                const getIcon = iconsGetter.get(credential.sourceSiteOrApp);
                const accountPicture = credential.accountPicture ?
                    bitmapN32ToRGBAImage(credential.accountPicture) :
                    undefined;
                const getAccountPicture = accountPicture ?
                    () => Promise.resolve(rgbaImageToBlob(accountPicture)) :
                    undefined;
                return {
                    id: credential.id,
                    username: credential.username,
                    sourceSiteOrApp: credential.sourceSiteOrApp,
                    requestOrigin: originToClient(credential.requestOrigin),
                    type: enumToClient(credential.type),
                    getIcon,
                    getAccountPicture,
                };
            });
            const requestWithCallback = {
                taskId: request.taskId,
                showDialog: request.showDialog,
                credentials,
                onDialogClosed: (result) => {
                    resolve({
                        response: {
                            taskId: request.taskId,
                            errorReason: null,
                            permissionDuration: optionalFromClient(result.response.permissionDuration),
                            selectedCredentialId: result.response.selectedCredentialId ?? null,
                        },
                    });
                },
            };
            this.selectCredentialDialogRequestSubject.next(requestWithCallback);
        });
    }
    requestToShowUserConfirmationDialog(request) {
        return new Promise(resolve => {
            if (!this.userConfirmationDialogRequestSubject.hasActiveSubscription()) {
                window.console.warn('GlicWebClient: no subscriber for ' +
                    'userConfirmationDialogRequest()!');
                resolve({
                    response: {
                        result: {
                            permissionGranted: false,
                        },
                    },
                });
                return;
            }
            const requestWithCallback = {
                navigationOrigin: request.payload.navigationOrigin ?
                    originToClient(request.payload.navigationOrigin) :
                    undefined,
                forBlocklistedOrigin: request.payload.forBlocklistedOrigin,
                onDialogClosed: (result) => {
                    resolve({
                        response: {
                            result: {
                                permissionGranted: result.response.permissionGranted,
                            },
                        },
                    });
                },
            };
            this.userConfirmationDialogRequestSubject.next(requestWithCallback);
        });
    }
    requestToConfirmNavigation(request) {
        return new Promise(resolve => {
            if (!this.navigationConfirmationRequestSubject.hasActiveSubscription()) {
                window.console.warn('GlicWebClient: no subscriber for ' +
                    'navigationConfirmationRequest()!');
                resolve({
                    response: {
                        result: {
                            permissionGranted: false,
                        },
                    },
                });
                return;
            }
            const requestWithCallback = {
                taskId: request.taskId,
                navigationOrigin: originToClient(request.navigationOrigin),
                onConfirmationDecision: (result) => {
                    resolve({
                        response: {
                            result: {
                                permissionGranted: result.response.permissionGranted ?? false,
                            },
                        },
                    });
                },
            };
            this.navigationConfirmationRequestSubject.next(requestWithCallback);
        });
    }
    requestToShowAutofillSuggestionsDialog(request) {
        return new Promise(resolve => {
            if (!this.selectAutofillSuggestionsDialogRequestSubject
                .hasActiveSubscription()) {
                resolve({
                    response: {
                        taskId: request.taskId,
                        result: {
                            errorReason: SelectAutofillSuggestionsDialogErrorReason
                                .kDialogPromiseNoSubscriber,
                        },
                    },
                });
                return;
            }
            const requestWithCallback = {
                formFillingRequests: request.formFillingRequests.map(formFillingRequest => ({
                    requestedData: Number(formFillingRequest.requestedData),
                    formattedRequestOrigin: formFillingRequest.formattedRequestOrigin ?? undefined,
                    sectionLabel: formFillingRequest.sectionLabel ?? undefined,
                    suggestions: formFillingRequest.suggestions.map(suggestion => {
                        const icon = suggestion.icon ?
                            bitmapN32ToRGBAImage(suggestion.icon) :
                            undefined;
                        const getIcon = icon ?
                            () => Promise.resolve(rgbaImageToBlob(icon)) :
                            undefined;
                        return {
                            id: suggestion.id,
                            title: suggestion.title,
                            details: suggestion.details,
                            getIcon,
                        };
                    }),
                })),
                onDialogClosed: (result) => {
                    resolve({
                        response: {
                            taskId: request.taskId,
                            result: {
                                selectedSuggestions: result.response.selectedSuggestions,
                            },
                        },
                    });
                },
                onFormPresented: (params) => {
                    this.autofillSuggestionDialogOnFormPresented(request.taskId, params);
                },
                onFormPreviewChanged: (params) => {
                    this.autofillSuggestionDialogOnFormPreviewChanged(request.taskId, params);
                },
                onFormConfirmed: (params) => {
                    this.autofillSuggestionDialogOnFormConfirmed(request.taskId, params);
                },
            };
            this.selectAutofillSuggestionsDialogRequestSubject.next(requestWithCallback);
        });
    }
    requestToShowGmailOtpOptInDialog(request) {
        return new Promise(resolve => {
            if (!this.selectGmailOtpOptInRequestSubject.hasActiveSubscription()) {
                window.console.warn('GlicWebClient: no subscriber for ' +
                    'selectGmailOtpOptInRequestHandler()!');
                resolve({
                    result: {
                        errorReason: GmailOtpErrorReason.kRequestPromiseNoSubscriber,
                    },
                });
                return;
            }
            const requestWithCallback = {
                taskId: request.taskId,
                onDialogClosed: (response) => {
                    resolve({
                        result: {
                            response: {
                                permissionGranted: response.permissionGranted,
                            },
                        },
                    });
                },
            };
            this.selectGmailOtpOptInRequestSubject.next(requestWithCallback);
        });
    }
    requestToShowGmailOtpConfirmationDialog(request) {
        return new Promise(resolve => {
            if (!this.selectGmailOtpConfirmationRequestSubject
                .hasActiveSubscription()) {
                window.console.warn('GlicWebClient: no subscriber for ' +
                    'selectGmailOtpConfirmationRequestHandler()!');
                resolve({
                    result: {
                        errorReason: GmailOtpErrorReason.kRequestPromiseNoSubscriber,
                    },
                });
                return;
            }
            const requestWithCallback = {
                taskId: request.taskId,
                verificationCode: request.verificationCode,
                onDialogClosed: (response) => {
                    resolve({
                        result: {
                            response: {
                                permissionGranted: response.permissionGranted,
                            },
                        },
                    });
                },
            };
            this.selectGmailOtpConfirmationRequestSubject.next(requestWithCallback);
        });
    }
}
class GlicBrowserHostJournalImpl {
    actorHandler;
    constructor(actorHandler) {
        this.actorHandler = actorHandler;
    }
    beginAsyncEvent(asyncEventId, taskId, event, details) {
        this.actorHandler.logBeginAsyncEvent(BigInt(asyncEventId), taskId, event, details);
    }
    clear() {
        this.actorHandler.journalClear();
    }
    endAsyncEvent(asyncEventId, details) {
        this.actorHandler.logEndAsyncEvent(BigInt(asyncEventId), details);
    }
    instantEvent(taskId, event, details) {
        this.actorHandler.logInstantEvent(taskId, event, details);
    }
    async snapshot(clear) {
        const result = await this.actorHandler.journalSnapshot(clear);
        const journalArray = new Uint8Array(result.journal.data);
        return {
            data: journalArray.buffer,
        };
    }
    start(maxBytes, captureScreenshots) {
        this.actorHandler.journalStart(BigInt(maxBytes), captureScreenshots);
    }
    stop() {
        this.actorHandler.journalStop();
    }
    recordFeedback(positive, reason) {
        this.actorHandler.journalRecordFeedback(positive, reason);
    }
}
function taskOptionsToMojo(taskOptions) {
    if (taskOptions) {
        return {
            title: taskOptions.title ?? null,
            duration: enumFromClient(taskOptions.duration),
            featureMode: enumFromClient(taskOptions.featureMode ?? FeatureMode.UNSPECIFIED),
            actuationTabId: taskOptions.actuationTabId ?
                idFromClient(taskOptions.actuationTabId) :
                null,
        };
    }
    return null;
}
function resumeActorTaskResultToClient(tabContext, actionResult, extras) {
    return {
        ...tabContextToClient(tabContext, extras),
        actionResult,
    };
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class GlicBrowserHostAnnotation {
    annotationHandler;
    handler;
    initialize(initialState, handler) {
        if (!initialState.enableScrollTo || !handler) {
            this.scrollTo = undefined;
            this.dropScrollToHighlight = undefined;
            return;
        }
        this.handler = handler;
    }
    destroyAnnotation() {
        if (this.annotationHandler) {
            this.annotationHandler.$.close();
            this.annotationHandler = undefined;
        }
        this.handler = undefined;
        this.scrollTo = undefined;
        this.dropScrollToHighlight = undefined;
    }
    async scrollTo(params) {
        function getMojoSelector() {
            const { selector } = params;
            if (selector.exactText !== undefined) {
                if (selector.exactText.searchRangeStartNodeId !== undefined &&
                    params.documentId === undefined) {
                    throw new ErrorWithReasonImpl('scrollTo', ScrollToErrorReason.NOT_SUPPORTED, 'searchRangeStartNodeId without documentId');
                }
                return {
                    exactText: {
                        text: selector.exactText.text,
                        searchRangeStartNodeId: selector.exactText.searchRangeStartNodeId ?? null,
                    },
                };
            }
            if (selector.textFragment !== undefined) {
                if (selector.textFragment.searchRangeStartNodeId !== undefined &&
                    params.documentId === undefined) {
                    throw new ErrorWithReasonImpl('scrollTo', ScrollToErrorReason.NOT_SUPPORTED, 'searchRangeStartNodeId without documentId');
                }
                return {
                    textFragment: {
                        textStart: selector.textFragment.textStart,
                        textEnd: selector.textFragment.textEnd,
                        searchRangeStartNodeId: selector.textFragment.searchRangeStartNodeId ?? null,
                    },
                };
            }
            if (selector.node !== undefined) {
                if (params.documentId === undefined) {
                    throw new ErrorWithReasonImpl('scrollTo', ScrollToErrorReason.NOT_SUPPORTED, 'nodeId without documentId');
                }
                return {
                    node: {
                        nodeId: selector.node.nodeId,
                    },
                };
            }
            throw new ErrorWithReasonImpl('scrollTo', ScrollToErrorReason.NOT_SUPPORTED);
        }
        const mojoParams = {
            highlight: params.highlight === undefined ? true : params.highlight,
            selector: getMojoSelector(),
            documentId: params.documentId ?? null,
            url: params.url ? urlFromClient(params.url) : null,
        };
        const { errorReason } = await this.getAnnotationHandler().scrollTo(mojoParams);
        if (errorReason !== null) {
            throw new ErrorWithReasonImpl('scrollTo', enumToClient(errorReason));
        }
    }
    dropScrollToHighlight() {
        this.getAnnotationHandler().dropScrollToHighlight();
    }
    getAnnotationHandler() {
        if (this.annotationHandler) {
            return this.annotationHandler;
        }
        assert(this.handler);
        this.annotationHandler = maybeWrapWithLogging(new AnnotationHandlerRemote(), { prefix: 'AnnotationHandler' });
        this.handler.createAnnotationHandler(this.annotationHandler.$.bindNewPipeAndPassReceiver());
        return this.annotationHandler;
    }
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// How long to wait for the web client to report whether a confirmation
// response was applied. Applying a response is a local operation, so the
// client is expected to reply promptly. If it doesn't, the response is
// reported as not applied so that the browser's reply callback is never left
// pending indefinitely.
const CONFIRMATION_RESPONSE_TIMEOUT_MS = 30 * 1000;
class GlicBrowserHostExperimentalTriggering {
    // TODO(csharrison): Apply the same teardown and timeout handling used for
    // `confirmationResponsesSubject` here, so that an upload which never
    // completes can't leave the browser's reply callback pending.
    uploadEncryptedScreenshotRequestsSubject = new Subject();
    confirmationResponsesSubject = new Subject();
    webClient;
    clientReceiver;
    enableStructuredYieldMetadata = null;
    updateHandlers = new Map();
    // Settles in-flight `submitExperimentalTriggeringConfirmationResponse()`
    // calls. Tracked so that each call is guaranteed to settle exactly once,
    // even if the web client never invokes onComplete(), or if this host is
    // destroyed while a response is in flight.
    pendingConfirmationResponses = new Set();
    initialize(webClient, handler) {
        this.webClient = webClient;
        this.clientReceiver?.$.close();
        this.clientReceiver = new ExperimentalTriggeringClientReceiver(this);
        handler.createExperimentalTriggeringClient(this.clientReceiver.$.bindNewPipeAndPassRemote());
    }
    destroy() {
        if (this.clientReceiver) {
            this.clientReceiver.$.close();
            this.clientReceiver = undefined;
        }
        for (const [handler, subscriber] of this.updateHandlers) {
            handler.$.close();
            subscriber.unsubscribe();
        }
        this.updateHandlers.clear();
        // Settle any in-flight confirmation responses as unapplied, and complete
        // the subject so that subscribers are notified and cleaned up rather than
        // waiting on requests that can no longer be answered.
        for (const settle of Array.from(this.pendingConfirmationResponses)) {
            settle(false);
        }
        this.pendingConfirmationResponses.clear();
        if (!this.confirmationResponsesSubject.isStopped()) {
            this.confirmationResponsesSubject.complete();
        }
    }
    async getExperimentalTriggeringUpdates(handler) {
        if (!this.webClient) {
            return { success: false };
        }
        const getUpdates = this.webClient.getExperimentalTriggeringUpdates;
        if (!getUpdates) {
            return { success: false };
        }
        const observable = await getUpdates.call(this.webClient);
        if (!observable) {
            return { success: false };
        }
        let completed = false;
        let subscriber;
        const cleanup = () => {
            if (completed) {
                return;
            }
            completed = true;
            this.updateHandlers.delete(handler);
            subscriber?.unsubscribe();
            subscriber = undefined;
        };
        handler.onConnectionError.addListener(() => {
            cleanup();
        });
        if (this.enableStructuredYieldMetadata === null) {
            this.enableStructuredYieldMetadata =
                getGuestLoadTimeData().enableStructuredYieldMetadata ?? false;
        }
        subscriber = observable.subscribeObserver({
            next: (update) => {
                handler.onUpdate(update ? {
                    type: enumFromClient(update.type),
                    data: update.data,
                    metadata: this.enableStructuredYieldMetadata ?
                        optionalFromClient(update.metadata) :
                        null,
                } :
                    null, SubscriberObservationType.kUpdate);
            },
            complete: () => {
                handler.onUpdate(null, SubscriberObservationType.kComplete);
                cleanup();
            },
            error: (_err) => {
                handler.onUpdate(null, SubscriberObservationType.kError);
                cleanup();
            },
        });
        if (!completed) {
            this.updateHandlers.set(handler, subscriber);
        }
        return { success: true };
    }
    uploadEncryptedScreenshotRequests() {
        return this.uploadEncryptedScreenshotRequestsSubject;
    }
    confirmationResponses() {
        return this.confirmationResponsesSubject;
    }
    async submitExperimentalTriggeringConfirmationResponse(response) {
        if (this.confirmationResponsesSubject.isStopped() ||
            !this.confirmationResponsesSubject.hasActiveSubscription()) {
            return { accepted: false };
        }
        const buffer = new Uint8Array(response).buffer;
        const { promise, resolve } = Promise.withResolvers();
        // Resolves the reply on whichever happens first: the client calling
        // onComplete(), the timeout below, or destroy(). Later calls are no-ops,
        // so the client cannot resolve the same request twice.
        const settle = (applied) => {
            if (!this.pendingConfirmationResponses.delete(settle)) {
                return;
            }
            clearTimeout(timeoutId);
            resolve(applied);
        };
        this.pendingConfirmationResponses.add(settle);
        // Only ever read from `settle`, which cannot run until after the request
        // is emitted below.
        const timeoutId = setTimeout(() => {
            console.warn('Timed out waiting for a confirmation response result.');
            settle(false);
        }, CONFIRMATION_RESPONSE_TIMEOUT_MS);
        try {
            this.confirmationResponsesSubject.next({
                response: buffer,
                onComplete: (applied) => {
                    settle(applied);
                },
            });
        }
        catch (e) {
            console.warn('Failed to deliver confirmation response:', e);
            settle(false);
        }
        return { accepted: await promise };
    }
    async uploadEncryptedScreenshot(screenshot) {
        const extras = new ResponseExtras();
        const clientScreenshot = screenshotToClient(screenshot, extras);
        if (!clientScreenshot) {
            return { fileToken: null };
        }
        try {
            const fileToken = await this.uploadEncryptedScreenshotInternal(clientScreenshot);
            return { fileToken };
        }
        catch (e) {
            console.warn('Failed to upload encrypted screenshot:', e);
            return { fileToken: null };
        }
    }
    async uploadEncryptedScreenshotInternal(screenshot) {
        if (!this.uploadEncryptedScreenshotRequestsSubject
            .hasActiveSubscription()) {
            return null;
        }
        const { promise, resolve, reject } = Promise.withResolvers();
        try {
            this.uploadEncryptedScreenshotRequestsSubject.next({
                screenshot,
                uploadComplete: (fileToken) => {
                    resolve(fileToken);
                },
            });
        }
        catch (e) {
            reject(e);
        }
        return promise;
    }
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class GlicBrowserHostGeic {
    handler;
    handlerRemote;
    initialize(_initialState, handler) {
        this.handler = handler;
    }
    destroy() {
        if (this.handlerRemote) {
            this.handlerRemote.$.close();
            this.handlerRemote = undefined;
        }
        this.handler = undefined;
    }
    async openSignInTab(options) {
        const mojoOptions = options ? {
            signinUrl: options.signinUrl ?? null,
        } :
            null;
        const response = await this.getGeicHandler().openSignInTab(mojoOptions);
        return enumToClient(response.result);
    }
    async closeSignInTab(options) {
        const response = await this.getGeicHandler().closeSignInTab(options ?? null);
        return enumToClient(response.result);
    }
    getGeicHandler() {
        assert(this.handler);
        if (!this.handlerRemote) {
            this.handlerRemote = new GeminiEnterpriseHandlerRemote();
            this.handler.createGeminiEnterpriseHandler(this.handlerRemote.$.bindNewPipeAndPassReceiver());
        }
        return this.handlerRemote;
    }
}

// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Defines some types shared across files in host/.
var PanelOpenState;
(function (PanelOpenState) {
    PanelOpenState[PanelOpenState["OPEN"] = 0] = "OPEN";
    PanelOpenState[PanelOpenState["CLOSED"] = 1] = "CLOSED";
})(PanelOpenState || (PanelOpenState = {}));

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function skillPreviewToClient(preview, isContextual) {
    return {
        ...preview,
        source: enumToClient(preview.source),
        curatedBy: optionalToClient(preview.curatedBy),
        imageUrl: urlToClient(preview.imageUrl),
        category: optionalToClient(preview.category),
        creationTime: timeToClient(preview.creationTime),
        isContextual,
    };
}
function skillToClient(skill) {
    return {
        preview: skillPreviewToClient(skill.preview, false),
        prompt: skill.prompt,
        sourceSkillId: optionalToClient(skill.sourceSkillId),
    };
}
class GlicBrowserSkillsImpl {
    host;
    constructor(host) {
        this.host = host;
    }
    async createSkill(request) {
        const result = await this.host.getSkillsHandler().createSkill({
            id: request.id ?? '',
            name: request.name ?? '',
            icon: request.icon ?? '',
            prompt: request.prompt,
            description: request.description ?? '',
            source: enumFromClient(request.source) ?? SkillSource$1.kUnknown,
        });
        if (!result.modalOpened) {
            throw new Error('createSkill: failed to open dialog');
        }
    }
    async updateSkill(request) {
        const result = await this.host.getSkillsHandler().updateSkill(request);
        if (!result.modalOpened) {
            throw new Error('updateSkill: failed to open dialog');
        }
    }
    showManageSkillsUi() {
        this.host.getSkillsHandler().showManageSkillsUi();
    }
    showBrowseSkillsUi() {
        this.host.getSkillsHandler().showBrowseSkillsUi();
    }
    async getSkill(id) {
        const { skill: mojoSkill } = await this.host.getSkillsHandler().getSkill(id);
        if (!mojoSkill) {
            throw new Error('getSkill: failed');
        }
        return skillToClient(mojoSkill);
    }
    recordSkillsWebClientEvent(event) {
        this.host.getSkillsHandler().recordSkillsWebClientEvent(enumFromClient(event));
    }
    getSkillPreviews() {
        return this.host.skillPreviews;
    }
}
class GlicBrowserHostSkills {
    skillsHandler;
    skillsClientReceiver;
    cachedSkillPreviews = [];
    cachedContextualSkillPreviews = [];
    skillPreviews = ObservableValue.withNoValue();
    skillToInvoke = ObservableValue.withNoValue();
    skillsObservable = ObservableValue.withValue(undefined);
    skillsInstance = new GlicBrowserSkillsImpl(this);
    initialize(initialState, handler) {
        this.setSkillsEnabled(initialState.enableSkills);
        // Support legacy behavior (which had these functions exist or not exist
        // based on feature enablement as of initialization).
        if (!initialState.enableSkills) {
            this.createSkill = undefined;
            this.updateSkill = undefined;
            this.showManageSkillsUi = undefined;
            this.showBrowseSkillsUi = undefined;
            this.getSkill = undefined;
            this.recordSkillsWebClientEvent = undefined;
            this.getSkillPreviews = undefined;
            this.getSkillToInvoke = undefined;
        }
        this.skillsHandler = maybeWrapWithLogging(new SkillsHandlerRemote(), { prefix: 'SkillsHandler' });
        this.skillsClientReceiver = new SkillsClientReceiver(this);
        handler.createSkillsHandler(this.skillsHandler.$.bindNewPipeAndPassReceiver(), this.skillsClientReceiver.$.bindNewPipeAndPassRemote());
    }
    destroySkills() {
        if (this.skillsHandler) {
            this.skillsHandler.$.close();
            this.skillsHandler = undefined;
        }
        if (this.skillsClientReceiver) {
            this.skillsClientReceiver.$.close();
            this.skillsClientReceiver = undefined;
        }
    }
    getSkillsHandler() {
        assert(this.skillsHandler);
        return this.skillsHandler;
    }
    notifySkillPreviewsChanged(skillPreviews) {
        this.cachedSkillPreviews =
            skillPreviews.map((p) => skillPreviewToClient(p, false));
        this.skillPreviews.assignAndSignal(this.combineSkillPreviews());
    }
    notifyContextualSkillPreviewsChanged(skillPreviews) {
        this.cachedContextualSkillPreviews =
            skillPreviews.map((p) => skillPreviewToClient(p, true));
        this.skillPreviews.assignAndSignal(this.combineSkillPreviews());
    }
    notifySkillPreviewChanged(skillPreview) {
        const clientPreview = skillPreviewToClient(skillPreview, false);
        const index = this.cachedSkillPreviews.findIndex((cachedSkillPreview) => cachedSkillPreview.id === clientPreview.id);
        if (index !== -1) {
            // SkillPreview with the same ID exists, replace it.
            this.cachedSkillPreviews = [
                ...this.cachedSkillPreviews.slice(0, index),
                clientPreview,
                ...this.cachedSkillPreviews.slice(index + 1),
            ];
        }
        else {
            // SkillPreview with this ID not found, add it to the cache.
            this.cachedSkillPreviews = [...this.cachedSkillPreviews, clientPreview];
        }
        // Signal the change to the host.
        this.skillPreviews.assignAndSignal(this.combineSkillPreviews());
    }
    notifySkillDeleted(skillId) {
        const index = this.cachedSkillPreviews.findIndex((cachedSkillPreview) => cachedSkillPreview.id === skillId);
        if (index !== -1) {
            // SkillPreview with the same ID exists, remove it.
            this.cachedSkillPreviews = [
                ...this.cachedSkillPreviews.slice(0, index),
                ...this.cachedSkillPreviews.slice(index + 1),
            ];
        }
        this.skillPreviews.assignAndSignal(this.combineSkillPreviews());
    }
    notifySkillsEnabledChanged(enabled) {
        this.setSkillsEnabled(enabled);
    }
    combineSkillPreviews() {
        return [...this.cachedContextualSkillPreviews, ...this.cachedSkillPreviews];
    }
    createSkill(request) {
        return this.skillsInstance.createSkill(request);
    }
    updateSkill(request) {
        return this.skillsInstance.updateSkill(request);
    }
    showManageSkillsUi() {
        this.skillsInstance.showManageSkillsUi();
    }
    showBrowseSkillsUi() {
        this.skillsInstance.showBrowseSkillsUi();
    }
    getSkill(id) {
        return this.skillsInstance.getSkill(id);
    }
    recordSkillsWebClientEvent(event) {
        this.skillsInstance.recordSkillsWebClientEvent(event);
    }
    getSkillPreviews() {
        return this.skillsInstance.getSkillPreviews();
    }
    getSkillToInvoke() {
        return this.skillToInvoke;
    }
    skills() {
        return this.skillsObservable;
    }
    setSkillsEnabled(enabled) {
        this.skillsObservable.assignAndSignal(enabled ? this.skillsInstance : undefined);
    }
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// THIS FILE IS GENERATED FROM tools/*.mojom. DO NOT EDIT.
/**
 * Returns the built-in tool definitions for the Gemini Live API based on the
 * AiOverlayTools mojom interfaces.
 */
const kBuiltInToolDefinitions = JSON.stringify([
    {
        "functionDeclarations": [
            {
                "name": "open_url",
                "description": "Opens a URL in the browser.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "url": {
                            "type": "STRING",
                            "description": "The complete URL to open (e.g. \"https://example.com\")."
                        },
                        "new_tab": {
                            "type": "BOOLEAN",
                            "description": "If true, opens the URL in a new tab; otherwise, navigates the current tab."
                        }
                    },
                    "required": [
                        "url",
                        "new_tab"
                    ]
                }
            },
            {
                "name": "follow_link",
                "description": "Follows or navigates to a link on the active webpage by its identifier.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "id": {
                            "type": "STRING",
                            "description": "The identifier or token of the link to follow (e.g. \"9821\" or \"101\")."
                        }
                    },
                    "required": [
                        "id"
                    ]
                }
            },
            {
                "name": "perform_search",
                "description": "Search using the default search engine.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "query": {
                            "type": "STRING"
                        },
                        "new_tab": {
                            "type": "BOOLEAN"
                        }
                    },
                    "required": [
                        "query",
                        "new_tab"
                    ]
                }
            },
            {
                "name": "switch_tab",
                "description": "Switch to another open tab by fuzzy matching name or URL.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "query": {
                            "type": "STRING",
                            "description": "keyword from the tab name or URL."
                        }
                    },
                    "required": [
                        "query"
                    ]
                }
            },
            {
                "name": "close_current_tab",
                "description": "Close the current browser tab."
            },
            {
                "name": "go_back",
                "description": "Go back to the previous page in history."
            },
            {
                "name": "go_forward",
                "description": "Go forward to the next page in history."
            },
            {
                "name": "reload_page",
                "description": "Refresh the current page."
            },
            {
                "name": "find_and_highlight",
                "description": "Highlight and scroll to specific text on the page.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "query": {
                            "type": "STRING",
                            "description": "A short phrase copied exactly as it appears in the page content."
                        }
                    },
                    "required": [
                        "query"
                    ]
                }
            },
            {
                "name": "scroll",
                "description": "Scroll the viewport in a specific direction.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "granularity": {
                            "type": "STRING",
                            "enum": [
                                "document",
                                "page"
                            ],
                            "description": "The units of the `magnitude` param. \"document\" scrolls to the start or end of the document."
                        },
                        "magnitude": {
                            "type": "NUMBER",
                            "description": "the distance to scroll. Positive is down, negative is up."
                        }
                    },
                    "required": [
                        "granularity",
                        "magnitude"
                    ]
                }
            },
            {
                "name": "play_video",
                "description": "Resume video playback."
            },
            {
                "name": "pause_video",
                "description": "Pause video playback."
            },
            {
                "name": "seek_to_timestamp",
                "description": "Jump the video to a specific timecode.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "timecode": {
                            "type": "STRING",
                            "description": "from the video transcript. Format: \"1:45\", \"0:30\", \"1:02:15\""
                        }
                    },
                    "required": [
                        "timecode"
                    ]
                }
            },
            {
                "name": "translate_page",
                "description": "Translate the current page.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "target_language": {
                            "type": "STRING",
                            "description": "Target language code (e.g. \"en\", \"es\", \"fr\"). If empty, translates to the user's default language."
                        }
                    },
                    "required": [
                        "target_language"
                    ]
                }
            },
            {
                "name": "add_bookmark",
                "description": "Bookmark the current active tab."
            },
            {
                "name": "remove_bookmark",
                "description": "Remove bookmark for the current active tab."
            },
            {
                "name": "open_page",
                "description": "Search for and open a page matching a query across open tabs, saved bookmarks, or browsing history.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "query": {
                            "type": "STRING",
                            "description": "Search term, title keyword, or topic description of the page to find. Returns a JSON string with candidates categorized into open_tabs, bookmarks, and history lists. If a single unique match is found, automatically opens the page and returns an action dictionary (e.g. {\"action\": \"switched_tab\"})."
                        }
                    },
                    "required": [
                        "query"
                    ]
                }
            },
            {
                "name": "set_text",
                "description": "Replaces the entire text content of an input field, textarea, search box, or editable element on the active webpage. Use this whenever the user asks to write, type, fill in, or enter text into a field or form on the page.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "dom_node_id": {
                            "type": "INTEGER",
                            "description": "The numeric DOM node ID of the target input field or editable element (e.g. 101)."
                        },
                        "text": {
                            "type": "STRING",
                            "description": "The complete replacement text to set into the element."
                        }
                    },
                    "required": [
                        "dom_node_id",
                        "text"
                    ]
                }
            },
            {
                "name": "click_element",
                "description": "Click or toggle an interactive element (such as a button, radio button, or checkbox) on the active webpage.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "dom_node_id": {
                            "type": "INTEGER",
                            "description": "The numeric DOM node ID of the target element (e.g. 101)."
                        }
                    },
                    "required": [
                        "dom_node_id"
                    ]
                }
            },
            {
                "name": "set_fullscreen",
                "description": "Set or exit full screen mode for the active browser window.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "fullscreen": {
                            "type": "BOOLEAN",
                            "description": "Set to true to enter full screen, false to exit full screen."
                        }
                    },
                    "required": [
                        "fullscreen"
                    ]
                }
            },
            {
                "name": "select_option",
                "description": "Selects an option from a dropdown (<select>) element on the active webpage.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "dom_node_id": {
                            "type": "INTEGER",
                            "description": "The numeric DOM node ID of the target dropdown element (e.g. 101)."
                        },
                        "value": {
                            "type": "STRING",
                            "description": "The value of the <option> element to select."
                        }
                    },
                    "required": [
                        "dom_node_id",
                        "value"
                    ]
                }
            },
            {
                "name": "open_gemini_panel",
                "description": "Opens the Gemini side panel in Chrome. Use this for image generation or when the user explicitly asks to open Gemini or the side panel.",
                "behavior": "NON_BLOCKING",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "prompt": {
                            "type": "STRING",
                            "description": "The request, question, or prompt to send to the Gemini side panel."
                        }
                    },
                    "required": [
                        "prompt"
                    ]
                }
            },
            {
                "name": "close_gemini_panel",
                "description": "Closes the Gemini side panel in Chrome if it is currently open.",
                "behavior": "NON_BLOCKING"
            }
        ]
    }
]);

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class InvalidArgumentError extends Error {
}
const SILENT_SUCCESS = {
    result: '{}',
    scheduling: ChromeToolResponseScheduling.SILENT,
};
function requireString(args, key) {
    const val = args[key];
    if (typeof val !== 'string') {
        throw new InvalidArgumentError(`Missing or invalid string argument: ${key}`);
    }
    return val;
}
function optionalString(args, key, defaultValue = '') {
    const val = args[key];
    return typeof val === 'string' ? val : defaultValue;
}
function requireNumber(args, key) {
    const val = Number(args[key]);
    if (isNaN(val)) {
        throw new InvalidArgumentError(`Missing or invalid number argument: ${key}`);
    }
    return val;
}
function requireBoolean(args, key) {
    const val = args[key];
    if (typeof val !== 'boolean') {
        throw new InvalidArgumentError(`Missing or invalid boolean argument: ${key}`);
    }
    return val;
}
class GlicToolsHostImpl {
    toolsRemote;
    constructor(toolsRemote) {
        this.toolsRemote = toolsRemote;
    }
    async getChromeTools() {
        const parsedDefs = JSON.parse(kBuiltInToolDefinitions);
        const tools = [];
        for (const group of parsedDefs) {
            for (const decl of group.functionDeclarations ?? []) {
                let blockingBehavior = ChromeToolBlockingBehavior.BLOCKING;
                if (decl.behavior === 'NON_BLOCKING') {
                    blockingBehavior = ChromeToolBlockingBehavior.NON_BLOCKING;
                }
                tools.push({
                    name: decl.name,
                    description: decl.description ?? '',
                    jsonSchemaParameters: decl.parameters ? JSON.stringify(decl.parameters) : '{}',
                    blockingBehavior,
                });
            }
        }
        return tools;
    }
    async executeTool(toolName, jsonArguments) {
        let args = {};
        if (jsonArguments && jsonArguments.trim() !== '') {
            try {
                args = JSON.parse(jsonArguments);
            }
            catch {
                return {
                    errorReason: ExecuteToolErrorReason.INVALID_ARGUMENTS,
                    scheduling: ChromeToolResponseScheduling.UNSPECIFIED,
                };
            }
        }
        try {
            switch (toolName) {
                case 'open_url':
                    await this.toolsRemote.openUrl(requireString(args, 'url'), requireBoolean(args, 'new_tab'));
                    return SILENT_SUCCESS;
                case 'follow_link':
                    await this.toolsRemote.followLink(requireString(args, 'id'));
                    return SILENT_SUCCESS;
                case 'perform_search':
                    await this.toolsRemote.performSearch(requireString(args, 'query'), requireBoolean(args, 'new_tab'));
                    return SILENT_SUCCESS;
                case 'switch_tab': {
                    const resp = await this.toolsRemote.switchTab(requireString(args, 'query'));
                    return {
                        result: JSON.stringify(resp ?? {}),
                        scheduling: ChromeToolResponseScheduling.SILENT,
                    };
                }
                case 'close_current_tab':
                    await this.toolsRemote.closeCurrentTab();
                    return SILENT_SUCCESS;
                case 'go_back':
                    await this.toolsRemote.goBack();
                    return SILENT_SUCCESS;
                case 'go_forward':
                    await this.toolsRemote.goForward();
                    return SILENT_SUCCESS;
                case 'reload_page':
                    await this.toolsRemote.reloadPage();
                    return SILENT_SUCCESS;
                case 'find_and_highlight':
                    await this.toolsRemote.findAndHighlight(requireString(args, 'query'));
                    return SILENT_SUCCESS;
                case 'scroll': {
                    const granularity = args['granularity'] === 'document' ?
                        ScrollGranularity.kDocument :
                        ScrollGranularity.kPage;
                    await this.toolsRemote.scroll(granularity, requireNumber(args, 'magnitude'));
                    return SILENT_SUCCESS;
                }
                case 'play_video':
                    await this.toolsRemote.playVideo();
                    return SILENT_SUCCESS;
                case 'pause_video':
                    await this.toolsRemote.pauseVideo();
                    return SILENT_SUCCESS;
                case 'seek_to_timestamp':
                    await this.toolsRemote.seekToTimestamp(requireString(args, 'timecode'));
                    return SILENT_SUCCESS;
                case 'translate_page':
                    await this.toolsRemote.translatePage(optionalString(args, 'target_language'));
                    return SILENT_SUCCESS;
                case 'add_bookmark':
                    await this.toolsRemote.addBookmark();
                    return SILENT_SUCCESS;
                case 'remove_bookmark':
                    await this.toolsRemote.removeBookmark();
                    return SILENT_SUCCESS;
                case 'open_page': {
                    const resp = await this.toolsRemote.openPage(requireString(args, 'query'));
                    return {
                        result: resp,
                        scheduling: ChromeToolResponseScheduling.SILENT,
                    };
                }
                case 'set_text':
                    await this.toolsRemote.setText({ value: requireNumber(args, 'dom_node_id') }, requireString(args, 'text'));
                    return SILENT_SUCCESS;
                case 'click_element':
                    await this.toolsRemote.clickElement({ value: requireNumber(args, 'dom_node_id') });
                    return SILENT_SUCCESS;
                case 'set_fullscreen':
                    await this.toolsRemote.setFullscreen(requireBoolean(args, 'fullscreen'));
                    return SILENT_SUCCESS;
                default:
                    return {
                        errorReason: ExecuteToolErrorReason.TOOL_NOT_FOUND,
                        scheduling: ChromeToolResponseScheduling.UNSPECIFIED,
                    };
            }
        }
        catch (e) {
            if (e instanceof InvalidArgumentError) {
                return {
                    errorReason: ExecuteToolErrorReason.INVALID_ARGUMENTS,
                    scheduling: ChromeToolResponseScheduling.UNSPECIFIED,
                };
            }
            console.error('Failed to execute tool:', toolName, e);
            return {
                errorReason: ExecuteToolErrorReason.EXECUTION_FAILED,
                scheduling: ChromeToolResponseScheduling.UNSPECIFIED,
            };
        }
    }
}
class GlicBrowserHostTools {
    toolsRemote;
    toolsInstance;
    initialize(initialState, handler) {
        if (hostCapabilitiesToClient(initialState.hostCapabilities)
            .includes(HostCapability.CHROME_TOOLS) &&
            handler) {
            const toolsRemote = new AiOverlayToolsRemote();
            this.toolsRemote =
                maybeWrapWithLogging(toolsRemote, { prefix: 'AiOverlayToolsRemote' });
            handler.createAiOverlayTools(toolsRemote.$.bindNewPipeAndPassReceiver());
            this.toolsInstance = new GlicToolsHostImpl(this.toolsRemote);
        }
        else {
            this.tools = undefined;
        }
    }
    destroyTools() {
        if (this.toolsRemote) {
            this.toolsRemote.$.close();
            this.toolsRemote = undefined;
        }
        this.toolsInstance = undefined;
        this.tools = undefined;
    }
    tools() {
        assert(this.toolsInstance);
        return this.toolsInstance;
    }
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class GlicBrowserHostZeroStateSuggestions {
    handler;
    clientReceiver;
    currentZeroStateSuggestionOptions;
    currentZeroStateObserver;
    initialize(initialState, handler) {
        if (!initialState.enableZeroStateSuggestions || !handler) {
            this.getZeroStateSuggestions = undefined;
            return;
        }
        this.handler = maybeWrapWithLogging(new ZeroStateSuggestionsHandlerRemote(), { prefix: 'ZeroStateSuggestionsHandler' });
        handler.createZeroStateSuggestionsHandler(this.handler.$.bindNewPipeAndPassReceiver());
    }
    destroySuggestions() {
        if (this.handler) {
            this.handler.$.close();
            this.handler = undefined;
        }
        if (this.clientReceiver) {
            this.clientReceiver.$.close();
            this.clientReceiver = undefined;
        }
    }
    getZeroStateSuggestions(options) {
        options = options ?? {
            isFirstRun: false,
            supportedTools: [],
        };
        this.currentZeroStateSuggestionOptions = options;
        this.currentZeroStateObserver =
            ObservableValue.withNoValue(this.zeroStateActiveSubscriptionStateChanged.bind(this, options));
        return this.currentZeroStateObserver;
    }
    async zeroStateActiveSubscriptionStateChanged(options, hasActiveSubscription) {
        if (options !== this.currentZeroStateSuggestionOptions) {
            // Don't send out of date updates.
            return;
        }
        if (!this.handler) {
            return;
        }
        this.clientReceiver?.$.close();
        this.clientReceiver = undefined;
        let clientRemote = null;
        if (hasActiveSubscription) {
            this.clientReceiver = new ZeroStateSuggestionsClientReceiver(this);
            clientRemote = this.clientReceiver.$.bindNewPipeAndPassRemote();
        }
        const mojoOptions = {
            isFirstRun: options.isFirstRun ?? false,
            supportedTools: options.supportedTools ?? [],
        };
        const response = await this.handler.getZeroStateSuggestionsAndSubscribe(clientRemote, mojoOptions);
        if (response.zeroStateSuggestions) {
            this.currentZeroStateObserver?.assignAndSignal(zeroStateSuggestionsToClient(response.zeroStateSuggestions));
        }
    }
    notifyZeroStateSuggestionsChanged(suggestions, _options) {
        this.currentZeroStateObserver?.assignAndSignal(zeroStateSuggestionsToClient(suggestions));
    }
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Creates a Proxy that forwards property access to a target object, and falls
 * back to a list of delegate objects if the property is not found on the
 * target. Note that this assumes that once a function is looked up, it is
 * cached permanently.
 *
 * Enforces compile-time disjointness: if any two delegates share a method name,
 * or if a delegate shadows a method implemented on the target, compilation will
 * fail. Also performs runtime checks at creation time to prevent
 * shadowing/conflicts.
 */
function createDelegationProxy(target, delegates) {
    const registeredMethods = new Set();
    const excludes = new Set(['constructor', 'initialize']);
    const untypedDelegates = delegates;
    for (const delegate of untypedDelegates) {
        const proto = Object.getPrototypeOf(delegate);
        if (!proto) {
            continue;
        }
        for (const method of Object.getOwnPropertyNames(proto)) {
            if (excludes.has(method)) {
                continue;
            }
            const val = delegate[method];
            if (typeof val === 'function') {
                const isStandardProperty = Reflect.has(Object.prototype, method);
                if (registeredMethods.has(method) ||
                    (!isStandardProperty && Reflect.has(target, method))) {
                    throw new Error(`Method conflict detected: '${method}' is defined on multiple delegates ` +
                        `or is shadowed by a property on the target object.`);
                }
                registeredMethods.add(method);
            }
        }
    }
    const methodCache = new Map();
    return new Proxy(target, {
        get(t, prop, receiver) {
            const cachedMethod = methodCache.get(prop);
            if (cachedMethod !== undefined) {
                return cachedMethod;
            }
            if (Reflect.has(t, prop)) {
                const val = Reflect.get(t, prop, receiver);
                if (typeof val === 'function') {
                    const bound = val.bind(t);
                    methodCache.set(prop, bound);
                    return bound;
                }
                return val;
            }
            for (const delegate of untypedDelegates) {
                const val = Reflect.get(delegate, prop, delegate);
                if (val !== undefined) {
                    if (typeof val === 'function') {
                        const bound = val.bind(delegate);
                        methodCache.set(prop, bound);
                        return bound;
                    }
                    return val;
                }
            }
            return undefined;
        },
    });
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Manages a set of observables which each observe a tab.
// When a tab is closed, the corresponding observable is completed, and
// removed from the set. Otherwise, observables are kept in the set,
// so they can be re-subscribed to later.
class ObservableSetByTabId {
    delegate;
    clientRemote;
    router;
    observablesByTabId = new Map();
    constructor(delegate, clientRemote, router) {
        this.delegate = delegate;
        this.clientRemote = clientRemote;
        this.router = router;
    }
    getObservableByTabId(tabId) {
        let obs = this.observablesByTabId.get(tabId);
        if (obs !== undefined) {
            return obs;
        }
        obs = new ObservableSetByTabIdObservable(tabId, this.clientRemote, this.router, this.delegate, () => {
            this.observablesByTabId.delete(tabId);
        });
        this.observablesByTabId.set(tabId, obs);
        return obs;
    }
}
// An observable representing a lazy, reference-counted, and debounced
// stream of updates for a specific tab from the host.
//
// It connects when the first subscriber joins, disconnects with a delay when
// the last subscriber leaves, and cleans itself up on completion.
class ObservableSetByTabIdObservable extends ObservableValue {
    tabId;
    clientRemote;
    router;
    delegate;
    onComplete;
    unsubscribeTimer;
    receiver;
    isCompleting = false;
    constructor(tabId, clientRemote, router, delegate, onComplete) {
        super(/*isSet=*/ false);
        this.tabId = tabId;
        this.clientRemote = clientRemote;
        this.router = router;
        this.delegate = delegate;
        this.onComplete = onComplete;
        this.unsubscribeTimer = new OneShotTimer(delegate.unsubscribeDelay);
    }
    activeSubscriptionChanged(hasActiveSubscription) {
        super.activeSubscriptionChanged(hasActiveSubscription);
        if (!hasActiveSubscription) {
            this.unsubscribeTimer.start(() => {
                if (this.hasActiveSubscription()) {
                    return;
                }
                this.complete();
            });
            return;
        }
        this.unsubscribeTimer.reset();
        if (!this.receiver) {
            const { receiver, remote } = this.router.newPipeWithReceiver(this.delegate.createHandler(this), this.delegate.interfaceDef);
            this.receiver = receiver;
            this.receiver.addCloseHandler(() => {
                this.complete();
            });
            this.delegate.subscribe(this.clientRemote, this.tabId, remote);
        }
    }
    complete() {
        // As this is an observable, it can be completed only once. Early exit if
        // already complete.
        if (this.isCompleting || this.isStopped()) {
            return;
        }
        this.isCompleting = true;
        this.receiver?.close();
        this.receiver = undefined;
        this.onComplete();
        super.complete();
    }
}

// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Web client side of the Glic API.
// Communicates with the Chrome-WebUI-side in glic_api_host.ts
class GlicHostRegistryImpl {
    directPair;
    hostApi;
    host;
    constructor(directPair, hostApi) {
        this.directPair = directPair;
        this.hostApi = hostApi;
    }
    async registerWebClient(webClient) {
        this.host =
            new GlicBrowserHostImpl(webClient, this.directPair, this.hostApi);
        const clientCapabilities = webClient.getClientCapabilities?.() ?? new Set();
        await this.host.webClientCreated(clientCapabilities);
        let success = false;
        let exception;
        try {
            await webClient.initialize(this.host);
            success = true;
        }
        catch (e) {
            console.warn(e);
            if (e instanceof Error) {
                exception = newTransferableException(e);
            }
        }
        if (this.host) {
            this.host.webClientInitialized(success, exception);
        }
    }
}
class GlicBrowserHostImpl {
    webClient;
    hostApi;
    router;
    clientRemote;
    actorClient;
    annotationClient;
    skillsClient;
    toolsClient;
    experimentalTriggeringClient = new GlicBrowserHostExperimentalTriggering();
    suggestionsClient;
    geicClient;
    chromeVersion;
    platform;
    formFactor;
    panelState = ObservableValue.withNoValue();
    canAttachPanelValue = ObservableValue.withNoValue();
    focusedTabStateV2 = ObservableValue.withNoValue();
    geminiEnterpriseSettings = ObservableValue.withNoValue();
    zoomLevel = ObservableValue.withNoValue();
    permissionStateMicrophone = ObservableValue.withNoValue();
    permissionStateLocation = ObservableValue.withNoValue();
    permissionStateTabContext = ObservableValue.withNoValue();
    defaultTabContextPermission = ObservableValue.withNoValue();
    enableDefaultTabContextSettingFeature = false;
    permissionStateOsLocation = ObservableValue.withNoValue();
    closedCaptioningState = ObservableValue.withNoValue();
    actuationOnWebState = ObservableValue.withNoValue();
    fileUploadAllowedState = ObservableValue.withNoValue();
    osHotkeyState = ObservableValue.withNoValue();
    onboardingCompleted = ObservableValue.withNoValue();
    panelActiveValue = ObservableValue.withNoValue();
    isBrowserOpenValue = ObservableValue.withNoValue();
    metrics;
    manuallyResizing = ObservableValue.withValue(false);
    cachedUserProfile;
    enableCachedGetUserProfileInfo;
    pinnedTabs = ObservableValue.withNoValue();
    pinCandidates;
    captureRegionObservable;
    cachedPinnedTabs = undefined;
    webClientReceiver;
    hostCapabilities = new Set();
    additionalContextSubject = new Subject();
    pageMetadataObservers = new Map();
    getTabByIdObservableSet;
    getTabFaviconByIdObservableSet;
    notifyPanelWillOpenCompleted = Promise.withResolvers();
    panelOpenState = PanelOpenState.CLOSED;
    handler;
    constructor(webClient, directPair, hostApi) {
        this.webClient = webClient;
        this.hostApi = hostApi;
        this.handler = hostApi.handler;
        this.router = directPair.client.router;
        this.clientRemote = directPair.client.rootRemote;
        this.actorClient = new GlicBrowserHostActor();
        this.annotationClient = new GlicBrowserHostAnnotation();
        this.skillsClient = new GlicBrowserHostSkills();
        this.suggestionsClient = new GlicBrowserHostZeroStateSuggestions();
        this.toolsClient = new GlicBrowserHostTools();
        this.geicClient = new GlicBrowserHostGeic();
        this.getTabByIdObservableSet =
            new ObservableSetByTabId(new GetTabByIdObservableSetImpl(), this.clientRemote, this.router);
        this.getTabFaviconByIdObservableSet =
            new TabFaviconObservableSet(this.handler);
        this.metrics = new GlicBrowserHostMetricsImpl(this.clientRemote);
        const proxy = createDelegationProxy(this, [
            this.actorClient,
            this.annotationClient,
            this.skillsClient,
            this.suggestionsClient,
            this.toolsClient,
        ]);
        return proxy;
    }
    isPanelOpen() {
        return this.panelOpenState === PanelOpenState.OPEN;
    }
    panelOpenStateChanged(state) {
        this.panelOpenState = state;
        if (state === PanelOpenState.CLOSED) {
            this.pinCandidates?.disconnectFromSource();
        }
        else {
            if (this.pinCandidates?.hasActiveSubscription()) {
                this.pinCandidates.connectToSource();
            }
        }
    }
    getHandler() {
        return this.handler;
    }
    destroy() {
        this.pinCandidates?.setObsolete();
        this.actorClient.destroyActor();
        this.skillsClient.destroySkills();
        this.toolsClient.destroyTools();
        this.annotationClient.destroyAnnotation();
        this.geicClient.destroy();
        this.suggestionsClient.destroySuggestions();
        this.experimentalTriggeringClient.destroy();
        if (this.webClientReceiver) {
            this.webClientReceiver.$.close();
            this.webClientReceiver = undefined;
        }
        this.router.destroy();
    }
    async webClientCreated(clientCapabilities) {
        conversionSettings.omitFaviconInTabData =
            clientCapabilities.has(ClientCapabilities.IGNORES_TAB_DATA_FAVICONS);
        this.webClientReceiver = new WebClientReceiver(this);
        const { initialState } = await this.handler.webClientCreated(this.webClientReceiver.$.bindNewPipeAndPassRemote());
        this.hostApi.setInitialState(initialState, clientCapabilities);
        this.actorClient.initialize(initialState, this.handler);
        this.annotationClient.initialize(initialState, this.handler);
        this.skillsClient.initialize(initialState, this.handler);
        this.experimentalTriggeringClient.initialize(this.webClient, this.handler);
        this.suggestionsClient.initialize(initialState, this.handler);
        this.toolsClient.initialize(initialState, this.handler);
        this.geicClient.initialize(initialState, this.handler);
        const state = initialState;
        this.geminiEnterpriseSettings.assignAndSignal(state.geminiEnterpriseSettings ?? undefined);
        this.zoomLevel.assignAndSignal(state.zoomFactor);
        this.panelState.assignAndSignal(panelStateToClient(state.panelState));
        const extras = new ResponseExtras();
        const focusedTabDataPrivate = focusedTabDataToClient(state.focusedTabData, extras);
        this.focusedTabStateV2.assignAndSignal(convertFocusedTabDataFromPrivate(focusedTabDataPrivate));
        this.permissionStateMicrophone.assignAndSignal(state.microphonePermissionEnabled);
        this.permissionStateLocation.assignAndSignal(state.locationPermissionEnabled);
        if (state.enableDefaultTabContextSettingFeature) {
            this.permissionStateTabContext.assignAndSignal(state.defaultTabContextSettingEnabled);
        }
        else {
            this.permissionStateTabContext.assignAndSignal(state.tabContextPermissionEnabled);
        }
        this.defaultTabContextPermission.assignAndSignal(state.defaultTabContextSettingEnabled);
        this.enableDefaultTabContextSettingFeature =
            state.enableDefaultTabContextSettingFeature;
        this.permissionStateOsLocation.assignAndSignal(state.osLocationPermissionEnabled);
        this.canAttachPanelValue.assignAndSignal(state.canAttach);
        const chromeVersion = state.chromeVersion.components;
        this.chromeVersion = {
            major: chromeVersion[0] || 0,
            minor: chromeVersion[1] || 0,
            build: chromeVersion[2] || 0,
            patch: chromeVersion[3] || 0,
        };
        this.platform = enumToClient(state.platform);
        this.formFactor = enumToClient(state.formFactor);
        this.enableCachedGetUserProfileInfo = state.enableCachedGetUserProfileInfo;
        this.panelActiveValue.assignAndSignal(state.panelIsActive);
        this.isBrowserOpenValue.assignAndSignal(state.browserIsOpen);
        this.osHotkeyState.assignAndSignal({ hotkey: state.hotkey });
        this.closedCaptioningState.assignAndSignal(state.closedCaptioningSettingEnabled);
        this.actuationOnWebState.assignAndSignal(state.actuationOnWebSettingEnabled);
        this.fileUploadAllowedState.assignAndSignal(fileUploadPolicyStateToClient(state.fileUploadPolicyState));
        for (const capability of state.hostCapabilities) {
            this.hostCapabilities.add(enumToClient(capability));
        }
        this.actorClient.actOnWebCapabilityValue.assignAndSignal(state.canActOnWeb);
        this.onboardingCompleted.assignAndSignal(state.onboardingCompleted);
        // Set the method to undefined since it's gated behind a mojo
        // RuntimeFeature. Calling a such a method when the feature is disabled
        // results in a mojo pipe closure.
        if (!this.hostCapabilities.has(HostCapability.GET_MODEL_QUALITY_CLIENT_ID)) {
            // MOJO_RUNTIME_FEATURE_GATED GetModelQualityClientId
            this.getModelQualityClientId = undefined;
        }
        if (!state.enableZeroStateSuggestions) {
            this.getZeroStateSuggestionsForFocusedTab = undefined;
        }
        if (!state.enableDefaultTabContextSettingFeature) {
            this.getDefaultTabContextPermissionState = undefined;
        }
        if (!state.enableMaybeRefreshUserStatus) {
            this.maybeRefreshUserStatus = undefined;
        }
        if (!state.enableGetPageMetadata) {
            this.getPageMetadata = undefined;
        }
        if (!state.enableWebActuationSettingFeature) {
            this.getActuationOnWebSetting = undefined;
            this.setActuationOnWebSetting = undefined;
        }
        if (!state.enableCaptureRegion) {
            this.captureRegion = undefined;
            this.deleteCapturedRegion = undefined;
        }
        if (!state.enableActivateTab) {
            // MOJO_RUNTIME_FEATURE_GATED ActivateTab
            this.activateTab = undefined;
        }
        if (!state.enableGetTabById) {
            this.getTabById = undefined;
        }
        if (!state.enableOpenPasswordManagerSettingsPage) {
            this.openPasswordManagerSettingsPage = undefined;
        }
        if (!state.enableOpenContactInfoSettingsPage) {
            this.openContactInfoSettingsPage = undefined;
        }
        if (!state.enableGetTabFaviconById) {
            this.getTabFaviconById = undefined;
        }
        if (!state.enableProcessCounterAbuseVerdict) {
            this.processCounterAbuseVerdict = undefined;
        }
    }
    webClientInitialized(success, exception) {
        if (success) {
            this.handler.webClientInitialized();
        }
        else {
            this.handler.webClientInitializeFailed();
        }
        this.clientRemote.requestNoResponse('webClientInitialized', { success, exception });
    }
    // WebClientInterface implementation.
    async checkResponsive() {
        await this.webClient.checkResponsive?.();
    }
    async notifyPanelWillOpen(panelOpeningData) {
        let openPanelInfo;
        const clientOpeningData = panelOpeningDataToClient(panelOpeningData);
        try {
            const mergedArgument = Object.assign({}, clientOpeningData, clientOpeningData.panelState);
            const completedPromise = this.notifyPanelWillOpenCompleted;
            const result = await this.webClient.notifyPanelWillOpen?.(mergedArgument);
            completedPromise.resolve();
            if (result) {
                openPanelInfo = result;
            }
        }
        catch (e) {
            console.warn(e);
        }
        finally {
            this.panelOpenStateChanged(PanelOpenState.OPEN);
        }
        const openPanelInfoMojo = {
            webClientMode: webClientModeToMojo(openPanelInfo?.startingMode),
            panelSize: null,
            resizeDuration: timeDeltaFromClient(openPanelInfo?.resizeParams?.options?.durationMs),
            canUserResize: openPanelInfo?.canUserResize ?? true,
        };
        if (openPanelInfo?.resizeParams) {
            const size = {
                width: openPanelInfo?.resizeParams?.width,
                height: openPanelInfo?.resizeParams?.height,
            };
            openPanelInfoMojo.panelSize = size;
        }
        return { openPanelInfo: openPanelInfoMojo };
    }
    async notifyPanelWasClosed() {
        this.panelOpenStateChanged(PanelOpenState.CLOSED);
        try {
            this.notifyPanelWillOpenCompleted = Promise.withResolvers();
            await this.webClient.notifyPanelWasClosed?.();
        }
        catch (e) {
            console.warn(e);
        }
    }
    async invoke(options) {
        try {
            const extras = new ResponseExtras();
            const clientOptions = convertInvokeOptionsFromPrivate(invokeOptionsToClient(options, extras));
            // Wait until notifyPanelWillOpen has resolved before invoking.
            await this.notifyPanelWillOpenCompleted.promise;
            await this.webClient.invoke?.(clientOptions);
        }
        catch (e) {
            console.warn(e);
        }
    }
    notifyPanelStateChange(panelState) {
        this.panelState.assignAndSignal(panelStateToClient(panelState));
    }
    notifyPanelActiveChange(panelActive) {
        this.panelActiveValue.assignAndSignal(panelActive);
    }
    notifyPanelCanAttachChange(canAttach) {
        this.canAttachPanelValue.assignAndSignal(canAttach);
    }
    notifyGeminiEnterpriseSettingsChanged(settings) {
        this.geminiEnterpriseSettings.assignAndSignal(settings || undefined);
    }
    notifyMicrophonePermissionStateChanged(enabled) {
        this.permissionStateMicrophone.assignAndSignal(enabled);
    }
    async stopMicrophone() {
        await this.webClient.stopMicrophone?.();
    }
    notifyLocationPermissionStateChanged(enabled) {
        this.permissionStateLocation.assignAndSignal(enabled);
    }
    notifyTabContextPermissionStateChanged(enabled) {
        this.permissionStateTabContext.assignAndSignal(enabled);
    }
    notifyOsLocationPermissionStateChanged(enabled) {
        this.permissionStateOsLocation.assignAndSignal(enabled);
    }
    notifyClosedCaptioningSettingChanged(enabled) {
        this.closedCaptioningState.assignAndSignal(enabled);
    }
    notifyDefaultTabContextPermissionStateChanged(enabled) {
        this.defaultTabContextPermission.assignAndSignal(enabled);
    }
    notifyActuationOnWebSettingChanged(enabled) {
        this.actuationOnWebState.assignAndSignal(enabled);
    }
    notifyFileUploadStateChanged(state) {
        this.fileUploadAllowedState.assignAndSignal(fileUploadPolicyStateToClient(state));
    }
    notifyZoomLevelChanged(zoomFactor) {
        this.zoomLevel.assignAndSignal(zoomFactor);
    }
    notifyFocusedTabChanged(focusedTabData) {
        const extras = new ResponseExtras();
        const focusedTabDataPrivate = focusedTabDataToClient(focusedTabData, extras);
        this.focusedTabStateV2.assignAndSignal(convertFocusedTabDataFromPrivate(focusedTabDataPrivate));
    }
    notifyManualResizeChanged(resizing) {
        this.manuallyResizing.assignAndSignal(resizing);
    }
    notifyBrowserIsOpenChanged(browserIsOpen) {
        this.isBrowserOpenValue.assignAndSignal(browserIsOpen);
    }
    notifyInstanceActivationChanged(instanceIsActive) {
        this.hostApi.setInstanceIsActive(instanceIsActive);
    }
    notifyOsHotkeyStateChanged(hotkey) {
        this.osHotkeyState.assignAndSignal({ hotkey });
    }
    notifyPinnedTabsChanged(tabData) {
        this.cachedPinnedTabs = tabData.map((x) => tabDataToClient(x));
        this.pinnedTabs.assignAndSignal(this.cachedPinnedTabs);
    }
    notifyPinnedTabDataChanged(tabData) {
        if (!this.cachedPinnedTabs) {
            return;
        }
        const convertedTab = tabDataToClient(tabData);
        this.cachedPinnedTabs = this.cachedPinnedTabs.map((cachedTab) => {
            if (cachedTab.tabId === convertedTab.tabId) {
                return convertedTab;
            }
            return cachedTab;
        });
        this.pinnedTabs.assignAndSignal(this.cachedPinnedTabs);
    }
    notifyPageMetadataChanged(tabId, metadata) {
        const tabIdStr = idToClient(tabId);
        const observable = this.pageMetadataObservers.get(tabIdStr);
        if (!observable) {
            return;
        }
        const clientMetadata = pageMetadataToClient(metadata);
        if (clientMetadata) {
            observable.assignAndSignal(clientMetadata);
        }
        else {
            if (!observable.isStopped()) {
                observable.complete();
            }
            this.pageMetadataObservers.delete(tabIdStr);
        }
    }
    notifyAdditionalContext(context) {
        const extras = new ResponseExtras();
        const clientContext = convertAdditionalContextFromPrivate(additionalContextToClient(context, extras));
        this.additionalContextSubject.next(clientContext);
    }
    notifyActOnWebCapabilityChanged(canActOnWeb) {
        this.actorClient.actOnWebCapabilityValue.assignAndSignal(canActOnWeb);
    }
    notifyOnboardingCompletedChanged(completed) {
        this.onboardingCompleted.assignAndSignal(completed);
    }
    notifyActorTaskListRowClicked(taskId) {
        this.actorClient.actorTaskListRowClickedSubject.next(taskId);
    }
    // GlicBrowserHost implementation.
    getChromeVersion() {
        return Promise.resolve(this.chromeVersion);
    }
    experimentalTriggering() {
        return this.experimentalTriggeringClient;
    }
    getPlatform() {
        return this.platform;
    }
    getFormFactor() {
        return this.formFactor;
    }
    async createTab(url, options = {}) {
        const response = await this.handler.createTab(urlFromClient(url), createTabOptionsFromClient(options));
        if (!response.tabData) {
            throw new Error('createTab: failed');
        }
        return tabDataToClient(response.tabData);
    }
    async activateTabWithUrl(exactUrl, options = {}) {
        const response = await this.handler.activateTabWithUrl(urlFromClient(exactUrl), {
            pattern: options.pattern ?? '',
            fallbackWindowId: idFromClient(options.fallbackWindowId),
        });
        if (!response.tabData) {
            throw new Error('activateTabWithUrl: failed');
        }
        return tabDataToClient(response.tabData);
    }
    openGlicSettingsPage(options) {
        this.handler.openGlicSettingsPage({
            highlightField: enumFromClient(options?.highlightField) ??
                SettingsPageField$1.kNone,
        });
    }
    openPasswordManagerSettingsPage() {
        this.handler.openPasswordManagerSettingsPage();
    }
    openContactInfoSettingsPage() {
        this.handler.openContactInfoSettingsPage();
    }
    reportClientTransientError(abslStatus) {
        this.clientRemote.requestNoResponse('reportClientTransientError', { abslStatus });
    }
    processCounterAbuseVerdict(tabId, verdict) {
        this.clientRemote.requestNoResponse('processCounterAbuseVerdict', { tabId, verdict });
    }
    async closePanel() {
        this.handler.closePanel();
    }
    closePanelAndShutdown() {
        this.handler.closePanelAndShutdown();
    }
    attachPanel() {
        this.handler.attachPanel();
    }
    detachPanel() {
        if (this.hostCapabilities.has(HostCapability.NO_LIVE_MODE)) {
            throw new Error('NO_LIVE_MODE: detachPanel not supported');
        }
        this.handler.detachPanel();
    }
    showProfilePicker() {
        this.handler.showProfilePicker();
    }
    async getModelQualityClientId() {
        const result = await this.clientRemote.requestWithResponse('getModelQualityClientId', undefined);
        return result.modelQualityClientId;
    }
    getGeminiEnterpriseSettings() {
        return this.geminiEnterpriseSettings;
    }
    async switchConversation(info) {
        await this.clientRemote.requestWithResponse('switchConversation', { info });
    }
    async registerConversation(info) {
        await this.clientRemote.requestWithResponse('registerConversation', { info });
    }
    async getContextFromFocusedTab(options) {
        const context = await this.clientRemote.requestWithResponse('getContextFromFocusedTab', { options });
        return convertTabContextResultFromPrivate(context.tabContextResult);
    }
    async setMaximumNumberOfPinnedTabs(requestedMax) {
        const result = await this.clientRemote.requestWithResponse('setMaximumNumberOfPinnedTabs', { requestedMax });
        return result.effectiveMax;
    }
    async getContextFromTab(tabId, options) {
        const result = await this.clientRemote.requestWithResponse('getContextFromTab', { tabId, options });
        return convertTabContextResultFromPrivate(result.tabContextResult);
    }
    async getImageBytesFromTab(tabId, documentId, domNodeId) {
        const response = await this.clientRemote.requestWithResponse('getImageBytesFromTab', { tabId, documentId, domNodeId });
        if (!response.result) {
            throw new Error('Failed to get image bytes');
        }
        return convertImageBytesResultFromPrivate(response.result);
    }
    getTabById(tabId) {
        return this.getTabByIdObservableSet.getObservableByTabId(tabId);
    }
    getTabFaviconById(tabId) {
        return this.getTabFaviconByIdObservableSet.getObservableByTabId(tabId);
    }
    activateTab(tabId) {
        this.clientRemote.requestNoResponse('activateTab', { tabId });
    }
    onModeChange(newMode) {
        this.clientRemote.requestNoResponse('onModeChange', { newMode });
    }
    onMicrophoneStatusChange(status) {
        this.clientRemote.requestNoResponse('onMicrophoneStatusChange', { status });
    }
    setErrorDialogState(shownDialogType) {
        this.clientRemote.requestNoResponse('setErrorDialogState', { shownDialogType });
    }
    async resizeWindow(width, height, options) {
        return this.clientRemote.requestWithResponse('resizeWindow', { size: { width, height }, options });
    }
    enableDragResize(enabled) {
        return this.clientRemote.requestWithResponse('enableDragResize', { enabled });
    }
    captureRegion(params) {
        if (this.captureRegionObservable) {
            this.captureRegionObservable.complete();
        }
        this.captureRegionObservable =
            new CaptureRegionObservable(this.handler, params);
        return this.captureRegionObservable;
    }
    deleteCapturedRegion(tabId, regionId) {
        this.clientRemote.requestNoResponse('deleteCapturedRegion', { tabId, regionId });
    }
    setMinimumWidgetSize(width, height) {
        return this.clientRemote.requestWithResponse('setMinimumWidgetSize', { size: { width, height } });
    }
    getPanelState() {
        return this.panelState;
    }
    panelActive() {
        return this.panelActiveValue;
    }
    canAttachPanel() {
        return this.canAttachPanelValue;
    }
    isBrowserOpen() {
        return this.isBrowserOpenValue;
    }
    getFocusedTabStateV2() {
        return this.focusedTabStateV2;
    }
    getZoomLevel() {
        return this.zoomLevel;
    }
    getMicrophonePermissionState() {
        return this.permissionStateMicrophone;
    }
    getLocationPermissionState() {
        return this.permissionStateLocation;
    }
    getTabContextPermissionState() {
        return this.permissionStateTabContext;
    }
    getDefaultTabContextPermissionState() {
        return this.defaultTabContextPermission;
    }
    getOsLocationPermissionState() {
        return this.permissionStateOsLocation;
    }
    getClosedCaptioningSetting() {
        return this.closedCaptioningState;
    }
    getActuationOnWebSetting() {
        return this.actuationOnWebState;
    }
    getFileUploadAllowedCapability() {
        return this.fileUploadAllowedState;
    }
    setMicrophonePermissionState(enabled) {
        return this.clientRemote.requestWithResponse('setMicrophonePermissionState', { enabled });
    }
    setLocationPermissionState(enabled) {
        return this.clientRemote.requestWithResponse('setLocationPermissionState', { enabled });
    }
    setTabContextPermissionState(enabled) {
        if (this.enableDefaultTabContextSettingFeature) {
            this.permissionStateTabContext.assignAndSignal(enabled);
            return Promise.resolve();
        }
        return this.clientRemote.requestWithResponse('setTabContextPermissionState', { enabled });
    }
    setClosedCaptioningSetting(enabled) {
        return this.clientRemote.requestWithResponse('setClosedCaptioningSetting', { enabled });
    }
    setContextAccessIndicator(show) {
        this.handler.setContextAccessIndicator(show);
    }
    setActuationOnWebSetting(enabled) {
        return this.clientRemote.requestWithResponse('setActuationOnWebSetting', { enabled });
    }
    async getUserProfileInfo() {
        return this.enableCachedGetUserProfileInfo ? this.fetchUserProfileCached() :
            this.fetchUserProfileDirect();
    }
    async fetchUserProfileDirect() {
        const { profileInfo } = await this.clientRemote.requestWithResponse('getUserProfileInfo', undefined);
        if (!profileInfo) {
            throw new Error('getUserProfileInfo failed');
        }
        const { avatarIcon } = profileInfo;
        return replaceProperties(profileInfo, {
            avatarIcon: async () => avatarIcon && Promise.resolve(rgbaImageToBlob(avatarIcon)),
        });
    }
    async fetchUserProfileCached() {
        if (this.cachedUserProfile) {
            return this.cachedUserProfile;
        }
        this.cachedUserProfile = (async () => {
            try {
                const { profileInfo } = await this.clientRemote.requestWithResponse('getUserProfileInfo', undefined);
                if (!profileInfo) {
                    throw new Error('getUserProfileInfo failed');
                }
                let blobPromise;
                return replaceProperties(profileInfo, {
                    avatarIcon: () => {
                        if (blobPromise) {
                            return blobPromise;
                        }
                        if (!profileInfo.avatarIcon) {
                            blobPromise = Promise.resolve(undefined);
                            return blobPromise;
                        }
                        const newBlob = rgbaImageToBlob(profileInfo.avatarIcon);
                        // Clear memory after conversion
                        profileInfo.avatarIcon = undefined;
                        blobPromise = Promise.resolve(newBlob);
                        return blobPromise;
                    },
                });
            }
            catch (e) {
                this.cachedUserProfile = undefined;
                throw e;
            }
        })();
        return this.cachedUserProfile;
    }
    async refreshSignInCookies() {
        const result = await this.clientRemote.requestWithResponse('refreshSignInCookies', undefined);
        if (!result.success) {
            throw Error('refreshSignInCookies failed');
        }
    }
    setAudioDucking(enabled) {
        this.clientRemote.requestNoResponse('setAudioDucking', { enabled });
    }
    getMetrics() {
        return this.metrics;
    }
    getGeicClient() {
        return this.geicClient;
    }
    setSyntheticExperimentState(trialName, groupName) {
        this.clientRemote.requestNoResponse('setSyntheticExperimentState', { trialName, groupName });
    }
    openOsPermissionSettingsMenu(permission) {
        // Warning: calling openOsPermissionSettingsMenu with unsupported content
        // setting type will terminate the render process (bad mojo message).
        // Update GlicWebClientHandler:OpenOsPermissionSettingsMenu with any new
        // types.
        switch (permission) {
            case 'media':
                this.handler.openOsPermissionSettingsMenu(ContentSettingsType.MEDIASTREAM_MIC);
                break;
            case 'geolocation':
                this.handler.openOsPermissionSettingsMenu(ContentSettingsType.GEOLOCATION);
                break;
            default:
                this.handler.openOsPermissionSettingsMenu(ContentSettingsType.COOKIES);
                break;
        }
    }
    async getOsMicrophonePermissionStatus() {
        return (await this.clientRemote.requestWithResponse('getOsMicrophonePermissionStatus', undefined))
            .enabled;
    }
    isManuallyResizing() {
        return this.manuallyResizing;
    }
    getOsHotkeyState() {
        return this.osHotkeyState;
    }
    getPinnedTabs() {
        return this.pinnedTabs;
    }
    async pinTabs(tabIds, options) {
        return (await this.clientRemote.requestWithResponse('pinTabs', { tabIds, options }))
            .pinnedAll;
    }
    async unpinTabs(tabIds, options) {
        return (await this.clientRemote.requestWithResponse('unpinTabs', { tabIds, options }))
            .unpinnedAll;
    }
    unpinAllTabs(options) {
        this.clientRemote.requestNoResponse('unpinAllTabs', { options });
    }
    async openPinnedTabPicker(options) {
        await this.clientRemote.requestWithResponse('openPinnedTabPicker', { options });
    }
    getPinCandidates(options) {
        this.pinCandidates?.setObsolete();
        return this.pinCandidates = new PinCandidatesObservable(this, options);
    }
    async getZeroStateSuggestionsForFocusedTab(isFirstRun) {
        const zeroStateResult = await this.clientRemote.requestWithResponse('getZeroStateSuggestionsForFocusedTab', { isFirstRun });
        if (!zeroStateResult.suggestions) {
            return {
                suggestions: [],
                tabId: '',
                url: '',
            };
        }
        return zeroStateResult.suggestions;
    }
    maybeRefreshUserStatus() {
        this.cachedUserProfile = undefined;
        this.clientRemote.requestNoResponse('maybeRefreshUserStatus', undefined);
    }
    getAdditionalContext() {
        return this.additionalContextSubject;
    }
    getHostCapabilities() {
        return this.hostCapabilities;
    }
    getPageMetadata(tabId, names) {
        if (this.pageMetadataObservers.has(tabId)) {
            // Currently, we assume that names do not change and keep only
            // one observer per tabId.
            return this.pageMetadataObservers.get(tabId);
        }
        if (names.length === 0) {
            throw Error('names must not be empty');
        }
        const observableValue = ObservableValue.withNoValue(async (isActive) => {
            // If the client subscribes to an Observable with an invalid tabId,
            // it will emit nothing, even if the tab later becomes valid.
            const { success } = await this.clientRemote.requestWithResponse('subscribeToPageMetadata', { tabId, names: isActive ? names : [] });
            if (!success) {
                if (!observableValue.isStopped()) {
                    observableValue.complete();
                }
                this.pageMetadataObservers.delete(tabId);
            }
        });
        this.pageMetadataObservers.set(tabId, observableValue);
        return observableValue;
    }
    setOnboardingCompleted() {
        return this.clientRemote.requestNoResponse('setOnboardingCompleted', undefined);
    }
    isOnboardingCompleted() {
        return this.onboardingCompleted;
    }
}
class GlicBrowserHostMetricsImpl {
    sender;
    constructor(sender) {
        this.sender = sender;
    }
    onOptinImpression() {
        this.sender.requestNoResponse('onOptinImpression', undefined);
    }
    onUserInputSubmitted(mode, promptType) {
        this.sender.requestNoResponse('onUserInputSubmitted', { mode, promptType });
    }
    onReaction(reactionType) {
        this.sender.requestNoResponse('onReaction', { reactionType });
    }
    onPerformActionResultSubmitted(isRetry) {
        this.sender.requestNoResponse('onActionSubmitted', { isRetry });
    }
    onContextUploadStarted() {
        this.sender.requestNoResponse('onContextUploadStarted', undefined);
    }
    onContextUploadCompleted() {
        this.sender.requestNoResponse('onContextUploadCompleted', undefined);
    }
    onResponseStarted() {
        this.sender.requestNoResponse('onResponseStarted', undefined);
    }
    onResponseStopped(details) {
        this.sender.requestNoResponse('onResponseStopped', { details });
    }
    onSessionTerminated() {
        this.sender.requestNoResponse('onSessionTerminated', undefined);
    }
    onResponseRated(positive) {
        this.sender.requestNoResponse('onResponseRated', { positive });
    }
    onClosedCaptionsShown() {
        this.sender.requestNoResponse('onClosedCaptionsShown', undefined);
    }
    onTurnCompleted(model, duration) {
        this.sender.requestNoResponse('onTurnCompleted', { model, duration });
    }
    onRecordUseCounter(counter) {
        // Since the frontend can contain a newer version than what Chrome is
        // built against, we use a sparse histogram.
        this.sender.requestNoResponse('recordHistogram', { name: 'Glic.Api.UseCounter', sparseValue: counter });
    }
}
class CaptureRegionObservable extends ObservableValue {
    handler;
    params;
    receiver;
    constructor(handler, params) {
        super(false);
        this.handler = handler;
        this.params = params;
    }
    close() {
        this.receiver?.$.close();
        this.receiver = undefined;
    }
    activeSubscriptionChanged(hasActiveSubscription) {
        super.activeSubscriptionChanged(hasActiveSubscription);
        if (this.isStopped()) {
            return;
        }
        if (hasActiveSubscription) {
            this.close();
            this.receiver = new CaptureRegionObserverReceiver(this);
            this.receiver.onConnectionError.addListener(() => {
                if (!this.isStopped()) {
                    this.processError(CaptureRegionErrorReason.UNKNOWN);
                }
            });
            const remote = this.receiver.$.bindNewPipeAndPassRemote();
            this.handler.captureRegion(remote, this.params ? {
                tabId: idFromClient(this.params.tabId),
                options: tabContextOptionsFromClient(this.params.options),
            } :
                null);
        }
        else {
            this.complete();
        }
    }
    error(e) {
        if (this.isStopped()) {
            return;
        }
        super.error(e);
    }
    complete() {
        if (this.isStopped()) {
            return;
        }
        super.complete();
        this.close();
    }
    onUpdate(result, reason) {
        if (this.isStopped()) {
            return;
        }
        const captureResult = captureRegionResultToClient(result);
        if (captureResult) {
            this.assignAndSignal(captureResult);
        }
        else {
            const errorReason = reason !== null ?
                enumToClient(reason) :
                CaptureRegionErrorReason.UNKNOWN;
            this.processError(errorReason);
        }
    }
    processError(reason) {
        if (this.isStopped()) {
            return;
        }
        this.error(new ErrorWithReasonImpl('captureRegion', reason));
        this.close();
    }
}
// TODO(harringtond): Instead of watching for panel state changes in typescript,
// we should probably just have c++ code not send updates when the panel is not
// visible.
class PinCandidatesObservable extends ObservableValue {
    host;
    options;
    isObsolete = false;
    isConnected = false;
    receiver;
    constructor(host, options) {
        super(false);
        this.host = host;
        this.options = options;
    }
    activeSubscriptionChanged(hasActiveSubscription) {
        super.activeSubscriptionChanged(hasActiveSubscription);
        if (this.isObsolete) {
            console.warn(`getPinCandidates() observable is in use while obsolete.`);
            return;
        }
        if (hasActiveSubscription) {
            if (this.host.isPanelOpen()) {
                this.connectToSource();
            }
        }
        else {
            this.disconnectFromSource();
        }
    }
    connectToSource() {
        if (this.isObsolete || this.isConnected) {
            return;
        }
        const handler = this.host.getHandler();
        this.isConnected = true;
        this.receiver = new PinCandidatesObserverReceiver(this);
        handler.subscribeToPinCandidates(getPinCandidatesOptionsFromClient(this.options), this.receiver.$.bindNewPipeAndPassRemote());
    }
    disconnectFromSource() {
        if (!this.isConnected) {
            return;
        }
        this.isConnected = false;
        this.receiver?.$.close();
        this.receiver = undefined;
    }
    onPinCandidatesChanged(candidates) {
        this.assignAndSignal(candidates.map(c => pinCandidateToClient(c)));
    }
    // Mark this observable as obsolete. It should not be used any further.
    // Only one PinCandidatesObservable is active at one time.
    setObsolete() {
        if (this.hasActiveSubscription()) {
            console.warn(`getPinCandidates() observable was made obsolete with subscribers.`);
        }
        this.isObsolete = true;
        this.disconnectFromSource();
    }
}
class GetTabByIdObservableSetImpl {
    interfaceDef = WebClientTabDataObserverDef;
    unsubscribeDelay = 1000;
    subscribe(clientRemote, tabId, remote) {
        clientRemote.requestNoResponse('subscribeToTabData', { tabId, remote });
    }
    createHandler(observable) {
        return new WebClientTabDataObserverHandler(observable);
    }
}
class WebClientTabDataObserverHandler {
    observable;
    constructor(observable) {
        this.observable = observable;
    }
    tabDataChanged(payload) {
        this.observable.assignAndSignal(convertTabDataFromPrivate(payload.tabData));
    }
}
class TabFaviconObservableSet {
    handler;
    observablesByTabId = new Map();
    constructor(handler) {
        this.handler = handler;
    }
    getObservableByTabId(tabId) {
        let obs = this.observablesByTabId.get(tabId);
        if (obs !== undefined) {
            return obs;
        }
        obs = new TabFaviconObservable(tabId, this.handler, () => {
            this.observablesByTabId.delete(tabId);
        });
        this.observablesByTabId.set(tabId, obs);
        return obs;
    }
}
class TabFaviconObservable extends ObservableValue {
    tabId;
    handler;
    onComplete;
    unsubscribeTimer = new OneShotTimer(1000);
    receiver;
    isCompleting = false;
    constructor(tabId, handler, onComplete) {
        super(/*isSet=*/ false);
        this.tabId = tabId;
        this.handler = handler;
        this.onComplete = onComplete;
    }
    activeSubscriptionChanged(hasActiveSubscription) {
        super.activeSubscriptionChanged(hasActiveSubscription);
        if (!hasActiveSubscription) {
            this.unsubscribeTimer.start(() => {
                if (this.hasActiveSubscription()) {
                    return;
                }
                this.complete();
            });
            return;
        }
        this.unsubscribeTimer.reset();
        if (!this.receiver) {
            this.receiver = new TabFaviconHandlerReceiver(this);
            this.receiver.onConnectionError.addListener(() => {
                this.complete();
            });
            this.handler.subscribeToTabFavicon(idFromClient(this.tabId), this.receiver.$.bindNewPipeAndPassRemote());
        }
    }
    onTabFaviconChanged(favicon) {
        if (this.isCompleting || this.isStopped()) {
            return;
        }
        let blob;
        if (favicon) {
            const rgba = bitmapN32ToRGBAImage(favicon);
            if (rgba) {
                blob = rgbaImageToBlob(rgba);
            }
        }
        this.assignAndSignal(blob);
    }
    complete() {
        if (this.isCompleting || this.isStopped()) {
            return;
        }
        this.isCompleting = true;
        this.receiver?.$.close();
        this.receiver = undefined;
        this.onComplete();
        super.complete();
    }
}
function convertTabDataFromPrivate(data) {
    if (!data) {
        return undefined;
    }
    let faviconResult;
    const dataFavicon = data.favicon;
    async function getFavicon() {
        if (dataFavicon && !faviconResult) {
            faviconResult = Promise.resolve(rgbaImageToBlob(dataFavicon));
        }
        return faviconResult;
    }
    const favicon = dataFavicon && getFavicon;
    return replaceProperties(data, { favicon });
}
function convertFocusedTabDataFromPrivate(data) {
    const result = {};
    if (data.hasFocus) {
        result.hasFocus = replaceProperties(data.hasFocus, {
            tabData: convertTabDataFromPrivate(data.hasFocus.tabData),
        });
    }
    if (data.hasNoFocus) {
        result.hasNoFocus = replaceProperties(data.hasNoFocus, {
            tabFocusCandidateData: convertTabDataFromPrivate(data.hasNoFocus.tabFocusCandidateData),
        });
    }
    return result;
}
function streamFromBuffer(buffer) {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(buffer);
            controller.close();
        },
    });
}
function convertPdfDocumentDataFromPrivate(data) {
    const pdfData = data.pdfData && streamFromBuffer(new Uint8Array(data.pdfData));
    return replaceProperties(data, { pdfData });
}
function convertAnnotatedPageDataFromPrivate(data) {
    const annotatedPageContent = data.annotatedPageContent &&
        streamFromBuffer(new Uint8Array(data.annotatedPageContent));
    return replaceProperties(data, { annotatedPageContent });
}
function convertTabContextResultFromPrivate(data) {
    const tabData = convertTabDataFromPrivate(data.tabData);
    const screenshotInfo = data.screenshotInfo &&
        streamFromBuffer(new Uint8Array(data.screenshotInfo));
    const pdfDocumentData = data.pdfDocumentData &&
        convertPdfDocumentDataFromPrivate(data.pdfDocumentData);
    const annotatedPageData = data.annotatedPageData &&
        convertAnnotatedPageDataFromPrivate(data.annotatedPageData);
    return replaceProperties(data, { tabData, screenshotInfo, pdfDocumentData, annotatedPageData });
}
function convertAdditionalContextFromPrivate(context) {
    const parts = context.parts.map(p => {
        const annotatedPageData = p.annotatedPageData &&
            convertAnnotatedPageDataFromPrivate(p.annotatedPageData);
        const pdf = p.pdf && convertPdfDocumentDataFromPrivate(p.pdf);
        const data = p.data && new Blob([p.data.data], { type: p.data.mimeType });
        const filename = p.filename;
        const tabContext = p.tabContext && convertTabContextResultFromPrivate(p.tabContext);
        return {
            ...p,
            data,
            filename,
            annotatedPageData,
            pdf,
            tabContext,
        };
    });
    return {
        ...context,
        parts,
    };
}
function convertInvokeOptionsFromPrivate(options) {
    return {
        ...options,
        context: options.context ?
            convertAdditionalContextFromPrivate(options.context) :
            undefined,
    };
}
function convertImageInfoFromPrivate(data) {
    return {
        caption: data.caption,
        sourceOrigin: data.sourceOrigin,
        url: data.url,
        mimeType: data.mimeType,
    };
}
function convertImageBytesResultFromPrivate(data) {
    return {
        bytes: data.bytes,
        imageInfo: convertImageInfoFromPrivate(data.imageInfo),
    };
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// A queue for running async tasks in serial.
class TaskQueue {
    queue = [];
    running = false;
    // Adds a task to the queue. Returns a promise that will be resolved when the
    // task is completes.
    add(task) {
        const resolver = Promise.withResolvers();
        this.queue.push({
            task,
            resolver: resolver,
        });
        this.runTasks();
        return resolver.promise;
    }
    async runTasks() {
        if (this.running) {
            return;
        }
        this.running = true;
        while (this.queue.length > 0) {
            const { task, resolver } = this.queue.shift();
            try {
                const result = await task();
                resolver.resolve(result);
            }
            catch (e) {
                resolver.reject(e);
            }
        }
        this.running = false;
    }
}

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Automatically closes all pipes when one of them is closed.
function linkPipeClosure(...entries) {
    let activeEntries = entries;
    const destroy = () => {
        if (!activeEntries) {
            return;
        }
        for (const entry of activeEntries) {
            if (entry.$) {
                entry.$.close();
            }
            else {
                entry.close();
            }
        }
        activeEntries = null;
    };
    for (const entry of entries) {
        if (entry.$) {
            entry.onConnectionError.addListener(() => {
                destroy();
            });
        }
        else {
            entry.addCloseHandler(() => {
                destroy();
            });
        }
    }
}

// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// This file handles messages from the client, usually passing them on
// to the browser via mojo.
/**
 * Handles all requests to the host.
 *
 * Each function is a message handler, automatically called when the host
 * receives a message with the corresponding request name.
 *
 * Any new state or function that's not a handler should be added to
 * `GlicApiHost`.
 */
class HostMessageHandler {
    handler;
    host;
    // Reminder: Don't add more state here! See `HostMessageHandler`'s comment.
    constructor(handler, host) {
        this.handler = handler;
        this.host = host;
    }
    destroy() { }
    webClientInitialized(request) {
        // The webview may have been re-shown by webui, having previously been
        // opened by the browser. In that case, show the guest frame again.
        if (request.exception) {
            console.warn(exceptionFromTransferable(request.exception));
        }
        if (request.success) {
            this.host.webClientInitialized();
        }
        else {
            this.host.webClientInitializeFailed();
        }
    }
    reportClientTransientError(request) {
        this.handler.reportClientTransientError(request.abslStatus);
    }
    processCounterAbuseVerdict(request) {
        const mojoVerdict = counterAbuseVerdictFromClient(request.verdict);
        this.handler.processCounterAbuseVerdict(idFromClient(request.tabId), mojoVerdict);
    }
    getModelQualityClientId() {
        return this.handler.getModelQualityClientId();
    }
    async switchConversation(request) {
        const { errorReason } = await this.handler.switchConversation(conversationInfoFromClient(request.info ?? {
            conversationId: '',
            conversationTitle: '',
            clientData: undefined,
        }));
        if (errorReason !== null) {
            throw new ErrorWithReasonImpl('switchConversation', errorReason.valueOf());
        }
        return {};
    }
    async registerConversation(request) {
        const { errorReason } = await this.handler.registerConversation(conversationInfoFromClient(request.info));
        if (errorReason !== null) {
            throw new ErrorWithReasonImpl('registerConversation', errorReason.valueOf());
        }
        return {};
    }
    async getContextFromFocusedTab(request, extras) {
        const { result: { errorReason, tabContext } } = await this.handler.getContextFromFocusedTab(tabContextOptionsFromClient(request.options));
        if (!tabContext) {
            throw new Error(`tabContext failed: ${errorReason}`);
        }
        const tabContextResult = tabContextToClient(tabContext, extras);
        return {
            tabContextResult: tabContextResult,
        };
    }
    async getContextFromTab(request, extras) {
        const { result: { errorReason, tabContext } } = await this.handler.getContextFromTab(idFromClient(request.tabId), tabContextOptionsFromClient(request.options));
        if (!tabContext) {
            throw new Error(`tabContext failed: ${errorReason}`);
        }
        const tabContextResult = tabContextToClient(tabContext, extras);
        return {
            tabContextResult: tabContextResult,
        };
    }
    async getImageBytesFromTab(request, extras) {
        const { result: { errorReason, imageBytes } } = await this.handler.getImageBytesFromTab(idFromClient(request.tabId), request.documentId, request.domNodeId);
        if (!imageBytes) {
            throw new Error(`getImageBytes failed: ${errorReason}`);
        }
        return {
            result: imageBytesResultToClient(imageBytes, extras),
        };
    }
    async setMaximumNumberOfPinnedTabs(request) {
        const requestedMax = request.requestedMax >= 0 ? request.requestedMax : 0;
        const { effectiveMax } = await this.handler.setMaximumNumberOfPinnedTabs(requestedMax);
        return { effectiveMax };
    }
    activateTab(request) {
        this.handler.activateTab(idFromClient(request.tabId));
    }
    async resizeWindow(request) {
        return await this.handler.resizeWidget(request.size, timeDeltaFromClient(request.options?.durationMs));
    }
    enableDragResize(request) {
        return this.handler.enableDragResize(request.enabled);
    }
    deleteCapturedRegion(request) {
        this.handler.deleteCapturedRegion(idFromClient(request.tabId), request.regionId);
    }
    setMinimumWidgetSize(request) {
        return this.handler.setMinimumPanelSize(request.size);
    }
    setMicrophonePermissionState(request) {
        return this.handler.setMicrophonePermissionState(request.enabled);
    }
    setLocationPermissionState(request) {
        return this.handler.setLocationPermissionState(request.enabled);
    }
    setTabContextPermissionState(request) {
        return this.handler.setTabContextPermissionState(request.enabled);
    }
    setClosedCaptioningSetting(request) {
        return this.handler.setClosedCaptioningSetting(request.enabled);
    }
    setActuationOnWebSetting(request) {
        return this.handler.setActuationOnWebSetting(request.enabled);
    }
    async getUserProfileInfo(_request, extras) {
        const { profileInfo: mojoProfileInfo } = await this.handler.getUserProfileInfo();
        if (!mojoProfileInfo) {
            return {};
        }
        let avatarIcon;
        if (mojoProfileInfo.avatarIcon) {
            avatarIcon = bitmapN32ToRGBAImage(mojoProfileInfo.avatarIcon);
            if (avatarIcon) {
                extras.addTransfer(avatarIcon.dataRGBA);
            }
        }
        return { profileInfo: replaceProperties(mojoProfileInfo, { avatarIcon }) };
    }
    refreshSignInCookies() {
        return this.handler.syncCookies();
    }
    setAudioDucking(request) {
        this.handler.setAudioDucking(request.enabled);
    }
    onOptinImpression() {
        this.handler.onOptinImpression();
    }
    onUserInputSubmitted(request) {
        this.handler.onUserInputSubmitted(webClientModeToMojo(request.mode), enumFromClient(request.promptType) ?? PromptType$1.kUnspecified);
    }
    onContextUploadStarted() {
        this.handler.onContextUploadStarted();
    }
    onContextUploadCompleted() {
        this.handler.onContextUploadCompleted();
    }
    onReaction(request) {
        this.handler.onReaction(request.reactionType);
    }
    onActionSubmitted(request) {
        this.handler.onActionSubmitted(request.isRetry ?? false);
    }
    onResponseStarted() {
        this.handler.onResponseStarted();
    }
    onResponseStopped(request) {
        const cause = request.details?.cause;
        let causeMojo = ResponseStopCause$1.kUnknown;
        if (cause !== undefined) {
            switch (cause) {
                case ResponseStopCause.USER:
                    causeMojo = ResponseStopCause$1.kUser;
                    break;
                case ResponseStopCause.OTHER:
                    causeMojo = ResponseStopCause$1.kOther;
                    break;
                default:
                    assertNotReached();
            }
        }
        this.handler.onResponseStopped({ cause: causeMojo });
    }
    onSessionTerminated() {
        this.handler.onSessionTerminated();
    }
    onTurnCompleted(request) {
        this.handler.onTurnCompleted(request.model, timeDeltaFromClient(request.duration));
    }
    recordHistogram(request) {
        this.handler.recordSparseValue(request.name, request.sparseValue);
    }
    onResponseRated(request) {
        this.handler.onResponseRated(request.positive);
    }
    onClosedCaptionsShown() {
        this.handler.onClosedCaptionsShown();
    }
    setSyntheticExperimentState(request) {
        return this.handler.setSyntheticExperimentState(request.trialName, request.groupName);
    }
    getOsMicrophonePermissionStatus() {
        return this.handler.getOsMicrophonePermissionStatus();
    }
    pinTabs(request) {
        return this.handler.pinTabs(request.tabIds.map((x) => idFromClient(x)), pinTabsOptionsToMojo(request.options));
    }
    unpinTabs(request) {
        return this.handler.unpinTabs(request.tabIds.map((x) => idFromClient(x)), unpinTabsOptionsToMojo(request.options));
    }
    unpinAllTabs(request) {
        this.handler.unpinAllTabs(unpinTabsOptionsToMojo(request.options));
    }
    async openPinnedTabPicker(request) {
        await this.handler.openPinnedTabPicker(openPinnedTabPickerOptionsToMojo(request.options));
    }
    async getZeroStateSuggestionsForFocusedTab(request) {
        const zeroStateResult = await this.handler.getZeroStateSuggestionsForFocusedTab(optionalFromClient(request.isFirstRun));
        const zeroStateData = zeroStateResult.suggestions;
        if (!zeroStateData) {
            return {};
        }
        else {
            return {
                suggestions: {
                    tabId: idToClient(zeroStateData.tabId),
                    url: urlToClient(zeroStateData.url),
                    suggestions: zeroStateData.suggestions,
                },
            };
        }
    }
    maybeRefreshUserStatus() {
        this.handler.maybeRefreshUserStatus();
    }
    subscribeToPageMetadata(request) {
        return this.handler.subscribeToPageMetadata(idFromClient(request.tabId), request.names);
    }
    onModeChange(request) {
        this.handler.onModeChange(webClientModeToMojo(request.newMode));
    }
    onMicrophoneStatusChange(request) {
        this.handler.onMicrophoneStatusChange(microphoneStatusToMojo(request.status));
    }
    setOnboardingCompleted() {
        this.handler.setOnboardingCompleted();
    }
    subscribeToTabData(request) {
        new TabDataHandlerImpl(idFromClient(request.tabId), this.handler, request.remote, this.host.router);
    }
    setErrorDialogState(request) {
        if (request.shownDialogType !== undefined) {
            this.handler.clientErrorDialogStateChanged(enumFromClient(request.shownDialogType));
        }
        // TODO(b/506142920): Avoid showing error panels to the user if it is
        // presented while the panel is backgrounded. Automatically reload the
        // page instead.
    }
}
class TabDataHandlerImpl {
    mojoReceiver;
    pmRemote;
    constructor(tabId, handler, pendingRemote, router) {
        this.pmRemote = router.newRemote(pendingRemote);
        this.mojoReceiver = new TabDataHandlerReceiver(this);
        linkPipeClosure(this.pmRemote, this.mojoReceiver);
        handler.subscribeToTabData(tabId, this.mojoReceiver.$.bindNewPipeAndPassRemote());
    }
    onTabDataChanged(tabData) {
        const extras = new ResponseExtras();
        this.pmRemote.requestNoResponse('tabDataChanged', {
            tabData: tabDataToPrivate(tabData, extras),
        }, extras.transfers);
    }
}

// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Chrome-WebUI-side of the Glic API.
// Communicates with the web client side in ../client/.
var WebClientState;
(function (WebClientState) {
    WebClientState[WebClientState["UNINITIALIZED"] = 0] = "UNINITIALIZED";
    WebClientState[WebClientState["WARMED"] = 1] = "WARMED";
    WebClientState[WebClientState["RESPONSIVE"] = 2] = "RESPONSIVE";
    WebClientState[WebClientState["UNRESPONSIVE"] = 3] = "UNRESPONSIVE";
    WebClientState[WebClientState["ERROR"] = 4] = "ERROR";
})(WebClientState || (WebClientState = {}));
/**
 * The host side of the Glic API.
 *
 * Its primary job is to route calls between the client (over postMessage) and
 * the browser (over Mojo).
 */
class GlicApiHost {
    hostMessageHandler;
    sender;
    panelIsActive = false;
    handler;
    get handlerForTesting() {
        return this.handler;
    }
    webClientState = ObservableValue.withValue(WebClientState.UNINITIALIZED);
    openCloseTasks = new TaskQueue();
    waitingOnPanelWillOpenValue = false;
    // Synchronizes panel open/close events between the browser and client,
    // ensuring panel open state is eventually consistent.
    clientActiveObs = ObservableValue.withValue(false);
    // The open state as understood by the client, this is delayed
    // from the notifyPanelWillOpen and notifyPanelWasClosed calls because
    // processing is async.
    panelOpenState = PanelOpenState.CLOSED;
    instanceIsActive = true;
    router;
    isDestroyed = false;
    constructor(hostRemote, hostRouter) {
        this.router = hostRouter;
        this.sender = hostRemote;
        this.handler = maybeWrapWithLogging(new WebClientHandlerRemote(), { prefix: 'WebClientHandler' });
        this.handler.onConnectionError.addListener(() => {
            if (this.isDestroyed ||
                this.webClientState.getCurrentValue() === WebClientState.ERROR) {
                return;
            }
            console.warn(`Mojo connection error in glic host`);
            this.webClientState.assignAndSignal(WebClientState.ERROR);
        });
        const receiver = this.handler.$.bindNewPipeAndPassReceiver();
        receiver.bindInBrowser();
        this.hostMessageHandler = new HostMessageHandler(this.handler, this);
        if (this.router.receiver) {
            this.router.receiver.requestObserver = this;
            this.router.receiver.setHandlerWrapper(this.handlerWrapper.bind(this));
        }
    }
    destroy() {
        this.isDestroyed = true;
        this.webClientState = ObservableValue.withValue(WebClientState.ERROR); // Final state
        this.hostMessageHandler.destroy();
    }
    setInitialState(initialState, clientCapabilities) {
        this.panelIsActive = initialState.panelIsActive;
        this.instanceIsActive = initialState.instanceIsActive;
        conversionSettings.platform = enumToClient(initialState.platform);
        conversionSettings.omitFaviconInTabData =
            clientCapabilities.has(ClientCapabilities.IGNORES_TAB_DATA_FAVICONS);
    }
    waitingOnPanelWillOpen() {
        return this.waitingOnPanelWillOpenValue;
    }
    setWaitingOnPanelWillOpen(value) {
        this.waitingOnPanelWillOpenValue = value;
    }
    panelOpenStateChanged(state) {
        this.panelOpenState = state;
        this.clientActiveObs.assignAndSignal(this.isClientActive());
    }
    setInstanceIsActive(instanceIsActive) {
        this.instanceIsActive = instanceIsActive;
        this.clientActiveObs.assignAndSignal(this.isClientActive());
    }
    getInstanceIsActive() {
        return this.instanceIsActive;
    }
    isPanelOpen() {
        return this.panelOpenState === PanelOpenState.OPEN;
    }
    // Returns true if the user might be interacting with the client.
    // That is, the panel is open, not in an error state, and either the panel
    // itself is focused or a browser window it could be accessing is.
    isClientActive() {
        return this.panelOpenState === PanelOpenState.OPEN &&
            this.webClientState.getCurrentValue() !== WebClientState.ERROR &&
            this.instanceIsActive;
    }
    // Called when the web client is initialized.
    webClientInitialized() {
        this.setWebClientState(WebClientState.RESPONSIVE);
    }
    webClientInitializeFailed() {
        console.warn('GlicApiHost: web client initialize failed');
        this.setWebClientState(WebClientState.ERROR);
    }
    setWebClientState(state) {
        this.webClientState.assignAndSignal(state);
    }
    getWebClientState() {
        return this.webClientState;
    }
    openLinkInPopup(url, initialWidth, initialHeight) {
        this.handler.openLinkInPopup(urlFromClient(url), initialWidth, initialHeight);
    }
    async openLinkInNewTab(url) {
        await this.handler.createTab(urlFromClient(url), {
            openInBackground: false,
            windowId: null,
        });
    }
    async handlerWrapper(type, interfaceDef, payload, extras, handlerFunction) {
        const startTime = performance.now();
        const response = await handlerFunction(payload, extras);
        if (response) {
            // Report latency metric for handled requests that return a response.
            const latency = performance.now() - startTime;
            this.reportLatency(type, interfaceDef, latency);
        }
        // Not all request types require a return value.
        return response;
    }
    onRequestReceived(type, interfaceDef) {
        this.reportRequestCountEvent(type, interfaceDef, GlicRequestEvent.REQUEST_RECEIVED);
        if (!this.panelIsActive) {
            this.reportRequestCountEvent(type, interfaceDef, GlicRequestEvent.REQUEST_RECEIVED_WHILE_INACTIVE);
        }
    }
    onRequestHandlerException(type, interfaceDef) {
        this.reportRequestCountEvent(type, interfaceDef, GlicRequestEvent.REQUEST_HANDLER_EXCEPTION);
    }
    onRequestCompleted(type, interfaceDef) {
        this.reportRequestCountEvent(type, interfaceDef, GlicRequestEvent.RESPONSE_SENT);
    }
    reportRequestCountEvent(requestType, interfaceDef, event) {
        const histogramInfo = getHostRequestHistogramInfo(requestType, interfaceDef);
        if (histogramInfo === undefined) {
            return;
        }
        let mojoEvent = GlicRequestEvent$1.kRequestReceived;
        switch (event) {
            case GlicRequestEvent.REQUEST_RECEIVED:
                mojoEvent = GlicRequestEvent$1.kRequestReceived;
                break;
            case GlicRequestEvent.RESPONSE_SENT:
                mojoEvent = GlicRequestEvent$1.kResponseSent;
                break;
            case GlicRequestEvent.REQUEST_HANDLER_EXCEPTION:
                mojoEvent = GlicRequestEvent$1.kRequestHandlerException;
                break;
            case GlicRequestEvent.REQUEST_RECEIVED_WHILE_INACTIVE:
                mojoEvent = GlicRequestEvent$1.kRequestReceivedWhileInactive;
                break;
            default:
                return;
        }
        try {
            this.handler.reportApiRequestCount(histogramInfo.id, mojoEvent);
        }
        catch (e) {
            console.error('[reportApiRequestCount ERROR]', e);
        }
    }
    reportLatency(requestType, interfaceDef, latencyMs) {
        const histogramInfo = getHostRequestHistogramInfo(requestType, interfaceDef);
        if (histogramInfo === undefined) {
            return;
        }
        try {
            this.handler.reportApiRequestLatency(histogramInfo.name, { microseconds: BigInt(Math.round(latencyMs * 1000)) });
        }
        catch (e) {
            console.error('[reportApiRequestLatency ERROR]', e);
        }
    }
}
// LINT.IfChange(GlicRequestEvent)
var GlicRequestEvent;
(function (GlicRequestEvent) {
    GlicRequestEvent[GlicRequestEvent["REQUEST_RECEIVED"] = 0] = "REQUEST_RECEIVED";
    GlicRequestEvent[GlicRequestEvent["RESPONSE_SENT"] = 1] = "RESPONSE_SENT";
    GlicRequestEvent[GlicRequestEvent["REQUEST_HANDLER_EXCEPTION"] = 2] = "REQUEST_HANDLER_EXCEPTION";
    // Deprecated: REQUEST_RECEIVED_WHILE_HIDDEN = 3,
    GlicRequestEvent[GlicRequestEvent["REQUEST_RECEIVED_WHILE_INACTIVE"] = 4] = "REQUEST_RECEIVED_WHILE_INACTIVE";
    GlicRequestEvent[GlicRequestEvent["MAX_VALUE"] = 4] = "MAX_VALUE";
})(GlicRequestEvent || (GlicRequestEvent = {}));
// LINT.ThenChange(//tools/metrics/histograms/metadata/glic/enums.xml:GlicRequestEvent)

// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const ROOT_PIPE = 0;
const ON_PIPE_CLOSED = Symbol('ON_PIPE_CLOSED');
function newSenderId() {
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    return Array.from(array).map((n) => n.toString(16)).join('');
}
// Implements a simple queue with O(1) push and shift.
class Queue {
    // An array where elements are always pushed.
    next = [];
    // An array frozen in size from which elements are consumed.
    // When all elements are consumed, `next` is swapped into `current`.
    current = [];
    // Next element index in `current`.
    index = 0;
    push(item) {
        this.next.push(item);
    }
    popFront() {
        if (this.index < this.current.length) {
            const result = this.current[this.index];
            this.current[this.index] = undefined;
            this.index++;
            return result;
        }
        if (this.next.length === 0) {
            return undefined;
        }
        this.current = this.next;
        this.next = [];
        this.index = 0;
        return this.popFront();
    }
    get length() {
        return this.current.length - this.index + this.next.length;
    }
    empty() {
        return this.next.length === 0 && this.index === this.current.length;
    }
}
class ClosedPipe {
    open = false;
    messageHandler = undefined;
    interfaceDef = undefined;
    addCloseHandler(f) {
        f();
    }
    close() { }
    setMessageHandler(_handler, _interfaceDef) { }
    getHandlerFunction(_type) {
        return undefined;
    }
    pending() {
        return false;
    }
    pushPendingMessage(_pmReceiver, _requestMessage) { }
}
const CLOSED_PIPE = new ClosedPipe();
// Used by PostMessageRouterImpl to track a pipe.
class Pipe {
    id;
    onCloseHandlers = [];
    open = true;
    // The message handler for this pipe, if the pipe is bound as a receiver.
    messageHandler;
    interfaceDef;
    pendingMessages = [];
    constructor(
    // The id of the pipe, which is a unique number.
    id) {
        this.id = id;
    }
    close() {
        if (!this.open) {
            return;
        }
        this.open = false;
        this.onCloseHandlers.forEach((f) => {
            try {
                f();
            }
            catch (e) {
                console.error('Error in pipe onClose callback', e);
            }
        });
        this.onCloseHandlers = [];
        this.pendingMessages = [];
    }
    addCloseHandler(f) {
        if (this.open) {
            this.onCloseHandlers.push(f);
        }
        else {
            f();
        }
    }
    setMessageHandler(handler, interfaceDef) {
        this.messageHandler = handler;
        this.interfaceDef = interfaceDef;
        if (this.messageHandler && this.pendingMessages.length) {
            const messages = this.pendingMessages;
            this.pendingMessages = [];
            if (!this.open) {
                return;
            }
            setTimeout(() => {
                messages.forEach(([pmReceiver, requestMessage]) => {
                    pmReceiver.onMessage(requestMessage);
                });
            }, 0);
        }
    }
    getHandlerFunction(type) {
        if (!this.open) {
            return undefined;
        }
        if (this.messageHandler) {
            const handleFn = this.messageHandler[type];
            if (typeof handleFn !== 'function') {
                return undefined;
            }
            return handleFn.bind(this.messageHandler);
        }
        return undefined;
    }
    pending() {
        return this.open &&
            (!this.messageHandler || this.pendingMessages.length > 0);
    }
    pushPendingMessage(pmReceiver, requestMessage) {
        this.pendingMessages.push([pmReceiver, requestMessage]);
    }
}
class PostMessageRouterImpl {
    remoteOrigin;
    senderId;
    messageSender;
    isHost;
    errorCodec;
    onDestroy;
    sender;
    receiver;
    // Pipes that are not closed.
    pipes = new Map();
    // Tracks IDs of pipes that have been closed.
    closedPipes = new InverseSet();
    nextPipeId;
    loggingPrefix;
    constructor(remoteOrigin, senderId, messageSender, logPrefix, isHost, errorCodec = {
        serialize: e => ({ exception: e }),
        deserialize: raw => raw.exception,
    }) {
        this.remoteOrigin = remoteOrigin;
        this.senderId = senderId;
        this.messageSender = messageSender;
        this.isHost = isHost;
        this.errorCodec = errorCodec;
        this.loggingPrefix = `${logPrefix}(${senderId.substring(0, 6)})`;
        // Use even and odd scheme to ensure host and client pipe ids don't clash.
        this.nextPipeId = isHost ? 2 : 1;
        const handler = this.onMessage.bind(this);
        window.addEventListener('message', handler);
        this.onDestroy = () => {
            window.removeEventListener('message', handler);
        };
    }
    destroy() {
        this.onDestroy();
    }
    onMessage(event) {
        if (event.origin !== this.remoteOrigin) {
            return;
        }
        // Check properties on MessageBase.
        const data = event.data;
        if (data.type === undefined || data.senderId === undefined ||
            !event.source) {
            return;
        }
        if (data.responseId === undefined) {
            // For RequestMessage, only process messages if they are not from this
            // sender.
            if (this.receiver && data.senderId !== this.senderId &&
                data.glicRequest === true) {
                this.receiver?.onMessage(data);
            }
        }
        else {
            // For ResponseMessage, only process messages if they are from this
            // sender.
            if (this.sender && data.senderId === this.senderId) {
                this.sender?.onMessage(data);
            }
        }
    }
    sendRequest(pipeId, type, requestId, requestPayload, transfer = []) {
        const request = {
            glicRequest: true,
            pipeId,
            type,
            requestId,
            requestPayload,
            senderId: this.senderId,
        };
        this.messageSender.postMessage(request, this.remoteOrigin, transfer);
    }
    sendResponse(pipeId, type, senderId, responseId, responsePayload, exception, transfer = []) {
        const response = {
            pipeId,
            type,
            responseId,
            responsePayload,
            senderId,
        };
        if (exception) {
            response.exception = exception;
        }
        this.messageSender.postMessage(response, this.remoteOrigin, transfer);
    }
    newPipe() {
        const id = this.nextPipeId;
        this.nextPipeId += 2;
        return {
            receiver: id,
            remote: id,
        };
    }
    newPipeWithReceiver(receiverHandler, interfaceDef) {
        const { receiver, remote } = this.newPipe();
        return {
            receiver: this.newReceiver(receiver, receiverHandler, interfaceDef),
            remote,
        };
    }
    newPipeWithRemote(_remoteInterfaceDef) {
        const { receiver, remote } = this.newPipe();
        return {
            receiver,
            remote: this.newRemote(remote),
        };
    }
    newReceiver(receiver, handler, interfaceDef) {
        const pipe = this.getOrMakePipe(receiver);
        if (pipe.open && handler) {
            pipe.setMessageHandler(handler, interfaceDef);
        }
        return new PostMessageReceiverImpl(pipe, receiver, handler, this);
    }
    newRemote(remote) {
        this.getOrMakePipe(remote);
        return new PostMessageRemoteImpl(remote, this.sender, this);
    }
    closePipe(pipe) {
        this.closedPipes.add(pipe);
        const existing = this.pipes.get(pipe);
        if (!existing) {
            return;
        }
        this.pipes.delete(pipe);
        existing.close();
        this.sendRequest(pipe, '__closePipe', undefined, undefined);
    }
    remoteClosedPipe(pipeId) {
        this.closedPipes.add(pipeId);
        const pipe = this.pipes.get(pipeId);
        if (pipe) {
            pipe.close();
            this.pipes.delete(pipeId);
        }
    }
    getOrMakePipe(id) {
        if (this.closedPipes.has(id)) {
            return CLOSED_PIPE;
        }
        let pipe = this.pipes.get(id);
        if (!pipe) {
            pipe = new Pipe(id);
            this.pipes.set(id, pipe);
        }
        return pipe;
    }
    addCloseHandler(pipeId, handler) {
        this.getOrMakePipe(pipeId).addCloseHandler(handler);
    }
}
class PostMessageRemoteImpl {
    pipeId;
    sender;
    router;
    constructor(pipeId, sender, router) {
        this.pipeId = pipeId;
        this.sender = sender;
        this.router = router;
    }
    addCloseHandler(f) {
        const pipe = this.router.pipes.get(this.pipeId);
        pipe?.addCloseHandler(f);
    }
    close() {
        this.router.closePipe(this.pipeId);
    }
    requestWithResponse(requestType, request, transfer = []) {
        return this.sender.requestWithResponse(this.pipeId, requestType, request, transfer);
    }
    requestNoResponse(requestType, request, transfer = []) {
        this.sender.requestNoResponse(this.pipeId, requestType, request, transfer);
    }
    rawSender() {
        return this.sender;
    }
}
/**
 * Receives messages sent via a `PostMessageRemote`, and forwards them to a
 * message handler.
 */
class PostMessageReceiverImpl {
    pipe;
    pipeId;
    handler;
    router;
    constructor(pipe, pipeId, handler, router) {
        this.pipe = pipe;
        this.pipeId = pipeId;
        this.handler = handler;
        this.router = router;
        this.pipe.addCloseHandler(() => {
            this.handler?.[ON_PIPE_CLOSED]?.();
        });
    }
    close() {
        this.router.closePipe(this.pipeId);
    }
    setMessageHandler(handler, interfaceDef) {
        this.pipe.setMessageHandler(handler, interfaceDef);
    }
    addCloseHandler(f) {
        this.pipe.addCloseHandler(f);
    }
}
// Sends requests over postMessage.
class PostMessageRequestSender {
    router;
    requestId = 1;
    responseHandlers = new Map();
    // We limit the number of in-flight requests because it fails in a better way
    // than doing no limiting. The WebUI code heavily relies on promises to
    // dispatch work in processing mojo requests and requests over postMessage.
    // Ideally, we could prioritize processing of mojo requests, but that's not
    // currently tractable. Instead, we limit the number of in-flight requests
    // which in practice prevents the situation where the WebUI is too busy
    // processing new postMessage requests to respond to existing ones.
    maxInFlightRequests = Infinity;
    // If true, send responses for all requests even if the request doesn't
    // require one. This ensures in-flight request tracking is accurate.
    // Without this, in-flight request tracking just ignores requests that don't
    // require a response until after the `maxInFlightRequests` limit is reached.
    sendResponsesForAllRequests = false;
    sendQueue = new Queue();
    queueNoticeLogged = false;
    constructor(router) {
        this.router = router;
        assert(router.sender === undefined);
        router.sender = this;
    }
    inFlightRequestCount() {
        return this.responseHandlers.size;
    }
    messageQueueLength() {
        return this.sendQueue.length;
    }
    // Handles responses from the host.
    onMessage(response) {
        const entry = this.responseHandlers.get(response.responseId);
        if (!entry) {
            // No handler for this request.
            return;
        }
        this.responseHandlers.delete(response.responseId);
        if (!this.sendQueue.empty() &&
            this.responseHandlers.size < this.maxInFlightRequests) {
            // Running a queued send will always register another response handler.
            // This should ensure a steady state of MAX_IN_FLIGHT_REQUESTS until
            // the queue is empty.
            this.sendQueue.popFront()();
        }
        entry.handler(response);
    }
    // Sends a request to the host, and returns a promise that resolves with its
    // response.
    requestWithResponse(pipeId, requestType, request, transfer = []) {
        const { promise, resolve, reject } = Promise.withResolvers();
        const requestId = this.requestId++;
        const processFn = () => {
            this.responseHandlers.set(requestId, {
                type: requestType,
                handler: (response) => {
                    if (response.exception !== undefined) {
                        reject(this.router.errorCodec.deserialize(response.exception));
                    }
                    else {
                        resolve(response.responsePayload);
                    }
                },
            });
            this.router.sendRequest(pipeId, requestType, requestId, request, transfer);
        };
        if (this.isQueueing()) {
            if (!this.queueNoticeLogged) {
                console.warn(`WARNING! ${this.router.loggingPrefix}:` +
                    ` Too many in-flight requests, starting to queue them.`);
                this.queueNoticeLogged = true;
            }
            this.sendQueue.push(processFn);
        }
        else {
            processFn();
        }
        return promise;
    }
    requestNoResponse(pipeId, requestType, request, transfer = []) {
        if (!this.sendResponsesForAllRequests && !this.isQueueing()) {
            this.router.sendRequest(pipeId, requestType, undefined, request, transfer);
            return;
        }
        this.requestWithResponse(pipeId, requestType, request, transfer);
    }
    setMaxInFlightRequests(maxInFlightRequests) {
        if (maxInFlightRequests < 1) {
            this.maxInFlightRequests = Infinity;
        }
        else {
            this.maxInFlightRequests = maxInFlightRequests;
        }
    }
    isQueueing() {
        return this.inFlightRequestCount() >= this.maxInFlightRequests ||
            this.sendQueue.length > 0;
    }
}
// Receives requests over postMessage and forward them to a
// `PostMessageLifecycleObserver`.
class PostMessageRequestReceiver {
    router;
    requestObserver;
    handlerWrapper = (_type, _interfaceName, payload, extras, handler) => handler(payload, extras);
    constructor(router, requestObserver) {
        this.router = router;
        this.requestObserver = requestObserver;
        assert(router.receiver === undefined);
        router.receiver = this;
    }
    setHandlerWrapper(wrapper) {
        this.handlerWrapper = wrapper;
    }
    async onMessage(requestMessage) {
        const { pipeId, senderId, requestId, type, requestPayload } = requestMessage;
        if (type === '__closePipe') {
            this.router.remoteClosedPipe(requestMessage.pipeId);
            return;
        }
        const pipe = this.router.getOrMakePipe(pipeId);
        // TODO(harringtond): Consider adding more debug logging for pending
        // messages or messages dropped due to pipe closure.
        if (pipe.pending()) {
            pipe.pushPendingMessage(this, requestMessage);
            return;
        }
        if (!pipe.open) {
            const exception = this.router.errorCodec.serialize(new Error(`Pipe closed`));
            if (requestId) {
                this.router.sendResponse(pipeId, type, senderId, requestId, undefined, exception);
            }
            return;
        }
        this.requestObserver.onRequestReceived?.(type, pipe.interfaceDef);
        const handleFn = pipe.getHandlerFunction(type);
        if (!handleFn) {
            return;
        }
        let response;
        let exception;
        const extras = new ResponseExtras();
        try {
            response = await this.handlerWrapper(type, pipe.interfaceDef, requestPayload, extras, handleFn);
        }
        catch (error) {
            this.requestObserver.onRequestHandlerException?.(type, pipe.interfaceDef);
            console.warn('Unexpected error', error);
            if (error instanceof Error) {
                exception = this.router.errorCodec.serialize(error);
            }
            else {
                exception = this.router.errorCodec.serialize(new Error(`Unexpected error: ${error}`));
            }
        }
        if (!exception) {
            this.requestObserver.onRequestCompleted?.(type, pipe.interfaceDef);
        }
        // If the message contains no `requestId`, a response is not requested.
        if (!requestId) {
            return;
        }
        this.router.sendResponse(pipeId, type, senderId, requestId, response, exception, extras.transfers);
    }
}
// Creates a direct in-memory messaging transport pair between host and client
// without going through real window.postMessage.
function createDirectMessagingPair(logPrefix, errorCodec, clientRootHandler, hostRootHandler, clientInterfaceDef, hostInterfaceDef, clientLifecycleObserver = {}, hostLifecycleObserver = {}) {
    const targetForClient = {};
    const targetForHost = {};
    const senderToHost = {
        postMessage(message, _targetOrigin, _transfer) {
            queueMicrotask(() => {
                targetForHost.router?.onMessage({
                    origin: '*',
                    source: window,
                    data: message,
                    ports: [],
                });
            });
        },
    };
    const senderToClient = {
        postMessage(message, _targetOrigin, _transfer) {
            queueMicrotask(() => {
                targetForClient.router?.onMessage({
                    origin: '*',
                    source: window,
                    data: message,
                    ports: [],
                });
            });
        },
    };
    const clientSenderId = newSenderId();
    const hostSenderId = newSenderId();
    const routerClient = new PostMessageRouterImpl('*', clientSenderId, senderToHost, `${logPrefix}_client`, false, errorCodec);
    const routerHost = new PostMessageRouterImpl('*', hostSenderId, senderToClient, `${logPrefix}_host`, true, errorCodec);
    targetForClient.router = routerClient;
    targetForHost.router = routerHost;
    const clientSender = new PostMessageRequestSender(routerClient);
    const clientReceiver = new PostMessageRequestReceiver(routerClient, clientLifecycleObserver);
    const clientRootReceiver = routerClient.newReceiver(ROOT_PIPE, clientRootHandler, clientInterfaceDef);
    const clientRootRemote = new PostMessageRemoteImpl(ROOT_PIPE, clientSender, routerClient);
    const hostSender = new PostMessageRequestSender(routerHost);
    const hostReceiver = new PostMessageRequestReceiver(routerHost, hostLifecycleObserver);
    const hostRootReceiver = routerHost.newReceiver(ROOT_PIPE, hostRootHandler, hostInterfaceDef);
    const hostRootRemote = new PostMessageRemoteImpl(ROOT_PIPE, hostSender, routerHost);
    return {
        client: {
            router: routerClient,
            sender: clientSender,
            receiver: clientReceiver,
            rootRemote: clientRootRemote,
            rootReceiver: clientRootReceiver,
        },
        host: {
            router: routerHost,
            sender: hostSender,
            receiver: hostReceiver,
            rootRemote: hostRootRemote,
            rootReceiver: hostRootReceiver,
        },
    };
}
// Stores a set of non-negative integers in O(N) memory where N is the largest
// integer _not_ stored between [0, M], and M is the largest
// integer stored.
class InverseSet {
    notContained = new Set();
    maxValue = -1;
    add(v) {
        assert(v >= 0);
        while (v > this.maxValue) {
            this.maxValue++;
            this.notContained.add(this.maxValue);
        }
        this.notContained.delete(v);
    }
    delete(v) {
        if (v <= this.maxValue) {
            this.notContained.add(v);
        }
    }
    has(v) {
        return v <= this.maxValue && !this.notContained.has(v);
    }
}

// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/*
This is bundled into a js file, and sent to the web client. It should be
directly executable in a <script> element, and therefore should not have any
exports.
*/
class InFrameGlicBoot {
    static createRegistry() {
        return {
            async registerWebClient(webClient) {
                // Note: A migration is underway to use mojo directly from the
                // web client code. In the interim, there is still the guise of a
                // client/host architecture here, but in fact the host and client are
                // directly coupled.
                const directPair = createDirectMessagingPair('glic_api', ERROR_CODEC, 
                // client root handler will be bound by GlicBrowserHostImpl later,
                // with setMessageHandler. For now, no messages will be handled.
                undefined, 
                // host root handler will be bound by GlicApiHost below, with
                // setMessageHandler. For now, no messages will be handled.
                undefined, WebClientDef, WebClientHostDef);
                const hostApi = new GlicApiHost(directPair.host.rootRemote, directPair.host.router);
                window.addEventListener('click', (e) => {
                    const target = e.target?.closest?.('a');
                    if (target && target.getAttribute('target') === '_blank' &&
                        target.href) {
                        e.preventDefault();
                        hostApi?.openLinkInNewTab(target.href);
                    }
                }, true);
                directPair.host.rootReceiver.setMessageHandler(hostApi.hostMessageHandler, WebClientHostDef);
                const clientHostRegistry = new GlicHostRegistryImpl(directPair, hostApi);
                return clientHostRegistry.registerWebClient(webClient);
            },
        };
    }
}
window.internalAutoGlicBoot = (_windowProxy) => InFrameGlicBoot.createRegistry();
//# sourceMappingURL=glic_api_injected_client.rollup.js.map
