var ve=Object.defineProperty;var A=(i,e)=>{for(var t in e)ve(i,t,{get:e[t],enumerable:!0})};var Z={};A(Z,{EntriesLinkOverlay:()=>R,EntryLinkStartCreating:()=>k});import"../../../../ui/kit/kit.js";import*as _ from"../../../../core/i18n/i18n.js";import*as S from"../../../../models/trace/trace.js";import*as G from"../../../../ui/legacy/theme_support/theme_support.js";import{html as we,render as xe}from"../../../../ui/lit/lit.js";import*as Y from"../../../../ui/visual_logging/visual_logging.js";var W=`.connectorContainer{display:flex;width:100%;height:100%}.entry-wrapper{pointer-events:none;position:absolute;display:block;border:var(--sys-size-2) solid var(--color-text-primary);box-sizing:border-box;&.cut-off-top{border-top:none}&.cut-off-bottom{border-bottom:none}&.cut-off-right{border-right:none}&.cut-off-left{border-left:none}}.entry-is-not-source{border:var(--sys-size-2) dashed var(--color-text-primary)}.create-link-icon{pointer-events:auto;cursor:pointer;color:var(--sys-color-on-surface);width:var(--sys-size-8);height:var(--sys-size-8);position:absolute}
/*# sourceURL=${import.meta.resolve("./entriesLinkOverlay.css")} */`;var j={diagram:"Links between entries"},Le=_.i18n.registerUIStrings("panels/timeline/overlays/components/EntriesLinkOverlay.ts",j),Ee=_.i18n.getLocalizedString.bind(void 0,Le),k=class i extends Event{static eventName="entrylinkstartcreating";constructor(){super(i.eventName,{bubbles:!0,composed:!0})}},R=class extends HTMLElement{#i=this.attachShadow({mode:"open"});#o;#t;#n;#r=null;#s=null;#e=null;#l=null;#h=null;#c=null;#u=null;#d=!0;#a=!0;#g=null;#y=!0;#b=!0;#p=!1;#v;constructor(e,t){super(),this.#m(),this.#o={x:e.x,y:e.y},this.#t={width:e.width,height:e.height},this.#n={x:e.x,y:e.y},this.#s=this.#i.querySelector(".connectorContainer")??null,this.#e=this.#s?.querySelector("line")??null,this.#l=this.#i.querySelector(".from-highlight-wrapper")??null,this.#h=this.#i.querySelector(".to-highlight-wrapper")??null,this.#c=this.#s?.querySelector(".entryFromConnector")??null,this.#u=this.#s?.querySelector(".entryToConnector")??null,this.#v=t,this.#m()}set canvasRect(e){e!==null&&(this.#g&&this.#g.width===e.width&&this.#g.height===e.height||(this.#g=e,this.#m()))}entryFromWrapper(){return this.#l}entryToWrapper(){return this.#h}set hideArrow(e){this.#p=e,this.#e&&(this.#e.style.display=e?"none":"block")}set fromEntryCoordinateAndDimensions(e){this.#o={x:e.x,y:e.y},this.#t={width:e.length,height:e.height},this.#x(),this.#L()}set entriesVisibility(e){this.#d=e.fromEntryVisibility,this.#a=e.toEntryVisibility,this.#L()}set toEntryCoordinateAndDimensions(e){this.#n={x:e.x,y:e.y},e.length&&e.height?this.#r={width:e.length,height:e.height}:this.#r=null,this.#x(),this.#L()}set fromEntryIsSource(e){e!==this.#y&&(this.#y=e,this.#m())}set toEntryIsSource(e){e!==this.#b&&(this.#b=e,this.#m())}#L(){if(!this.#e||!this.#l||!this.#h||!this.#c||!this.#u){console.error("one of the required Entries Link elements is missing.");return}if(this.#v===S.Types.File.EntriesLinkState.CREATION_NOT_STARTED){this.#c.setAttribute("visibility","hidden"),this.#u.setAttribute("visibility","hidden"),this.#e.style.display="none";return}this.#S(),this.#T(),this.#A(),this.#E(),this.#m()}#S(){!this.#l||!this.#h||(this.#l.style.visibility=this.#d?"visible":"hidden",this.#h.style.visibility=this.#a?"visible":"hidden")}#T(){if(!this.#r||!this.#c||!this.#u)return;let e=8,t=this.#d&&!this.#p&&this.#y&&this.#t.width>=e,n=!this.#p&&this.#a&&this.#b&&this.#r?.width>=e&&!this.#p;this.#c.setAttribute("visibility",t?"visible":"hidden"),this.#u.setAttribute("visibility",n?"visible":"hidden")}#A(){if(!this.#e)return;this.#e.style.display=this.#d||this.#a?"block":"none",this.#e.setAttribute("stroke-width","2");let e=G.ThemeSupport.instance().getComputedValue("--color-text-primary");if(!this.#r||this.#d&&this.#a){this.#e.setAttribute("stroke",e);return}this.#d&&!this.#a?this.#e.setAttribute("stroke","url(#fromVisibleLineGradient)"):this.#a&&!this.#d&&this.#e.setAttribute("stroke","url(#toVisibleLineGradient)")}#E(){if(!this.#e||!this.#c||!this.#u)return;let e=this.#t.height/2,t=this.#o.x+this.#t.width,n=this.#o.y+e;this.#e.setAttribute("x1",t.toString()),this.#e.setAttribute("y1",n.toString()),this.#c.setAttribute("cx",t.toString()),this.#c.setAttribute("cy",n.toString());let s=this.#n.x,o=this.#r?this.#n.y+(this.#r?.height??0)/2:this.#n.y;this.#e.setAttribute("x2",s.toString()),this.#e.setAttribute("y2",o.toString()),this.#u.setAttribute("cx",s.toString()),this.#u.setAttribute("cy",o.toString())}#w(){if(!this.#g)return 100;let e=25,t=this.#n.x-(this.#o.x+this.#t.width),n=e*100/t;return n<100?n:100}#x(){let e=this.#i.querySelector(".create-link-box"),t=e?.querySelector(".create-link-icon")??null;if(!e||!t){console.error("creating element is missing.");return}if(this.#v!==S.Types.File.EntriesLinkState.CREATION_NOT_STARTED){t.style.display="none";return}t.style.left=`${this.#o.x+this.#t.width}px`,t.style.top=`${this.#o.y}px`}#k(){this.#v=S.Types.File.EntriesLinkState.PENDING_TO_EVENT,this.dispatchEvent(new k)}#m(){let e=G.ThemeSupport.instance().getComputedValue("--color-text-primary");xe(we`
          <style>${W}</style>
          <svg class="connectorContainer" width="100%" height="100%" role="region" aria-label=${Ee(j.diagram)}>
            <defs>
              <linearGradient
                id="fromVisibleLineGradient"
                x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  stop-color=${e}
                  stop-opacity="1" />
                <stop
                  offset="${this.#w()}%"
                  stop-color=${e}
                  stop-opacity="0" />
              </linearGradient>

              <linearGradient
                id="toVisibleLineGradient"
                x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="${100-this.#w()}%"
                  stop-color=${e}
                  stop-opacity="0" />
                <stop
                  offset="100%"
                  stop-color=${e}
                  stop-opacity="1" />
              </linearGradient>
              <marker
                id="arrow"
                orient="auto"
                markerWidth="3"
                markerHeight="4"
                fill-opacity="1"
                refX="4"
                refY="2"
                visibility=${this.#a||!this.#r?"visible":"hidden"}>
                <path d="M0,0 V4 L4,2 Z" fill=${e} />
              </marker>
            </defs>
            <line
              marker-end="url(#arrow)"
              stroke-dasharray=${!this.#y||!this.#b?Te:"none"}
              visibility=${!this.#d&&!this.#a?"hidden":"visible"}
              />
            <circle class="entryFromConnector" fill="none" stroke=${e} stroke-width=${X} r=${K} />
            <circle class="entryToConnector" fill="none" stroke=${e} stroke-width=${X} r=${K} />
          </svg>
          <div class="entry-wrapper from-highlight-wrapper ${this.#y?"":"entry-is-not-source"}"></div>
          <div class="entry-wrapper to-highlight-wrapper ${this.#b?"":"entry-is-not-source"}"></div>
          <div class="create-link-box ${this.#v?"visible":"hidden"}">
            <devtools-icon
              class='create-link-icon'
              jslog=${Y.action("timeline.annotations.create-entry-link").track({click:!0})}
              @click=${this.#k}
              name='arrow-right-circle'>
            </devtools-icon>
          </div>
        `,this.#i,{host:this})}},K=2,X=1,Te=4;customElements.define("devtools-entries-link-overlay",R);var ae={};A(ae,{EntryLabelChangeEvent:()=>L,EntryLabelOverlay:()=>N,EntryLabelRemoveEvent:()=>x,LabelAnnotationsConsentDialogVisibilityChange:()=>E});import"../../../../ui/kit/kit.js";import"../../../../ui/components/tooltips/tooltips.js";import"../../../../ui/components/spinners/spinners.js";import*as ee from"../../../../core/common/common.js";import*as te from"../../../../core/host/host.js";import*as I from"../../../../core/i18n/i18n.js";import*as z from"../../../../core/platform/platform.js";import*as h from"../../../../core/root/root.js";import*as ie from"../../../../models/ai_assistance/ai_assistance.js";import*as ne from"../../../../ui/components/buttons/buttons.js";import*as se from"../../../../ui/components/dialogs/dialogs.js";import*as C from"../../../../ui/components/helpers/helpers.js";import*as oe from"../../../../ui/helpers/helpers.js";import*as $ from"../../../../ui/legacy/legacy.js";import*as re from"../../../../ui/legacy/theme_support/theme_support.js";import*as p from"../../../../ui/lit/lit.js";import*as g from"../../../../ui/visual_logging/visual_logging.js";var J=`.label-parts-wrapper{display:flex;flex-direction:column;align-items:center}.label-button-input-wrapper{display:flex;position:relative;overflow:visible}.ai-label-button-wrapper,
.ai-label-disabled-button-wrapper,
.ai-label-loading,
.ai-label-error{position:absolute;left:100%;display:flex;transform:translateY(-3px);flex-flow:row nowrap;border:none;border-radius:var(--sys-shape-corner-large);background:var(--sys-color-surface3);box-shadow:var(--drop-shadow);align-items:center;gap:var(--sys-size-4);pointer-events:auto;transition:all var(--sys-motion-duration-medium2) var(--sys-motion-easing-emphasized);&.only-pen-wrapper{overflow:hidden;width:var(--sys-size-12);height:var(--sys-size-12)}*{transform:translateX(-2px)}}.delete-button{display:flex;pointer-events:auto;position:absolute;right:0;top:-5px;border-radius:50%;padding:0;border:none;background:var(--color-background-inverted)}.ai-label-loading,
.ai-label-error{gap:var(--sys-size-6);padding:var(--sys-size-5) var(--sys-size-8)}.ai-label-button-wrapper:focus,
.ai-label-button-wrapper:focus-within,
.ai-label-button-wrapper:hover{width:auto;height:var(--sys-size-13);padding:var(--sys-size-3) var(--sys-size-5);transform:translateY(-9px);*{transform:translateX(0)}}.ai-label-button{display:flex;align-items:center;gap:var(--sys-size-4);padding:var(--sys-size-3) var(--sys-size-5);border:var(--sys-size-1) solid var(--color-primary);border-radius:var(--sys-shape-corner-large);&.enabled{background:var(--sys-color-surface3)}&.disabled{background:var(--sys-color-surface5)}&:hover{background:var(--sys-color-state-hover-on-subtle)}}.generate-label-text{white-space:nowrap;color:var(--color-primary)}.input-field{background-color:var(--color-background-inverted);color:var(--color-background);pointer-events:auto;border-radius:var(--sys-shape-corner-extra-small);white-space:nowrap;padding:var(--sys-size-3) var(--sys-size-4);font-family:var(--default-font-family);font-size:var(--sys-typescale-body2-size);font-weight:var(--ref-typeface-weight-medium);outline:var(--sys-size-2) solid var(--color-background)}.input-field:focus,
.label-parts-wrapper:focus-within .input-field,
.input-field.fake-focus-state{background-color:var(--color-background);color:var(--color-background-inverted);outline:var(--sys-size-2) solid var(--color-background-inverted)}.connectorContainer{overflow:visible}.entry-highlight-wrapper{box-sizing:border-box;border:var(--sys-size-2) solid var(--sys-color-on-surface);&.cut-off-top{border-top:none}&.cut-off-bottom{border-bottom:none}&.cut-off-right{border-right:none}&.cut-off-left{border-left:none}}.info-tooltip-container{max-width:var(--sys-size-28);button.link{cursor:pointer;text-decoration:underline;border:none;padding:0;background:none;font:inherit;font-weight:var(--ref-typeface-weight-medium);display:block;margin-top:var(--sys-size-4);color:var(--sys-color-primary)}}
/*# sourceURL=${import.meta.resolve("./entryLabelOverlay.css")} */`;var{html:b,Directives:Q}=p,m={entryLabel:"Entry label",inputTextPrompt:"Enter an annotation label",generateLabelButton:"Generate label",freDialog:"Get AI-powered annotation suggestions dialog",learnMoreAriaLabel:"Learn more about auto annotations in settings",moreInfoAriaLabel:"More information about this feature"},r={learnMore:"Learn more in settings",generateLabelSecurityDisclaimer:"The selected call stack is sent to Google. This data may be seen by human reviewers to improve this feature. This is an experimental AI feature and won\u2019t always get it right.",generateLabelSecurityDisclaimerLoggingOff:"The selected call stack is sent to Google. This data will not be used to improve Google\u2019s AI models. Your organization may change these settings at any time. This is an experimental AI feature and won\u2019t always get it right.",autoAnnotationNotAvailableDisclaimer:"Auto annotations are not available.",autoAnnotationNotAvailableOfflineDisclaimer:"Auto annotations are not available because you are offline",freDisclaimerHeader:"Get AI-powered annotation suggestions",generatingLabel:"Generating label",generationFailed:"Generation failed",freDisclaimerAiWontAlwaysGetItRight:"This feature uses AI and won\u2019t always get it right",freDisclaimerPrivacyDataSentToGoogle:"To generate annotation suggestions, your performance trace is sent to Google. This data may be seen by human reviewers to improve this feature.",freDisclaimerPrivacyDataSentToGoogleNoLogging:"To generate annotation suggestions, your performance trace is sent to Google. This data will not be used to improve Google\u2019s AI models. Your organization may change these settings at any time.",learnMoreButton:"Learn more"};var Ae=I.i18n.registerUIStrings("panels/timeline/overlays/components/EntryLabelOverlay.ts",m),y=I.i18n.getLocalizedString.bind(void 0,Ae),c=I.i18n.lockedString;function Se(){return h.Runtime.hostConfig.devToolsGeminiRebranding?.enabled?!1:!h.Runtime.hostConfig.aidaAvailability?.disallowLogging}var x=class i extends Event{static eventName="entrylabelremoveevent";constructor(){super(i.eventName)}},L=class i extends Event{constructor(t){super(i.eventName);this.newLabel=t}newLabel;static eventName="entrylabelchangeevent"},E=class i extends Event{constructor(t){super(i.eventName,{bubbles:!0,composed:!0});this.isVisible=t}isVisible;static eventName="labelannotationsconsentdialogvisiblitychange"},N=class i extends HTMLElement{static LABEL_AND_CONNECTOR_SHIFT_LENGTH=8;static LABEL_CONNECTOR_HEIGHT=7;static MAX_LABEL_LENGTH=100;#i=this.attachShadow({mode:"open"});#o=!1;#t=!0;#n=null;#r=null;#s=null;#e=null;#l=null;#h;#c;#u=Q.createRef();#d;#a=null;#g=ee.Settings.Settings.instance().createSetting("ai-annotations-enabled",!1);#y=new ie.PerformanceAnnotations.PerformanceAnnotations({aidaClient:new te.AidaClient.AidaClient,serverSideLoggingEnabled:Se()});#b=!1;#p="hidden";constructor(e,t=!1){super(),this.#f(),this.#c=t,this.#r=this.#i.querySelector(".label-parts-wrapper"),this.#e=this.#r?.querySelector(".input-field")??null,this.#l=this.#r?.querySelector(".connectorContainer")??null,this.#s=this.#r?.querySelector(".entry-highlight-wrapper")??null,this.#h=e,this.#d=h.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue===h.Runtime.GenAiEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING,this.#A(e),e!==""&&this.setLabelEditabilityAndRemoveEmptyLabel(!1);let n=e===""?y(m.inputTextPrompt):e;this.#e?.setAttribute("aria-label",n),this.#T()}overridePerformanceAnnotationsForTest(e){this.#y=e}entryHighlightWrapper(){return this.#s}#v(){let e=this.#e?.textContent?.trim()??"";e!==this.#h&&(this.#h=e,this.dispatchEvent(new L(this.#h)),this.#e?.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))),this.#m(),this.#f(),this.#e?.setAttribute("aria-label",e)}#L(e){if(!this.#e)return!1;let t=["Backspace","Delete","ArrowLeft","ArrowRight"];return(e.key===z.KeyboardUtilities.ENTER_KEY||e.key===z.KeyboardUtilities.ESCAPE_KEY)&&this.#t?(this.#e.blur(),this.setLabelEditabilityAndRemoveEmptyLabel(!1),!1):this.#e.textContent!==null&&this.#e.textContent.length<=i.MAX_LABEL_LENGTH||t.includes(e.key)||e.key.length===1&&e.ctrlKey?!0:(e.preventDefault(),!1)}#S(e){e.preventDefault();let t=e.clipboardData;if(!t||!this.#e)return;let n=t.getData("text").replace(/(\r\n|\n|\r)/gm,""),o=(this.#e.textContent+n).slice(0,i.MAX_LABEL_LENGTH+1);this.#e.textContent=o,this.#w()}set entryLabelVisibleHeight(e){this.#n=e,C.ScheduledRender.scheduleRender(this,this.#f),this.#t&&this.#E(),this.#A(),this.#T()}#T(){if(!this.#l){console.error("`connectorLineContainer` element is missing.");return}if(this.#c&&this.#n){let s=this.#n+i.LABEL_CONNECTOR_HEIGHT;this.#l.style.transform=`translateY(${s}px) rotate(180deg)`}let e=this.#l.querySelector("line"),t=this.#l.querySelector("circle");if(!e||!t){console.error("Some entry label elements are missing.");return}this.#l.setAttribute("width",(i.LABEL_AND_CONNECTOR_SHIFT_LENGTH*2).toString()),this.#l.setAttribute("height",i.LABEL_CONNECTOR_HEIGHT.toString()),e.setAttribute("x1","0"),e.setAttribute("y1","0"),e.setAttribute("x2",i.LABEL_AND_CONNECTOR_SHIFT_LENGTH.toString()),e.setAttribute("y2",i.LABEL_CONNECTOR_HEIGHT.toString());let n=re.ThemeSupport.instance().getComputedValue("--color-text-primary");e.setAttribute("stroke",n),e.setAttribute("stroke-width","2"),t.setAttribute("cx",i.LABEL_AND_CONNECTOR_SHIFT_LENGTH.toString()),t.setAttribute("cy",(i.LABEL_CONNECTOR_HEIGHT+1).toString()),t.setAttribute("r","3"),t.setAttribute("fill",n)}#A(e){if(!this.#e){console.error("`labelBox`element is missing.");return}typeof e=="string"&&(this.#e.innerText=e);let t=null,n=null;this.#c?t=i.LABEL_AND_CONNECTOR_SHIFT_LENGTH:t=i.LABEL_AND_CONNECTOR_SHIFT_LENGTH*-1,this.#c&&this.#n&&(n=this.#n+i.LABEL_CONNECTOR_HEIGHT*2+this.#e?.offsetHeight);let s="";t&&(s+=`translateX(${t}px) `),n&&(s+=`translateY(${n}px)`),s.length&&(this.#e.style.transform=s)}#E(){if(!this.#e){console.error("`labelBox` element is missing.");return}this.#e.focus()}setLabelEditabilityAndRemoveEmptyLabel(e){if(this.#b&&e===!1)return;e?this.setAttribute("data-user-editing-label","true"):this.removeAttribute("data-user-editing-label"),this.#t=e,this.#f(),e&&this.#e&&(this.#w(),this.#E());let t=this.#e?.textContent?.trim()??"";!e&&t.length===0&&!this.#o&&(this.#o=!0,this.dispatchEvent(new x))}#w(){if(!this.#e)return;let e=window.getSelection(),t=document.createRange();t.selectNodeContents(this.#e),t.collapse(!1),e?.removeAllRanges(),e?.addRange(t)}set callTree(e){this.#a=e,this.#m()}async#x(){if(this.#g.get()){if(!this.#a||!this.#e)return;try{this.#p="generating_label",$.ARIAUtils.LiveAnnouncer.alert(r.generatingLabel),this.#f(),this.#E(),C.ScheduledRender.scheduleRender(this,this.#f),this.#h=await this.#y.generateAIEntryLabel(this.#a),this.dispatchEvent(new L(this.#h)),this.#e.innerText=this.#h,this.#w(),this.#m(),this.#f()}catch{this.#p="generation_failed",C.ScheduledRender.scheduleRender(this,this.#f)}}else{this.#b=!0,this.#f();let e=await this.#k();this.#b=!1,this.setLabelEditabilityAndRemoveEmptyLabel(!0),e&&await this.#x()}}async#k(){this.dispatchEvent(new E(!0));let e=await se.FreDialog.FreDialog.show({ariaLabel:y(m.freDialog),header:{iconName:"pen-spark",text:c(r.freDisclaimerHeader)},reminderItems:[{iconName:"psychiatry",content:c(r.freDisclaimerAiWontAlwaysGetItRight)},{iconName:"google",content:this.#d?c(r.freDisclaimerPrivacyDataSentToGoogleNoLogging):c(r.freDisclaimerPrivacyDataSentToGoogle)}],onLearnMoreClick:()=>{oe.openInNewTab("https://developer.chrome.com/docs/devtools/performance/annotations#auto-annotations")},learnMoreButtonText:r.learnMoreButton});return this.dispatchEvent(new E(!1)),e&&this.#g.set(!0),this.#g.get()}#m(){let e=!!h.Runtime.hostConfig.devToolsAiGeneratedTimelineLabels?.enabled,t=h.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue===h.Runtime.GenAiEnterprisePolicyValue.DISABLE,n=this.#a!==null,s=this.#h?.length<=0;!e||t||!n||!s?this.#p="hidden":h.Runtime.hostConfig.aidaAvailability?.enabled&&!h.Runtime.hostConfig.aidaAvailability?.blockedByAge&&!h.Runtime.hostConfig.aidaAvailability?.blockedByGeo&&navigator.onLine?this.#p="enabled":this.#p="disabled"}#R(e){return b`<devtools-tooltip
    variant="rich"
    id="info-tooltip"
    ${Q.ref(this.#u)}>
      <div class="info-tooltip-container">
        ${e.textContent} ${e.includeSettingsButton?b`
          <button
            class="link tooltip-link"
            role="link"
            jslog=${g.link("open-ai-settings").track({click:!0})}
            @click=${this.#I}
            aria-label=${y(m.learnMoreAriaLabel)}
          >${c(r.learnMore)}</button>
        `:p.nothing}
      </div>
    </devtools-tooltip>`}#N(){return b`
      <span
        class="ai-label-loading">
        <devtools-spinner></devtools-spinner>
        <span class="generate-label-text">${c(r.generatingLabel)}</span>
      </span>
    `}#C(){return this.#p==="generation_failed"?b`
        <span
          class="ai-label-error">
          <devtools-icon
            class="warning extra-large"
            name="warning"
            style="color: var(--ref-palette-error50)">
          </devtools-icon>
          <span class="generate-label-text">${c(r.generationFailed)}</span>
        </span>
      `:b`
      <!-- 'preventDefault' on the AI label button to prevent the label removal on blur  -->
      <span
        class="ai-label-button-wrapper only-pen-wrapper"
        @mousedown=${e=>e.preventDefault()}>
        <button
          class="ai-label-button enabled"
          @click=${this.#x}
          jslog=${g.link("timeline.annotations.ai-generate-label").track({click:!0})}>
          <devtools-icon
            class="pen-icon extra-large"
            name="pen-spark"
            style="color: var(--icon-primary);">
          </devtools-icon>
          <span class="generate-label-text">${y(m.generateLabelButton)}</span>
        </button>
        <devtools-button
          aria-details="info-tooltip"
          class="pen-icon"
          .title=${y(m.moreInfoAriaLabel)}
          .iconName=${"info"}
          .variant=${ne.Button.Variant.ICON}
          ></devtools-button>
        ${this.#R({textContent:this.#d?c(r.generateLabelSecurityDisclaimerLoggingOff):c(r.generateLabelSecurityDisclaimer),includeSettingsButton:!0})}
      </span>
    `}#I(){this.#u?.value?.hidePopover(),$.ViewManager.ViewManager.instance().showView("chrome-ai")}#$(){let e=navigator.onLine===!1;return b`
      <!-- 'preventDefault' on the AI label button to prevent the label removal on blur  -->
      <span
        class="ai-label-disabled-button-wrapper only-pen-wrapper"
        @mousedown=${t=>t.preventDefault()}>
        <button
          class="ai-label-button disabled"
          ?disabled=${!0}
          @click=${this.#x}>
          <devtools-icon
            aria-details="info-tooltip"
            class="pen-icon extra-large"
            name="pen-spark"
            style="color: var(--sys-color-state-disabled);">
          </devtools-icon>
        </button>
        ${this.#R({textContent:c(e?r.autoAnnotationNotAvailableOfflineDisclaimer:r.autoAnnotationNotAvailableDisclaimer),includeSettingsButton:!e})}
      </span>
    `}#H(e){let t=e.relatedTarget;t&&this.#i.contains(t)||this.setLabelEditabilityAndRemoveEmptyLabel(!1)}#f(){let e=p.Directives.classMap({"input-field":!0,"fake-focus-state":this.#b});p.render(b`
        <style>${J}</style>
        <span class="label-parts-wrapper" role="region" aria-label=${y(m.entryLabel)}
          @focusout=${this.#H}
        >
          <span
            class="label-button-input-wrapper">
            <span
              class=${e}
              role="textbox"
              @focus=${()=>{this.setLabelEditabilityAndRemoveEmptyLabel(!0)}}
              @dblclick=${()=>{this.setLabelEditabilityAndRemoveEmptyLabel(!0)}}
              @keydown=${this.#L}
              @paste=${this.#S}
              @input=${this.#v}
              contenteditable=${this.#t?"plaintext-only":!1}
              jslog=${g.textField("timeline.annotations.entry-label-input").track({keydown:!0,click:!0,change:!0})}
              tabindex="0"
            ></span>
            ${this.#t&&this.#e?.innerText!==""?b`
              <button
                class="delete-button"
                @click=${()=>this.dispatchEvent(new x)}
                jslog=${g.action("timeline.annotations.delete-entry-label").track({click:!0})}>
              <devtools-icon name="cross" class="small" style="color: var(--color-background);"
              ></devtools-icon>
              </button>
            `:p.nothing}
            ${(()=>{switch(this.#p){case"hidden":return p.nothing;case"enabled":return this.#C();case"generating_label":return this.#N();case"generation_failed":return this.#C();case"disabled":return this.#$()}})()}
          </span>
          <svg class="connectorContainer">
            <line/>
            <circle/>
          </svg>
          <div class="entry-highlight-wrapper"></div>
        </span>`,this.#i,{host:this})}};customElements.define("devtools-entry-label-overlay",N);var de={};A(de,{TimeRangeLabelChangeEvent:()=>H,TimeRangeOverlay:()=>B,TimeRangeRemoveEvent:()=>D});import*as T from"../../../../core/i18n/i18n.js";import*as V from"../../../../core/platform/platform.js";import{html as ke,render as Re}from"../../../../ui/lit/lit.js";import*as ce from"../../../../ui/visual_logging/visual_logging.js";var le=`:host{display:flex;overflow:hidden;flex-direction:column;justify-content:flex-end;width:100%;height:100%;box-sizing:border-box;padding-bottom:5px;background:linear-gradient(180deg,rgb(255 125 210/0%) 0%,rgb(255 125 210/15%) 85%);border-color:var(--ref-palette-pink55);border-width:0 var(--sys-size-1) 5px;border-style:solid;pointer-events:none}.range-container{display:flex;align-items:center;flex-direction:column;text-align:center;box-sizing:border-box;pointer-events:all;user-select:none;color:var(--sys-color-pink);&.labelHidden{user-select:none;pointer-events:none;visibility:hidden}&.offScreenLeft{align-items:flex-start;text-align:left}&.offScreenRight{align-items:flex-end;text-align:right}}.label-text{width:100%;max-width:70px;min-width:fit-content;text-overflow:ellipsis;overflow:hidden;word-break:normal;overflow-wrap:anywhere;margin-bottom:3px;display:-webkit-box;white-space:break-spaces;background:var(--sys-color-cdt-base-container);line-clamp:2;-webkit-line-clamp:2;-webkit-box-orient:vertical}.duration{background:var(--sys-color-cdt-base-container)}.label-text[contenteditable='true']{outline:none;box-shadow:0 0 0 var(--sys-size-1) var(--ref-palette-pink55)}.label-text[contenteditable='false']{width:auto}
/*# sourceURL=${import.meta.resolve("./timeRangeOverlay.css")} */`;var he={timeRange:"Time range"},Ce=T.i18n.registerUIStrings("panels/timeline/overlays/components/TimeRangeOverlay.ts",he),Ne=T.i18n.getLocalizedString.bind(void 0,Ce),H=class i extends Event{constructor(t){super(i.eventName);this.newLabel=t}newLabel;static eventName="timerangelabelchange"},D=class i extends Event{static eventName="timerangeremoveevent";constructor(){super(i.eventName)}},B=class extends HTMLElement{#i=this.attachShadow({mode:"open"});#o=null;#t=null;#n;#r=!0;#s=null;#e=null;constructor(e){if(super(),this.#a(),this.#s=this.#i.querySelector(".range-container"),this.#e=this.#s?.querySelector(".label-text")??null,this.#n=e,!this.#e){console.error("`labelBox` element is missing.");return}this.#e.innerText=e,e&&(this.#e?.setAttribute("aria-label",e),this.#c(!1))}set canvasRect(e){e!==null&&(this.#t&&this.#t.width===e.width&&this.#t.height===e.height||(this.#t=e,this.#a()))}set duration(e){e!==this.#o&&(this.#o=e,this.#a())}#l(e){if(!this.#t)return 0;let{x:t,width:n}=e,s=t+n,o=this.#t.x,u=this.#t.x+this.#t.width,a=Math.max(o,t);return Math.min(u,s)-a}updateLabelPositioning(){if(!this.#s||!this.#t||!this.#e)return;let e=9,t=this.getBoundingClientRect(),n=this.#i.activeElement===this.#e,s=this.#s.getBoundingClientRect(),o=this.#l(t)-e,a=(this.#s.querySelector(".duration")??null)?.getBoundingClientRect().width;if(!a)return;let d=o<=a&&!n&&this.#n.length>0;if(this.#s.classList.toggle("labelHidden",d),d)return;let v=(t.width-s.width)/2,f=t.x+v<this.#t.x;this.#s.classList.toggle("offScreenLeft",f);let P=this.#t.x+this.#t.width,w=t.x+v+s.width>P;this.#s.classList.toggle("offScreenRight",w),f?this.#s.style.marginLeft=`${Math.abs(this.#t.x-t.x)+e}px`:w?this.#s.style.marginRight=`${t.right-this.#t.right+e}px`:this.#s.style.margin="0px",this.#e?.innerText===""&&this.#c(!0)}#h(){if(!this.#e){console.error("`labelBox` element is missing.");return}this.#e.focus()}#c(e){if(this.#e?.innerText===""){this.#h();return}this.#r=e,this.#a(),e&&this.#h()}#u(){let e=this.#e?.textContent??"";e!==this.#n&&(this.#n=e,this.dispatchEvent(new H(this.#n)),this.#e?.setAttribute("aria-label",e))}#d(e){return e.key===V.KeyboardUtilities.ENTER_KEY||e.key===V.KeyboardUtilities.ESCAPE_KEY?(e.stopPropagation(),this.#n===""&&this.dispatchEvent(new D),this.#e?.blur(),!1):!0}#a(){let e=this.#o?T.TimeUtilities.formatMicroSecondsTime(this.#o):"";Re(ke`
          <style>${le}</style>
          <span class="range-container" role="region" aria-label=${Ne(he.timeRange)}>
            <span
             class="label-text"
             role="textbox"
             @focusout=${()=>this.#c(!1)}
             @dblclick=${()=>this.#c(!0)}
             @keydown=${this.#d}
             @keyup=${this.#u}
             contenteditable=${this.#r?"plaintext-only":!1}
             jslog=${ce.textField("timeline.annotations.time-range-label-input").track({keydown:!0,click:!0})}
            ></span>
            <span class="duration">${e}</span>
          </span>
          `,this.#i,{host:this}),this.updateLabelPositioning()}};customElements.define("devtools-time-range-overlay",B);var fe={};A(fe,{DEFAULT_VIEW:()=>ge,TimespanBreakdownOverlay:()=>F});import*as pe from"../../../../core/i18n/i18n.js";import*as be from"../../../../ui/legacy/legacy.js";import{Directives as me,html as U,nothing as Ie,render as $e}from"../../../../ui/lit/lit.js";var ue=`@scope to (devtools-widget > *){.timespan-breakdown-overlay-section{pointer-events:auto;border:solid;border-color:var(--sys-color-on-surface);border-width:var(--sys-size-3) var(--sys-size-1) 0;align-content:flex-start;text-align:center;overflow:hidden;text-overflow:ellipsis;background-image:linear-gradient(180deg,var(--sys-color-on-primary),transparent);height:90%;box-sizing:border-box;padding-top:var(--sys-size-2);.is-below &{border-top-width:0;border-bottom-width:var(--sys-size-3);align-content:flex-end;padding-bottom:var(--sys-size-2);padding-top:0;.timespan-breakdown-overlay-label{display:flex;flex-direction:column-reverse}}}.timeline-segment-container{display:flex;overflow:hidden;flex-direction:row;justify-content:flex-end;align-items:flex-end;width:100%;box-sizing:border-box;height:100%;max-height:100px;.timespan-breakdown-overlay-section:first-child{border-left-width:var(--sys-size-1)!important}.timespan-breakdown-overlay-section:last-child{border-right-width:var(--sys-size-1)!important}}.timeline-segment-container.is-below{align-items:flex-start}.timeline-segment-container.even-number-of-sections{.timespan-breakdown-overlay-section:nth-child(even){height:100%}.timespan-breakdown-overlay-section:nth-child(odd){border-left-width:0;border-right-width:0}}.timeline-segment-container.odd-number-of-sections{.timespan-breakdown-overlay-section:nth-child(odd){height:100%}.timespan-breakdown-overlay-section:nth-child(even){border-left-width:0;border-right-width:0}}.timespan-breakdown-overlay-label{font-family:var(--default-font-family);font-size:var(--sys-typescale-body2-size);line-height:var(--sys-typescale-body4-line-height);font-weight:var(--ref-typeface-weight-medium);color:var(--sys-color-on-surface);text-align:center;box-sizing:border-box;width:max-content;padding:0 3px;overflow:hidden;text-overflow:ellipsis;text-wrap:nowrap;.duration-text{font-size:var(--sys-typescale-body4-size);text-overflow:ellipsis;overflow:hidden;text-wrap:nowrap;display:block}.discovery-time-ms{font-weight:var(--ref-typeface-weight-bold)}&.labelHidden{user-select:none;pointer-events:none;visibility:hidden}&.labelTruncated{max-width:100%}&.offScreenLeft{text-align:left}&.offScreenRight{text-align:right}}}
/*# sourceURL=${import.meta.resolve("./timespanBreakdownOverlay.css")} */`;var He=(i,e)=>{let t=me.styleMap({left:e?`${e.left}px`:void 0,width:e?`${e.width}px`:void 0}),n=i.showDuration?pe.TimeUtilities.formatMicroSecondsAsMillisFixed(i.bounds.range):"",s=i.label instanceof HTMLElement?i.label.textContent||"":typeof i.label=="string"?i.label:"",o=n?`${n} ${s}`:s;return U`
      <div class="timespan-breakdown-overlay-section" style=${t} title=${o}>
        <div class="timespan-breakdown-overlay-label">
          ${i.showDuration?U`<span class="duration-text">${n}</span> `:Ie}
          <span class="section-label-text">${i.label}</span>
        </div>
      </div>`},ge=(i,e,t)=>{let n=me.styleMap({left:i.left!==null?`${i.left}px`:void 0,width:i.width!==null?`${i.width}px`:void 0,top:i.top!==null?`${i.top}px`:void 0,maxHeight:i.maxHeight!==null?`${i.maxHeight}px`:void 0,position:"relative"});$e(U`
        <style>${ue}</style>
        <div style=${n} class=${i.className}>
          ${i.sections?.map((s,o)=>He(s,i.positions[o]))}
        </div>`,t,{container:{classes:["devtools-timespan-breakdown-overlay"]}})},F=class extends be.Widget.Widget{#i=null;#o=null;#t=[];#n=null;#r=null;#s=null;#e=null;#l;constructor(e,t=ge){super(e),this.#l=t,this.requestUpdate()}set top(e){this.#e=e,this.requestUpdate()}set maxHeight(e){this.#s=e,this.requestUpdate()}set width(e){this.#r=e,this.requestUpdate()}set left(e){this.#n=e,this.requestUpdate()}set isBelowEntry(e){this.element.classList.toggle("is-below",e)}set canvasRect(e){this.#i&&e&&this.#i.width===e.width&&this.#i.height===e.height||(this.#i=e,this.requestUpdate())}set widths(e){e!==this.#t&&(this.#t=e,this.requestUpdate())}set sections(e){e!==this.#o&&(this.#o=e,this.requestUpdate())}checkSectionLabelPositioning(){let e=this.element.querySelectorAll(".timespan-breakdown-overlay-section");if(!e||!this.#i)return;let t=9,n=new Map;for(let o of e){let u=o.querySelector(".timespan-breakdown-overlay-label");if(!u)continue;let a=o.getBoundingClientRect(),l=u.getBoundingClientRect();n.set(o,{sectionRect:a,labelRect:l,label:u})}let s=30;for(let o of e){let u=n.get(o);if(!u)break;let{labelRect:a,sectionRect:l,label:d}=u,v=l.width<s,O=l.width-5<=a.width;if(d.classList.toggle("labelHidden",v),d.classList.toggle("labelTruncated",O),v||O)continue;let f=(l.width-a.width)/2,M=l.x+f<this.#i.x;d.classList.toggle("offScreenLeft",M);let w=this.#i.x+this.#i.width,q=l.x+f+a.width>w;if(d.classList.toggle("offScreenRight",q),M)d.style.marginLeft=`${Math.abs(this.#i.x-l.x)+t}px`;else if(q){let ye=w-a.width-l.x;d.style.marginLeft=`${ye}px`}else d.style.marginLeft=`${f}px`}}performUpdate(){let e="timeline-segment-container";this.#o&&(this.#o.length%2===0?e+=" even-number-of-sections":e+=" odd-number-of-sections"),this.#l({sections:this.#o,positions:this.#t,left:this.#n,width:this.#r,top:this.#e,maxHeight:this.#s,className:e},void 0,this.contentElement),this.checkSectionLabelPositioning()}};export{Z as EntriesLinkOverlay,ae as EntryLabelOverlay,de as TimeRangeOverlay,fe as TimespanBreakdownOverlay};
//# sourceMappingURL=components.js.map
