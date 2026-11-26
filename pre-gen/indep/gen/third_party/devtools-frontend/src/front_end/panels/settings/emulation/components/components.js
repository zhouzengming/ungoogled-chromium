var M=Object.defineProperty;var S=(b,e)=>{for(var n in e)M(b,n,{get:e[n],enumerable:!0})};var U={};S(U,{ALL_PROTOCOL_FORM_FACTORS:()=>A,ClientHintsChangeEvent:()=>h,ClientHintsSubmitEvent:()=>y,UserAgentClientHintsForm:()=>L});import"../../../../ui/kit/kit.js";import"../../../../ui/legacy/legacy.js";import*as w from"../../../../core/i18n/i18n.js";import*as E from"../../../../core/platform/platform.js";import*as x from"../../../../ui/components/buttons/buttons.js";import*as V from"../../../../ui/components/input/input.js";import*as f from"../../../../ui/lit/lit.js";import*as d from"../../../../ui/visual_logging/visual_logging.js";import*as $ from"../utils/utils.js";var F=`.root{color:var(--sys-color-on-surface);width:100%}.tree-title{font-weight:700;display:flex;align-items:center;& > [aria-controls="form-container"]{margin-left:var(--sys-size-2);padding-right:var(--sys-size-3);& > [name="triangle-right"],
    & > [name="triangle-down"]{vertical-align:bottom}&[aria-expanded="true"] > [name="triangle-right"]{display:none}&[aria-expanded="false"] > [name="triangle-down"]{display:none}}}.form-container{display:grid;grid-template-columns:1fr 1fr 1fr auto;align-items:center;gap:var(--sys-size-5) 10px;padding:0 10px}.full-row{grid-column:1/5}.form-factors-checkbox-group{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--sys-size-4) 10px}.form-factor-checkbox-label{display:flex;align-items:center;gap:var(--sys-size-4);white-space:nowrap}hr.section-separator{grid-column:1/5;border:none;margin-top:var(--sys-size-1)}.half-row{grid-column:span 2}.mobile-checkbox-container{display:flex}.device-model-input{grid-column:1/4}.input-field{color:var(--sys-color-on-surface);padding:3px var(--sys-size-4);border-radius:var(--sys-size-2);border:var(--sys-size-1) solid var(--sys-color-neutral-outline);background-color:var(--sys-color-cdt-base-container);font-size:inherit;height:18px}.input-field::placeholder{color:var(--sys-color-on-surface-subtle)}.input-field:focus{border:var(--sys-size-1) solid var(--sys-color-state-focus-ring);outline-style:none}.add-container{cursor:pointer;display:flex;align-items:center;gap:var(--sys-size-4)}.add-icon{margin-right:5px}.brand-row{display:flex;align-items:center;gap:10px;justify-content:space-between}.brand-row > input{width:100%}.info-icon{margin-left:5px;margin-right:var(--sys-size-1);height:var(--sys-size-8);width:var(--sys-size-8)}.link,
.devtools-link{color:var(--sys-color-primary);text-decoration:underline;cursor:pointer;outline-offset:var(--sys-size-2);font-weight:400}devtools-icon + .link{margin-inline-start:var(--sys-size-2)}.hide-container{display:none}.input-field-label-container{display:flex;flex-direction:column;gap:10px}@media (forced-colors: active){.input-field{border:var(--sys-size-1) solid}.tree-title[aria-disabled="true"]{color:GrayText}}
/*# sourceURL=${import.meta.resolve("./userAgentClientHintsForm.css")} */`;var{html:u}=f,t={title:"User agent client hints",useragent:"User agent (Sec-CH-UA)",fullVersionList:"Full version list (Sec-CH-UA-Full-Version-List)",brandProperties:"User agent properties",brandName:"Brand",brandNameAriaLabel:"Brand {PH1}",significantBrandVersionPlaceholder:"Significant version (e.g. 87)",brandVersionPlaceholder:"Version (e.g. 87.0.4280.88)",brandVersionAriaLabel:"Version {PH1}",addBrand:"Add brand",brandUserAgentDelete:"Delete brand from user agent section",brandFullVersionListDelete:"Delete brand from full version list",formFactorsTitle:"Form factors (Sec-CH-UA-Form-Factors)",formFactorsGroupAriaLabel:"Available form factors",formFactorDesktop:"Desktop",formFactorAutomotive:"Automotive",formFactorMobile:"Mobile",formFactorTablet:"Tablet",formFactorXR:"XR",formFactorEInk:"EInk",formFactorWatch:"Watch",fullBrowserVersion:"Full browser version (Sec-CH-UA-Full-Version)",fullBrowserVersionPlaceholder:"Full browser version (e.g. 87.0.4280.88)",platformLabel:"Platform (Sec-CH-UA-Platform / Sec-CH-UA-Platform-Version)",platformProperties:"Platform properties",platformVersion:"Platform version",platformPlaceholder:"Platform (e.g. Android)",architecture:"Architecture (Sec-CH-UA-Arch)",architecturePlaceholder:"Architecture (e.g. x86)",deviceProperties:"Device properties",deviceModel:"Device model (Sec-CH-UA-Model)",mobileCheckboxLabel:"Mobile",update:"Update",notRepresentable:"Not representable as structured headers string",userAgentClientHintsInfo:"User agent client hints are an alternative to the user agent string that identify the browser and the device in a more structured way with better privacy accounting",addedBrand:"Added brand row",deletedBrand:"Deleted brand row",learnMore:"Learn more"},P=w.i18n.registerUIStrings("panels/settings/emulation/components/UserAgentClientHintsForm.ts",t),r=w.i18n.getLocalizedString.bind(void 0,P),h=class b extends Event{static eventName="clienthintschange";constructor(){super(b.eventName)}},y=class b extends Event{static eventName="clienthintssubmit";detail;constructor(e){super(b.eventName),this.detail={value:e}}},k={brands:[{brand:"",version:""}],fullVersionList:[{brand:"",version:""}],fullVersion:"",platform:"",platformVersion:"",architecture:"",model:"",mobile:!1,formFactors:[]},A=[t.formFactorDesktop,t.formFactorAutomotive,t.formFactorMobile,t.formFactorTablet,t.formFactorXR,t.formFactorEInk,t.formFactorWatch],L=class extends HTMLElement{#m=this.attachShadow({mode:"open"});#r=!1;#a=!1;#e=k;#s=!1;#i=!1;#n="";set value(e){let{metaData:n=k,showMobileCheckbox:a=!1,showSubmitButton:o=!1}=e;this.#e={...this.#e,...n},this.#s=a,this.#i=o,this.#t()}get value(){return{metaData:this.#e}}set disabled(e){this.#a=e,this.#r=!1,this.#t()}get disabled(){return this.#a}#b=e=>{(e.code==="Space"||e.code==="Enter"||e.code==="ArrowLeft"||e.code==="ArrowRight")&&(e.consume(!0),this.#l(e.code))};#l=e=>{this.#a||e==="ArrowLeft"&&!this.#r||e==="ArrowRight"&&this.#r||(this.#r=!this.#r,this.#t())};#d=(e,n,a)=>{let o=this.#e.brands?.map((s,i)=>{if(i===n){let{brand:l,version:p}=s;return a==="brandName"?{brand:e,version:p}:{brand:l,version:e}}return s});this.#e={...this.#e,brands:o},this.dispatchEvent(new h),this.#t()};#c=(e,n,a)=>{let o=this.#e.fullVersionList?.map((s,i)=>{if(i===n){let{brand:l,version:p}=s;return a==="brandName"?{brand:e,version:p}:{brand:l,version:e}}return s});this.#e={...this.#e,fullVersionList:o},this.dispatchEvent(new h),this.#t()};#f=e=>{let{brands:n=[]}=this.#e;n.splice(e,1),this.#e={...this.#e,brands:n},this.dispatchEvent(new h),this.#n=r(t.deletedBrand),this.#t();let a=this.shadowRoot?.getElementById(`ua-brand-${e+1}-input`);a||(a=this.shadowRoot?.getElementById("add-brand-button")),a?.focus()};#g=e=>{let{fullVersionList:n=[]}=this.#e;n.splice(e,1),this.#e={...this.#e,fullVersionList:n},this.dispatchEvent(new h),this.#n=r(t.deletedBrand),this.#t();let a=this.shadowRoot?.getElementById(`fvl-brand-${e+1}-input`);a||(a=this.shadowRoot?.getElementById("add-fvl-brand-button")),a?.focus()};#u=()=>{let{brands:e}=this.#e;this.#e={...this.#e,brands:[...Array.isArray(e)?e:[],{brand:"",version:""}]},this.dispatchEvent(new h),this.#n=r(t.addedBrand),this.#t();let n=this.shadowRoot?.querySelectorAll(".ua-brand-name-input");if(n){let a=Array.from(n).pop();a&&a.focus()}};#v=e=>{(e.code==="Space"||e.code==="Enter")&&(e.preventDefault(),this.#u())};#h=()=>{let{fullVersionList:e}=this.#e;this.#e={...this.#e,fullVersionList:[...Array.isArray(e)?e:[],{brand:"",version:""}]},this.dispatchEvent(new h),this.#n=r(t.addedBrand),this.#t();let n=this.shadowRoot?.querySelectorAll(".fvl-brand-name-input");if(n){let a=Array.from(n).pop();a&&a.focus()}};#$=e=>{(e.code==="Space"||e.code==="Enter")&&(e.preventDefault(),this.#h())};#y=(e,n)=>{let a=[...this.#e.formFactors||[]];n?a.includes(e)||a.push(e):a=a.filter(o=>o!==e),this.#e={...this.#e,formFactors:a},this.dispatchEvent(new h),this.#t()};#o=(e,n)=>{e in this.#e&&(this.#e={...this.#e,[e]:n},this.#t()),this.dispatchEvent(new h)};#L=e=>{e.preventDefault(),this.#i&&(this.dispatchEvent(new y(this.#e)),this.#t())};#p(e,n,a,o){return u`
      <label class="full-row label input-field-label-container">
        ${e}
        <input
          class="input-field"
          type="text"
          @input=${i=>{let l=i.target.value;this.#o(o,l)}}
          .value=${a}
          placeholder=${n}
          jslog=${d.textField().track({change:!0}).context(E.StringUtilities.toKebabCase(o))}
          />
      </label>
    `}#E(){let{platform:e,platformVersion:n}=this.#e,a=s=>{let i=s.target.value;this.#o("platform",i)},o=s=>{let i=s.target.value;this.#o("platformVersion",i)};return u`
      <span class="full-row label">${r(t.platformLabel)}</span>
      <div class="full-row brand-row" aria-label=${r(t.platformProperties)} role="group">
        <input
          class="input-field half-row"
          type="text"
          @input=${a}
          .value=${e}
          placeholder=${r(t.platformPlaceholder)}
          aria-label=${r(t.platformLabel)}
          jslog=${d.textField("platform").track({change:!0})}
        />
        <input
          class="input-field half-row"
          type="text"
          @input=${o}
          .value=${n}
          placeholder=${r(t.platformVersion)}
          aria-label=${r(t.platformVersion)}
          jslog=${d.textField("platform-version").track({change:!0})}
        />
      </div>
    `}#A(){let{model:e,mobile:n}=this.#e,a=i=>{let l=i.target.value;this.#o("model",l)},o=i=>{let l=i.target.checked;this.#o("mobile",l)},s=this.#s?u`
      <label class="mobile-checkbox-container">
        <input type="checkbox" @input=${o} .checked=${n}
          jslog=${d.toggle("mobile").track({click:!0})}
        />
        ${r(t.mobileCheckboxLabel)}
      </label>
    `:f.nothing;return u`
      <span class="full-row label">${r(t.deviceModel)}</span>
      <div class="full-row brand-row" aria-label=${r(t.deviceProperties)} role="group">
        <input
          class="input-field ${this.#s?"device-model-input":"full-row"}"
          type="text"
          @input=${a}
          .value=${e}
          placeholder=${r(t.deviceModel)}
          jslog=${d.textField("model").track({change:!0})}
        />
        ${s}
      </div>
    `}#w(){let{brands:e=[{brand:"",version:""}]}=this.#e,n=e.map((a,o)=>{let{brand:s,version:i}=a,l=()=>{this.#f(o)},p=c=>{(c.code==="Space"||c.code==="Enter")&&(c.preventDefault(),l())},g=c=>{let m=c.target.value;this.#d(m,o,"brandName")},v=c=>{let m=c.target.value;this.#d(m,o,"brandVersion")};return u`
        <div class="full-row brand-row" aria-label=${r(t.brandProperties)} role="group">
          <input
            class="input-field ua-brand-name-input"
            type="text"
            @input=${g}
            .value=${s}
            id="ua-brand-${o+1}-input"
            placeholder=${r(t.brandName)}
            aria-label=${r(t.brandNameAriaLabel,{PH1:o+1})}
            jslog=${d.textField("brand-name").track({change:!0})}
          />
          <input
            class="input-field"
            type="text"
            @input=${v}
            .value=${i}
            placeholder=${r(t.significantBrandVersionPlaceholder)}
            aria-label=${r(t.brandVersionAriaLabel,{PH1:o+1})}
            jslog=${d.textField("brand-version").track({change:!0})}
          />
          <devtools-icon name="bin"
            title=${r(t.brandUserAgentDelete)}
            class="medium delete-icon"
            tabindex="0"
            role="button"
            @click=${l}
            @keypress=${p}
            aria-label=${r(t.brandUserAgentDelete)}
          >
          </devtools-icon>
        </div>
      `});return u`
      <span class="full-row label">${r(t.useragent)}</span>
      ${n}
      <div
        class="add-container full-row"
        role="button"
        tabindex="0"
        id="add-brand-button"
        aria-label=${r(t.addBrand)}
        @click=${this.#u}
        @keypress=${this.#v}
      >
        <devtools-icon
          aria-hidden="true" name="plus" class="medium">
        </devtools-icon>
        ${r(t.addBrand)}
      </div>
    `}#F(){let{fullVersionList:e=[{brand:"",version:""}]}=this.#e,n=e.map((a,o)=>{let{brand:s,version:i}=a,l=()=>{this.#g(o)},p=c=>{(c.code==="Space"||c.code==="Enter")&&(c.preventDefault(),l())},g=c=>{let m=c.target.value;this.#c(m,o,"brandName")},v=c=>{let m=c.target.value;this.#c(m,o,"brandVersion")};return u`
        <div
          class="full-row brand-row"
          aria-label=${r(t.brandProperties)}
          jslog=${d.section("full-version")}
          role="group">
          <input
            class="input-field fvl-brand-name-input"
            type="text"
            @input=${g}
            .value=${s}
            id="fvl-brand-${o+1}-input"
            placeholder=${r(t.brandName)}
            aria-label=${r(t.brandNameAriaLabel,{PH1:o+1})}
            jslog=${d.textField("brand-name").track({change:!0})}
          />
          <input
            class="input-field"
            type="text"
            @input=${v}
            .value=${i}
            placeholder=${r(t.brandVersionPlaceholder)}
            aria-label=${r(t.brandVersionAriaLabel,{PH1:o+1})}
            jslog=${d.textField("brand-version").track({change:!0})}
          />
          <devtools-icon name="bin" 
            title=${r(t.brandFullVersionListDelete)}
            class="medium delete-icon"
            tabindex="0"
            role="button"
            @click=${l}
            @keypress=${p}
            aria-label=${r(t.brandFullVersionListDelete)}
          >
          </devtools-icon>
        </div>
      `});return u`
      <span class="full-row label">${r(t.fullVersionList)}</span>
      ${n}
      <div
        class="add-container full-row"
        role="button"
        tabindex="0"
        id="add-fvl-brand-button"
        aria-label=${r(t.addBrand)}
        @click=${this.#h}
        @keypress=${this.#$}
      >
        <devtools-icon name="plus" class="medium"
          aria-hidden="true">
        </devtools-icon>
        ${r(t.addBrand)}
      </div>
    `}#k(){let e=A.map(n=>{let a=this.#e.formFactors?.includes(n)||!1,o=`formFactor${n}`,s=r(t[o]);return u`
        <label class="form-factor-checkbox-label">
          <input
            type="checkbox"
            .checked=${a}
            value=${n}
            jslog=${d.toggle(E.StringUtilities.toKebabCase(n)).track({click:!0})}
            @change=${i=>this.#y(n,i.target.checked)}
          />
          ${s}
        </label>
      `});return u`
      <span class="full-row label" jslog=${d.sectionHeader("form-factors")}>
        ${r(t.formFactorsTitle)}
      </span>
      <div class="full-row form-factors-checkbox-group" role="group" aria-label=${r(t.formFactorsGroupAriaLabel)}>
        ${e}
      </div>
    `}#t(){let{fullVersion:e,architecture:n}=this.#e,a=this.#w(),o=this.#F(),s=this.#p(r(t.fullBrowserVersion),r(t.fullBrowserVersionPlaceholder),e||"","fullVersion"),i=this.#k(),l=this.#E(),p=this.#p(r(t.architecture),r(t.architecturePlaceholder),n,"architecture"),g=this.#A(),v=this.#i?u`
      <devtools-button
        .variant=${x.Button.Variant.OUTLINED}
        .type=${"submit"}
      >
        ${r(t.update)}
      </devtools-button>
    `:f.nothing,c=u`
      <style>${V.checkboxStyles}</style>
      <style>${F}</style>
      <section class="root">
        <div class="tree-title">
          <div
            role=button
            @click=${this.#l}
            tabindex=${this.#a?"-1":"0"}
            @keydown=${this.#b}
            aria-expanded=${this.#r}
            aria-controls=form-container
            aria-disabled=${this.#a}
            aria-label=${r(t.title)}
            jslog=${d.toggleSubpane().track({click:!0})}>
            <devtools-icon name=triangle-right></devtools-icon>
            <devtools-icon name=triangle-down></devtools-icon>
            ${r(t.title)}
          </div>
          <devtools-icon tabindex=${this.#a?"-1":"0"} class=info-icon name=info aria-label=${r(t.userAgentClientHintsInfo)} title=${r(t.userAgentClientHintsInfo)}></devtools-icon>
          <devtools-link
           tabindex=${this.#a?"-1":"0"}
           href="https://web.dev/user-agent-client-hints/"
           class="link"
           aria-label=${r(t.learnMore)}
           jslogcontext="learn-more"
          >
            ${r(t.learnMore)}
          </devtools-link>
        </div>
        <form
          id="form-container"
          class="form-container ${this.#r?"":"hide-container"}"
          @submit=${this.#L}
        >
          ${a}
          <hr class="section-separator">
          ${o}
          <hr class="section-separator">
          ${s}
          <hr class="section-separator">
          ${i}
          <hr class="section-separator">
          ${l}
          <hr class="section-separator">
          ${p}
          <hr class="section-separator">
          ${g}
          ${v}
        </form>
        <div aria-live="polite" aria-label=${this.#n}></div>
      </section>
    `;f.render(c,this.#m,{host:this})}validate=()=>{for(let[e,n]of Object.entries(this.#e))if(e==="brands"||e==="fullVersionList"){if(!this.#e.brands?.every(({brand:o,version:s})=>{let i=$.UserAgentMetadata.validateAsStructuredHeadersString(o,r(t.notRepresentable)),l=$.UserAgentMetadata.validateAsStructuredHeadersString(s,r(t.notRepresentable));return i.valid&&l.valid}))return{valid:!1,errorMessage:r(t.notRepresentable)}}else if(e==="formFactors"){let a=n;if(a)for(let o of a){if(!A.includes(o))return{valid:!1,errorMessage:r(t.notRepresentable)+` (Invalid form factor: ${o})`};let s=$.UserAgentMetadata.validateAsStructuredHeadersString(o,r(t.notRepresentable));if(!s.valid)return s}}else{let a=$.UserAgentMetadata.validateAsStructuredHeadersString(n,r(t.notRepresentable));if(!a.valid)return a}return{valid:!0}}};customElements.define("devtools-user-agent-client-hints-form",L);export{U as UserAgentClientHintsForm};
//# sourceMappingURL=components.js.map
