var Yo=Object.defineProperty;var K=(t,e)=>{for(var o in e)Yo(t,o,{get:e[o],enumerable:!0})};var Xt={};K(Xt,{ControlButton:()=>de,DEFAULT_VIEW:()=>Yt});import*as Kt from"../../ui/legacy/legacy.js";import*as it from"../../ui/lit/lit.js";var Wt=`*{margin:0;padding:0;box-sizing:border-box;font-size:inherit}.control{background:none;border:none;border-radius:var(--sys-shape-corner-small);display:flex;flex-direction:column;align-items:center}.control:focus-visible{outline:var(--sys-size-2) solid var(--sys-color-state-focus-ring);outline-offset:var(--sys-size-2)}.control[disabled]{filter:grayscale(100%);cursor:auto}.icon{display:flex;width:var(--sys-size-14);height:var(--sys-size-14);border-radius:var(--sys-shape-corner-full);background:var(--sys-color-error-bright);margin-bottom:var(--sys-size-5);position:relative;transition:background 200ms;place-content:center center;align-items:center}.icon::before{--override-white:#fff;box-sizing:border-box;content:"";display:block;width:var(--sys-size-7);height:var(--sys-size-7);border:var(--sys-size-1) solid var(--override-white);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background-color:var(--override-white)}.icon.square::before{border-radius:0}.icon.circle::before{border-radius:var(--sys-shape-corner-full)}.icon:hover{background:color-mix(in srgb,var(--sys-color-error-bright),var(--sys-color-state-hover-on-prominent) 10%)}.icon:active{background:color-mix(in srgb,var(--sys-color-error-bright),var(--sys-color-state-ripple-neutral-on-prominent) 16%)}.control[disabled] .icon:hover{background:var(--sys-color-error)}.label{font-size:var(--sys-typescale-body4-size);line-height:var(--sys-typescale-body4-line-height);text-align:center;letter-spacing:0.02em;color:var(--sys-color-on-surface)}
/*# sourceURL=${import.meta.resolve("./controlButton.css")} */`;var{html:Xo}=it,Yt=(t,e,o)=>{let{label:r,shape:i,disabled:s,onClick:n}=t;it.render(Xo`
    <style>${Wt}</style>
    <button
        @click=${d=>{s?(d.stopPropagation(),d.preventDefault()):n(d)}}
        .disabled=${s}
        class="control">
      <div class="icon ${i}"></div>
      <div class="label">${r}</div>
    </button>
  `,o,{container:{attributes:{classes:"flex-none"}}})},de=class extends Kt.Widget.Widget{#t="";#e="square";#r=!1;#i=()=>{};#o;constructor(e,o){super(e,{useShadowDom:"pure"}),this.#o=o||Yt}set label(e){this.#t=e,this.requestUpdate()}set shape(e){this.#e=e,this.requestUpdate()}set disabled(e){this.#r=e,this.requestUpdate()}set onClick(e){this.#i=e,this.requestUpdate()}performUpdate(){this.#o({label:this.#t,shape:this.#e,disabled:this.#r,onClick:this.#i},{},this.contentElement)}};var Zt={};K(Zt,{CreateRecordingView:()=>he,DEFAULT_VIEW:()=>Qt});import"../../ui/kit/kit.js";import*as lt from"../../core/i18n/i18n.js";import*as _e from"../../models/badges/badges.js";import*as nt from"../../ui/components/buttons/buttons.js";import*as Ge from"../../ui/components/input/input.js";import*as dt from"../../ui/legacy/legacy.js";import*as ct from"../../ui/lit/lit.js";import*as Y from"../../ui/visual_logging/visual_logging.js";var Jt=`*{margin:0;padding:0;outline:none;box-sizing:border-box;font-size:inherit}.wrapper{padding:var(--sys-size-11);flex:1}h1{font-size:var(--sys-typescale-headline3-size);line-height:var(--sys-typescale-headline3-line-height);letter-spacing:0.02em;color:var(--sys-color-on-surface);margin:0;font-weight:normal}.row-label{font-weight:500;font-size:var(--sys-typescale-body5-size);line-height:var(--sys-typescale-body5-line-height);letter-spacing:0.8px;text-transform:uppercase;color:var(--sys-color-secondary);margin-bottom:var(--sys-size-5);margin-top:var(--sys-size-13);display:flex;align-items:center;gap:3px}.footer{display:flex;justify-content:center;border-top:var(--sys-size-1) solid var(--sys-color-divider);padding:var(--sys-size-6);background:var(--sys-color-cdt-base-container)}.controls{display:flex}.error{margin:var(--sys-size-8) 0 0;padding:var(--sys-size-5);background:var(--sys-color-error-container);color:var(--sys-color-error)}.row-label .link:focus-visible{outline:var(--sys-color-state-focus-ring) auto var(--sys-size-1)}.header-wrapper{display:flex;align-items:baseline;justify-content:space-between}.checkbox-label{display:inline-flex;align-items:center;overflow:hidden;text-overflow:ellipsis;gap:var(--sys-size-3);line-height:1.1;padding:var(--sys-size-3)}.checkbox-container{display:flex;flex-flow:row wrap;gap:10px}input[type="checkbox"]:focus-visible{outline:var(--sys-color-state-focus-ring) auto var(--sys-size-1)}devtools-icon[name="help"]{width:var(--sys-size-8);height:var(--sys-size-8)}
/*# sourceURL=${import.meta.resolve("./createRecordingView.css")} */`;import*as N from"./models/models.js";import*as at from"./recorder-actions/recorder-actions.js";var{html:st,Directives:{ref:Jo,createRef:Qo,repeat:Zo}}=ct,$={recordingName:"Recording name",startRecording:"Start recording",createRecording:"Create a new recording",recordingNameIsRequired:"Recording name is required",selectorAttribute:"Selector attribute",cancelRecording:"Cancel recording",selectorTypeCSS:"CSS",selectorTypePierce:"Pierce",selectorTypeARIA:"ARIA",selectorTypeText:"Text",selectorTypeXPath:"XPath",selectorTypes:"Selector types to record",includeNecessarySelectors:"You must choose CSS, Pierce, or XPath as one of your options. Only these selectors are guaranteed to be recorded since ARIA and text selectors may not be unique.",learnMore:"Learn more"},er=lt.i18n.registerUIStrings("panels/recorder/CreateRecordingView.ts",$),O=lt.i18n.getLocalizedString.bind(void 0,er),{widget:tr}=dt.Widget,Qt=(t,e,o)=>{let{name:r,selectorAttribute:i,selectorTypes:s,error:n,onUpdate:l,onRecordingStarted:d,onRecordingCancelled:u,onErrorReset:c}=t,x=Qo(),p=g=>{n&&c(),g.key==="Enter"&&(d(),g.stopPropagation(),g.preventDefault())};e.focusInput=()=>{x.value?.focus()};let a=new Map([[N.Schema.SelectorType.ARIA,O($.selectorTypeARIA)],[N.Schema.SelectorType.CSS,O($.selectorTypeCSS)],[N.Schema.SelectorType.Text,O($.selectorTypeText)],[N.Schema.SelectorType.XPath,O($.selectorTypeXPath)],[N.Schema.SelectorType.Pierce,O($.selectorTypePierce)]]);ct.render(st`
      <style>${Jt}</style>
      <style>${Ge.textInputStyles}</style>
      <style>${Ge.checkboxStyles}</style>
      <div class="wrapper" jslog=${Y.section("create-recording-view")}>
        <div class="header-wrapper">
          <h1>${O($.createRecording)}</h1>
          <devtools-button
            title=${O($.cancelRecording)}
            jslog=${Y.close().track({click:!0})}
            .data=${{variant:nt.Button.Variant.ICON,size:nt.Button.Size.SMALL,iconName:"cross"}}
            @click=${u}
          ></devtools-button>
        </div>
        <label class="row-label" for="user-flow-name">${O($.recordingName)}</label>
        <input
          value=${r}
          @focus=${()=>x.value?.select()}
          @keydown=${p}
          jslog=${Y.textField("user-flow-name").track({change:!0})}
          class="devtools-text-input"
          id="user-flow-name"
          ${Jo(x)}
          @input=${g=>l({name:g.target.value.trim()})}
        />
        <label class="row-label" for="selector-attribute">
          <span>${O($.selectorAttribute)}</span>
          <devtools-link
            class="link" href="https://g.co/devtools/recorder#selector"
            title=${O($.learnMore)}
            .jslogContext=${"recorder-selector-help"}>
            <devtools-icon name="help">
            </devtools-icon>
          </devtools-link>
        </label>
        <input
          value=${i}
          placeholder="data-testid"
          @keydown=${p}
          jslog=${Y.textField("selector-attribute").track({change:!0})}
          class="devtools-text-input"
          id="selector-attribute"
          @input=${g=>l({selectorAttribute:g.target.value.trim()})}
        />
        <label class="row-label">
          <span>${O($.selectorTypes)}</span>
          <devtools-link
            class="link" href="https://g.co/devtools/recorder#selector"
            title=${O($.learnMore)}
            .jslogContext=${"recorder-selector-help"}>
            <devtools-icon name="help">
            </devtools-icon>
          </devtools-link>
        </label>
        <div class="checkbox-container">
          ${Zo(s,g=>st`
              <label class="checkbox-label selector-type">
                <input
                  @keydown=${p}
                  .value=${g.selectorType}
                  jslog=${Y.toggle().track({click:!0}).context(`selector-${g.selectorType}`)}
                  ?checked=${g.checked}
                  type="checkbox"
                  @change=${B=>l({selectorType:g.selectorType,checked:B.target.checked})}
                />
                ${a.get(g.selectorType)||g.selectorType}
              </label>
            `)}
        </div>
        ${n&&st` <div class="error" role="alert"> ${n.message} </div>`}
      </div>
      <div class="footer">
        <div class="controls">
          <devtools-widget
            class="control-button"
            ${tr(de,{label:O($.startRecording),shape:"circle",onClick:d})}
            jslog=${Y.action(at.RecorderActions.START_RECORDING).track({click:!0})}
            title=${N.Tooltip.getTooltipForActions(O($.startRecording),at.RecorderActions.START_RECORDING)}
          ></devtools-widget>
        </div>
      </div>
    `,o)},he=class extends dt.Widget.Widget{#t;#e="";#r="";#i=[];#o;#s={};#n;onRecordingStarted=()=>{};onRecordingCancelled=()=>{};set recorderSettings(e){this.#n=e,this.#e=this.#n.defaultTitle,this.#r=this.#n.selectorAttribute,this.#i=Object.values(N.Schema.SelectorType).map(o=>({selectorType:o,checked:this.#n?.getSelectorByType(o)??!0})),this.requestUpdate()}constructor(e,o){super(e,{useShadowDom:!0}),this.#o=o||Qt}wasShown(){super.wasShown(),this.requestUpdate(),this.updateComplete.then(()=>this.#s.focusInput?.())}startRecording(){if(!this.#n)throw new Error("settings not set");if(!this.#e.trim()){this.#t=new Error(O($.recordingNameIsRequired)),this.requestUpdate();return}let e=this.#i.filter(r=>r.checked).map(r=>r.selectorType);if(!e.includes(N.Schema.SelectorType.CSS)&&!e.includes(N.Schema.SelectorType.XPath)&&!e.includes(N.Schema.SelectorType.Pierce)){this.#t=new Error(O($.includeNecessarySelectors)),this.requestUpdate();return}for(let r of Object.values(N.Schema.SelectorType))this.#n.setSelectorByType(r,e.includes(r));let o=this.#r.trim();o&&(this.#n.selectorAttribute=o),this.onRecordingStarted({name:this.#e,selectorTypesToRecord:e,selectorAttribute:this.#r?this.#r:void 0}),_e.UserBadges.instance().recordAction(_e.BadgeAction.RECORDER_RECORDING_STARTED)}performUpdate(){this.#o({name:this.#e,selectorAttribute:this.#r,selectorTypes:this.#i,error:this.#t,onRecordingCancelled:this.onRecordingCancelled,onUpdate:e=>{"name"in e?this.#e=e.name:"selectorAttribute"in e?this.#r=e.selectorAttribute:this.#i=this.#i.map(o=>o.selectorType===e.selectorType?{...o,checked:e.checked}:o),this.requestUpdate()},onRecordingStarted:()=>{this.startRecording()},onErrorReset:()=>{this.#t=void 0,this.requestUpdate()}},this.#s,this.contentElement)}};var pt={};K(pt,{RecordingStateChangedEvent:()=>me,ReplayFinishedEvent:()=>ve,SetRecordingFinishedEvent:()=>Ie});var ve=class t extends Event{static eventName="replayfinished";constructor(){super(t.eventName,{bubbles:!0,composed:!0})}},Ie=class t extends Event{static eventName="setrecordingfinished";constructor(){super(t.eventName,{bubbles:!0,composed:!0})}},me=class t extends Event{constructor(o){super(t.eventName,{bubbles:!0,composed:!0});this.recording=o}recording;static eventName="recordingstatechanged"};var Wo={};K(Wo,{ActionDelegate:()=>jt,DEFAULT_VIEW:()=>Ho,Pages:()=>qo,RecorderPanel:()=>Fe});import"../../ui/kit/kit.js";import*as Q from"../../core/common/common.js";import*as C from"../../core/host/host.js";import*as qt from"../../core/i18n/i18n.js";import*as Vo from"../../core/platform/platform.js";import*as _t from"../../core/root/root.js";import*as _ from"../../core/sdk/sdk.js";import*as zo from"../../models/bindings/bindings.js";import*as Fo from"../../models/emulation/emulation.js";import*as te from"../../models/extensions/extensions.js";import*as _o from"../../services/tracing/tracing.js";import*as le from"../../ui/components/buttons/buttons.js";import*as Go from"../../ui/components/dialogs/dialogs.js";import*as T from"../../ui/legacy/legacy.js";import{Directives as Ur,html as ee,render as Br}from"../../ui/lit/lit.js";import*as W from"../../ui/visual_logging/visual_logging.js";import*as G from"./converters/converters.js";import*as Gt from"./extensions/extensions.js";import*as h from"./models/models.js";import*as D from"./recorder-actions/recorder-actions.js";var eo=`*{margin:0;padding:0;box-sizing:border-box;font-size:inherit}*:focus,
*:focus-visible{outline:none}:host{overflow-x:auto}:host,
devtools-create-recording-view{display:flex;flex-direction:column;flex:1;min-height:0}.wrapper{display:flex;flex-direction:column;height:100%}.header{background-color:var(--sys-color-cdt-base-container);display:flex;flex-flow:row wrap;align-items:center;border-bottom:var(--sys-size-1) solid var(--sys-color-divider);padding:0 5px;gap:3px;flex-shrink:0}.separator{background-color:var(--sys-color-divider);width:var(--sys-size-1);height:17px;margin:0}select{appearance:none;user-select:none;border:none;border-radius:var(--sys-shape-corner-extra-small);height:var(--sys-size-9);max-width:140px;min-width:140px;padding:0 var(--sys-size-6) 0 var(--sys-size-5);position:relative;color:var(--sys-color-on-surface);background-color:transparent;text-overflow:ellipsis;background-image:var(--combobox-dropdown-arrow);background-position:right center;background-repeat:no-repeat;&:hover{background-color:var(--sys-color-state-hover-on-subtle)}&:active{background-color:var(--sys-color-state-ripple-neutral-on-subtle)}&:hover:active{background:var(--combobox-dropdown-arrow),linear-gradient(var(--sys-color-state-hover-on-subtle),var(--sys-color-state-hover-on-subtle)),linear-gradient(var(--sys-color-state-ripple-neutral-on-subtle),var(--sys-color-state-ripple-neutral-on-subtle));background-position:right center;background-repeat:no-repeat}&:disabled{pointer-events:none;color:var(--sys-color-state-disabled);background-color:var(--sys-color-state-disabled-container)}&:focus-visible{outline:var(--sys-size-2) solid var(--sys-color-state-focus-ring)}}select option{background-color:var(--sys-color-cdt-base-container);color:var(--sys-color-on-surface)}devtools-menu{width:0;height:0;position:absolute}devtools-recording-list-view{overflow:auto}.error{color:var(--sys-color-error);border:var(--sys-size-1) solid var(--sys-color-error);background-color:var(--sys-color-error-container);padding:var(--sys-size-3)}.feedback{margin-left:auto;margin-right:var(--sys-size-3)}.feedback .devtools-link{letter-spacing:0.03em;text-decoration-line:underline;font-size:var(--sys-typescale-body4-size);line-height:var(--sys-typescale-body4-line-height);color:var(--sys-color-primary);outline-offset:3px}.feedback .devtools-link:focus-visible,
.empty-state-description .devtools-link:focus-visible{outline:-webkit-focus-ring-color auto var(--sys-size-1)}.empty-state{margin:var(--sys-size-5);display:flex;flex-grow:1;justify-content:center;align-items:center;flex-direction:column;text-align:center;min-height:fit-content;min-width:fit-content;> *{max-width:var(--sys-size-29)}.empty-state-header{font:var(--sys-typescale-headline5);margin-bottom:var(--sys-size-3)}.empty-state-description{font:var(--sys-typescale-body4-regular);color:var(--sys-color-on-surface-subtle);> devtools-link{white-space:nowrap;margin-left:var(--sys-size-3);cursor:pointer;text-decoration:underline;color:var(--sys-color-primary);outline-offset:var(--sys-size-2)}}> devtools-button{margin-top:var(--sys-size-7)}}
/*# sourceURL=${import.meta.resolve("./recorderPanel.css")} */`;var ao={};K(ao,{DEFAULT_VIEW:()=>no,RecordingListView:()=>$e});import"../../ui/kit/kit.js";import*as ut from"../../core/i18n/i18n.js";import*as je from"../../ui/components/buttons/buttons.js";import*as oo from"../../ui/legacy/legacy.js";import*as ht from"../../ui/lit/lit.js";import*as ro from"../../ui/visual_logging/visual_logging.js";import*as io from"./models/models.js";import*as so from"./recorder-actions/recorder-actions.js";var to=`@scope to (devtools-widget > *){*{margin:0;padding:0;box-sizing:border-box;font-size:inherit}*:focus,
  *:focus-visible{outline:none}.wrapper{padding:var(--sys-size-11)}.header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}h1{font-size:var(--sys-typescale-body1-size);line-height:19px;color:var(--sys-color-on-surface);font-weight:normal}.icon,
  .icon devtools-icon{width:var(--sys-size-9);height:var(--sys-size-9);color:var(--sys-color-primary)}.table{margin-top:35px}.title{font-size:var(--sys-typescale-body3-size);color:var(--sys-color-on-surface);margin-left:10px;flex:1;overflow-x:hidden;white-space:nowrap;text-overflow:ellipsis}.row{display:flex;align-items:center;padding-right:5px;height:var(--sys-size-12);border-bottom:var(--sys-size-1) solid var(--sys-color-divider)}.row:focus-within,
  .row:hover{background-color:var(--sys-color-state-hover-on-subtle)}.row:last-child{border-bottom:none}.actions{display:flex;align-items:center}.actions button{border:none;background-color:transparent;width:var(--sys-size-11);height:var(--sys-size-11);border-radius:var(--sys-shape-corner-full)}.actions .divider{width:var(--sys-size-1);height:17px;background-color:var(--sys-color-divider);margin:0 var(--sys-size-4)}}
