/* eslint-disable */
// DesignSystem: desktop layout, 1440×1640. Ported from the "DesignSystem.dc.html" design board.
import React from 'react';
import { gsap } from 'gsap';
import './DesignSystem.css';

export default class DesignSystem extends React.Component {
  static defaultProps = {};

  renderVals() {
    return {};
  }

  render() {
    const v = this.renderVals();
    return (
      <div className="dc-DesignSystem">
      <div className="ds" style={{"width":"1440px","height":"1640px","boxSizing":"border-box","padding":"72px 80px","background":"#102D23","display":"flex","flexDirection":"column","gap":"52px"}}>
        <header style={{"display":"flex","justifyContent":"space-between","alignItems":"flex-end","gap":"40px"}}>
          <div>
            <p className="eyebrow">
              Design system · v0.1
            </p>
            <h1 className="display" style={{"margin":"8px 0 0","fontSize":"68px","lineHeight":"1","fontWeight":"600"}}>
              Dylan's Storybook Forest
            </h1>
            <p style={{"margin":"14px 0 0","maxWidth":"720px","fontSize":"17px","lineHeight":"1.55","color":"#A6C79C"}}>
              A hand-painted, misty, firefly-lit storybook. Every chapter is an illustrated place Dylan explores; the forest opens the story and closes it. Built mobile-portrait first, in layers: background, atmosphere, midground, character, foreground, then accessible HTML on top.
            </p>
          </div>
          <p className="script" style={{"margin":"0","fontSize":"54px","color":"#F4DD82","whiteSpace":"nowrap"}}>
            little explorer
          </p>
        </header>
        <div className="rule" />
        <section style={{"display":"flex","flexDirection":"column","gap":"20px"}}>
          <div>
            <p className="eyebrow">
              01 · Core palette
            </p>
            <h2 className="h2">
              Forest at night, lit by lanterns
            </h2>
          </div>
          <div style={{"display":"grid","gridTemplateColumns":"repeat(6, minmax(0, 1fr))","gap":"14px"}}>
            <div style={{"height":"128px","borderRadius":"14px","padding":"14px","boxSizing":"border-box","display":"flex","flexDirection":"column","justifyContent":"space-between","background":"#071B15","boxShadow":"inset 0 0 0 1px rgba(166,199,156,.25)"}}>
              <span style={{"fontWeight":"700","fontSize":"14px"}}>
                Forest Black
              </span>
              <span className="mono" style={{"color":"#A6C79C"}}>
                #071B15 · deepest ground, vignette
              </span>
            </div>
            <div style={{"height":"128px","borderRadius":"14px","padding":"14px","boxSizing":"border-box","display":"flex","flexDirection":"column","justifyContent":"space-between","background":"#102D23","boxShadow":"inset 0 0 0 1px rgba(166,199,156,.25)"}}>
              <span style={{"fontWeight":"700","fontSize":"14px"}}>
                Deep Woodland
              </span>
              <span className="mono" style={{"color":"#A6C79C"}}>
                #102D23 · base background
              </span>
            </div>
            <div style={{"height":"128px","borderRadius":"14px","padding":"14px","boxSizing":"border-box","display":"flex","flexDirection":"column","justifyContent":"space-between","background":"#385A3B"}}>
              <span style={{"fontWeight":"700","fontSize":"14px"}}>
                Moss Green
              </span>
              <span className="mono" style={{"color":"#F7EBD0"}}>
                #385A3B · midground foliage
              </span>
            </div>
            <div style={{"height":"128px","borderRadius":"14px","padding":"14px","boxSizing":"border-box","display":"flex","flexDirection":"column","justifyContent":"space-between","background":"#6D9561","color":"#071B15"}}>
              <span style={{"fontWeight":"700","fontSize":"14px"}}>
                Leaf Green
              </span>
              <span className="mono">
                #6D9561 · leaf highlights
              </span>
            </div>
            <div style={{"height":"128px","borderRadius":"14px","padding":"14px","boxSizing":"border-box","display":"flex","flexDirection":"column","justifyContent":"space-between","background":"#A6C79C","color":"#071B15"}}>
              <span style={{"fontWeight":"700","fontSize":"14px"}}>
                Soft Sage
              </span>
              <span className="mono">
                #A6C79C · secondary text on dark
              </span>
            </div>
            <div style={{"height":"128px","borderRadius":"14px","padding":"14px","boxSizing":"border-box","display":"flex","flexDirection":"column","justifyContent":"space-between","background":"#F7EBD0","color":"#071B15"}}>
              <span style={{"fontWeight":"700","fontSize":"14px"}}>
                Warm Cream
              </span>
              <span className="mono">
                #F7EBD0 · primary text
              </span>
            </div>
            <div style={{"height":"128px","borderRadius":"14px","padding":"14px","boxSizing":"border-box","display":"flex","flexDirection":"column","justifyContent":"space-between","background":"#DBC77D","color":"#071B15"}}>
              <span style={{"fontWeight":"700","fontSize":"14px"}}>
                Antique Gold
              </span>
              <span className="mono">
                #DBC77D · rules, ornaments
              </span>
            </div>
            <div style={{"height":"128px","borderRadius":"14px","padding":"14px","boxSizing":"border-box","display":"flex","flexDirection":"column","justifyContent":"space-between","background":"#F4DD82","color":"#071B15"}}>
              <span style={{"fontWeight":"700","fontSize":"14px"}}>
                Firefly Yellow
              </span>
              <span className="mono">
                #F4DD82 · glow, script, CTA
              </span>
            </div>
            <div style={{"height":"128px","borderRadius":"14px","padding":"14px","boxSizing":"border-box","display":"flex","flexDirection":"column","justifyContent":"space-between","background":"#E5A85A","color":"#071B15"}}>
              <span style={{"fontWeight":"700","fontSize":"14px"}}>
                Lantern Amber
              </span>
              <span className="mono">
                #E5A85A · warm light, lantern
              </span>
            </div>
            <div style={{"height":"128px","borderRadius":"14px","padding":"14px","boxSizing":"border-box","display":"flex","flexDirection":"column","justifyContent":"space-between","background":"#C2DFE8","color":"#071B15"}}>
              <span style={{"fontWeight":"700","fontSize":"14px"}}>
                Mist Blue
              </span>
              <span className="mono">
                #C2DFE8 · mist, water
              </span>
            </div>
            <div style={{"height":"128px","borderRadius":"14px","padding":"14px","boxSizing":"border-box","display":"flex","flexDirection":"column","justifyContent":"space-between","background":"#EFC3B4","color":"#071B15"}}>
              <span style={{"fontWeight":"700","fontSize":"14px"}}>
                Pastel Peach
              </span>
              <span className="mono">
                #EFC3B4 · cheeks, pastel accents
              </span>
            </div>
            <div style={{"height":"128px","borderRadius":"14px","padding":"14px","boxSizing":"border-box","display":"flex","flexDirection":"column","justifyContent":"space-between","background":"#102D23","boxShadow":"inset 0 0 0 1px rgba(219,199,125,.4)"}}>
              <span style={{"fontWeight":"700","fontSize":"14px"}}>
                Text pairs
              </span>
              <span style={{"fontSize":"12px","lineHeight":"1.5","color":"#A6C79C"}}>
                Cream on Woodland ≈ 12:1
                <br />
                Sage on Woodland ≈ 8:1
                <br />
                Firefly on Woodland ≈ 10.7:1
              </span>
            </div>
          </div>
        </section>
        <section style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","gap":"56px"}}>
          <div style={{"display":"flex","flexDirection":"column","gap":"18px"}}>
            <div>
              <p className="eyebrow">
                02 · Typography
              </p>
              <h2 className="h2">
                Three voices
              </h2>
            </div>
            <div style={{"display":"flex","alignItems":"baseline","gap":"20px"}}>
              <span className="script" style={{"fontSize":"52px","color":"#F4DD82","width":"280px"}}>
                You're Invited
              </span>
              <span className="td muted">
                Parisienne — moments only: invitations, greetings, sign-offs. Never body copy or buttons.
              </span>
            </div>
            <div style={{"display":"flex","alignItems":"baseline","gap":"20px"}}>
              <span className="display" style={{"fontSize":"56px","fontWeight":"600","width":"280px"}}>
                Dylan
              </span>
              <span className="td muted">
                Cormorant Garamond 600 / 500 italic — names, chapter titles, buttons. 74–80 px hero, 40 px chapter, 19 px button.
              </span>
            </div>
            <div style={{"display":"flex","alignItems":"baseline","gap":"20px"}}>
              <span style={{"fontSize":"17px","width":"280px","lineHeight":"1.6"}}>
                Please join us as Dylan is welcomed into the faith.
              </span>
              <span className="td muted">
                Nunito 400 / 600 / 700 — body 15.5–17 px at 1.6 line height; labels 11–13 px, tracked 0.22em, uppercase.
              </span>
            </div>
          </div>
          <div style={{"display":"flex","flexDirection":"column","gap":"18px"}}>
            <div>
              <p className="eyebrow">
                03 · Components
              </p>
              <h2 className="h2">
                {"Magical button & chapter dots"}
              </h2>
            </div>
            <div style={{"display":"flex","gap":"24px","alignItems":"center","padding":"28px","borderRadius":"18px","background":"#071B15"}}>
              <span className="magic">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 1 L9.6 6.4 L15 8 L9.6 9.6 L8 15 L6.4 9.6 L1 8 L6.4 6.4 Z" fill="#F4DD82" />
                </svg>
                Open Invitation
              </span>
              <span className="magic" style={{"boxShadow":"0 0 0 2px #F4DD82"}}>
                Focus state
              </span>
              <div aria-hidden="true" style={{"display":"flex","gap":"7px","alignItems":"center"}}>
                <span style={{"width":"22px","height":"6px","borderRadius":"3px","background":"#F4DD82"}} />
                <span style={{"width":"6px","height":"6px","borderRadius":"50%","background":"rgba(166,199,156,.45)"}} />
                <span style={{"width":"6px","height":"6px","borderRadius":"50%","background":"rgba(166,199,156,.45)"}} />
                <span style={{"width":"6px","height":"6px","borderRadius":"50%","background":"rgba(166,199,156,.45)"}} />
              </div>
            </div>
            <p className="td muted" style={{"margin":"0"}}>
              Pill, 48 px min height, translucent Forest Black with a breathing firefly glow (3.2 s). Text stays live HTML above the art, never baked into illustrations.
            </p>
          </div>
        </section>
        <section style={{"display":"flex","flexDirection":"column","gap":"20px"}}>
          <div>
            <p className="eyebrow">
              04 · Seven chapter worlds
            </p>
            <h2 className="h2">
              One storybook, seven places Dylan explores
            </h2>
          </div>
          <div style={{"display":"grid","gridTemplateColumns":"repeat(7, minmax(0, 1fr))","gap":"12px"}}>
            <div style={{"borderRadius":"16px","overflow":"hidden","background":"#071B15"}}>
              <div style={{"height":"96px","background":"linear-gradient(#0E2A20, #1E4430)"}} />
              <div style={{"padding":"14px"}}>
                <p className="eyebrow" style={{"fontSize":"10px"}}>
                  Ch 1
                </p>
                <p className="display" style={{"margin":"4px 0 0","fontSize":"21px","fontWeight":"600"}}>
                  Firefly Forest
                </p>
                <p style={{"margin":"6px 0 0","fontSize":"13px","lineHeight":"1.45","color":"#A6C79C"}}>
                  Opening + Welcome. Night, lantern glow, leaf curtains.
                </p>
              </div>
            </div>
            <div style={{"borderRadius":"16px","overflow":"hidden","background":"#071B15"}}>
              <div style={{"height":"96px","background":"linear-gradient(#C2DFE8, #A6C79C)"}} />
              <div style={{"padding":"14px"}}>
                <p className="eyebrow" style={{"fontSize":"10px"}}>
                  Ch 2
                </p>
                <p className="display" style={{"margin":"4px 0 0","fontSize":"21px","fontWeight":"600"}}>
                  Country Lane
                </p>
                <p style={{"margin":"6px 0 0","fontSize":"13px","lineHeight":"1.45","color":"#A6C79C"}}>
                  Event details, maps, parking. Morning meadow and a stone chapel.
                </p>
              </div>
            </div>
            <div style={{"borderRadius":"16px","overflow":"hidden","background":"#071B15"}}>
              <div style={{"height":"96px","background":"linear-gradient(#C2DFE8, #EFC3B4)"}} />
              <div style={{"padding":"14px"}}>
                <p className="eyebrow" style={{"fontSize":"10px"}}>
                  Ch 3
                </p>
                <p className="display" style={{"margin":"4px 0 0","fontSize":"21px","fontWeight":"600"}}>
                  Seaside Postcard Town
                </p>
                <p style={{"margin":"6px 0 0","fontSize":"13px","lineHeight":"1.45","color":"#A6C79C"}}>
                  Milestone game + photoshoot. Rooftops, floating postcards, airmail.
                </p>
              </div>
            </div>
            <div style={{"borderRadius":"16px","overflow":"hidden","background":"#071B15"}}>
              <div style={{"height":"96px","background":"linear-gradient(#EFC3B4, #F7EBD0)"}} />
              <div style={{"padding":"14px"}}>
                <p className="eyebrow" style={{"fontSize":"10px"}}>
                  Ch 4
                </p>
                <p className="display" style={{"margin":"4px 0 0","fontSize":"21px","fontWeight":"600"}}>
                  Cloud Garden
                </p>
                <p style={{"margin":"6px 0 0","fontSize":"13px","lineHeight":"1.45","color":"#A6C79C"}}>
                  Dress code + gifts. Pastel clouds, an original floating sky-house, ribbons.
                </p>
              </div>
            </div>
            <div style={{"borderRadius":"16px","overflow":"hidden","background":"#071B15"}}>
              <div style={{"height":"96px","background":"linear-gradient(#1B2A3A, #E5A85A)"}} />
              <div style={{"padding":"14px"}}>
                <p className="eyebrow" style={{"fontSize":"10px"}}>
                  Ch 5
                </p>
                <p className="display" style={{"margin":"4px 0 0","fontSize":"21px","fontWeight":"600"}}>
                  Lantern Path
                </p>
                <p style={{"margin":"6px 0 0","fontSize":"13px","lineHeight":"1.45","color":"#A6C79C"}}>
                  Do's and don'ts. Evening mist, paper lanterns, wooden signs.
                </p>
              </div>
            </div>
            <div style={{"borderRadius":"16px","overflow":"hidden","background":"#071B15"}}>
              <div style={{"height":"96px","background":"linear-gradient(#C2DFE8, #1F4E5F)"}} />
              <div style={{"padding":"14px"}}>
                <p className="eyebrow" style={{"fontSize":"10px"}}>
                  Ch 6
                </p>
                <p className="display" style={{"margin":"4px 0 0","fontSize":"21px","fontWeight":"600"}}>
                  Tide Cove
                </p>
                <p style={{"margin":"6px 0 0","fontSize":"13px","lineHeight":"1.45","color":"#A6C79C"}}>
                  Countdown, RSVP, wishes. Underwater glow, bubbles, a message bottle.
                </p>
              </div>
            </div>
            <div style={{"borderRadius":"16px","overflow":"hidden","background":"#071B15"}}>
              <div style={{"height":"96px","background":"linear-gradient(#1E4430, #E5A85A)"}} />
              <div style={{"padding":"14px"}}>
                <p className="eyebrow" style={{"fontSize":"10px"}}>
                  Ch 7
                </p>
                <p className="display" style={{"margin":"4px 0 0","fontSize":"21px","fontWeight":"600"}}>
                  Golden Forest
                </p>
                <p style={{"margin":"6px 0 0","fontSize":"13px","lineHeight":"1.45","color":"#A6C79C"}}>
                  Thank you. The opening forest at golden hour, Dylan waving goodbye.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","gap":"56px"}}>
          <div style={{"display":"flex","flexDirection":"column","gap":"16px"}}>
            <div>
              <p className="eyebrow">
                05 · cinematicOpen timeline
              </p>
              <h2 className="h2">
                2.9 s, five layers moving at different speeds
              </h2>
            </div>
            <div style={{"display":"flex","flexDirection":"column","gap":"6px","padding":"20px","borderRadius":"18px","background":"#071B15"}}>
              <div style={{"display":"flex","justifyContent":"space-between","paddingLeft":"150px"}} className="mono muted">
                <span>
                  0s
                </span>
                <span>
                  0.5
                </span>
                <span>
                  1.0
                </span>
                <span>
                  1.5
                </span>
                <span>
                  2.0
                </span>
                <span>
                  2.5
                </span>
                <span>
                  2.9
                </span>
              </div>
              <div style={{"display":"flex","alignItems":"center","height":"32px"}}>
                <span className="td" style={{"width":"150px","fontSize":"13px"}}>
                  Input lock
                </span>
                <div style={{"position":"relative","flex":"1","height":"32px"}}>
                  <div className="bar" style={{"left":"0%","width":"60%","background":"rgba(166,199,156,.35)"}} />
                </div>
              </div>
              <div style={{"display":"flex","alignItems":"center","height":"32px"}}>
                <span className="td" style={{"width":"150px","fontSize":"13px"}}>
                  Titles lift + blur out
                </span>
                <div style={{"position":"relative","flex":"1","height":"32px"}}>
                  <div className="bar" style={{"left":"0%","width":"34%","background":"#DBC77D"}} />
                </div>
              </div>
              <div style={{"display":"flex","alignItems":"center","height":"32px"}}>
                <span className="td" style={{"width":"150px","fontSize":"13px"}}>
                  Leaf curtains part
                </span>
                <div style={{"position":"relative","flex":"1","height":"32px"}}>
                  <div className="bar" style={{"left":"9%","width":"52%","background":"#6D9561"}} />
                </div>
              </div>
              <div style={{"display":"flex","alignItems":"center","height":"32px"}}>
                <span className="td" style={{"width":"150px","fontSize":"13px"}}>
                  Foreground dolly
                </span>
                <div style={{"position":"relative","flex":"1","height":"32px"}}>
                  <div className="bar" style={{"left":"9%","width":"55%","background":"#385A3B"}} />
                </div>
              </div>
              <div style={{"display":"flex","alignItems":"center","height":"32px"}}>
                <span className="td" style={{"width":"150px","fontSize":"13px"}}>
                  Mid / far parallax
                </span>
                <div style={{"position":"relative","flex":"1","height":"32px"}}>
                  <div className="bar" style={{"left":"7%","width":"76%","background":"#1E4430","boxShadow":"inset 0 0 0 1px #385A3B"}} />
                </div>
              </div>
              <div style={{"display":"flex","alignItems":"center","height":"32px"}}>
                <span className="td" style={{"width":"150px","fontSize":"13px"}}>
                  Light bloom
                </span>
                <div style={{"position":"relative","flex":"1","height":"32px"}}>
                  <div className="bar" style={{"left":"16%","width":"62%","background":"#F4DD82"}} />
                </div>
              </div>
              <div style={{"display":"flex","alignItems":"center","height":"32px"}}>
                <span className="td" style={{"width":"150px","fontSize":"13px"}}>
                  Warm light up
                </span>
                <div style={{"position":"relative","flex":"1","height":"32px"}}>
                  <div className="bar" style={{"left":"81%","width":"19%","background":"#E5A85A"}} />
                </div>
              </div>
              <div style={{"display":"flex","alignItems":"center","height":"32px"}}>
                <span className="td" style={{"width":"150px","fontSize":"13px"}}>
                  Welcome stagger
                </span>
                <div style={{"position":"relative","flex":"1","height":"32px"}}>
                  <div className="bar" style={{"left":"60%","width":"40%","background":"#F7EBD0"}} />
                </div>
              </div>
            </div>
            <p className="td muted" style={{"margin":"0"}}>
              Easing: cubic-bezier(.65,0,.25,1) for camera moves (GSAP power3.inOut), cubic-bezier(.22,1,.36,1) for content arrival (expo.out). Reduced motion: opacity crossfade, 0.35 s, no transforms.
            </p>
          </div>
          <div style={{"display":"flex","flexDirection":"column","gap":"16px"}}>
            <div>
              <p className="eyebrow">
                06 · Named motion patterns
              </p>
              <h2 className="h2">
                Shared transition vocabulary
              </h2>
            </div>
            <div style={{"display":"grid","gridTemplateColumns":"1.3fr 1.6fr .7fr 1.3fr","columnGap":"16px","rowGap":"9px","padding":"20px","borderRadius":"18px","background":"#071B15"}}>
              <span className="th">
                Pattern
              </span>
              <span className="th">
                Trigger
              </span>
              <span className="th">
                Time
              </span>
              <span className="th">
                Reduced
              </span>
              <span className="td mono">
                cinematicOpen
              </span>
              <span className="td">
                Open Invitation tap
              </span>
              <span className="td">
                2.9s
              </span>
              <span className="td muted">
                0.35s fade
              </span>
              <span className="td mono">
                forestReveal
              </span>
              <span className="td">
                Ch 1 load / replay
              </span>
              <span className="td">
                1.2s
              </span>
              <span className="td muted">
                fade
              </span>
              <span className="td mono">
                leafCurtainTransition
              </span>
              <span className="td">
                Any chapter change
              </span>
              <span className="td">
                1.4s
              </span>
              <span className="td muted">
                0.3s fade
              </span>
              <span className="td mono">
                storybookSceneTransition
              </span>
              <span className="td">
                Chapter enter / exit
              </span>
              <span className="td">
                1.0s
              </span>
              <span className="td muted">
                0.3s fade
              </span>
              <span className="td mono">
                fireflyDrift
              </span>
              <span className="td">
                Ambient, Ch 1 + 7
              </span>
              <span className="td">
                6–12s loop
              </span>
              <span className="td muted">
                static glow
              </span>
              <span className="td mono">
                floatingPostcards
              </span>
              <span className="td">
                Ch 3 next question
              </span>
              <span className="td">
                0.8s
              </span>
              <span className="td muted">
                instant swap
              </span>
              <span className="td mono">
                magicalPhotoReveal
              </span>
              <span className="td">
                Answer / photo open
              </span>
              <span className="td">
                0.6s
              </span>
              <span className="td muted">
                opacity only
              </span>
              <span className="td mono">
                floatingClouds
              </span>
              <span className="td">
                Ambient, Ch 4
              </span>
              <span className="td">
                40–60s loop
              </span>
              <span className="td muted">
                static
              </span>
              <span className="td mono">
                floatingLanterns
              </span>
              <span className="td">
                Ambient, Ch 5
              </span>
              <span className="td">
                12–18s loop
              </span>
              <span className="td muted">
                static
              </span>
              <span className="td mono">
                oceanWaveMotion
              </span>
              <span className="td">
                Ambient, Ch 6
              </span>
              <span className="td">
                8s loop
              </span>
              <span className="td muted">
                static
              </span>
              <span className="td mono">
                bubbleTransition
              </span>
              <span className="td">
                Enter Ch 6 / RSVP sent
              </span>
              <span className="td">
                1.2s
              </span>
              <span className="td muted">
                fade
              </span>
              <span className="td mono">
                finalForestReturn
              </span>
              <span className="td">
                Enter Ch 7
              </span>
              <span className="td">
                2.4s
              </span>
              <span className="td muted">
                0.5s fade
              </span>
            </div>
          </div>
        </section>
      </div>
      </div>
    );
  }
}
