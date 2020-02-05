import World from 'public/images/world.svg';
import Wrapper from 'components/Wrapper';
import s from './style.css';
import useSWR from 'swr';
import fetch from 'unfetch';
import cn from 'classnames';

const fetcher = async url => {
  const response = await fetch(url);
  return response.json();
};

function convLatLongToStyle(latitude, longitude) {
  const x = (longitude + 180.0) * (100.0 / 360.0);
  const y = (latitude * -1.0 + 90.0) * (100.0 / 180.0);
  return { left: `${x}%`, top: `${y}%` };
}

export default function CdnMap() {
  const { data: datacenters } = useSWR('/api/cdn/datacenters', fetcher);
  const { data: ping } = useSWR('https://graphql.datocms.com/geo/ping', fetcher);
  const { data: location } = useSWR('https://api-geolocation.zeit.sh/', fetcher);

  return (
    <div className={s.root}>
      <div className={s.map}>
        <World />

        {datacenters &&
          datacenters.map(dc => (
            <div
              key={dc.code}
              className={cn(s.point, {
                [s.activePoint]: ping && ping.datacenter === dc.code,
              })}
              style={convLatLongToStyle(
                dc.coordinates.latitude,
                dc.coordinates.longitude,
              )}
            >
              <div />
            </div>
          ))}

        {location && (
          <div
            className={s.viewer}
            style={convLatLongToStyle(location.lat, location.lon)}
          >
            <div className={s.pin} />
            <div className={s.ripple} />
          </div>
        )}
      </div>
    </div>
  );
}