/*# sourceURL=${import.meta.resolve("./recordingListView.css")} */`;var{html:gt}=ht,ce={savedRecordings:"Saved recordings",createRecording:"Create a new recording",playRecording:"Play recording",deleteRecording:"Delete recording",openRecording:"Open recording"},or=ut.i18n.registerUIStrings("panels/recorder/RecordingListView.ts",ce),fe=ut.i18n.getLocalizedString.bind(void 0,or),no=(t,e,o)=>{let{recordings:r,replayAllowed:i,onCreateClick:s,onDeleteClick:n,onOpenClick:l,onPlayRecordingClick:d,onKeyDown:u}=t;ht.render(gt`
      <style>${to}</style>
      <div class="wrapper">
        <div class="header">
          <h1>${fe(ce.savedRecordings)}</h1>
          <devtools-button
            .variant=${je.Button.Variant.PRIMARY}
            @click=${s}
            title=${io.Tooltip.getTooltipForActions(fe(ce.createRecording),so.RecorderActions.CREATE_RECORDING)}
            .jslogContext=${"create-recording"}
          >
            ${fe(ce.createRecording)}
          </devtools-button>
        </div>
        <div class="table">
          ${r.map(c=>gt`
                <div
                  role="button"
                  tabindex="0"
                  aria-label=${fe(ce.openRecording)}
                  class="row"
                  @keydown=${x=>u(c.storageName,x)}
                  @click=${x=>l(c.storageName,x)}
                  jslog=${ro.item().track({click:!0,resize:!0}).context("recording")}>
                  <div class="icon">
                    <devtools-icon name="flow">
                    </devtools-icon>
                  </div>
                  <div class="title">${c.name}</div>
                  <div class="actions">
                    ${i?gt`
                              <devtools-button
                                title=${fe(ce.playRecording)}
                                .data=${{variant:je.Button.Variant.ICON,iconName:"play",jslogContext:"play-recording"}}
                                @click=${x=>d(c.storageName,x)}
                                @keydown=${x=>x.stopPropagation()}
                              ></devtools-button>
                              <div class="divider"></div>`:""}
                    <devtools-button
                      class="delete-recording-button"
                      title=${fe(ce.deleteRecording)}
                      .data=${{variant:je.Button.Variant.ICON,iconName:"bin",jslogContext:"delete-recording"}}
                      @click=${x=>n(c.storageName,x)}
                      @keydown=${x=>x.stopPropagation()}
                    ></devtools-button>
                  </div>
                </div>
              `)}
        </div>
      </div>
    `,o)},$e=class extends oo.Widget.Widget{#t=[];#e=!0;#r;onCreateRecording;onDeleteRecording;onOpenRecording;onPlayRecording;constructor(e,o){super(e,{useShadowDom:!0}),this.#r=o||no}set recordings(e){this.#t=e,this.performUpdate()}set replayAllowed(e){this.#e=e,this.performUpdate()}#i(){this.onCreateRecording?.()}#o(e,o){o.stopPropagation(),this.onDeleteRecording?.(e)}#s(e,o){o.stopPropagation(),this.onOpenRecording?.(e)}#n(e,o){o.stopPropagation(),this.onPlayRecording?.(e)}#l(e,o){o.key==="Enter"&&this.#s(e,o)}performUpdate(){this.#r({recordings:this.#t,replayAllowed:this.#e,onCreateClick:this.#i.bind(this),onDeleteClick:this.#o.bind(this),onOpenClick:this.#s.bind(this),onPlayRecordingClick:this.#n.bind(this),onKeyDown:this.#l.bind(this)},{},this.contentElement)}wasShown(){super.wasShown(),this.performUpdate()}};var No={};K(No,{DEFAULT_VIEW:()=>Bo,RecordingView:()=>Pe,TargetPanel:()=>Nt});import"../../ui/kit/kit.js";import*as ot from"../../core/host/host.js";import*as Ce from"../../core/i18n/i18n.js";import*as Bt from"../../core/platform/platform.js";import*as J from"../../core/sdk/sdk.js";import*as Te from"../../third_party/codemirror.next/codemirror.next.js";import*as ne from"../../ui/components/buttons/buttons.js";import*as Oo from"../../ui/components/code_highlighter/code_highlighter.js";import*as Uo from"../../ui/components/input/input.js";import*as rt from"../../ui/components/text_editor/text_editor.js";import*as ae from"../../ui/legacy/legacy.js";import*as I from"../../ui/lit/lit.js";import*as E from"../../ui/visual_logging/visual_logging.js";import*as ft from"../../core/i18n/i18n.js";import*as vt from"../../ui/components/buttons/buttons.js";import*as po from"../../ui/legacy/legacy.js";import*as yt from"../../ui/lit/lit.js";import*as He from"../../ui/visual_logging/visual_logging.js";import*as qe from"./extensions/extensions.js";var lo=`*{margin:0;padding:0;outline:none;box-sizing:border-box;font-size:inherit}.extension-view{display:flex;flex-direction:column;height:100%}main{flex:1}iframe{border:none;height:100%;width:100%}header{display:flex;padding:3px var(--sys-size-5);justify-content:space-between;border-bottom:var(--sys-size-1) solid var(--sys-color-divider)}header > div{align-self:center}.icon{display:block;width:var(--sys-size-8);height:var(--sys-size-8);color:var(--sys-color-secondary)}.title{display:flex;flex-direction:row;gap:var(--sys-size-4);color:var(--sys-color-secondary);align-items:center;font-weight:500}
/*# sourceURL=${import.meta.resolve("./extensionView.css")} */`;var{html:rr}=yt,mt={closeView:"Close",extension:"Content provided by a browser extension"},ir=ft.i18n.registerUIStrings("panels/recorder/ExtensionView.ts",mt),co=ft.i18n.getLocalizedString.bind(void 0,ir),sr=(t,e,o)=>{let{descriptor:r,iframe:i}=t;yt.render(rr`
      <style>${lo}</style>
      <div class="extension-view">
        <header>
          <div class="title">
            <devtools-icon
              class="icon"
              title=${co(mt.extension)}
              name="extension">
            </devtools-icon>
            ${r.title}
          </div>
          <devtools-button
            title=${co(mt.closeView)}
            jslog=${He.close().track({click:!0})}
            .data=${{variant:vt.Button.Variant.ICON,size:vt.Button.Size.SMALL,iconName:"cross"}}
            @click=${e.closeView}
          ></devtools-button>
        </header>
        <main>
          ${i}
        </main>
    </div>
  `,o,{container:{attributes:{jslog:He.section("extension-view")}}})},Le=class extends po.Widget.VBox{#t;#e;#r;#i={closeView:()=>{this.#r?.()}};set onClose(e){this.#r=e}constructor(e,o=sr){super(e,{useShadowDom:!0}),this.#e=o}get descriptor(){return this.#t}set descriptor(e){this.#t=e,e&&qe.ExtensionManager.ExtensionManager.instance().getView(e.id).show(),this.requestUpdate()}willHide(){super.willHide(),this.#t&&qe.ExtensionManager.ExtensionManager.instance().getView(this.#t.id).hide()}performUpdate(){if(!this.#t)return;let e=qe.ExtensionManager.ExtensionManager.instance().getView(this.#t.id).frame();this.#e({descriptor:this.#t,iframe:e},this.#i,this.contentElement)}};import*as F from"./models/models.js";import*as ke from"./recorder-actions/recorder-actions.js";var go=`@scope to (devtools-widget > *){*{padding:0;margin:0;box-sizing:border-box;font-size:inherit}.wrapper{display:flex;flex-direction:row;flex:1;height:100%}.main{overflow:hidden;display:flex;flex-direction:column;flex:1}.sections{min-height:0;background-color:var(--sys-color-cdt-base-container);z-index:0;position:relative;container:sections/inline-size}.section{display:flex;padding:0 var(--sys-size-8);gap:var(--sys-size-5);position:relative}.section::after{content:'';border-bottom:var(--sys-size-1) solid var(--sys-color-divider);position:absolute;left:0;right:0;bottom:0;z-index:-1}.section:last-child::after{content:none}.screenshot-wrapper{flex:0 0 var(--sys-size-19);padding-top:var(--sys-size-13);z-index:2}@container sections (max-width: 400px){.screenshot-wrapper{display:none}}.screenshot{object-fit:cover;object-position:top center;max-width:100%;width:200px;height:auto;border:var(--sys-size-1) solid var(--sys-color-divider);border-radius:1px}.content{flex:1;min-width:0}.steps{flex:1;position:relative;align-self:flex-start;overflow:visible}.step{position:relative;padding-left:var(--sys-size-14);margin:var(--sys-size-8) 0}.step .action{font-size:var(--sys-typescale-body3-size);line-height:var(--sys-typescale-body4-line-height);letter-spacing:0.03em}.recording{color:var(--sys-color-primary);font-style:italic;margin-top:var(--sys-size-5);margin-bottom:0}.add-assertion-button{margin-top:var(--sys-size-5)}.details{max-width:var(--sys-size-28);display:flex;flex-direction:column;align-items:flex-end}.url{font-size:var(--sys-typescale-body4-size);line-height:var(--sys-typescale-body4-line-height);letter-spacing:0.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--sys-color-secondary);max-width:100%;margin-bottom:var(--sys-size-8)}.header{flex-shrink:0;align-items:center;border-bottom:var(--sys-size-1) solid var(--sys-color-divider);display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;padding:var(--sys-size-8)}.header-title-wrapper{max-width:100%}.header-title{align-items:center;display:flex;flex:1;max-width:100%}.header-title::before{content:'';min-width:var(--sys-size-6);height:var(--sys-size-6);display:inline-block;background:var(--sys-color-primary);border-radius:50%;margin-right:7px}#title-input{font-family:inherit;field-sizing:content;font-size:var(--sys-typescale-headline3-size);line-height:22px;letter-spacing:0.02em;padding:var(--sys-size-1) var(--sys-size-3);border:var(--sys-size-1) solid transparent;border-radius:1px;word-break:break-all}#title-input:hover,
  #title-input:focus-visible{border-color:var(--input-outline)}#title-input.has-error{border-color:var(--sys-color-error)}#title-input.disabled{color:var(--sys-color-state-disabled)}.title-input-error-text{margin-top:var(--sys-size-3);margin-left:19px;color:var(--sys-color-error)}.title-button-bar{flex-shrink:0;padding-left:var(--sys-size-2);display:flex}#title-input:focus + .title-button-bar{display:none}.settings-row{padding:var(--sys-size-8) var(--sys-size-12);border-bottom:var(--sys-size-1) solid var(--sys-color-divider);display:flex;flex-flow:row wrap;justify-content:space-between}.settings-title{font-size:var(--sys-typescale-body2-size);line-height:var(--sys-typescale-body1-line-height);letter-spacing:0.03em;color:var(--sys-color-on-surface);display:flex;align-items:center;align-content:center;gap:5px;width:fit-content}.settings-title:focus-visible{outline:var(--sys-size-2) solid var(--sys-color-state-focus-ring);outline-offset:var(--sys-size-2)}.settings{margin-top:var(--sys-size-3);display:flex;flex-wrap:wrap;font-size:var(--sys-typescale-body4-size);line-height:var(--sys-typescale-body2-line-height);letter-spacing:0.03em;color:var(--sys-color-on-surface-subtle)}.settings.expanded{gap:10px}.settings .separator{width:var(--sys-size-1);height:var(--sys-size-9);background-color:var(--sys-color-divider);margin:0 5px}.actions{display:flex;align-items:center;flex-wrap:wrap;gap:var(--sys-size-6)}.actions .separator{width:var(--sys-size-1);height:var(--sys-size-11);background-color:var(--sys-color-divider)}.is-recording .header-title::before{background:var(--sys-color-error-bright)}.footer{display:flex;justify-content:center;border-top:var(--sys-size-1) solid var(--sys-color-divider);padding:var(--sys-size-6);background:var(--sys-color-cdt-base-container);z-index:1}.controls{align-items:center;display:flex;justify-content:center;position:relative;width:100%}.chevron{width:var(--sys-size-7);height:var(--sys-size-7);transform:rotate(-90deg);color:var(--sys-color-on-surface)}.expanded .chevron{transform:rotate(0)}.editable-setting{display:flex;flex-direction:row;gap:var(--sys-size-6);align-items:center}.editable-setting .devtools-text-input{width:fit-content;height:var(--sys-size-9)}.wrapping-label{display:inline-flex;align-items:center;gap:var(--sys-size-6)}.text-editor{height:100%;overflow:auto}.section-toolbar{display:flex;align-items:center;padding:3px 5px;justify-content:space-between;gap:3px}.code-format-label{display:flex;align-items:center;flex:1;gap:var(--sys-size-3);min-width:0;white-space:nowrap}.code-format-label > select{height:var(--sys-size-11);min-width:0}.sections .section-toolbar{justify-content:flex-end}devtools-split-view{flex:1 1 0%;min-height:0}[slot='main']{overflow:hidden auto}[slot='sidebar']{display:flex;flex-direction:column;overflow:auto;height:100%;width:100%}[slot='sidebar'] .section-toolbar{border-bottom:var(--sys-size-1) solid var(--sys-color-divider)}.recorder-extension-view{flex:1}}
/*# sourceURL=${import.meta.resolve("./recordingView.css")} */`;var yo={};K(yo,{DEFAULT_VIEW:()=>fo,ReplaySection:()=>De});import*as St from"../../core/i18n/i18n.js";import*as vo from"../../core/platform/platform.js";import*as mo from"../../ui/components/buttons/buttons.js";import*as Ye from"../../ui/legacy/legacy.js";import*as Oe from"../../ui/lit/lit.js";import*as ye from"../../ui/visual_logging/visual_logging.js";import*as V from"./models/models.js";import*as bt from"./recorder-actions/recorder-actions.js";var uo=`.select-button{display:flex;gap:var(--sys-size-6)}.groups-label{display:inline-block;padding:0 var(--sys-size-4) var(--sys-size-4) 0}.select-button devtools-button{position:relative}
/*# sourceURL=${import.meta.resolve("./replaySection.css")} */`;var{html:We,Directives:{ifDefined:nr,repeat:ho}}=Oe,j={Replay:"Replay",ReplayNormalButtonLabel:"Normal speed",ReplayNormalItemLabel:"Normal (Default)",ReplaySlowButtonLabel:"Slow speed",ReplaySlowItemLabel:"Slow",ReplayVerySlowButtonLabel:"Very slow speed",ReplayVerySlowItemLabel:"Very slow",ReplayExtremelySlowButtonLabel:"Extremely slow speed",ReplayExtremelySlowItemLabel:"Extremely slow",speedGroup:"Speed",extensionGroup:"Extensions"},ar=St.i18n.registerUIStrings("panels/recorder/ReplaySection.ts",j),X=St.i18n.getLocalizedString.bind(void 0,ar),Ke="extension";function lr(t){return t===V.RecordingPlayer.PlayRecordingSpeed.NORMAL||t===V.RecordingPlayer.PlayRecordingSpeed.SLOW||t===V.RecordingPlayer.PlayRecordingSpeed.VERY_SLOW||t===V.RecordingPlayer.PlayRecordingSpeed.EXTREMELY_SLOW}var fo=(t,e,o)=>{let{disabled:r,groups:i,selectedItem:s,actionTitle:n,onButtonClick:l,onItemSelected:d}=t,u=mo.Button.Variant.PRIMARY,c=p=>{p.stopPropagation(),l()},x=p=>{p.target instanceof HTMLSelectElement&&d(p.target.value)};Oe.render(We`
      <style>
        ${Ye.inspectorCommonStyles}
      </style>
      <style>
        ${uo}
      </style>
      <div
        class="select-button"
        title=${nr(n)}
      >
        <label>
          ${i.length>1?We`
                <div
                  class="groups-label"
                  >${i.map(p=>p.name).join(" & ")}</div>`:Oe.nothing}
          <select
            class="primary"
            ?disabled=${r}
            jslog=${ye.dropDown("network-conditions").track({change:!0})}
            @change=${x}
          >
            ${ho(i,p=>p.name,p=>We`
                <optgroup label=${p.name}>
                  ${ho(p.items,a=>a.value,a=>{let g=a.value===s.value;return We`
                      <option
                        .title=${a.label()}
                        value=${a.value}
                        ?selected=${g}
                        jslog=${ye.item(vo.StringUtilities.toKebabCase(a.value)).track({click:!0})}
                      >
                        ${g&&a.buttonLabel?a.buttonLabel():a.label()}
                      </option>
                    `})}
                </optgroup>
              `)}
          </select>
        </label>
        <devtools-button
          .disabled=${r}
          .variant=${u}
          .iconName=${s.buttonIconName}
          @click=${c}
          jslog=${ye.action(bt.RecorderActions.REPLAY_RECORDING).track({click:!0})}
        >
          ${X(j.Replay)}
        </devtools-button>
      </div>`,o)},De=class extends Ye.Widget.Widget{onStartReplay;#t=!1;#e;#r=[];#i;#o=[];constructor(e,o){super(e,{useShadowDom:!0}),this.#i=o||fo,this.#o=this.#s()}set settings(e){this.#e=e,this.performUpdate()}set replayExtensions(e){this.#r=e,this.#o=this.#s(),this.performUpdate()}get disabled(){return this.#t}set disabled(e){this.#t=e,this.performUpdate()}wasShown(){super.wasShown(),this.performUpdate()}performUpdate(){let e=this.#n();this.#i({disabled:this.#t,groups:this.#o,selectedItem:e,actionTitle:V.Tooltip.getTooltipForActions(e.label(),bt.RecorderActions.REPLAY_RECORDING),onButtonClick:()=>this.#l(),onItemSelected:o=>this.#c(o)},void 0,this.contentElement)}#s(){let e=[{name:X(j.speedGroup),items:[{value:V.RecordingPlayer.PlayRecordingSpeed.NORMAL,buttonIconName:"play",buttonLabel:()=>X(j.ReplayNormalButtonLabel),label:()=>X(j.ReplayNormalItemLabel)},{value:V.RecordingPlayer.PlayRecordingSpeed.SLOW,buttonIconName:"play",buttonLabel:()=>X(j.ReplaySlowButtonLabel),label:()=>X(j.ReplaySlowItemLabel)},{value:V.RecordingPlayer.PlayRecordingSpeed.VERY_SLOW,buttonIconName:"play",buttonLabel:()=>X(j.ReplayVerySlowButtonLabel),label:()=>X(j.ReplayVerySlowItemLabel)},{value:V.RecordingPlayer.PlayRecordingSpeed.EXTREMELY_SLOW,buttonIconName:"play",buttonLabel:()=>X(j.ReplayExtremelySlowButtonLabel),label:()=>X(j.ReplayExtremelySlowItemLabel)}]}];return this.#r.length&&e.push({name:X(j.extensionGroup),items:this.#r.map(o=>({value:Ke+o.getOrigin(),buttonIconName:"play",buttonLabel:()=>o.getName(),label:()=>o.getName()}))}),e}#n(){let e=this.#e?.replayExtension||this.#e?.speed||"";for(let o of this.#o)for(let r of o.items)if(r.value===e)return r;return this.#o[0].items[0]}#l(){let e=this.#e?.replayExtension||this.#e?.speed||"";if(e.startsWith(Ke)){let o=e.substring(Ke.length),r=this.#r.find(i=>i.getOrigin()===o);if(r){this.#e&&(this.#e.replayExtension=Ke+r.getOrigin()),this.onStartReplay&&this.onStartReplay(V.RecordingPlayer.PlayRecordingSpeed.NORMAL,r),this.performUpdate();return}}this.onStartReplay&&this.onStartReplay(this.#e?this.#e.speed:V.RecordingPlayer.PlayRecordingSpeed.NORMAL),this.performUpdate()}#c(e){this.#e&&(lr(e)?(this.#e.speed=e,this.#e.replayExtension=""):this.#e.replayExtension=e,this.performUpdate())}};var Do={};K(Do,{AddStepPosition:()=>Ot,DEFAULT_VIEW:()=>Lo,State:()=>Dt,StepView:()=>Ee});import"../../ui/kit/kit.js";import*as Lt from"../../core/i18n/i18n.js";import*as $t from"../../core/platform/platform.js";import*as tt from"../../ui/components/menus/menus.js";import*as ze from"../../ui/legacy/legacy.js";import*as xe from"../../ui/lit/lit.js";import*as se from"../../ui/visual_logging/visual_logging.js";import*as U from"./models/models.js";var ko={};K(ko,{EditorState:()=>pe,StepEditor:()=>we});import*as Mt from"../../core/i18n/i18n.js";import*as kt from"../../core/platform/platform.js";import*as Re from"../../ui/components/buttons/buttons.js";import*as Qe from"../../ui/components/suggestion_input/suggestion_input.js";import*as Pt from"../../ui/legacy/legacy.js";import*as gr from"../../ui/lit/lit.js";import*as M from"../../ui/visual_logging/visual_logging.js";import*as k from"./models/models.js";var xo={};K(xo,{DEFAULT_VIEW:()=>Eo,SelectorPicker:()=>Ue});import*as wt from"../../core/common/common.js";import*as xt from"../../core/i18n/i18n.js";import*as Xe from"../../core/platform/platform.js";import*as q from"../../core/sdk/sdk.js";import*as Et from"../../ui/components/buttons/buttons.js";import*as bo from"../../ui/legacy/legacy.js";import*as Ct from"../../ui/lit/lit.js";import*as Ro from"../../ui/visual_logging/visual_logging.js";import*as Se from"./models/models.js";var So=`:host{display:inline-block}.selector-picker{width:18px;height:18px}
