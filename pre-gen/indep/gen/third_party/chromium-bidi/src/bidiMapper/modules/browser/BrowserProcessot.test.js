/*
 *  Copyright 2025 Google LLC.
 *  Copyright (c) Microsoft Corporation.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { describe, it } from 'node:test';
import { assert } from 'chai';
import { InvalidArgumentException, UnknownErrorException, UnsupportedOperationException, } from '../../../protocol/protocol.js';
import { getProxyStr } from './BrowserProcessor.js';
describe('BrowserProcessor:getProxyStr', () => {
    it('should return undefined for "direct" proxyType', () => {
        const proxyConfig = { proxyType: 'direct' };
        assert.isUndefined(getProxyStr(proxyConfig));
    });
    it('should return undefined for "system" proxyType', () => {
        const proxyConfig = { proxyType: 'system' };
        assert.isUndefined(getProxyStr(proxyConfig));
    });
    it('should throw UnsupportedOperationException for "pac" proxyType', () => {
        const proxyConfig = {
            proxyType: 'pac',
            proxyAutoconfigUrl: 'some_url',
        };
        assert.throws(() => getProxyStr(proxyConfig), UnsupportedOperationException);
    });
    it('should throw UnsupportedOperationException for "autodetect" proxyType', () => {
        const proxyConfig = { proxyType: 'autodetect' };
        assert.throws(() => getProxyStr(proxyConfig), UnsupportedOperationException);
    });
    describe('manual proxyType', () => {
        it('should return undefined if no specific proxies are provided', () => {
            const proxyConfig = { proxyType: 'manual' };
            assert.isUndefined(getProxyStr(proxyConfig));
        });
        it('should correctly format httpProxy', () => {
            const proxyConfig = {
                proxyType: 'manual',
                httpProxy: 'localhost:8080',
            };
            assert.equal(getProxyStr(proxyConfig), 'http=localhost:8080');
        });
        it('should correctly format sslProxy', () => {
            const proxyConfig = {
                proxyType: 'manual',
                sslProxy: 'secure.proxy:443',
            };
            assert.equal(getProxyStr(proxyConfig), 'https=secure.proxy:443');
        });
        describe('socksProxy', () => {
            it('should correctly format socksProxy with valid socksVersion', () => {
                const proxyConfig = {
                    proxyType: 'manual',
                    socksProxy: 'socks.server:1080',
                    socksVersion: 5,
                };
                assert.equal(getProxyStr(proxyConfig), 'socks=socks5://socks.server:1080');
            });
            it('should correctly format socksProxy with socksVersion 0', () => {
                const proxyConfig = {
                    proxyType: 'manual',
                    socksProxy: 'socks.server:1080',
                    socksVersion: 0,
                };
                assert.equal(getProxyStr(proxyConfig), 'socks=socks0://socks.server:1080');
            });
            it('should throw InvalidArgumentException if socksProxy is undefined while socksVersion is not', () => {
                const proxyConfig = {
                    proxyType: 'manual',
                    socksVersion: 5,
                };
                assert.throws(() => getProxyStr(proxyConfig), InvalidArgumentException);
            });
            it('should throw InvalidArgumentException if socksVersion is undefined', () => {
                const proxyConfig = {
                    proxyType: 'manual',
                    socksProxy: 'socks.server:1080',
                };
                assert.throws(() => getProxyStr(proxyConfig), InvalidArgumentException);
            });
            it('should throw InvalidArgumentException if socksVersion is not a number', () => {
                const proxyConfig = {
                    proxyType: 'manual',
                    socksProxy: 'socks.server:1080',
                    socksVersion: '5', // Force incorrect type
                };
                assert.throws(() => getProxyStr(proxyConfig), InvalidArgumentException);
            });
            it('should throw InvalidArgumentException if socksVersion is not an integer', () => {
                const proxyConfig = {
                    proxyType: 'manual',
                    socksProxy: 'socks.server:1080',
                    socksVersion: 5.5,
                };
                assert.throws(() => getProxyStr(proxyConfig), InvalidArgumentException);
            });
            it('should throw InvalidArgumentException if socksVersion is less than 0', () => {
                const proxyConfig = {
                    proxyType: 'manual',
                    socksProxy: 'socks.server:1080',
                    socksVersion: -1,
                };
                assert.throws(() => getProxyStr(proxyConfig), InvalidArgumentException);
            });
            it('should throw InvalidArgumentException if socksVersion is greater than 255', () => {
                const proxyConfig = {
                    proxyType: 'manual',
                    socksProxy: 'socks.server:1080',
                    socksVersion: 256,
                };
                assert.throws(() => getProxyStr(proxyConfig), InvalidArgumentException);
            });
        });
        it('should correctly format multiple proxies', () => {
            const proxyConfig = {
                proxyType: 'manual',
                httpProxy: 'http.proxy:80',
                sslProxy: 'https.proxy:443',
                socksProxy: 'socks.proxy:1080',
                socksVersion: 4,
            };
            const expected = 'http=http.proxy:80;https=https.proxy:443;socks=socks4://socks.proxy:1080';
            assert.equal(getProxyStr(proxyConfig), expected);
        });
        it('should correctly format multiple proxies in different order', () => {
            const proxyConfig = {
                proxyType: 'manual',
                socksProxy: 'socks.proxy:1080',
                socksVersion: 5,
                httpProxy: 'http.proxy:80',
            };
            // Order of servers in the output string is defined by the function's implementation
            const expected = 'http=http.proxy:80;socks=socks5://socks.proxy:1080';
            assert.equal(getProxyStr(proxyConfig), expected);
        });
    });
    it('should throw UnknownErrorException for an unknown proxyType', () => {
        const proxyConfig = {
            proxyType: 'unknown_type',
        };
        assert.throws(() => getProxyStr(proxyConfig), UnknownErrorException);
    });
});
//# sourceMappingURL=BrowserProcessot.test.js.map