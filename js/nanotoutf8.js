const alphabet = "13456789abcdefghijkmnopqrstuwxyz";

function nanotoutf8(addr) {
	try {
		var prefix = addr.indexOf("_")
		if (prefix === -1) throw "Prefix error in \"" + addr + "\""
		if (addr.length - (prefix + 1) != 60 ) throw "Wrong address length: \"" + addr + "\""
		if(new RegExp("[^\s" + alphabet + "]").test(addr.substr(prefix+1, addr.length))) throw "Wrong address format! Invalid characters found in \"" + addr + "\""
		var keyinbase32 = addr.substr(prefix + 1, 52)
		var key = Base32Decode("1111"+keyinbase32)
		if (key) return key.slice(3, 35)
	} catch(err) {
		alert (err)
	}
}

function Base32Decode(base32EncodedString) {
	try {
		if (!base32EncodedString && base32EncodedString !== "") {
				throw "base32EncodedString cannot be null or undefined";
		}

		if (base32EncodedString.length * 5 % 8 !== 0) {
				throw "base32EncodedString is not of the proper length. Please verify padding.";
		}

		base32EncodedString = base32EncodedString.toLowerCase();
		var returnArray = new Array(base32EncodedString.length * 5 / 8);

		var currentByte = 0;
		var bitsRemaining = 8;
		var mask = 0;
		var arrayIndex = 0;

		for (var count = 0; count < base32EncodedString.length; count++) {
				var currentIndexValue = alphabet.indexOf(base32EncodedString[count]);
				if (-1 === currentIndexValue) {
						if ("=" === base32EncodedString[count]) {
								var paddingCount = 0;
								for (count = count; count < base32EncodedString.length; count++) {
										if ("=" !== base32EncodedString[count]) {
												throw "Invalid '=' in encoded string";
										} else {
												paddingCount++;
										}
								}

								switch (paddingCount) {
										case 6:
												returnArray = returnArray.slice(0, returnArray.length - 4);
												break;
										case 4:
												returnArray = returnArray.slice(0, returnArray.length - 3);
												break;
										case 3:
												returnArray = returnArray.slice(0, returnArray.length - 2);
												break;
										case 1:
												returnArray = returnArray.slice(0, returnArray.length - 1);
												break;
										default:
												throw "Incorrect padding";
								}
						} else {
								throw "base32EncodedString contains invalid characters or invalid padding.";
						}
				} else {
						if (bitsRemaining > 5) {
								mask = currentIndexValue << (bitsRemaining - 5);
								currentByte = currentByte | mask;
								bitsRemaining -= 5;
						} else {
								mask = currentIndexValue >> (5 - bitsRemaining);
								currentByte = currentByte | mask;
								returnArray[arrayIndex++] = currentByte;
								currentByte = currentIndexValue << (3 + bitsRemaining);
								bitsRemaining += 3;
						}
				}
		}

		return new Uint8Array(returnArray);
	} catch (err) {
		alert (err)
	}

}
