import s from './style.module.css';
import Wrapper from 'components/Wrapper';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from 'react-simple-maps';

const groupBy = (items, fn) =>
  items.reduce((result, item) => {
    const key = fn(item);

    return {
      ...result,
      [key]: [...(result[key] || []), item],
    };
  }, {});

export default function PartnersMap({ partners }) {
  const countries = groupBy(
    partners
      .map((partner) =>
        partner.locations.map((location) => ({
          location: location,
          partner: partner,
        })),
      )
      .flat(),
    (thing) => thing.location.code,
  );

  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.map}>
          <ComposableMap
            projection="geoEquirectangular"
            width={900}
            height={400}
            projectionConfig={{ center: [0.5, 12] }}
          >
            <Geographies geography="/world-110m.json">
              {({ geographies }) =>
                geographies.map((geo) => {
                  const results = countries[geo.properties.ISO_A2];
                  console.log(geo.properties.ISO_A2, results);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={results ? `var(--azure-color)` : '#F5F4F6'}
                      tabIndex={-1}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
      </Wrapper>
    </div>
  );
}
