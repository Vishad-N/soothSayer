// Every card shares one anchor (.cslot, centred by CSS) and one size, so each new card
// is rebuilt exactly where the last one burst. Shards are clipped clones of the card
// face; they stay mounted and are only animated, so the whole thing reverses cleanly.
function CardBody({ state, tagged }) {
  const c = tagged ? { 'data-c': '' } : undefined
  return (
    <div className="cbody">
      <span className="mono" {...c}>
        {state.number} · {state.rail}
      </span>
      <h3 {...c}>{state.title}</h3>
      <p {...c}>{state.body}</p>
      <div className="cfoot" {...c}>
        <span className="chip">{state.meta}</span>
        <i />
      </div>
    </div>
  )
}

export default function CardStage({ states, fragments, stageRef }) {
  const last = states.length - 1
  return (
    <div className="cstage" ref={stageRef}>
      <span className="cquiet" />
      <span className="cflash" />
      {states.map((state, i) => (
        <div className="cslot" key={state.id} aria-hidden={i !== 0} data-label={`${state.number} ${state.title}. ${state.body}`}>
          <div className="cface">
            <CardBody state={state} tagged />
          </div>
          {i < last && (
            <div className="cfrags" aria-hidden="true">
              {fragments.map((f, k) => (
                <div className="cfrag" key={k} style={{ clipPath: f.clip, transformOrigin: f.origin }}>
                  <div className="cface cclone">
                    <CardBody state={state} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
