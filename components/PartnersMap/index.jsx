import Wrapper from 'components/Wrapper';
import { groupBy } from 'lodash-es';
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from 'react-simple-maps';
import s from './style.module.css';

export default function PartnersMap({ partners }) {
  const countries = groupBy(
    partners.flatMap((partner) =>
      partner.locations.map((location) => ({
        location: location,
        partner: partner,
      })),
    ),
    'location.code',
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
                      fill={results ? 'var(--azure-color)' : '#F5F4F6'}
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
