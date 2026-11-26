// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './text_overlay.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss } from './motion_overlay.css.js';
import { getHtml } from './motion_overlay.html.js';
const SWIPE_DURATION_MS = 2000;
const LOADING_CIRCLES_START_DELAY_MS = 1300;
const TEXT_OVERLAY_START_DELAY_MS = 1000;
export class IndigoMotionOverlayElement extends CrLitElement {
    static get is() {
        return 'indigo-motion-overlay';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            animationState: {
                type: String,
                reflect: true,
                attribute: 'animation-state',
            },
            showLoadingCircles_: {
                type: Boolean,
                reflect: true,
                attribute: 'show-loading-circles',
            },
        };
    }
    #animationState_accessor_storage = 'none';
    get animationState() { return this.#animationState_accessor_storage; }
    set animationState(value) { this.#animationState_accessor_storage = value; }
    #showLoadingCircles__accessor_storage = false;
    get showLoadingCircles_() { return this.#showLoadingCircles__accessor_storage; }
    set showLoadingCircles_(value) { this.#showLoadingCircles__accessor_storage = value; }
    loadingTimeout_ = null;
    entryTimeout_ = null;
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('animationState')) {
            const oldState = changedProperties.get('animationState');
            const newState = this.animationState;
            if (newState === 'entry' && oldState !== 'entry') {
                this.startTransitionAnimation_();
            }
            else if (newState === 'exit' && oldState !== 'exit') {
                this.startExitAnimation_();
            }
        }
    }
    startTransitionAnimation_() {
        this.calculateDimensions_();
        this.entryTimeout_ = window.setTimeout(() => {
            this.fire('entry-complete');
        }, SWIPE_DURATION_MS);
        this.loadingTimeout_ = window.setTimeout(() => {
            this.showLoadingCircles_ = true;
        }, LOADING_CIRCLES_START_DELAY_MS);
        window.setTimeout(() => {
            this.$.textOverlay.startSequence();
        }, TEXT_OVERLAY_START_DELAY_MS);
    }
    startExitAnimation_() {
        if (this.entryTimeout_) {
            window.clearTimeout(this.entryTimeout_);
            this.entryTimeout_ = null;
            this.fire('entry-complete');
        }
        if (this.loadingTimeout_) {
            window.clearTimeout(this.loadingTimeout_);
        }
        this.$.textOverlay.stopSequence();
        // This is to handle a scenario where the exit animation is started before
        // the entry animation has completed. In this case, we want the exit
        // animation to start from the entry animation's last keyframe's opacity
        // value.
        const blurLayer = this.$.blurLayer;
        if (blurLayer) {
            const computedStyle = window.getComputedStyle(blurLayer);
            const currentBlur = computedStyle.getPropertyValue('backdrop-filter');
            if (currentBlur && currentBlur !== 'none') {
                blurLayer.style.setProperty('backdrop-filter', currentBlur);
            }
        }
        this.showLoadingCircles_ = false;
        window.setTimeout(() => {
            this.fire('motion-complete');
        }, SWIPE_DURATION_MS);
    }
    calculateDimensions_() {
        const rect = this.getBoundingClientRect();
        const w = rect.width || window.innerWidth;
        const h = rect.height || window.innerHeight;
        const diagonal = Math.sqrt(w * w + h * h);
        const majorAxis = diagonal * 4;
        const minorAxis = majorAxis * 0.7;
        const borderWidth = (h + w) / 4;
        const gap = h * 0.7;
        this.style.setProperty('--major-axis', `${majorAxis}px`);
        this.style.setProperty('--minor-axis', `${minorAxis}px`);
        this.style.setProperty('--border-width', `${borderWidth}px`);
        this.style.setProperty('--gap', `${gap}px`);
        this.style.setProperty('--indigo-swipe-duration', `${SWIPE_DURATION_MS}ms`);
    }
}
customElements.define(IndigoMotionOverlayElement.is, IndigoMotionOverlayElement);