/*# sourceURL=${import.meta.resolve("./selectorPicker.css")} */`;import*as Z from"./util/util.js";var{html:dr}=Ct,Rt="captureSelectors",wo={selectorPicker:"Select an element in the page to update selectors"},cr=xt.i18n.registerUIStrings("panels/recorder/SelectorPicker.ts",wo),pr=xt.i18n.getLocalizedString.bind(void 0,cr),Eo=(t,e,o)=>{let{active:r,disabled:i,onClick:s}=t;Ct.render(dr`
      <style>${So}</style>
      <devtools-button
        @click=${s}
        .title=${pr(wo.selectorPicker)}
        class="selector-picker"
        .size=${Et.Button.Size.SMALL}
        .iconName=${"select-element"}
        .active=${r}
        .disabled=${i}
        .variant=${Et.Button.Variant.ICON}
        jslog=${Ro.toggle("selector-picker").track({click:!0})}
      ></devtools-button>
    `,o)},Ue=class t extends bo.Widget.Widget{#t;#e=!1;#r=!1;#i;#o=new wt.Mutex.Mutex;#s=new Map;#n=new Map;onSelectorPicked;onAttributeRequested;constructor(e,o){super(e,{useShadowDom:!0}),this.#t=o||Eo}static get#l(){return q.TargetManager.TargetManager.instance()}set disabled(e){this.#e=e,this.requestUpdate()}performUpdate(){this.#t({active:this.#r,disabled:this.#e,onClick:this.#c.bind(this)},{},this.contentElement)}#c(e){e.preventDefault(),e.stopPropagation(),this.#u()}async#u(){return this.#r?await this.#a():await this.#v()}#v=()=>this.#o.run(async()=>{this.#r||(this.#r=!0,this.#i=await new Promise((e,o)=>{let r=setTimeout(o,1e3);this.onAttributeRequested?this.onAttributeRequested(i=>{clearTimeout(r),e(i)}):(clearTimeout(r),e(void 0))}),t.#l.observeTargets(this),this.requestUpdate())});#a=()=>this.#o.run(async()=>{this.#r&&(this.#r=!1,t.#l.unobserveTargets(this),t.#l.targets().map(this.targetRemoved.bind(this)),this.#i=void 0,this.requestUpdate())});targetAdded(e){if(e.type()!==q.Target.Type.FRAME)return;let o=this.#s.get(e);o||(o=new wt.Mutex.Mutex,this.#s.set(e,o)),o.run(async()=>{await this.#w(e),await this.#f(e)})}targetRemoved(e){let o=this.#s.get(e);o&&o.run(async()=>{try{await this.#b(e),await this.#E(e)}catch{}})}#m=e=>{if(e.data.name!==Rt)return;let o=e.data.executionContextId,r=q.TargetManager.TargetManager.instance().targets(),i=Se.SDKUtils.findTargetByExecutionContext(r,o),s=Se.SDKUtils.findFrameIdByExecutionContext(r,o);if(!i||!s)throw new Error(`No execution context found for the binding call + ${JSON.stringify(e.data)}`);let n=i.model(q.ResourceTreeModel.ResourceTreeModel);if(!n)throw new Error(`ResourceTreeModel instance is missing for the target: ${i.id()}`);let l=n.frameForId(s);if(!l)throw new Error("Frame is not found");this.onSelectorPicked&&this.onSelectorPicked({...JSON.parse(e.data.payload),...Se.SDKUtils.getTargetFrameContext(i,l)}),this.#a()};async#f(e){let r=`${await Z.InjectedScript.get()};DevToolsRecorder.startSelectorPicker({getAccessibleName, getAccessibleRole}, ${JSON.stringify(this.#i?this.#i:void 0)}, ${Z.isDebugBuild})`,[{identifier:i}]=await Promise.all([e.pageAgent().invoke_addScriptToEvaluateOnNewDocument({source:r,worldName:Z.DEVTOOLS_RECORDER_WORLD_NAME,includeCommandLineAPI:!0}),Se.SDKUtils.evaluateInAllFrames(Z.DEVTOOLS_RECORDER_WORLD_NAME,e,r)]);this.#n.set(e,i)}async#b(e){let o=this.#n.get(e);Xe.assertNotNullOrUndefined(o),this.#n.delete(e),await e.pageAgent().invoke_removeScriptToEvaluateOnNewDocument({identifier:o}),await Se.SDKUtils.evaluateInAllFrames(Z.DEVTOOLS_RECORDER_WORLD_NAME,e,"DevToolsRecorder.stopSelectorPicker()")}async#w(e){let o=e.model(q.RuntimeModel.RuntimeModel);Xe.assertNotNullOrUndefined(o),o.addEventListener(q.RuntimeModel.Events.BindingCalled,this.#m),await o.addBinding({name:Rt,executionContextName:Z.DEVTOOLS_RECORDER_WORLD_NAME})}async#E(e){await e.runtimeAgent().invoke_removeBinding({name:Rt});let o=e.model(q.RuntimeModel.RuntimeModel);Xe.assertNotNullOrUndefined(o),o.removeEventListener(q.RuntimeModel.Events.BindingCalled,this.#m)}wasShown(){super.wasShown(),this.requestUpdate()}wasHidden(){super.wasHidden(),this.#a()}};var Co=`*{box-sizing:border-box;padding:0;margin:0;font-size:inherit}:host{display:block}.row{display:flex;flex-direction:row;color:var(--sys-color-token-property-special);font-family:var(--monospace-font-family);font-size:var(--monospace-font-size);align-items:center;line-height:18px;margin-top:3px}.row devtools-button{line-height:1;margin-left:0.5em}.separator{margin-right:0.5em;color:var(--sys-color-on-surface)}.padded{margin-left:2em}.padded.double{margin-left:4em}.inline-button{width:18px;height:18px;opacity:0%;visibility:hidden;transition:opacity 200ms;flex-shrink:0}.row:focus-within .inline-button,
.row:hover .inline-button{opacity:100%;visibility:visible}.wrapped.row{flex-wrap:wrap}.gap.row{gap:5px}.gap.row devtools-button{margin-left:0}.regular-font{font-family:inherit;font-size:inherit}.no-margin{margin:0}.row-buttons{margin-top:3px}.error{margin:3px 0 var(--sys-size-4);padding:var(--sys-size-5) var(--sys-size-6);background:var(--sys-color-error-container);color:var(--sys-color-error)}
/*# sourceURL=${import.meta.resolve("./stepEditor.css")} */`;import{ArrayAssignments as P,assert as Tt,deepFreeze as Ze,immutableDeepAssign as be,InsertAssignment as Je,SharedObject as ur}from"./util/util.js";var{html:L,render:hr,Directives:vr}=gr,{live:oe}=vr,{widget:mr}=Pt.Widget,fr=Object.freeze({string:t=>t.trim(),number:t=>{let e=parseFloat(t);return Number.isNaN(e)?0:e},boolean:t=>t.toLowerCase()==="true"}),To=Object.freeze({selectors:"string",offsetX:"number",offsetY:"number",target:"string",frame:"number",assertedEvents:"string",value:"string",key:"string",operator:"string",count:"number",expression:"string",x:"number",y:"number",url:"string",type:"string",timeout:"number",duration:"number",button:"string",deviceType:"string",width:"number",height:"number",deviceScaleFactor:"number",isMobile:"boolean",hasTouch:"boolean",isLandscape:"boolean",download:"number",upload:"number",latency:"number",name:"string",parameters:"string",visible:"boolean",properties:"string",attributes:"string"}),A=Ze({selectors:[[".cls"]],offsetX:1,offsetY:1,target:"main",frame:[0],assertedEvents:[{type:"navigation",url:"https://example.com",title:"Title"}],value:"Value",key:"Enter",operator:">=",count:1,expression:"true",x:0,y:0,url:"https://example.com",timeout:5e3,duration:50,deviceType:"mouse",button:"primary",type:"click",width:800,height:600,deviceScaleFactor:1,isMobile:!1,hasTouch:!1,isLandscape:!0,download:1e3,upload:1e3,latency:25,name:"customParam",parameters:"{}",properties:"{}",attributes:[{name:"attribute",value:"value"}],visible:!0}),At=Ze({[k.Schema.StepType.Click]:{required:["selectors","offsetX","offsetY"],optional:["assertedEvents","button","deviceType","duration","frame","target","timeout"]},[k.Schema.StepType.DoubleClick]:{required:["offsetX","offsetY","selectors"],optional:["assertedEvents","button","deviceType","frame","target","timeout"]},[k.Schema.StepType.Hover]:{required:["selectors"],optional:["assertedEvents","frame","target","timeout"]},[k.Schema.StepType.Change]:{required:["selectors","value"],optional:["assertedEvents","frame","target","timeout"]},[k.Schema.StepType.KeyDown]:{required:["key"],optional:["assertedEvents","target","timeout"]},[k.Schema.StepType.KeyUp]:{required:["key"],optional:["assertedEvents","target","timeout"]},[k.Schema.StepType.Scroll]:{required:[],optional:["assertedEvents","frame","target","timeout","x","y"]},[k.Schema.StepType.Close]:{required:[],optional:["assertedEvents","target","timeout"]},[k.Schema.StepType.Navigate]:{required:["url"],optional:["assertedEvents","target","timeout"]},[k.Schema.StepType.WaitForElement]:{required:["selectors"],optional:["assertedEvents","attributes","count","frame","operator","properties","target","timeout","visible"]},[k.Schema.StepType.WaitForExpression]:{required:["expression"],optional:["assertedEvents","frame","target","timeout"]},[k.Schema.StepType.CustomStep]:{required:["name","parameters"],optional:["assertedEvents","target","timeout"]},[k.Schema.StepType.EmulateNetworkConditions]:{required:["download","latency","upload"],optional:["assertedEvents","target","timeout"]},[k.Schema.StepType.SetViewport]:{required:["deviceScaleFactor","hasTouch","height","isLandscape","isMobile","width"],optional:["assertedEvents","target","timeout"]}}),z={notSaved:"Not saved: {error}",addAttribute:"Add {attributeName}",deleteRow:"Delete row",addFrameIndex:"Add frame index within the frame tree",removeFrameIndex:"Remove frame index",addSelectorPart:"Add a selector part",removeSelectorPart:"Remove a selector part",addSelector:"Add a selector",removeSelector:"Remove a selector",unknownActionType:"Enter a valid action type"},yr=Mt.i18n.registerUIStrings("panels/recorder/StepEditor.ts",z),H=Mt.i18n.getLocalizedString.bind(void 0,yr),Sr=t=>JSON.parse(JSON.stringify(t)),pe=class{static#t=new ur.SharedObject(()=>k.RecordingPlayer.RecordingPlayer.connectPuppeteer(),({browser:e})=>k.RecordingPlayer.RecordingPlayer.disconnectPuppeteer(e));static async default(e){let o={type:e},r=At[o.type],i=Promise.resolve();for(let s of r.required)i=Promise.all([i,(async()=>Object.assign(o,{[s]:await this.defaultByAttribute(o,s)}))()]);return await i,Object.freeze(o)}static async defaultByAttribute(e,o){return await this.#t.run(r=>{switch(o){case"assertedEvents":return be(A.assertedEvents,new P({0:{url:r.page.url()||A.assertedEvents[0].url}}));case"url":return r.page.url()||A.url;case"height":return r.page.evaluate(()=>visualViewport.height).then(i=>i||A.height);case"width":return r.page.evaluate(()=>visualViewport.width).then(i=>i||A.width);default:return A[o]}})}static fromStep(e){let o=structuredClone(e);for(let r of["parameters","properties"])r in e&&e[r]!==void 0&&(o[r]=JSON.stringify(e[r]));if("attributes"in e&&e.attributes){o.attributes=[];for(let[r,i]of Object.entries(e.attributes))o.attributes.push({name:r,value:i})}return"selectors"in e&&(o.selectors=e.selectors.map(r=>typeof r=="string"?[r]:[...r])),Ze(o)}static toStep(e){let o=structuredClone(e);for(let r of["parameters","properties"]){let i=e[r];i&&Object.assign(o,{[r]:JSON.parse(i)})}if(e.attributes)if(e.attributes.length!==0){let r={};for(let{name:i,value:s}of e.attributes)Object.assign(r,{[i]:s});Object.assign(o,{attributes:r})}else"attributes"in o&&delete o.attributes;if(e.selectors){let r=e.selectors.filter(i=>i.length>0).map(i=>i.length===1?i[0]:[...i]);r.length!==0?Object.assign(o,{selectors:r}):"selectors"in o&&delete o.selectors}return e.frame?.length===0&&"frame"in o&&delete o.frame,Sr(k.SchemaUtils.parseStep(o))}};function re(t,e){if(!t.disabled)return L`
    <devtools-button
      title=${e.title}
      .accessibleLabel=${e.title}
      .size=${Re.Button.Size.SMALL}
      .iconName=${e.iconName}
      .variant=${Re.Button.Variant.ICON}
      jslog=${M.action(e.class).track({click:!0})}
      class="inline-button ${e.class}"
      @click=${e.onClick}
    ></devtools-button>
  `}function Be(t,e){if(!(t.disabled||![...At[t.state.type].optional].includes(e)||t.disabled))return L`<devtools-button
    .size=${Re.Button.Size.SMALL}
    .iconName=${"bin"}
    .variant=${Re.Button.Variant.ICON}
    .title=${H(z.deleteRow)}
    class="inline-button delete-row"
    data-attribute=${e}
    jslog=${M.action("delete").track({click:!0})}
    @click=${t.handleDeleteRowClick(e)}
  ></devtools-button>`}var br=(t,e,o)=>{let r=new Set;function i(p){return r.add("type"),L`<div class="row attribute" data-attribute="type" jslog=${M.treeItem("type").track({resize:!0})}>
      <div id="type">type<span class="separator">:</span></div>
      <devtools-suggestion-input
        aria-labelledby="type"
        .disabled=${!p||t.disabled}
        .options=${Object.values(k.Schema.StepType)}
        .placeholder=${A.type}
        .value=${oe(t.state.type)}
        @blur=${t.handleTypeInputBlur}
      ></devtools-suggestion-input>
    </div>`}function s(p){r.add(p);let a=t.state[p]?.toString();if(a!==void 0)return L`<div class="row attribute" data-attribute=${p} jslog=${M.treeItem(kt.StringUtilities.toKebabCase(p)).track({resize:!0})}>
      <div id=${p}>${p}<span class="separator">:</span></div>
      <devtools-suggestion-input
        .disabled=${t.disabled}
        aria-labelledby=${p}
        .placeholder=${A[p].toString()}
        .value=${oe(a)}
        .mimeType=${(()=>{switch(p){case"expression":return"text/javascript";case"properties":return"application/json";default:return""}})()}
        @blur=${t.handleInputBlur({attribute:p,from(g){if(!(t.state[p]===void 0||t.state[p]===g))return{[p]:g}}})}
      ></devtools-suggestion-input>
      ${Be(t,p)}
    </div>`}function n(){if(r.add("frame"),t.state.frame!==void 0)return L`
      <div class="attribute" data-attribute="frame" jslog=${M.treeItem("frame").track({resize:!0})}>
        <div class="row">
          <div id="frame">frame<span class="separator">:</span></div>
          ${Be(t,"frame")}
        </div>
        ${t.state.frame.map((p,a,g)=>L`
            <div class="padded row">
              <devtools-suggestion-input
                aria-labelledby="frame"
                .disabled=${t.disabled}
                .placeholder=${A.frame[0].toString()}
                .value=${oe(p.toString())}
                data-path=${`frame.${a}`}
                @blur=${t.handleInputBlur({attribute:"frame",from(B){if(!(t.state.frame?.[a]===void 0||t.state.frame[a]===B))return{frame:new P({[a]:B})}}})}
              ></devtools-suggestion-input>
              ${re(t,{class:"add-frame",title:H(z.addFrameIndex),iconName:"plus",onClick:t.handleAddOrRemoveClick({frame:new P({[a+1]:new Je(A.frame[0])})},`devtools-suggestion-input[data-path="frame.${a+1}"]`)})}
              ${re(t,{class:"remove-frame",title:H(z.removeFrameIndex),iconName:"minus",onClick:t.handleAddOrRemoveClick({frame:new P({[a]:void 0})},`devtools-suggestion-input[data-path="frame.${Math.min(a,g.length-2)}"]`)})}
            </div>
          `)}
      </div>
    `}function l(){if(r.add("selectors"),t.state.selectors!==void 0)return L`<div class="attribute" data-attribute="selectors" jslog=${M.treeItem("selectors")}>
      <div class="row">
        <div>selectors<span class="separator">:</span></div>
        ${mr(Ue,{disabled:t.disabled,onSelectorPicked:t.handleSelectorPicked,onAttributeRequested:t.handleAttributeRequested})}
        ${Be(t,"selectors")}
      </div>
      ${t.state.selectors.map((p,a,g)=>L`<div class="padded row" data-selector-path=${a}>
            <div id="selector-${a}">selector #${a+1}<span class="separator">:</span></div>
            ${re(t,{class:"add-selector",title:H(z.addSelector),iconName:"plus",onClick:t.handleAddOrRemoveClick({selectors:new P({[a+1]:new Je(structuredClone(A.selectors[0]))})},`devtools-suggestion-input[data-path="selectors.${a+1}.0"]`)})}
            ${re(t,{class:"remove-selector",title:H(z.removeSelector),iconName:"minus",onClick:t.handleAddOrRemoveClick({selectors:new P({[a]:void 0})},`devtools-suggestion-input[data-path="selectors.${Math.min(a,g.length-2)}.0"]`)})}
          </div>
          ${p.map((B,w,Ae)=>L`<div
              class="double padded row"
              data-selector-path="${a}.${w}"
            >
              <devtools-suggestion-input
                aria-labelledby="selector-${a}"
                .disabled=${t.disabled}
                .placeholder=${A.selectors[0][0]}
                .value=${oe(B)}
                data-path=${`selectors.${a}.${w}`}
                @blur=${t.handleInputBlur({attribute:"selectors",from(ue){if(!(t.state.selectors?.[a]?.[w]===void 0||t.state.selectors[a][w]===ue))return{selectors:new P({[a]:new P({[w]:ue})})}}})}
              ></devtools-suggestion-input>
              ${re(t,{class:"add-selector-part",title:H(z.addSelectorPart),iconName:"plus",onClick:t.handleAddOrRemoveClick({selectors:new P({[a]:new P({[w+1]:new Je(A.selectors[0][0])})})},`devtools-suggestion-input[data-path="selectors.${a}.${w+1}"]`)})}
              ${re(t,{class:"remove-selector-part",title:H(z.removeSelectorPart),iconName:"minus",onClick:t.handleAddOrRemoveClick({selectors:new P({[a]:new P({[w]:void 0})})},`devtools-suggestion-input[data-path="selectors.${a}.${Math.min(w,Ae.length-2)}"]`)})}
            </div>`)}`)}
    </div>`}function d(){if(r.add("assertedEvents"),t.state.assertedEvents!==void 0)return L`<div class="attribute" data-attribute="assertedEvents" jslog=${M.treeItem("asserted-events")}>
      <div class="row">
        <div>asserted events<span class="separator">:</span></div>
        ${Be(t,"assertedEvents")}
      </div>
      ${t.state.assertedEvents.map((p,a)=>L` <div class="padded row" jslog=${M.treeItem("event-type")}>
            <div id="event-type">type<span class="separator">:</span></div>
            <div aria-labelledby="event-type">${p.type}</div>
          </div>
          <div class="padded row" jslog=${M.treeItem("event-title")}>
            <div id="event-title">title<span class="separator">:</span></div>
            <devtools-suggestion-input
              aria-labelledby="event-title"
              .disabled=${t.disabled}
              .placeholder=${A.assertedEvents[0].title}
              .value=${oe(p.title??"")}
              @blur=${t.handleInputBlur({attribute:"assertedEvents",from(g){if(!(t.state.assertedEvents?.[a]?.title===void 0||t.state.assertedEvents[a].title===g))return{assertedEvents:new P({[a]:{title:g}})}}})}
            ></devtools-suggestion-input>
          </div>
          <div  id="event-url" class="padded row" jslog=${M.treeItem("event-url")}>
            <div>url<span class="separator">:</span></div>
            <devtools-suggestion-input
              aria-labelledby="event-url"
              .disabled=${t.disabled}
              .placeholder=${A.assertedEvents[0].url}
              .value=${oe(p.url??"")}
              @blur=${t.handleInputBlur({attribute:"url",from(g){if(!(t.state.assertedEvents?.[a]?.url===void 0||t.state.assertedEvents[a].url===g))return{assertedEvents:new P({[a]:{url:g}})}}})}
            ></devtools-suggestion-input>
          </div>`)}
    </div> `}function u(){if(r.add("attributes"),t.state.attributes!==void 0)return L`<div class="attribute" data-attribute="attributes" jslog=${M.treeItem("attributes")}>
      <div class="row">
        <div>attributes<span class="separator">:</span></div>
        ${Be(t,"attributes")}
      </div>
      ${t.state.attributes.map(({name:p,value:a},g,B)=>L`<div class="padded row" jslog=${M.treeItem("attribute")}>
          <devtools-suggestion-input
            .disabled=${t.disabled}
            .placeholder=${A.attributes[0].name}
            .value=${oe(p)}
            data-path=${`attributes.${g}.name`}
            jslog=${M.key().track({change:!0})}
            @blur=${t.handleInputBlur({attribute:"attributes",from(w){if(!(t.state.attributes?.[g]?.name===void 0||t.state.attributes[g].name===w))return{attributes:new P({[g]:{name:w}})}}})}
          ></devtools-suggestion-input>
          <span class="separator">:</span>
          <devtools-suggestion-input
            .disabled=${t.disabled}
            .placeholder=${A.attributes[0].value}
            .value=${oe(a)}
            data-path=${`attributes.${g}.value`}
            @blur=${t.handleInputBlur({attribute:"attributes",from(w){if(!(t.state.attributes?.[g]?.value===void 0||t.state.attributes[g].value===w))return{attributes:new P({[g]:{value:w}})}}})}
          ></devtools-suggestion-input>
          ${re(t,{class:"add-attribute-assertion",title:H(z.addSelectorPart),iconName:"plus",onClick:t.handleAddOrRemoveClick({attributes:new P({[g+1]:new Je((()=>{{let w=new Set(B.map(({name:Ko})=>Ko)),Ae=A.attributes[0],ue=Ae.name,Ht=0;for(;w.has(ue);)++Ht,ue=`${Ae.name}-${Ht}`;return{...Ae,name:ue}}})())})},`devtools-suggestion-input[data-path="attributes.${g+1}.name"]`)})}
          ${re(t,{class:"remove-attribute-assertion",title:H(z.removeSelectorPart),iconName:"minus",onClick:t.handleAddOrRemoveClick({attributes:new P({[g]:void 0})},`devtools-suggestion-input[data-path="attributes.${Math.min(g,B.length-2)}.value"]`)})}
        </div>`)}
    </div>`}function c(){return[...At[t.state.type].optional].filter(a=>t.state[a]===void 0).map(a=>L`<devtools-button
          .variant=${Re.Button.Variant.OUTLINED}
          class="add-row"
          data-attribute=${a}
          jslog=${M.action(`add-${kt.StringUtilities.toKebabCase(a)}`)}
          @click=${t.handleAddRowClickEvent}
        >
          ${H(z.addAttribute,{attributeName:a})}
        </devtools-button>`)}let x=L`
    <style>${Co}</style>
    <div class="wrapper" jslog=${M.tree("step-editor")} >
      ${i(t.isTypeEditable)} ${s("target")}
      ${n()} ${l()}
      ${s("deviceType")} ${s("button")}
      ${s("url")} ${s("x")}
      ${s("y")} ${s("offsetX")}
      ${s("offsetY")} ${s("value")}
      ${s("key")} ${s("operator")}
      ${s("count")} ${s("expression")}
      ${s("duration")} ${d()}
      ${s("timeout")} ${s("width")}
      ${s("height")} ${s("deviceScaleFactor")}
      ${s("isMobile")} ${s("hasTouch")}
      ${s("isLandscape")} ${s("download")}
      ${s("upload")} ${s("latency")}
      ${s("name")} ${s("parameters")}
      ${s("visible")} ${s("properties")}
      ${u()}
      ${t.error?L`
            <div class="error">
              ${H(z.notSaved,{error:t.error})}
            </div>
          `:void 0}
      ${t.disabled?void 0:L`<div
            class="row-buttons wrapped gap row regular-font no-margin"
          >
            ${c()}
          </div>`}
    </div>
  `;for(let p of Object.keys(To))if(!r.has(p))throw new Error(`The editable attribute ${p} does not have UI`);hr(x,o,{container:{listeners:{keydown:t.handleKeyDownEvent}}})},we=class extends Pt.Widget.Widget{#t;#e;#r=!0;#i=!1;#o;onStepEdited;onAttributeRequested;constructor(e,o=br){super(e,{useShadowDom:!0}),this.#t={type:k.Schema.StepType.WaitForElement},this.#o=o}set isTypeEditable(e){this.#r=e,this.requestUpdate()}set disabled(e){this.#i=e,this.requestUpdate()}set step(e){this.#t=Ze(pe.fromStep(e)),this.#e=void 0,this.requestUpdate()}performUpdate(){let e={state:this.#t,disabled:this.#i,error:this.#e,isTypeEditable:this.#r,handleInputBlur:this.#m,handleTypeInputBlur:this.#f,handleAddRowClickEvent:this.#b,handleDeleteRowClick:this.#u,handleSelectorPicked:this.#n,handleAttributeRequested:this.#l,handleAddOrRemoveClick:this.#c,handleKeyDownEvent:this.#a};this.#o(e,void 0,this.contentElement)}#s(e){try{this.onStepEdited?.(pe.toStep(e)),this.#t=e}catch(o){this.#e=o.message}this.requestUpdate()}#n=e=>{this.#s(be(this.#t,{target:e.target,frame:e.frame,selectors:e.selectors.map(o=>typeof o=="string"?[o]:o),offsetX:e.offsetX,offsetY:e.offsetY}))};#l=e=>{this.onAttributeRequested?.(e)};#c=(e,o)=>r=>{r.preventDefault(),r.stopPropagation(),this.#s(be(this.#t,e)),this.#v(o)};#u=e=>o=>{o.preventDefault(),o.stopPropagation(),this.#s(be(this.#t,{[e]:void 0}))};#v=e=>{this.updateComplete.then(()=>{this.contentElement.querySelector(e)?.focus()})};#a=e=>{if(Tt(e instanceof KeyboardEvent),e.target instanceof Qe.SuggestionInput.SuggestionInput&&e.key==="Enter"){e.preventDefault(),e.stopPropagation();let o=this.contentElement.querySelectorAll("devtools-suggestion-input"),r=[...o].findIndex(i=>i===e.target);r>=0&&r+1<o.length?o[r+1].focus():e.target.blur()}};#m=e=>o=>{if(Tt(o.target instanceof Qe.SuggestionInput.SuggestionInput),o.target.disabled)return;let r=To[e.attribute],i=fr[r](o.target.value),s=e.from.bind(this)(i);s&&this.#s(be(this.#t,s))};#f=async e=>{if(Tt(e.target instanceof Qe.SuggestionInput.SuggestionInput),e.target.disabled)return;let o=e.target.value;if(o!==this.#t.type){if(!Object.values(k.Schema.StepType).includes(o)){this.#e=H(z.unknownActionType),this.requestUpdate();return}this.#s(await pe.default(o))}};#b=async e=>{e.preventDefault(),e.stopPropagation();let o=e.target.dataset.attribute;this.#s(be(this.#t,{[o]:await pe.defaultByAttribute(this.#t,o)})),this.#v(`[data-attribute=${o}].attribute devtools-suggestion-input`)}};var Mo=`*{margin:0;padding:0;box-sizing:border-box;font-size:inherit}.title-container{min-width:0;font-size:var(--sys-size-7);display:flex;flex-direction:row;gap:var(--sys-size-2);outline-offset:var(--sys-size-2);flex-grow:1;align-items:center}.action{display:flex;align-items:center}.title{flex:1;min-width:0}.is-start-of-group .title{font-weight:bold}.error-icon{display:none}.breakpoint-icon{visibility:hidden;cursor:pointer;opacity:0%;fill:var(--sys-color-primary);stroke:#1a73e8;transform:translate(-1.92px,-3px)}.circle-icon{fill:var(--sys-color-primary);stroke:var(--sys-color-cdt-base-container);stroke-width:var(--sys-size-3);r:5px;cx:var(--sys-size-5);cy:var(--sys-size-5)}.is-start-of-group:not(:first-of-type) .circle-icon{r:7px;fill:var(--sys-color-cdt-base-container);stroke:var(--sys-color-primary);stroke-width:var(--sys-size-2)}.step.is-success .circle-icon{fill:var(--sys-color-primary);stroke:var(--sys-color-primary)}.step.is-current .circle-icon{stroke-dasharray:24 10;animation:rotate 1s linear infinite;fill:var(--sys-color-cdt-base-container);stroke:var(--sys-color-primary);stroke-width:var(--sys-size-2)}.error{margin:var(--sys-size-8) 0 0;padding:var(--sys-size-5);background:var(--sys-color-error-container);color:var(--sys-color-error);position:relative}@keyframes rotate{0%{transform:translate(var(--sys-size-5),var(--sys-size-5)) rotate(0) translate(calc(-1 * var(--sys-size-5)),calc(-1 * var(--sys-size-5)))}100%{transform:translate(var(--sys-size-5),var(--sys-size-5)) rotate(360deg) translate(calc(-1 * var(--sys-size-5)),calc(-1 * var(--sys-size-5)))}}.step.is-error .circle-icon{fill:var(--sys-color-error);stroke:var(--sys-color-error)}.step.is-error .error-icon{display:block;transform:translate(var(--sys-size-3),var(--sys-size-3))}:host-context(.was-successful) .circle-icon{animation:flash-circle 2s}:host-context(.was-successful) .breakpoint-icon{animation:flash-breakpoint-icon 2s}@keyframes flash-circle{25%{fill:var(--override-color-recording-successful-text);stroke:var(--override-color-recording-successful-text)}75%{fill:var(--override-color-recording-successful-text);stroke:var(--override-color-recording-successful-text)}}@keyframes flash-breakpoint-icon{25%{fill:var(--override-color-recording-successful-text);stroke:var(--override-color-recording-successful-text)}75%{fill:var(--override-color-recording-successful-text);stroke:var(--override-color-recording-successful-text)}}.chevron{width:var(--sys-size-7);height:var(--sys-size-7);transition:200ms;position:absolute;top:var(--sys-size-7);left:var(--sys-size-11);transform:rotate(-90deg);color:var(--sys-color-on-surface)}.expanded .chevron{transform:rotate(0deg)}.is-start-of-group .chevron{top:34px}.details{display:none;margin-top:var(--sys-size-5);position:relative}.expanded .details{display:block}.step-details{overflow:auto}devtools-recorder-step-editor{border:var(--sys-size-1) solid var(--sys-color-neutral-outline);padding:3px 6px 6px;margin-left:calc(-1 * var(--sys-size-4));border-radius:3px}devtools-recorder-step-editor:hover{border:var(--sys-size-1) solid var(--sys-color-neutral-outline)}devtools-recorder-step-editor.is-selected{background-color:color-mix(in srgb,var(--sys-color-tonal-container),var(--sys-color-cdt-base-container) 50%);border:var(--sys-size-1) solid var(--sys-color-tonal-outline)}.summary{display:flex;flex-flow:row nowrap}.subtitle{font-weight:normal;color:var(--sys-color-on-surface-subtle);word-break:break-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.main-title{word-break:break-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.step-actions{border:none;border-radius:0;flex-shrink:0;height:var(--sys-size-11);--override-select-menu-show-button-border-radius:0;--override-select-menu-show-button-outline:none;--override-select-menu-show-button-padding:0}.step.has-breakpoint .circle-icon{visibility:hidden}.step:not(.is-start-of-group).has-breakpoint .breakpoint-icon{visibility:visible;opacity:100%}.step:not(.is-start-of-group, .has-breakpoint) .icon:hover .circle-icon{transition:opacity 0.2s;opacity:0%}.step:not(.is-start-of-group, .has-breakpoint) .icon:hover .error-icon{visibility:hidden}.step:not(.is-start-of-group, .has-breakpoint) .icon:hover .breakpoint-icon{transition:opacity 0.2s;visibility:visible;opacity:50%}
/*# sourceURL=${import.meta.resolve("./stepView.css")} */`;var $o={};K($o,{DEFAULT_VIEW:()=>Io,TimelineSection:()=>Ne});import*as Ao from"../../ui/legacy/legacy.js";import*as Ve from"../../ui/lit/lit.js";var Po=`*{margin:0;padding:0;box-sizing:border-box;font-size:inherit}.timeline-section{position:relative;padding:var(--sys-size-5) 0 var(--sys-size-5) var(--sys-size-14);margin-left:var(--sys-size-5);--override-color-recording-successful-text:#36a854;--override-color-recording-successful-background:#e6f4ea}.overlay{position:absolute;width:100vw;height:100%;left:calc(-1 * var(--sys-size-13) - var(--sys-size-19));top:0;z-index:-1;pointer-events:none}@container (max-width: 400px){.overlay{left:calc(-1 * var(--sys-size-13))}}:hover .overlay{background:var(--sys-color-state-hover-on-subtle)}.is-selected .overlay{background:var(--sys-color-tonal-container)}:host-context(.is-stopped) .overlay{background:var(--sys-color-state-ripple-primary);outline:var(--sys-size-1) solid var(--sys-color-state-focus-ring);z-index:4}.is-start-of-group:not(:first-of-type){padding-top:var(--sys-size-8)}.is-end-of-group{padding-bottom:var(--sys-size-8)}.icon{position:absolute;left:var(--sys-size-3);transform:translateX(-50%);z-index:2}.bar{position:absolute;left:var(--sys-size-3);display:block;transform:translateX(-50%);top:18px;height:100%;z-index:1}.bar .background{fill:var(--sys-color-state-hover-on-subtle)}.bar .line{fill:var(--sys-color-primary)}.is-first-section .bar{height:100%;display:none}.is-first-section:not(.is-last-section) .bar{display:block}.is-last-section .bar .line{display:none}.is-last-section .bar .background{display:none}:host-context(.is-error) .bar .line{fill:var(--sys-color-error)}:host-context(.is-error) .bar .background{fill:var(--sys-color-error-container)}:host-context(.was-successful) .bar .background{animation:flash-background 2s}:host-context(.was-successful) .bar .line{animation:flash-line 2s}@keyframes flash-background{25%{fill:var(--override-color-recording-successful-background)}75%{fill:var(--override-color-recording-successful-background)}}@keyframes flash-line{25%{fill:var(--override-color-recording-successful-text)}75%{fill:var(--override-color-recording-successful-text)}}
/*# sourceURL=${import.meta.resolve("./timelineSection.css")} */`;var{html:Rr}=Ve,Io=(t,e,o)=>{let r={"timeline-section":!0,"is-end-of-group":t.isEndOfGroup,"is-start-of-group":t.isStartOfGroup,"is-first-section":t.isFirstSection,"is-last-section":t.isLastSection,"is-selected":t.isSelected};Ve.render(Rr`
    <style>${Po}</style>
    <div class=${Ve.Directives.classMap(r)}>
      <div class="overlay"></div>
      <div class="icon"><slot name="icon"></slot></div>
      <svg width="24" height="100%" class="bar" aria-hidden="true">
        <rect class="line" x="7" y="0" width="2" height="100%" />
      </svg>
      <slot></slot>
    </div>
  `,o)},Ne=class extends Ao.Widget.Widget{#t=!1;#e=!1;#r=!1;#i=!1;#o=!1;#s;constructor(e,o=Io){super(e,{useShadowDom:!0}),this.#s=o}set isEndOfGroup(e){this.#t=e,this.requestUpdate()}set isStartOfGroup(e){this.#e=e,this.requestUpdate()}set isFirstSection(e){this.#r=e,this.requestUpdate()}set isLastSection(e){this.#i=e,this.requestUpdate()}set isSelected(e){this.#o=e,this.requestUpdate()}performUpdate(){this.#s({isEndOfGroup:this.#t,isStartOfGroup:this.#e,isFirstSection:this.#r,isLastSection:this.#i,isSelected:this.#o},{},this.contentElement)}};var{html:ge}=xe,{ifDefined:et}=xe.Directives,{widget:It}=ze.Widget,m={setViewportClickTitle:"Set viewport",customStepTitle:"Custom step",clickStepTitle:"Click",doubleClickStepTitle:"Double click",hoverStepTitle:"Hover",emulateNetworkConditionsStepTitle:"Emulate network conditions",changeStepTitle:"Change",closeStepTitle:"Close",scrollStepTitle:"Scroll",keyUpStepTitle:"Key up",navigateStepTitle:"Navigate",keyDownStepTitle:"Key down",waitForElementStepTitle:"Wait for element",waitForExpressionStepTitle:"Wait for expression",elementRoleButton:"Button",elementRoleInput:"Input",elementRoleFallback:"Element",addStepBefore:"Add step before",addStepAfter:"Add step after",removeStep:"Remove step",openStepActions:"Open step actions",addBreakpoint:"Add breakpoint",removeBreakpoint:"Remove breakpoint",copyAs:"Copy as",stepManagement:"Manage steps",breakpoints:"Breakpoints"},wr=Lt.i18n.registerUIStrings("panels/recorder/StepView.ts",m),f=Lt.i18n.getLocalizedString.bind(void 0,wr),Dt=(n=>(n.DEFAULT="default",n.SUCCESS="success",n.CURRENT="current",n.OUTSTANDING="outstanding",n.ERROR="error",n.STOPPED="stopped",n))(Dt||{}),Ot=(o=>(o.BEFORE="before",o.AFTER="after",o))(Ot||{}),ie="copy-step-as-";function Er(t){if(t.section)return t.section.title?t.section.title:ge`<span class="fallback">(No Title)</span>`;if(!t.step)throw new Error("Missing both step and section");switch(t.step.type){case U.Schema.StepType.CustomStep:return f(m.customStepTitle);case U.Schema.StepType.SetViewport:return f(m.setViewportClickTitle);case U.Schema.StepType.Click:return f(m.clickStepTitle);case U.Schema.StepType.DoubleClick:return f(m.doubleClickStepTitle);case U.Schema.StepType.Hover:return f(m.hoverStepTitle);case U.Schema.StepType.EmulateNetworkConditions:return f(m.emulateNetworkConditionsStepTitle);case U.Schema.StepType.Change:return f(m.changeStepTitle);case U.Schema.StepType.Close:return f(m.closeStepTitle);case U.Schema.StepType.Scroll:return f(m.scrollStepTitle);case U.Schema.StepType.KeyUp:return f(m.keyUpStepTitle);case U.Schema.StepType.KeyDown:return f(m.keyDownStepTitle);case U.Schema.StepType.WaitForElement:return f(m.waitForElementStepTitle);case U.Schema.StepType.WaitForExpression:return f(m.waitForExpressionStepTitle);case U.Schema.StepType.Navigate:return f(m.navigateStepTitle)}}function xr(t){switch(t){case"button":return f(m.elementRoleButton);case"input":return f(m.elementRoleInput);default:return f(m.elementRoleFallback)}}function Cr(t){if(!("selectors"in t))return"";let e=t.selectors.flat().find(r=>r.startsWith("aria/"));if(!e)return"";let o=e.match(/^aria\/(.+?)(\[role="(.+)"\])?$/);return o?`${xr(o[3])} "${o[1]}"`:""}function Tr(t){return t?t.url:""}function kr(t){return ge`
    <devtools-menu-button
      class="step-actions"
      .accessibleLabel=${f(m.openStepActions)}
      .populateMenuCall=${t.populateStepContextMenu}
      @keydown=${e=>{e.stopPropagation()}}
      jslog=${se.dropDown("step-actions").track({click:!0})}
      .iconName=${"dots-vertical"}
    ></devtools-menu-button>
  `}var Lo=(t,e,o)=>{if(!t.step&&!t.section)return;let r={step:!0,expanded:t.showDetails,"is-success":t.state==="success","is-current":t.state==="current","is-outstanding":t.state==="outstanding","is-error":t.state==="error","is-stopped":t.state==="stopped","is-start-of-group":t.isStartOfGroup,"is-first-section":t.isFirstSection,"has-breakpoint":t.hasBreakpoint},i=!!t.step,s=Er({step:t.step,section:t.section}),n=t.step?Cr(t.step):Tr(t.section),l=t.hasBreakpoint?f(m.removeBreakpoint):f(m.addBreakpoint);xe.render(ge`
    <style>${Mo}</style>
    <div>
      <devtools-widget ${It(Ne,{isFirstSection:t.isFirstSection,isLastSection:t.isLastSection,isStartOfGroup:t.isStartOfGroup,isEndOfGroup:t.isEndOfGroup,isSelected:t.isSelected})}
        @contextmenu=${d=>{let u=new ze.ContextMenu.ContextMenu(d);t.populateStepContextMenu(u),u.show()}}
        data-step-index=${t.stepIndex}
        data-section-index=${t.sectionIndex}
        @click=${d=>{d.stopPropagation();let u=t.step||t.section;u&&t.onStepClick(u)}}
        @mouseover=${()=>{let d=t.step||t.section;d&&t.onStepHover(d)}}
        class=${xe.Directives.classMap(r)}>
        <svg slot="icon" width="24" height="24" class="icon"
          role=${t.step?"button":"presentation"}
          aria-label=${et(t.step?l:void 0)}
          aria-hidden=${et(t.step?void 0:"true")}
          tabindex=${et(t.step?0:void 0)}
          @click=${t.step?t.onBreakpointClick:void 0}
          @keydown=${t.step?d=>{(d.key==="Enter"||d.key===" ")&&(t.onBreakpointClick(),d.preventDefault(),d.stopPropagation())}:void 0}
          jslog=${et(t.step?se.action("breakpoint").track({click:!0}):void 0)}>
          <circle class="circle-icon"/>
          <g class="error-icon">
            <path d="M1.5 1.5L6.5 6.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1.5 6.5L6.5 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <path class="breakpoint-icon" d="M2.5 5.5H17.7098L21.4241 12L17.7098 18.5H2.5V5.5Z"/>
        </svg>
        <div class="summary">
          <div class="title-container ${i?"action":""}"
            @click=${i?t.toggleShowDetails:void 0}
            @keydown=${i?t.onToggleShowDetailsKeydown:void 0}
            tabindex="0"
            jslog=${se.sectionHeader().track({click:!0})}
            aria-role=${i?"button":""}
            aria-label=${i?"Show details for step":""}
          >
            ${i?ge`<devtools-icon
                    class="chevron"
                    jslog=${se.expand().track({click:!0})}
                    name="triangle-down">
                  </devtools-icon>`:""}
            <div class="title">
              <div class="main-title" title=${s}>${s}</div>
              <div class="subtitle" title=${n}>${n}</div>
            </div>
          </div>
          ${kr(t)}
        </div>
        <div class="details">
          ${t.step&&ge`<devtools-widget ${It(we,{step:t.step,disabled:t.isPlaying,onStepEdited:t.stepEdited,onAttributeRequested:t.onAttributeRequested})}
            class=${t.isSelected?"is-selected":""}></devtools-widget>`}
          ${t.section?.causingStep&&ge`<devtools-widget ${It(we,{step:t.section.causingStep,isTypeEditable:!1,disabled:t.isPlaying,onStepEdited:t.stepEdited,onAttributeRequested:t.onAttributeRequested})}></devtools-widget>`}
          }
        </div>
        ${t.error&&ge`
          <div class="error" role="alert">
            ${t.error.message}
          </div>
        `}
      </devtools-widget>
    </div>
  `,o,{container:{classes:["step-view-widget"]}})},Ee=class extends ze.Widget.Widget{#t=new IntersectionObserver(e=>{this.#e.isVisible=e[0].isIntersecting});onStepChanged;onAddStep;onRemoveStep;onAddBreakpoint;onRemoveBreakpoint;onCopyStep;onAttributeRequested;#e={state:"default",showDetails:!1,isEndOfGroup:!1,isStartOfGroup:!1,stepIndex:0,sectionIndex:0,isFirstSection:!1,isLastSection:!1,isRecording:!1,isPlaying:!1,isVisible:!1,hasBreakpoint:!1,removable:!0,builtInConverters:[],extensionConverters:[],isSelected:!1,actions:[],stepEdited:this.#s.bind(this),onAttributeRequested:e=>this.onAttributeRequested?.(e),onBreakpointClick:this.#l.bind(this),handleStepAction:this.#n.bind(this),toggleShowDetails:this.#i.bind(this),onToggleShowDetailsKeydown:this.#o.bind(this),populateStepContextMenu:this.#u.bind(this),onStepClick:()=>{},onStepHover:()=>{}};#r;constructor(e,o){super(e,{useShadowDom:"pure"}),this.#r=o||Lo}set step(e){this.#e.step=e,this.requestUpdate()}set section(e){this.#e.section=e,this.requestUpdate()}set state(e){let o=this.#e.state;this.#e.state=e,this.performUpdate(),this.#e.state!==o&&this.#e.state==="current"&&!this.#e.isVisible&&this.element.scrollIntoView()}set error(e){this.#e.error=e,this.requestUpdate()}set isEndOfGroup(e){this.#e.isEndOfGroup=e,this.requestUpdate()}set isStartOfGroup(e){this.#e.isStartOfGroup=e,this.requestUpdate()}set stepIndex(e){this.#e.stepIndex=e,this.requestUpdate()}set sectionIndex(e){this.#e.sectionIndex=e,this.requestUpdate()}set isFirstSection(e){this.#e.isFirstSection=e,this.requestUpdate()}set isLastSection(e){this.#e.isLastSection=e,this.requestUpdate()}set isRecording(e){this.#e.isRecording=e,this.requestUpdate()}set isPlaying(e){this.#e.isPlaying=e,this.requestUpdate()}set hasBreakpoint(e){this.#e.hasBreakpoint=e,this.requestUpdate()}set removable(e){this.#e.removable=e,this.requestUpdate()}set builtInConverters(e){this.#e.builtInConverters=e,this.requestUpdate()}set extensionConverters(e){this.#e.extensionConverters=e,this.requestUpdate()}set isSelected(e){this.#e.isSelected=e,this.requestUpdate()}set recorderSettings(e){this.#e.recorderSettings=e,this.requestUpdate()}set onStepClick(e){this.#e.onStepClick=e,this.requestUpdate()}set onStepHover(e){this.#e.onStepHover=e,this.requestUpdate()}get step(){return this.#e.step}get section(){return this.#e.section}wasShown(){super.wasShown(),this.#t.observe(this.element),this.requestUpdate()}willHide(){super.willHide(),this.#t.unobserve(this.element)}#i(){this.#e.showDetails=!this.#e.showDetails,this.requestUpdate()}#o(e){let o=e;(o.key==="Enter"||o.key===" ")&&(this.#i(),e.stopPropagation(),e.preventDefault())}#s(e){let o=this.#e.step||this.#e.section?.causingStep;if(!o)throw new Error("Expected step.");this.onStepChanged?.(o,e)}#n(e){switch(e.itemValue){case"add-step-before":{let o=this.#e.step||this.#e.section;if(!o)throw new Error("Expected step or section.");this.onAddStep?.(o,"before");break}case"add-step-after":{let o=this.#e.step||this.#e.section;if(!o)throw new Error("Expected step or section.");this.onAddStep?.(o,"after");break}case"remove-step":{let o=this.#e.section?.causingStep;if(!this.#e.step&&!o)throw new Error("Expected step.");this.onRemoveStep?.(this.#e.step||o);break}case"add-breakpoint":{if(!this.#e.step)throw new Error("Expected step");this.onAddBreakpoint?.(this.#e.stepIndex);break}case"remove-breakpoint":{if(!this.#e.step)throw new Error("Expected step");this.onRemoveBreakpoint?.(this.#e.stepIndex);break}default:{let o=e.itemValue;if(!o.startsWith(ie))throw new Error("Unknown step action.");let r=this.#e.step||this.#e.section?.causingStep;if(!r)throw new Error("Step not found.");let i=o.substring(ie.length);this.#e.recorderSettings&&(this.#e.recorderSettings.preferredCopyFormat=i),this.onCopyStep?.(structuredClone(r))}}}#l(){this.#e.hasBreakpoint?this.onRemoveBreakpoint?.(this.#e.stepIndex):this.onAddBreakpoint?.(this.#e.stepIndex),this.requestUpdate()}#c=()=>{let e=[];if(this.#e.isPlaying||(this.#e.step&&e.push({id:"add-step-before",label:f(m.addStepBefore),group:"stepManagement",groupTitle:f(m.stepManagement)}),e.push({id:"add-step-after",label:f(m.addStepAfter),group:"stepManagement",groupTitle:f(m.stepManagement)}),this.#e.removable&&e.push({id:"remove-step",group:"stepManagement",groupTitle:f(m.stepManagement),label:f(m.removeStep)})),this.#e.step&&!this.#e.isRecording&&(this.#e.hasBreakpoint?e.push({id:"remove-breakpoint",label:f(m.removeBreakpoint),group:"breakPointManagement",groupTitle:f(m.breakpoints)}):e.push({id:"add-breakpoint",label:f(m.addBreakpoint),group:"breakPointManagement",groupTitle:f(m.breakpoints)})),this.#e.step){for(let o of this.#e.builtInConverters||[])e.push({id:ie+$t.StringUtilities.toKebabCase(o.getId()),label:o.getFormatName(),group:"copy",groupTitle:f(m.copyAs)});for(let o of this.#e.extensionConverters||[])e.push({id:ie+$t.StringUtilities.toKebabCase(o.getId()),label:o.getFormatName(),group:"copy",groupTitle:f(m.copyAs),jslogContext:ie+"extension"})}return e};#u(e){let o=this.#c(),r=o.filter(n=>n.id.startsWith(ie)),i=o.filter(n=>!n.id.startsWith(ie));for(let n of i)e.section(n.group).appendItem(n.label,()=>{this.#n(new tt.Menu.MenuItemSelectedEvent(n.id))},{jslogContext:n.id});let s=r.find(n=>n.id===ie+this.#e.recorderSettings?.preferredCopyFormat);if(s&&e.section("copy").appendItem(s.label,()=>{this.#n(new tt.Menu.MenuItemSelectedEvent(s.id))},{jslogContext:s.id}),r.length){let n=e.section("copy").appendSubMenuItem(f(m.copyAs),!1,"copy");for(let l of r)l!==s&&n.section(l.group).appendItem(l.label,()=>{this.#n(new tt.Menu.MenuItemSelectedEvent(l.id))},{jslogContext:l.id})}}performUpdate(){this.#e.actions=this.#c(),this.#r(this.#e,void 0,this.contentElement)}};var{html:v}=I,{widget:Me}=ae.Widget,y={mobile:"Mobile",desktop:"Desktop",latency:"Latency: {value} ms",upload:"Upload: {value}",download:"Download: {value}",editReplaySettings:"Edit replay settings",replaySettings:"Replay settings",default:"Default",environment:"Environment",screenshotForSection:"Screenshot for this section",editTitle:"Edit title",requiredTitleError:"Title is required",recording:"Recording\u2026",endRecording:"End recording",recordingIsBeingStopped:"Stopping recording\u2026",timeout:"Timeout: {value} ms",network:"Network",timeoutLabel:"Timeout",timeoutExplanation:"The timeout setting (in milliseconds) applies to every action when replaying the recording. For example, if a DOM element identified by a CSS selector does not appear on the page within the specified timeout, the replay fails with an error.",cancelReplay:"Cancel replay",showCode:"Show code",hideCode:"Hide code",addAssertion:"Add assertion",performancePanel:"Performance panel",codeSidebarOpened:"Code sidebar opened",codeSidebarClosed:"Code sidebar closed",codeFormat:"Code format"},Mr=Ce.i18n.registerUIStrings("panels/recorder/RecordingView.ts",y),b=Ce.i18n.getLocalizedString.bind(void 0,Mr),Nt=(o=>(o.PERFORMANCE_PANEL="timeline",o.DEFAULT="chrome-recorder",o))(Nt||{}),Ut=[J.NetworkManager.NoThrottlingConditions,J.NetworkManager.OfflineConditions,J.NetworkManager.Slow3GConditions,J.NetworkManager.Slow4GConditions,J.NetworkManager.Fast4GConditions];function Pr({settings:t,replaySettingsExpanded:e,onNetworkConditionsChange:o,onTimeoutInput:r,isRecording:i,replayState:s,onReplaySettingsKeydown:n,onToggleReplaySettings:l}){if(!t)return I.nothing;let d=[];t.viewportSettings&&(d.push(v`<div>${t.viewportSettings.isMobile?b(y.mobile):b(y.desktop)}</div>`),d.push(v`<div class="separator"></div>`),d.push(v`<div>${t.viewportSettings.width}×${t.viewportSettings.height} px</div>`));let u=[];if(!e)t.networkConditionsSettings?t.networkConditionsSettings.title?u.push(v`<div>${t.networkConditionsSettings.title}</div>`):u.push(v`<div>
          ${b(y.download,{value:Ce.ByteUtilities.bytesToString(t.networkConditionsSettings.download)})},
          ${b(y.upload,{value:Ce.ByteUtilities.bytesToString(t.networkConditionsSettings.upload)})},
          ${b(y.latency,{value:t.networkConditionsSettings.latency})}
        </div>`):u.push(v`<div>${J.NetworkManager.NoThrottlingConditions.title instanceof Function?J.NetworkManager.NoThrottlingConditions.title():J.NetworkManager.NoThrottlingConditions.title}</div>`),u.push(v`<div class="separator"></div>`),u.push(v`<div>${b(y.timeout,{value:t.timeout||F.RecordingPlayer.defaultTimeout})}</div>`);else{let a=t.networkConditionsSettings?.i18nTitleKey||J.NetworkManager.NoThrottlingConditions.i18nTitleKey,g=Ut.find(w=>w.i18nTitleKey===a),B="";g&&(B=g.title instanceof Function?g.title():g.title),u.push(v`<div class="editable-setting">
      <label class="wrapping-label">
        ${b(y.network)}
        <select
            title=${B}
            jslog=${E.dropDown("network-conditions").track({change:!0})}
            @change=${o}>
      ${Ut.map(w=>v`
        <option jslog=${E.item(Bt.StringUtilities.toKebabCase(w.i18nTitleKey||""))}
                value=${w.i18nTitleKey||""} ?selected=${a===w.i18nTitleKey}>
                ${w.title instanceof Function?w.title():w.title}
        </option>`)}
    </select>
      </label>
    </div>`),u.push(v`<div class="editable-setting">
      <label class="wrapping-label" title=${b(y.timeoutExplanation)}>
        ${b(y.timeoutLabel)}
        <input
          @input=${r}
          required
          min=${F.SchemaUtils.minTimeout}
          max=${F.SchemaUtils.maxTimeout}
          value=${t.timeout||F.RecordingPlayer.defaultTimeout}
          jslog=${E.textField("timeout").track({change:!0})}
          class="devtools-text-input"
          type="number">
      </label>
    </div>`)}let c=!i&&!s.isPlaying,x={"settings-title":!0,expanded:e},p={expanded:e,settings:!0};return v`
    <div class="settings-row">
      <div class="settings-container">
        <div
          class=${I.Directives.classMap(x)}
          @keydown=${c&&n}
          @click=${c&&l}
          aria-expanded=${x.expanded??!1}
          tabindex="0"
          role="button"
          jslog=${E.action("replay-settings").track({click:!0})}
          aria-label=${b(y.editReplaySettings)}>
          <span>${b(y.replaySettings)}</span>
          ${c?v`<devtools-icon
                  class="chevron"
                  name="triangle-down">
                </devtools-icon>`:""}
        </div>
        <div class=${I.Directives.classMap(p)}>
          ${u.length?u:v`<div>${b(y.default)}</div>`}
        </div>
      </div>
      <div class="settings-container">
        <div class="settings-title">${b(y.environment)}</div>
        <div class="settings">
          ${d.length?d:v`<div>${b(y.default)}</div>`}
        </div>
      </div>
    </div>
  `}function Ar(t,e){return t.extensionDescriptor?v`
        <devtools-widget class="recorder-extension-view" ${Me(Le,{descriptor:t.extensionDescriptor})}>
        </devtools-widget>
      `:v`
        <devtools-split-view
          direction="auto"
          sidebar-position="second"
          sidebar-initial-size="300"
          sidebar-visibility=${t.showCodeView?"":"hidden"}
        >
          <div slot="main">
            ${Dr(t)}
          </div>
          <div slot="sidebar" jslog=${E.pane("source-code").track({resize:!0})}>
            ${t.showCodeView?v`
            <div class="section-toolbar" jslog=${E.toolbar()}>
              <label class="code-format-label">
                ${b(y.codeFormat)}
                <select
                  @change=${o=>{o.target instanceof HTMLSelectElement&&t.onCodeFormatChange(o.target.value)}}
                  jslog=${E.dropDown("code-format").track({change:!0})}>
                ${t.builtInConverters.map(o=>v`<option
                    value=${o.getId()}
                    ?selected=${t.converterId===o.getId()}
                    jslog=${E.item(`converter-${Bt.StringUtilities.toKebabCase(o.getId())}`)}>
                    ${o.getFormatName()}
                  </option>`)}
                ${t.extensionConverters.map(o=>v`<option
                    value=${o.getId()}
                    ?selected=${t.converterId===o.getId()}
                    jslog=${E.item("converter-extension")}>
                    ${o.getFormatName()}
                  </option>`)}
                </select>
              </label>
              <devtools-button
                title=${F.Tooltip.getTooltipForActions(b(y.hideCode),ke.RecorderActions.TOGGLE_CODE_VIEW)}
                .data=${{variant:ne.Button.Variant.ICON,size:ne.Button.Size.SMALL,iconName:"cross"}}
                @click=${t.showCodeToggle}
                jslog=${E.close().track({click:!0})}
              ></devtools-button>
            </div>
            ${Ir(t,e)}`:I.nothing}
          </div>
        </devtools-split-view>
      `}function Ir(t,e){if(!t.editorState)throw new Error("Unexpected: trying to render the text editor without editorState");return v`
    <div class="text-editor" jslog=${E.textField().track({change:!0})}>
      <devtools-text-editor .state=${t.editorState} ${I.Directives.ref(o=>{!o||!(o instanceof rt.TextEditor.TextEditor)||(e.highlightLinesInEditor=(r,i,s=!1)=>{let n=o.editor,l=o.createSelection({lineNumber:r+i,columnNumber:0},{lineNumber:r,columnNumber:0}),d=o.state.doc.lineAt(l.main.anchor);l=o.createSelection({lineNumber:r+i-1,columnNumber:d.length+1},{lineNumber:r,columnNumber:0}),n.dispatch({selection:l,effects:s?[Te.EditorView.scrollIntoView(l.main,{y:"nearest"})]:void 0})})})}></devtools-text-editor>
    </div>
  `}function $r(t){return t.screenshot?v`
      <img class="screenshot" src=${t.screenshot} alt=${b(y.screenshotForSection)} />
    `:null}function Lr(t){return t.replayState.isPlaying?v`
        <devtools-button .jslogContext=${"abort-replay"} @click=${t.onAbortReplay} .iconName=${"pause"} .variant=${ne.Button.Variant.OUTLINED}>
          ${b(y.cancelReplay)}
        </devtools-button>`:t.recorderSettings?v`${Me(De,{settings:t.recorderSettings,replayExtensions:t.replayExtensions,onStartReplay:t.onTogglePlaying,disabled:t.replayState.isPlaying})}`:I.nothing}function Dr(t){return v`
      <div class="sections">
      ${t.showCodeView?"":v`<div class="section-toolbar">
        <devtools-button
          @click=${t.showCodeToggle}
          class="show-code"
          .data=${{variant:ne.Button.Variant.OUTLINED,title:F.Tooltip.getTooltipForActions(b(y.showCode),ke.RecorderActions.TOGGLE_CODE_VIEW)}}
          jslog=${E.toggleSubpane(ke.RecorderActions.TOGGLE_CODE_VIEW).track({click:!0})}
        >
          ${b(y.showCode)}
        </devtools-button>
      </div>`}
      ${t.sections.map((e,o)=>v`
            <div class="section">
              <div class="screenshot-wrapper">
                ${$r(e)}
              </div>
              <div class="content">
                <div class="steps">
                  ${Me(Ee,{section:e,state:t.getSectionState(e),isStartOfGroup:!0,isEndOfGroup:e.steps.length===0,isFirstSection:o===0,isLastSection:o===t.sections.length-1&&e.steps.length===0,isSelected:t.selectedStep===(e.causingStep||null),sectionIndex:o,isRecording:t.isRecording,isPlaying:t.replayState.isPlaying,error:t.getSectionState(e)==="error"?t.currentError??void 0:void 0,hasBreakpoint:!1,removable:t.recording.steps.length>1&&!!e.causingStep,onStepClick:t.onStepClick,onStepHover:t.onStepHover,onStepChanged:t.onStepChanged,onAddStep:t.onAddStep,onRemoveStep:t.onRemoveStep,onAddBreakpoint:t.onAddBreakpoint,onRemoveBreakpoint:t.onRemoveBreakpoint,onAttributeRequested:t.onAttributeRequested,onCopyStep:t.onCopyStep})}
                  ${e.steps.map(r=>{let i=t.recording.steps.indexOf(r);return v`
                      <devtools-widget
                      ${Me(Ee,{step:r,state:t.getStepState(r),error:t.currentStep===r?t.currentError??void 0:void 0,isFirstSection:!1,isLastSection:o===t.sections.length-1&&t.recording.steps[t.recording.steps.length-1]===r,isStartOfGroup:!1,isEndOfGroup:e.steps[e.steps.length-1]===r,stepIndex:i,hasBreakpoint:t.breakpointIndexes.has(i),sectionIndex:-1,isRecording:t.isRecording,isPlaying:t.replayState.isPlaying,removable:t.recording.steps.length>1,builtInConverters:t.builtInConverters,extensionConverters:t.extensionConverters,isSelected:t.selectedStep===r,recorderSettings:t.recorderSettings??void 0,onStepClick:t.onStepClick,onStepHover:t.onStepHover,onCopyStep:t.onCopyStep,onStepChanged:t.onStepChanged,onAddStep:t.onAddStep,onRemoveStep:t.onRemoveStep,onAddBreakpoint:t.onAddBreakpoint,onRemoveBreakpoint:t.onRemoveBreakpoint,onAttributeRequested:t.onAttributeRequested})}
                      jslog=${E.section("step").track({click:!0})}
                      ></devtools-widget>
                    `})}
                  ${!t.recordingTogglingInProgress&&t.isRecording&&o===t.sections.length-1?v`<devtools-button
                    class="step add-assertion-button"
                    .data=${{variant:ne.Button.Variant.OUTLINED,title:b(y.addAssertion),jslogContext:"add-assertion"}}
                    @click=${t.onAddAssertion}
                  >${b(y.addAssertion)}</devtools-button>`:void 0}
                  ${t.isRecording&&o===t.sections.length-1?v`<div class="step recording">${b(y.recording)}</div>`:null}
                </div>
              </div>
            </div>
      `)}
      </div>
    `}function Or(t){if(!t.recording)return I.nothing;let{title:e}=t.recording,o=!t.replayState.isPlaying&&!t.isRecording;return v`
    <div class="header">
      <div class="header-title-wrapper">
        <div class="header-title">
          <input @blur=${t.onTitleBlur}
                @keydown=${t.onTitleInputKeyDown}
                id="title-input"
                jslog=${E.value("title").track({change:!0})}
                class=${I.Directives.classMap({"has-error":t.isTitleInvalid,disabled:!o})}
                .value=${I.Directives.live(e)}
                .disabled=${!o}
                maxlength="300"
                >
          <div class="title-button-bar">
            <devtools-button
              @click=${t.onEditTitleButtonClick}
              .data=${{disabled:!o,variant:ne.Button.Variant.TOOLBAR,iconName:"edit",title:b(y.editTitle),jslogContext:"edit-title"}}
            ></devtools-button>
          </div>
        </div>
        ${t.isTitleInvalid?v`<div class="title-input-error-text">
          ${b(y.requiredTitleError)}
        </div>`:I.nothing}
      </div>
      ${!t.isRecording&&t.replayAllowed?v`<div class="actions">
              <devtools-button
                @click=${t.onMeasurePerformanceClick}
                .data=${{disabled:t.replayState.isPlaying,variant:ne.Button.Variant.OUTLINED,iconName:"performance",title:b(y.performancePanel),jslogContext:"measure-performance"}}
              >
                ${b(y.performancePanel)}
              </devtools-button>
              <div class="separator"></div>
              ${Lr(t)}
            </div>`:I.nothing}
    </div>`}var Bo=(t,e,o)=>{let r={wrapper:!0,"is-recording":t.isRecording,"is-playing":t.replayState.isPlaying,"was-successful":t.lastReplayResult===F.RecordingPlayer.ReplayResult.SUCCESS,"was-failure":t.lastReplayResult===F.RecordingPlayer.ReplayResult.FAILURE},i=t.recordingTogglingInProgress?b(y.recordingIsBeingStopped):b(y.endRecording);I.render(v`
    <style>${ae.inspectorCommonStyles}</style>
    <style>${go}</style>
    <style>${Uo.textInputStyles}</style>
    <div @click=${t.onWrapperClick} class=${I.Directives.classMap(r)}>
      <div class="recording-view main">
        ${Or(t)}
        ${t.extensionDescriptor?v`
            <devtools-widget class="recorder-extension-view" ${Me(Le,{descriptor:t.extensionDescriptor,onClose:()=>{o.dispatchEvent(new Event("recorderextensionviewclosed",{bubbles:!0,composed:!0}))}})}>
            </devtools-widget>`:v`
          ${Pr(t)}
          ${Ar(t,e)}
        `}
        ${t.isRecording?v`<div class="footer">
          <div class="controls">
            <devtools-widget
              class="control-button"
              ${Me(de,{label:i,shape:"square",disabled:t.recordingTogglingInProgress,onClick:t.onRecordingFinished})}
              jslog=${E.toggle("toggle-recording").track({click:!0})}
              title=${F.Tooltip.getTooltipForActions(i,ke.RecorderActions.START_RECORDING)}
            >
            </devtools-widget>
          </div>
        </div>`:I.nothing}
      </div>
    </div>
  `,o)},Pe=class extends ae.Widget.Widget{replayState={isPlaying:!1,isPausedOnBreakpoint:!1};isRecording=!1;recordingTogglingInProgress=!1;recording={title:"",steps:[]};currentStep;currentError;sections=[];settings;lastReplayResult;replayAllowed=!1;breakpointIndexes=new Set;extensionConverters=[];replayExtensions;extensionDescriptor;onPlayRecording;onNetworkConditionsChanged;onTimeoutChanged;onTitleChanged;onAddAssertion;onRecordingFinished;onAbortReplay;onStepChanged;onAddStep;onRemoveStep;onAddBreakpoint;onRemoveBreakpoint;onAttributeRequested;#t;get recorderSettings(){return this.#t}set recorderSettings(e){this.#t=e,this.#l=this.recorderSettings?.preferredCopyFormat??this.#e[0]?.getId(),this.#T()}#e=[];get builtInConverters(){return this.#e}set builtInConverters(e){this.#e=e,this.#l=this.recorderSettings?.preferredCopyFormat??this.#e[0]?.getId(),this.#T()}#r=!1;#i=null;#o=!1;#s=!1;#n="";#l="";#c;#u;#v=this.#L.bind(this);#a;#m={};constructor(e,o){super(e,{useShadowDom:!0}),this.#a=o||Bo}performUpdate(){this.#a({breakpointIndexes:this.breakpointIndexes,builtInConverters:this.builtInConverters,converterId:this.#l,currentError:this.currentError??null,currentStep:this.currentStep??null,editorState:this.#u??null,extensionConverters:this.extensionConverters,extensionDescriptor:this.extensionDescriptor,isRecording:this.isRecording,isTitleInvalid:this.#r,lastReplayResult:this.lastReplayResult??null,recorderSettings:this.#t??null,recording:this.recording,recordingTogglingInProgress:this.recordingTogglingInProgress,replayAllowed:this.replayAllowed,replayExtensions:this.replayExtensions??[],replaySettingsExpanded:this.#o,replayState:this.replayState,sections:this.sections,selectedStep:this.#i??null,settings:this.settings??null,showCodeView:this.#s,onAddAssertion:()=>{this.onAddAssertion?.()},onRecordingFinished:()=>{this.onRecordingFinished?.()},getSectionState:this.#b.bind(this),getStepState:this.#f.bind(this),onAbortReplay:()=>{this.onAbortReplay?.()},onMeasurePerformanceClick:this.#D.bind(this),onTogglePlaying:(e,o)=>{this.onPlayRecording?.({targetPanel:"chrome-recorder",speed:e,extension:o})},onStepChanged:(e,o)=>this.onStepChanged?.(e,o),onAddStep:(e,o)=>this.onAddStep?.(e,o),onRemoveStep:e=>this.onRemoveStep?.(e),onAddBreakpoint:e=>this.onAddBreakpoint?.(e),onRemoveBreakpoint:e=>this.onRemoveBreakpoint?.(e),onAttributeRequested:e=>this.onAttributeRequested?.(e),onCodeFormatChange:this.#$.bind(this),onCopyStep:this.#y.bind(this),onEditTitleButtonClick:this.#I.bind(this),onNetworkConditionsChange:this.#d.bind(this),onReplaySettingsKeydown:this.#M.bind(this),onStepClick:this.#E.bind(this),onStepHover:this.#w.bind(this),onTimeoutInput:this.#C.bind(this),onTitleBlur:this.#P.bind(this),onTitleInputKeyDown:this.#A.bind(this),onToggleReplaySettings:this.#x.bind(this),onWrapperClick:this.#k.bind(this),showCodeToggle:this.showCodeToggle.bind(this)},this.#m,this.contentElement)}wasShown(){super.wasShown(),document.addEventListener("copy",this.#v),this.performUpdate()}willHide(){super.willHide(),document.removeEventListener("copy",this.#v)}scrollToBottom(){let e=this.contentElement?.querySelector(".sections");e&&(e.scrollTop=e.scrollHeight)}#f(e){if(!this.currentStep)return"default";if(e===this.currentStep)return this.currentError?"error":this.replayState?.isPlaying?this.replayState?.isPausedOnBreakpoint?"stopped":"current":"success";let o=this.recording.steps.indexOf(this.currentStep);return o===-1?"default":this.recording.steps.indexOf(e)<o?"success":"outstanding"}#b(e){let o=this.currentStep;if(!o)return"default";let r=this.sections.find(n=>n.steps.includes(o));if(!r&&this.currentError)return"error";if(e===r)return"success";let i=this.sections.indexOf(r),s=this.sections.indexOf(e);return i>=s?"success":"outstanding"}#w=e=>{let o="type"in e?e:e.causingStep;!o||this.#i||this.#R(o)};#E(e){let o="type"in e?e:e.causingStep||null;this.#i!==o&&(this.#i=o,this.performUpdate(),o&&this.#R(o,!0))}#k(){this.#i&&(this.#i=null,this.performUpdate())}#M(e){e.key==="Enter"&&(e.preventDefault(),this.#x(e))}#x(e){e.stopPropagation(),this.#o=!this.#o,this.performUpdate()}#d(e){let o=e.target;if(o instanceof HTMLSelectElement){let r=Ut.find(i=>i.i18nTitleKey===o.value);this.onNetworkConditionsChanged?.(r?.i18nTitleKey===J.NetworkManager.NoThrottlingConditions.i18nTitleKey?void 0:r)}}#C(e){let o=e.target;if(!o.checkValidity()){o.reportValidity();return}this.onTimeoutChanged?.(Number(o.value))}#P=e=>{let r=e.target.value.trim();if(!r){this.#r=!0,this.performUpdate();return}this.onTitleChanged?.(r)};#A=e=>{switch(e.code){case"Escape":case"Enter":e.target.blur(),e.stopPropagation();break}};#I=()=>{let e=this.contentElement.querySelector("#title-input");if(!e)throw new Error("Missing #title-input");e.focus()};async#p(e){let o=[...this.builtInConverters,...this.extensionConverters].find(i=>i.getId()===this.recorderSettings?.preferredCopyFormat);if(o||(o=this.builtInConverters[0]),!o)throw new Error("No default converter found");let r="";e?r=await o.stringifyStep(e):this.recording&&([r]=await o.stringify(this.recording)),ot.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(r)}#y(e){this.#p(e)}async#L(e){e.target===document.body&&(e.preventDefault(),await this.#p(this.#i),ot.userMetrics.keyboardShortcutFired(ke.RecorderActions.COPY_RECORDING_OR_STEP))}#D(e){e.stopPropagation(),this.onPlayRecording?.({targetPanel:"timeline",speed:F.RecordingPlayer.PlayRecordingSpeed.NORMAL})}showCodeToggle=()=>{this.#s=!this.#s,this.#s?ae.ARIAUtils.LiveAnnouncer.alert(b(y.codeSidebarOpened)):ae.ARIAUtils.LiveAnnouncer.alert(b(y.codeSidebarClosed)),this.#T()};#T=async()=>{if(!this.recording)return;let e=[...this.builtInConverters||[],...this.extensionConverters||[]].find(n=>n.getId()===this.#l)??this.builtInConverters[0];if(!e)return;let[o,r]=await e.stringify(this.recording);this.#n=o,this.#c=r,this.#c?.shift();let i=e.getMediaType(),s=i?await Oo.CodeHighlighter.languageFromMIME(i):null;this.#u=Te.EditorState.create({doc:this.#n,extensions:[rt.Config.baseConfiguration(this.#n),Te.EditorState.readOnly.of(!0),Te.EditorView.lineWrapping,s||[]]}),this.performUpdate(),this.contentElement.dispatchEvent(new Event("code-generated"))};#R=(e,o=!1)=>{if(!this.#c)return;let r=this.recording.steps.indexOf(e);if(r===-1)return;let i=this.#c[r*2],s=this.#c[r*2+1];this.#m.highlightLinesInEditor?.(i,s,o)};#$=e=>{this.#l=e,this.recorderSettings&&(this.recorderSettings.preferredCopyFormat=e),this.#T()}};var{ref:Nr,repeat:Vt}=Ur,zt,S={createRecording:"Create recording",importRecording:"Import recording",recordingImported:"Recording imported",deleteRecording:"Delete recording",recordingDeleted:"Recording deleted",noRecordings:"No recordings",numberOfRecordings:"recording(s)",continueReplay:"Continue",stepOverReplay:"Execute one step",exportRecording:"Export recording",startStopRecording:"Start/stop recording",replayRecording:"Replay recording",copyShortcut:"Copy recording or selected step",toggleCode:"Toggle code view",export:"Export",recordingExported:"Recording exported",exportViaExtensions:"Export via extensions",getExtensions:"Get extensions\u2026",sendFeedback:"Send feedback",header:"Nothing recorded yet",recordingDescription:"Use recordings to create automated end-to-end tests or performance traces",learnMore:"Learn more",doYouTrustThisCode:"Do you trust this recording?",doNotImport:'Don\u2019t import recordings you don\u2019t understand or haven\u2019t reviewed yourself into DevTools. This could allow attackers to steal your identity or take control of your computer. Type "{PH1}" below to allow importing.',allowImporting:"allow importing",typeAllowImporting:'Type "{PH1}"'},Vr=qt.i18n.registerUIStrings("panels/recorder/RecorderPanel.ts",S),R=qt.i18n.getLocalizedString.bind(void 0,Vr),{widget:Ft}=T.Widget,jo="get-extensions-link",zr="https://goo.gle/recorder-extension-list",Fr="https://developer.chrome.com/docs/devtools/recorder",_r="https://goo.gle/recorder-feedback",qo=(i=>(i.START_PAGE="StartPage",i.ALL_RECORDINGS_PAGE="AllRecordingsPage",i.CREATE_RECORDING_PAGE="CreateRecordingPage",i.RECORDING_PAGE="RecordingPage",i))(qo||{});function Gr(t){if(t.steps.length>4096)throw new Error("Recording with steps over 4096 is not allowed");if(t.title.length>300)throw new Error("Recording with title over 300 characters is not allowed")}var Ho=(t,e,o)=>{function r(){switch(t.currentPage){case"StartPage":return s();case"AllRecordingsPage":return i();case"RecordingPage":return n();case"CreateRecordingPage":return l()}}function i(){return ee`
      <devtools-widget
        ${Ft($e,{recordings:t.recordings.map(c=>({storageName:c.storageName,name:c.flow.title})),replayAllowed:t.replayAllowed,onCreateRecording:t.onCreateNewRecording,onDeleteRecording:t.onDeleteRecording,onOpenRecording:t.onRecordingSelected,onPlayRecording:t.onPlayRecordingByName})}
      >
      </devtools-widget>
    `}function s(){return ee`
      <div class="empty-state" jslog=${W.section().context("start-view")}>
        <div class="empty-state-header">${R(S.header)}</div>
        <div class="empty-state-description">
          <span>${R(S.recordingDescription)}</span>
          <devtools-link
            class="devtools-link"
            href=${Fr}
            jslogcontext="learn-more"
          >${R(S.learnMore)}</devtools-link>
        </div>
        <devtools-button .variant=${le.Button.Variant.TONAL} jslogContext=${D.RecorderActions.CREATE_RECORDING} @click=${t.onCreateNewRecording}>${R(S.createRecording)}</devtools-button>
      </div>
    `}function n(){return ee`
      <devtools-widget
          class="recording-view"
          ${Ft(Pe,{recording:t.currentRecording?.flow??{title:"",steps:[]},replayState:t.replayState,isRecording:t.isRecording,recordingTogglingInProgress:t.isToggling,currentStep:t.currentStep,currentError:t.recordingError,sections:t.sections??[],settings:t.settings,recorderSettings:t.recorderSettings,lastReplayResult:t.lastReplayResult,replayAllowed:t.replayAllowed,breakpointIndexes:t.breakpointIndexes,builtInConverters:t.builtInConverters,extensionConverters:t.extensionConverters,replayExtensions:t.replayExtensions,extensionDescriptor:t.extensionDescriptor,onRecordingFinished:t.onRecordingFinished,onAddAssertion:t.handleAddAssertionEvent,onAbortReplay:t.onAbortReplay,onPlayRecording:t.onPlayRecording,onNetworkConditionsChanged:t.onNetworkConditionsChanged,onTimeoutChanged:t.onTimeoutChanged,onTitleChanged:t.handleRecordingTitleChanged,onStepChanged:t.handleRecordingChanged,onAddStep:t.handleStepAdded,onRemoveStep:t.handleStepRemoved,onAddBreakpoint:t.onAddBreakpoint,onRemoveBreakpoint:t.onRemoveBreakpoint,onAttributeRequested:c=>{c(t.currentRecording?.flow.selectorAttribute)}})}
          @recorderextensionviewclosed=${t.onExtensionViewClosed}
          ${T.Widget.widgetRef(Pe,c=>{e.recordingView=c})}
        ></devtools-widget>
    `}function l(){return ee`
      <devtools-widget
        class="recording-view"
        ${Ft(he,{recorderSettings:t.recorderSettings,onRecordingStarted:t.onRecordingStarted,onRecordingCancelled:t.onRecordingCancelled})}
        ${T.Widget.widgetRef(he,c=>{e.createRecordingView=c})}
      ></devtools-widget>
    `}let d=t.currentRecording?t.currentRecording.storageName:t.currentPage,u=[t.recordings.length===0?{value:"StartPage",name:R(S.noRecordings),selected:d==="StartPage"}:{value:"AllRecordingsPage",name:`${t.recordings.length} ${R(S.numberOfRecordings)}`,selected:d==="AllRecordingsPage"},...t.recordings.map(c=>({value:c.storageName,name:c.flow.title,selected:d===c.storageName}))];Br(ee`
        <style>${T.inspectorCommonStyles}</style>
        <style>${eo}</style>
        <div class="wrapper">
          <div class="header" jslog=${W.toolbar()}>
            <devtools-button
              @click=${t.onCreateNewRecording}
              .data=${{variant:le.Button.Variant.TOOLBAR,iconName:"plus",disabled:t.replayState.isPlaying||t.isRecording||t.isToggling,title:h.Tooltip.getTooltipForActions(R(S.createRecording),D.RecorderActions.CREATE_RECORDING),jslogContext:D.RecorderActions.CREATE_RECORDING}}
            ></devtools-button>
            <div class="separator"></div>
            <select
              .disabled=${t.recordings.length===0||t.replayState.isPlaying||t.isRecording||t.isToggling}
              @click=${c=>c.stopPropagation()}
              @change=${t.onRecordingSelected}
              jslog=${W.dropDown("recordings").track({change:!0})}
            >
              ${Vt(u,c=>c.value,c=>ee`<option .selected=${c.selected} value=${c.value}>${c.name}</option>`)}
            </select>
            <div class="separator"></div>
            <devtools-button
              @click=${t.onImportRecording}
              .data=${{variant:le.Button.Variant.TOOLBAR,iconName:"import",title:R(S.importRecording),jslogContext:"import-recording"}}
            ></devtools-button>
            <devtools-button
              id='origin'
              @click=${t.onExportRecording}
              ${Nr(c=>{c instanceof HTMLElement&&(e.exportMenuButton=c)})}
              .data=${{variant:le.Button.Variant.TOOLBAR,iconName:"download",title:R(S.exportRecording),disabled:!t.currentRecording}}
              jslog=${W.dropDown("export-recording").track({click:!0})}
            ></devtools-button>
            <devtools-menu
              @menucloserequest=${t.onExportMenuClosed}
              @menuitemselected=${t.onExportOptionSelected}
              .origin=${t.getExportMenuButton}
              .showDivider=${!1}
              .showSelectedItem=${!1}
              .open=${t.exportMenuExpanded}
            >
              <devtools-menu-group .name=${R(S.export)}>
                ${Vt(t.builtInConverters,c=>ee`
                    <devtools-menu-item
                      .value=${c.getId()}
                      jslog=${W.item(`converter-${Vo.StringUtilities.toKebabCase(c.getId())}`).track({click:!0})}>
                      ${c.getFormatName()}
                    </devtools-menu-item>
                  `)}
              </devtools-menu-group>
              <devtools-menu-group .name=${R(S.exportViaExtensions)}>
                ${Vt(t.extensionConverters,c=>ee`
                    <devtools-menu-item
                     .value=${c.getId()}
                      jslog=${W.item("converter-extension").track({click:!0})}>
                    ${c.getFormatName()}
                    </devtools-menu-item>
                  `)}
                <devtools-menu-item .value=${jo}>
                  ${R(S.getExtensions)}
                </devtools-menu-item>
              </devtools-menu-group>
            </devtools-menu>
            <devtools-button
              @click=${t.onDeleteRecording}
              .data=${{variant:le.Button.Variant.TOOLBAR,iconName:"bin",disabled:!t.currentRecording||t.replayState.isPlaying||t.isRecording||t.isToggling,title:R(S.deleteRecording),jslogContext:"delete-recording"}}
            ></devtools-button>
            <div class="separator"></div>
            <devtools-button
              @click=${t.onContinueReplay}
              .data=${{variant:le.Button.Variant.PRIMARY_TOOLBAR,iconName:"resume",disabled:!t.replayState.isPausedOnBreakpoint,title:R(S.continueReplay),jslogContext:"continue-replay"}}
            ></devtools-button>
            <devtools-button
              @click=${t.onStepOverReplay}
              .data=${{variant:le.Button.Variant.TOOLBAR,iconName:"step-over",disabled:!t.replayState.isPausedOnBreakpoint,title:R(S.stepOverReplay),jslogContext:"step-over"}}
            ></devtools-button>
            <div class="feedback">
              <devtools-link class="devtools-link" title=${R(S.sendFeedback)} href=${_r} jslogcontext="feedback">${R(S.sendFeedback)}</devtools-link>
            </div>
            <div class="separator"></div>
            <devtools-shortcut-dialog
              .data=${{shortcuts:t.shortcutsInfo}} jslog=${W.action("show-shortcuts").track({click:!0})}
            ></devtools-shortcut-dialog>
          </div>
          ${t.importError?ee`<div class='error'>Import error: ${t.importError.message}</div>`:""}
          ${r()}
        </div>
    `,o,{container:{listeners:{setrecording:t.onSetRecording}}})},Fe=class t extends T.Widget.VBox{static panelName="chrome-recorder";static instance(e={}){let{forceNew:o}=e;return(!zt||o)&&(zt=new t),zt}#t;get currentRecordingSession(){return this.#t}set currentRecordingSession(e){this.#t!==e&&(this.#t=e,this.requestUpdate())}#e;get currentRecording(){return this.#e}set currentRecording(e){this.#e!==e&&(this.#e=e,this.requestUpdate())}#r;get currentStep(){return this.#r}set currentStep(e){this.#r!==e&&(this.#r=e,this.requestUpdate())}#i;get recordingError(){return this.#i}set recordingError(e){this.#i!==e&&(this.#i=e,this.requestUpdate())}#o=h.RecordingStorage.RecordingStorage.instance();#s=h.ScreenshotStorage.ScreenshotStorage.instance();#n=!1;get isRecording(){return this.#n}set isRecording(e){this.#n!==e&&(this.#n=e,this.requestUpdate())}#l=!1;get isToggling(){return this.#l}set isToggling(e){this.#l!==e&&(this.#l=e,this.requestUpdate())}#c=!0;#u;get recordingPlayer(){return this.#u}set recordingPlayer(e){this.#u!==e&&(this.#u=e,this.requestUpdate())}#v;get lastReplayResult(){return this.#v}set lastReplayResult(e){this.#v!==e&&(this.#v=e,this.requestUpdate())}#a={isPlaying:!1,isPausedOnBreakpoint:!1};#m="StartPage";get currentPage(){return this.#m}set currentPage(e){this.#m!==e&&(this.#m=e,this.requestUpdate())}#f;get previousPage(){return this.#f}set previousPage(e){this.#f!==e&&(this.#f=e,this.requestUpdate())}#b;#w;get sections(){return this.#w}set sections(e){this.#w!==e&&(this.#w=e,this.requestUpdate())}#E;get settings(){return this.#E}set settings(e){this.#E!==e&&(this.#E=e,this.requestUpdate())}#k;get importError(){return this.#k}set importError(e){this.#k!==e&&(this.#k=e,this.requestUpdate())}#M=!1;get exportMenuExpanded(){return this.#M}set exportMenuExpanded(e){this.#M!==e&&(this.#M=e,this.requestUpdate())}#x;#d=new Set;#C;#P=[];get extensionConverters(){return this.#P}set extensionConverters(e){this.#P!==e&&(this.#P=e,this.requestUpdate())}#A=[];get replayExtensions(){return this.#A}set replayExtensions(e){this.#A!==e&&(this.#A=e,this.requestUpdate())}#I;get viewDescriptor(){return this.#I}set viewDescriptor(e){this.#I!==e&&(this.#I=e,this.requestUpdate())}#p;#y=new h.RecorderSettings.RecorderSettings;#L=new h.RecorderShortcutHelper.RecorderShortcutHelper;#D=Q.Settings.Settings.instance().createSetting("disable-recorder-import-warning",!1,Q.Settings.SettingStorageType.SYNCED);#T=Q.Settings.Settings.instance().createSetting("disable-self-xss-warning",!1,Q.Settings.SettingStorageType.SYNCED);#R;#$;#N;constructor(e,o){let r=e||document.createElement("devtools-recorder-panel");super(r,{useShadowDom:"pure"}),this.#N=o||Ho,this.setHideOnDetach(),this.isRecording=!1,this.isToggling=!1,this.exportMenuExpanded=!1,this.currentPage="StartPage",this.#o.getRecordings().length&&this.#h("AllRecordingsPage");let i=Q.Settings.Settings.instance().moduleSetting("text-editor-indent").get();this.#C=Object.freeze([new G.JSONConverter.JSONConverter(i),new G.PuppeteerReplayConverter.PuppeteerReplayConverter(i),new G.PuppeteerConverter.PuppeteerConverter(i),new G.PuppeteerFirefoxConverter.PuppeteerFirefoxConverter(i),new G.LighthouseConverter.LighthouseConverter(i)]);let s=Gt.ExtensionManager.ExtensionManager.instance();this.#V(s.extensions()),s.addEventListener(Gt.ExtensionManager.Events.EXTENSIONS_UPDATED,n=>{this.#V(n.data)})}wasShown(){super.wasShown(),T.Context.Context.instance().setFlavor(t,this),this.requestUpdate(),this.updateComplete.then(()=>{this.focus()})}willHide(){super.willHide(),T.Context.Context.instance().setFlavor(t,null)}onDetach(){super.onDetach(),this.currentRecordingSession&&this.currentRecordingSession.stop(),this.#p&&(te.RecorderPluginManager.RecorderPluginManager.instance().removeEventListener(te.RecorderPluginManager.Events.SHOW_VIEW_REQUESTED,this.#p),this.#p=void 0)}#V(e){this.extensionConverters=e.filter(o=>o.getCapabilities().includes("export")).map((o,r)=>new G.ExtensionConverter.ExtensionConverter(r,o)),this.replayExtensions=e.filter(o=>o.getCapabilities().includes("replay"))}setIsRecordingStateForTesting(e){this.isRecording=e}setRecordingStateForTesting(e){this.#a.isPlaying=e.isPlaying,this.#a.isPausedOnBreakpoint=e.isPausedOnBreakpoint}setCurrentPageForTesting(e){this.#h(e)}getCurrentPageForTesting(){return this.currentPage}getCurrentRecordingForTesting(){return this.currentRecording}getStepBreakpointIndexesForTesting(){return[...this.#d.values()]}#S(){this.importError=void 0}async#H(e){let o=new Q.StringOutputStream.StringOutputStream,r=new zo.FileUtils.ChunkedFileReader(e,1e7);if(!await r.read(o))throw r.error()??new Error("Unknown");let s;try{s=h.SchemaUtils.parse(JSON.parse(o.data())),Gr(s)}catch(n){this.importError=n;return}this.#g(await this.#o.upsertRecording(s)),this.#h("RecordingPage"),this.#S(),T.ARIAUtils.LiveAnnouncer.alert(R(S.recordingImported))}setCurrentRecordingForTesting(e){this.#g(e)}getSectionsForTesting(){return this.sections}#g(e,o={}){let{keepBreakpoints:r=!1,updateSession:i=!1}=o;this.recordingPlayer?.abort(),this.currentStep=void 0,this.recordingError=void 0,this.lastReplayResult=void 0,this.recordingPlayer=void 0,this.#a.isPlaying=!1,this.#a.isPausedOnBreakpoint=!1,this.#d=r?this.#d:new Set,e?(this.currentRecording=e,this.sections=h.Section.buildSections(e.flow.steps),this.settings=this.#W(e.flow),i&&this.currentRecordingSession&&this.currentRecordingSession.overwriteUserFlow(e.flow)):(this.currentRecording=void 0,this.sections=void 0,this.settings=void 0),this.#z()}#h(e){e!==this.currentPage&&(this.previousPage=this.currentPage,this.currentPage=e)}#W(e){let o=e.steps,r=o.findIndex(s=>s.type==="navigate"),i={timeout:e.timeout};for(let s=r-1;s>=0;s--){let n=o[s];if(!i.viewportSettings&&n.type==="setViewport"&&(i.viewportSettings=n),!i.networkConditionsSettings&&n.type==="emulateNetworkConditions"){i.networkConditionsSettings={...n};for(let l of[_.NetworkManager.OfflineConditions,_.NetworkManager.Slow3GConditions,_.NetworkManager.Slow4GConditions,_.NetworkManager.Fast4GConditions])_.NetworkManager.networkConditionsEqual({...l,title:l.i18nTitleKey||""},{...n,title:l.i18nTitleKey||"",key:`step_${s}_recorder_key`})&&(i.networkConditionsSettings.title=l.title instanceof Function?l.title():l.title,i.networkConditionsSettings.i18nTitleKey=l.i18nTitleKey)}}return i}#O(){let e=_.TargetManager.TargetManager.instance().primaryPageTarget();if(!e)throw new Error("Missing main page target");return e}#K(e){if(!this.sections)return null;for(let o of this.sections)if(o.steps.indexOf(e)!==-1)return o;return null}#z(){if(!this.sections||!this.currentRecording)return;let e=this.currentRecording.storageName;for(let o=0;o<this.sections.length;o++){let r=this.#s.getScreenshotForSection(e,o);this.sections[o].screenshot=r||void 0}this.requestUpdate()}#Y(){this.recordingPlayer?.abort()}async#X(e){if(!this.currentRecording||!this.#c)return;let o=te.RecorderPluginManager.RecorderPluginManager.instance();this.#p&&(o.removeEventListener(te.RecorderPluginManager.Events.SHOW_VIEW_REQUESTED,this.#p),this.#p=void 0);let r,i=new Promise(n=>{r=n});this.#p=n=>{let l=n.data;l.extensionOrigin===e.getOrigin()&&(this.#p&&(o.removeEventListener(te.RecorderPluginManager.Events.SHOW_VIEW_REQUESTED,this.#p),this.#p=void 0),r(l))},o.addEventListener(te.RecorderPluginManager.Events.SHOW_VIEW_REQUESTED,this.#p),e.replay(this.currentRecording.flow);let s=await i;this.viewDescriptor=s,C.userMetrics.recordingReplayStarted(C.UserMetrics.RecordingReplayStarted.REPLAY_VIA_EXTENSION)}async#U(e){if(!this.currentRecording||!this.#c)return;if(this.viewDescriptor&&(this.viewDescriptor=void 0),this.#p&&(te.RecorderPluginManager.RecorderPluginManager.instance().removeEventListener(te.RecorderPluginManager.Events.SHOW_VIEW_REQUESTED,this.#p),this.#p=void 0),e.extension)return await this.#X(e.extension);C.userMetrics.recordingReplayStarted(e.targetPanel!=="chrome-recorder"?C.UserMetrics.RecordingReplayStarted.REPLAY_WITH_PERFORMANCE_TRACING:C.UserMetrics.RecordingReplayStarted.REPLAY_ONLY),this.#a.isPlaying=!0,this.currentStep=void 0,this.recordingError=void 0,this.lastReplayResult=void 0;let o=this.currentRecording;this.#S(),await this.#F(),this.recordingPlayer=new h.RecordingPlayer.RecordingPlayer(this.currentRecording.flow,{speed:e.speed,breakpointIndexes:this.#d});let r=e.targetPanel==="timeline",i=new Set;this.recordingPlayer.addEventListener(h.RecordingPlayer.Events.STEP,async({data:{step:d,resolve:u}})=>{this.currentStep=d;let c=this.#K(d);if(this.sections&&c&&!i.has(c)){i.add(c);let x=this.sections.indexOf(c),p=await h.ScreenshotUtils.takeScreenshot();c.screenshot=p,h.ScreenshotStorage.ScreenshotStorage.instance().storeScreenshotForSection(o.storageName,x,p)}u()}),this.recordingPlayer.addEventListener(h.RecordingPlayer.Events.STOP,()=>{this.#a.isPausedOnBreakpoint=!0,this.requestUpdate()}),this.recordingPlayer.addEventListener(h.RecordingPlayer.Events.CONTINUE,()=>{this.#a.isPausedOnBreakpoint=!1,this.requestUpdate()}),this.recordingPlayer.addEventListener(h.RecordingPlayer.Events.ERROR,({data:d})=>{this.recordingError=d,r||(this.#a.isPlaying=!1,this.recordingPlayer=void 0),this.lastReplayResult=h.RecordingPlayer.ReplayResult.FAILURE;let u=d.message.toLowerCase();u.startsWith("could not find element")?C.userMetrics.recordingReplayFinished(C.UserMetrics.RecordingReplayFinished.TIMEOUT_ERROR_SELECTORS):u.startsWith("waiting for target failed")?C.userMetrics.recordingReplayFinished(C.UserMetrics.RecordingReplayFinished.TIMEOUT_ERROR_TARGET):C.userMetrics.recordingReplayFinished(C.UserMetrics.RecordingReplayFinished.OTHER_ERROR),this.element.dispatchEvent(new ve)}),this.recordingPlayer.addEventListener(h.RecordingPlayer.Events.DONE,()=>{r||(this.#a.isPlaying=!1,this.recordingPlayer=void 0),this.lastReplayResult=h.RecordingPlayer.ReplayResult.SUCCESS,this.element.dispatchEvent(new ve),C.userMetrics.recordingReplayFinished(C.UserMetrics.RecordingReplayFinished.SUCCESS)}),this.recordingPlayer.addEventListener(h.RecordingPlayer.Events.ABORT,()=>{this.currentStep=void 0,this.recordingError=void 0,this.lastReplayResult=void 0,this.#a.isPlaying=!1});let s=d=>{},n=new Promise(d=>{s=d}),l=null;if(e.targetPanel==="timeline"&&(l=new _o.PerformanceTracing.PerformanceTracing(this.#O(),{tracingBufferUsage(){},eventsRetrievalProgress(){},tracingComplete(d){s(d)}})),l&&await l.start(),this.#_(!1),await this.recordingPlayer.play(),this.#_(!0),l){await l.stop();let d=await n;if(this.#a.isPlaying=!1,this.recordingPlayer=void 0,await T.InspectorView.InspectorView.instance().showPanel(e.targetPanel),e.targetPanel==="timeline"){let u=new _.TraceObject.TraceObject(d);Q.Revealer.reveal(u)}}}async#F(){try{let e=Fo.DeviceModeModel.DeviceModeModel.instance();e.isDeviceModeOn()&&(e.toggleDeviceMode(),await this.#O().model(_.EmulationModel.EmulationModel)?.emulateDevice(null))}catch{}}#_(e){this.#O().model(_.EmulationModel.EmulationModel)?.setTouchEmulationAllowed(e)}async#J(e){let o=JSON.parse(e.detail);this.#g(await this.#o.upsertRecording(h.SchemaUtils.parse(o))),this.#h("RecordingPage"),this.#S(),this.element.dispatchEvent(new Ie)}getUserFlow(){return this.currentRecording?.flow}async#Q(e,o){if(!this.currentRecording)throw new Error("Current recording expected to be defined.");let r={...this.currentRecording,flow:{...this.currentRecording.flow,steps:this.currentRecording.flow.steps.map(i=>i===e?o:i)}};this.#g(await this.#o.upsertRecording(r.flow,r.storageName),{keepBreakpoints:!0,updateSession:!0})}async#Z(e,o){if(!this.currentRecording)throw new Error("Current recording expected to be defined.");let r,i=o;if("steps"in e){let u=this.sections?.indexOf(e);if(u===void 0||u===-1)throw new Error("There is no section to add a step to");if(o==="after")this.sections?.[u].steps.length?(r=this.sections?.[u].steps[0],i="before"):(r=this.sections?.[u].causingStep,i="after");else{if(u<=0)throw new Error("There is no section to add a step to");let c=this.sections?.[u-1];r=c?.steps[c.steps.length-1],i="after"}}else r=e;if(!r)throw new Error("Anchor step is not found when adding a step");let s=this.currentRecording.flow.steps,l=s.indexOf(r)+(i==="before"?0:1);s.splice(l,0,{type:h.Schema.StepType.WaitForElement,selectors:["body"]});let d={...this.currentRecording,flow:{...this.currentRecording.flow,steps:s}};this.#d=new Set([...this.#d.values()].map(u=>l>u?u:u+1)),this.#g(await this.#o.upsertRecording(d.flow,d.storageName),{keepBreakpoints:!0,updateSession:!0})}async#ee(e){if(!this.currentRecording)throw new Error("Current recording expected to be defined.");let o={...this.currentRecording.flow,title:e};this.#g(await this.#o.upsertRecording(o,this.currentRecording.storageName))}async#te(e){if(!this.currentRecording)throw new Error("Current recording expected to be defined.");let o=this.currentRecording.flow.steps,r=o.indexOf(e);o.splice(r,1);let i={...this.currentRecording.flow,steps:o};this.#d=new Set([...this.#d.values()].map(s=>r>s?s:r===s?-1:s-1).filter(s=>s>=0)),this.#g(await this.#o.upsertRecording(i,this.currentRecording.storageName),{keepBreakpoints:!0,updateSession:!0})}async#oe(e){if(!this.currentRecording)throw new Error("Current recording expected to be defined.");let o=this.currentRecording.flow.steps.findIndex(i=>i.type==="navigate");if(o===-1)throw new Error("Current recording does not have a navigate step");let r=this.currentRecording.flow.steps.findIndex((i,s)=>s>=o?!1:i.type==="emulateNetworkConditions");if(!e)r!==-1&&this.currentRecording.flow.steps.splice(r,1);else if(r===-1)this.currentRecording.flow.steps.splice(0,0,h.SchemaUtils.createEmulateNetworkConditionsStep({download:e.download,upload:e.upload,latency:e.latency}));else{let i=this.currentRecording.flow.steps[r];i.download=e.download,i.upload=e.upload,i.latency=e.latency}this.#g(await this.#o.upsertRecording(this.currentRecording.flow,this.currentRecording.storageName))}async#re(e){if(!this.currentRecording)throw new Error("Current recording expected to be defined.");this.currentRecording.flow.timeout=e,this.#g(await this.#o.upsertRecording(this.currentRecording.flow,this.currentRecording.storageName))}async#ie(e){let o;if(typeof e=="string")o=e;else{if(e.stopPropagation(),!this.currentRecording)return;o=this.currentRecording.storageName}await this.#o.deleteRecording(o),this.#s.deleteScreenshotsForRecording(o),this.requestUpdate(),T.ARIAUtils.LiveAnnouncer.alert(R(S.recordingDeleted)),(await this.#o.getRecordings()).length?this.#h("AllRecordingsPage"):this.#h("StartPage"),this.#g(void 0),this.#S()}#G(e){e?.stopPropagation(),this.#h("CreateRecordingPage"),this.#S()}async#j(e){await this.#F(),this.isToggling=!0,this.#S(),C.userMetrics.recordingToggled(C.UserMetrics.RecordingToggled.RECORDING_STARTED),this.currentRecordingSession=new h.RecordingSession.RecordingSession(this.#O(),{title:e.name,selectorAttribute:e.selectorAttribute,selectorTypesToRecord:e.selectorTypesToRecord.length?e.selectorTypesToRecord:Object.values(h.Schema.SelectorType)}),this.#g(await this.#o.upsertRecording(this.currentRecordingSession.cloneUserFlow()));let o=-1,r,i=async s=>{if(!this.sections)throw new Error("Could not find sections.");let n=this.sections.length-1,l=this.sections[n];if(r||o===n)return;r=h.ScreenshotUtils.takeScreenshot();let d=await r;r=void 0,l.screenshot=d,h.ScreenshotStorage.ScreenshotStorage.instance().storeScreenshotForSection(s.storageName,n,d),o=n,this.#z()};this.currentRecordingSession.addEventListener(h.RecordingSession.Events.RECORDING_UPDATED,async({data:s})=>{if(!this.currentRecording)throw new Error("No current recording found");this.#g(await this.#o.upsertRecording(s,this.currentRecording.storageName)),this.#R?.scrollToBottom(),await i(this.currentRecording)}),this.currentRecordingSession.addEventListener(h.RecordingSession.Events.RECORDING_STOPPED,async({data:s})=>{if(!this.currentRecording)throw new Error("No current recording found");C.userMetrics.keyboardShortcutFired(D.RecorderActions.START_RECORDING),this.#g(await this.#o.upsertRecording(s,this.currentRecording.storageName)),await this.#B()}),await this.currentRecordingSession.start(),this.isToggling=!1,this.isRecording=!0,this.#h("RecordingPage"),this.element.dispatchEvent(new me(this.currentRecording.flow))}async#B(){if(!this.currentRecording||!this.currentRecordingSession)throw new Error("Recording was never started");this.isToggling=!0,this.#S(),C.userMetrics.recordingToggled(C.UserMetrics.RecordingToggled.RECORDING_FINISHED),await this.currentRecordingSession.stop(),this.currentRecordingSession=void 0,this.isToggling=!1,this.isRecording=!1,this.element.dispatchEvent(new me(this.currentRecording.flow))}async onRecordingCancelled(){this.previousPage&&this.#h(this.previousPage)}async#q(e){let o;typeof e=="string"?o=e:o=e.target?.value,this.#g(await this.#o.getRecording(o)),this.currentRecording?this.#h("RecordingPage"):o==="StartPage"?this.#h("StartPage"):o==="AllRecordingsPage"&&this.#h("AllRecordingsPage")}async#se(e){if(typeof e.itemValue!="string")throw new Error("Invalid export option value");if(e.itemValue===jo){C.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(zr);return}if(!this.currentRecording)throw new Error("No recording selected");let o=e.itemValue,r=l=>l.getId()===o,i=this.#C.some(r),s=this.#C.find(r)||this.extensionConverters.find(r);if(!s)throw new Error("No recording selected");let[n]=await s.stringify(this.currentRecording.flow);if(await this.#ne(s.getFilename(this.currentRecording.flow),n),i)T.ARIAUtils.LiveAnnouncer.alert(R(S.recordingExported));else if(s.getId().startsWith(G.ExtensionConverter.EXTENSION_PREFIX))T.ARIAUtils.LiveAnnouncer.alert(R(S.recordingExported));else throw new Error("Could not find a metric for the export option with id = "+o)}async#ne(e,o){try{let i=await(await window.showSaveFilePicker({suggestedName:e})).createWritable();await i.write(o),await i.close()}catch(r){if(r.name==="AbortError")return;throw r}}async#ae(){if(!this.currentRecordingSession||!this.currentRecording)return;let e=this.currentRecordingSession.cloneUserFlow();e.steps.push({type:"waitForElement",selectors:[[".cls"]]}),this.#g(await this.#o.upsertRecording(e,this.currentRecording.storageName),{keepBreakpoints:!0,updateSession:!0}),await this.updateComplete,await this.#R?.updateComplete,this.#R?.contentElement?.querySelector(".section:last-child .step-view-widget:last-of-type")?.shadowRoot?.querySelector(".action")?.click()}async#le(){if(this.#D.get()||_t.Runtime.Runtime.queryParam("isChromeForTesting")||_t.Runtime.Runtime.queryParam("disableSelfXssWarnings")||this.#T.get())return!0;let e=await Go.TypeToAllowDialog.TypeToAllowDialog.show({jslogContext:{input:"confirm-import-recording-input",dialog:"confirm-import-recording-dialog"},message:R(S.doNotImport,{PH1:R(S.allowImporting)}),header:R(S.doYouTrustThisCode),typePhrase:R(S.allowImporting),inputPlaceholder:R(S.typeAllowImporting,{PH1:R(S.allowImporting)})});return e&&this.#D.set(!0),e}async#de(e){e.stopPropagation(),this.#S(),await this.#le()&&(this.#b=T.UIUtils.createFileSelectorElement(this.#H.bind(this)),this.#b.click())}async#ce(e){await this.#q(e),await this.#U({targetPanel:"chrome-recorder",speed:this.#y.speed})}#pe=e=>{this.#d=structuredClone(this.#d),this.#d.add(e),this.recordingPlayer?.updateBreakpointIndexes(this.#d),this.requestUpdate()};#ge=e=>{this.#d=structuredClone(this.#d),this.#d.delete(e),this.recordingPlayer?.updateBreakpointIndexes(this.#d),this.requestUpdate()};#ue(){this.viewDescriptor=void 0}handleActions(e){if(this.isActionPossible(e))switch(e){case D.RecorderActions.CREATE_RECORDING:this.#G();return;case D.RecorderActions.START_RECORDING:this.currentPage!=="CreateRecordingPage"&&!this.isRecording?this.#L.handleShortcut(this.#j.bind(this,{name:this.#y.defaultTitle,selectorTypesToRecord:this.#y.defaultSelectors,selectorAttribute:this.#y.selectorAttribute?this.#y.selectorAttribute:void 0})):this.currentPage==="CreateRecordingPage"?this.#$&&this.#L.handleShortcut(()=>{this.#$?.startRecording()}):this.isRecording&&this.#B();return;case D.RecorderActions.REPLAY_RECORDING:this.#U({targetPanel:"chrome-recorder",speed:this.#y.speed});return;case D.RecorderActions.TOGGLE_CODE_VIEW:{this.#R?.showCodeToggle();return}}}isActionPossible(e){switch(e){case D.RecorderActions.CREATE_RECORDING:return!this.isRecording&&!this.#a.isPlaying;case D.RecorderActions.START_RECORDING:return!this.#a.isPlaying;case D.RecorderActions.REPLAY_RECORDING:return this.currentPage==="RecordingPage"&&!this.#a.isPlaying;case D.RecorderActions.TOGGLE_CODE_VIEW:return this.currentPage==="RecordingPage";case D.RecorderActions.COPY_RECORDING_OR_STEP:return!1}}#he(){let e=o=>T.ShortcutRegistry.ShortcutRegistry.instance().shortcutsForAction(o).map(s=>s.title().split(/[\s+]+/).map(n=>({key:n.trim()})));return[{title:R(S.startStopRecording),rows:e(D.RecorderActions.START_RECORDING)},{title:R(S.replayRecording),rows:e(D.RecorderActions.REPLAY_RECORDING)},{title:R(S.copyShortcut),rows:C.Platform.isMac()?[[{key:"\u2318"},{key:"C"}]]:[[{key:"Ctrl"},{key:"C"}]]},{title:R(S.toggleCode),rows:e(D.RecorderActions.TOGGLE_CODE_VIEW)}]}#ve=()=>{if(!this.#x)throw new Error("#exportMenuButton not found");return this.#x};#me(e){e.stopPropagation(),this.#S(),this.exportMenuExpanded=!this.exportMenuExpanded}#fe(){this.exportMenuExpanded=!1}performUpdate(){let e=this.#o.getRecordings(),o=this,r={set exportMenuButton(i){o.#x=i},set recordingView(i){o.#R=i},set createRecordingView(i){o.#$=i}};this.#N({recordings:e,currentRecording:this.currentRecording,currentPage:this.currentPage,isRecording:this.isRecording,isToggling:this.isToggling,importError:this.importError,recordingError:this.recordingError,sections:this.sections??[],settings:this.settings,recorderSettings:this.#y,lastReplayResult:this.lastReplayResult,replayAllowed:this.#c,breakpointIndexes:this.#d,builtInConverters:this.#C,extensionConverters:this.extensionConverters,replayExtensions:this.replayExtensions,extensionDescriptor:this.viewDescriptor,exportMenuExpanded:this.exportMenuExpanded,replayState:this.#a,shortcutsInfo:this.#he(),currentStep:this.currentStep,onCreateNewRecording:this.#G.bind(this),onImportRecording:this.#de.bind(this),onExportRecording:this.#me.bind(this),onDeleteRecording:this.#ie.bind(this),onRecordingSelected:this.#q.bind(this),onPlayRecordingByName:this.#ce.bind(this),onPlayRecording:this.#U.bind(this),onAbortReplay:this.#Y.bind(this),onNetworkConditionsChanged:this.#oe.bind(this),onTimeoutChanged:this.#re.bind(this),handleRecordingTitleChanged:this.#ee.bind(this),handleRecordingChanged:this.#Q.bind(this),handleStepAdded:this.#Z.bind(this),handleStepRemoved:this.#te.bind(this),onAddBreakpoint:this.#pe.bind(this),onRemoveBreakpoint:this.#ge.bind(this),onExtensionViewClosed:this.#ue.bind(this),onExportMenuClosed:this.#fe.bind(this),onExportOptionSelected:this.#se.bind(this),onRecordingFinished:this.#B.bind(this),handleAddAssertionEvent:this.#ae.bind(this),onSetRecording:this.#J.bind(this),onContinueReplay:()=>this.recordingPlayer?.continue(),onStepOverReplay:()=>this.recordingPlayer?.stepOver(),getExportMenuButton:this.#ve.bind(this),onRecordingStarted:this.#j.bind(this),onRecordingCancelled:this.onRecordingCancelled.bind(this)},r,this.contentElement)}},jt=class{handleAction(e,o){return(async()=>{await T.ViewManager.ViewManager.instance().showView(Fe.panelName);let r=T.ViewManager.ViewManager.instance().view(Fe.panelName);r&&(await r.widget()).handleActions(o)})(),!0}};export{Xt as ControlButton,Zt as CreateRecordingView,pt as RecorderEvents,Wo as RecorderPanel,ao as RecordingListView,No as RecordingView,yo as ReplaySection,xo as SelectorPicker,ko as StepEditor,Do as StepView,$o as TimelineSection};
//# sourceMappingURL=recorder.js.map
