import cn from 'classnames';
import Wrapper from 'components/Wrapper';
import World from 'public/images/world.svg';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import wretch from 'wretch';
import s from './style.module.css';

const fetcher = (url) => wretch(url).get().json();

function convLatLongToStyle(latitude, longitude) {
  const x = (longitude + 180.0) * (100.0 / 360.0);
  const y = (latitude * -1.0 + 90.0) * (100.0 / 180.0);

  return { left: `${x}%`, top: `${y * (1 + (400 - 320) / 400)}%` };
}

const distance = (lat1, lon1, lat2, lon2, unit = 'K') => {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == 'K') {
      dist = dist * 1.609344;
    }
    if (unit == 'N') {
      dist = dist * 0.8684;
    }
    return dist;
  }
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function CdnMap() {
  const [currentDataCenter, setCurrentDataCenter] = useState(null);
  const [ping, setPing] = useState(null);

  const { data: datacenters } = useSWR('/api/cdn/datacenters', fetcher);

  const { data: location } = useSWR(
    'https://api-geolocation.zeit.sh/',
    fetcher,
  );

  const setAndScroll = useCallback(
    (code) => {
      setCurrentDataCenter(code);
      const el = document.getElementById(`datacenter-${code}`);

      if (el) {
        const rect = el.getBoundingClientRect();

        el.parentElement.parentElement.scroll({
          top: 0,
          left: el.offsetLeft - (window.innerWidth - rect.width) / 2,
          behavior: 'smooth',
        });
      }
    },
    [setCurrentDataCenter],
  );

  useEffect(() => {
    let stopped = false;

    (async () => {
      var start = new Date();
      const data = await fetcher('https://graphql.datocms.com/geo/ping');

      if (stopped) {
        return;
      }

      var end = new Date();
      setPing({ ...data, latency: parseInt((end - start) * 0.8) });

      if (!currentDataCenter) {
        setAndScroll(data.datacenter);
      }
    })();

    return () => {
      stopped = true;
    };
  }, [setPing, setAndScroll, currentDataCenter]);

  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.map}>
          <World />

          {location && (
            <div
              className={s.viewer}
              style={convLatLongToStyle(location.lat, location.lon)}
            >
              <div className={s.pin} />
              <div className={s.ripple} />
            </div>
          )}
          {datacenters &&
            datacenters.map((dc) => (
              <div
                key={dc.code}
                className={cn(s.datacenter, {
                  [s.activePoint]: ping && ping.datacenter === dc.code,
                })}
                style={{
                  ...convLatLongToStyle(
                    dc.coordinates.latitude,
                    dc.coordinates.longitude,
                  ),
                  zIndex: ping && ping.datacenter == dc.code ? 100 : 1,
                }}
                onClick={() => {
                  setAndScroll(dc.code);
                }}
              >
                <div className={s.pin} />
              </div>
            ))}
        </div>
      </Wrapper>
      <div className={s.list}>
        <div className={s.listInner}>
          {datacenters &&
            datacenters.map((dc) => (
              <div
                key={dc.code}
                id={`datacenter-${dc.code}`}
                className={s.itemWrapper}
              >
                <div
                  className={cn(s.item, {
                    [s.activeItem]:
                      dc.code ===
                      (currentDataCenter || (ping && ping.datacenter)),
                    [s.nearestItem]: ping && ping.datacenter == dc.code,
                  })}
                  onClick={() => setAndScroll(dc.code)}
                >
                  <div className={s.code}>{dc.code}</div>
                  <div className={s.city}>
                    {dc.name.split(/ \- /)[0]}, {dc.billing_region}
                  </div>
                  <div className={s.infos}>
                    <div className={s.info}>
                      <div className={s.infoTitle}>Distance</div>
                      <div className={s.infoValue}>
                        {location && (
                          <>
                            {numberWithCommas(
                              parseInt(
                                distance(
                                  dc.coordinates.latitude,
                                  dc.coordinates.longitude,
                                  location.lat,
                                  location.lon,
                                ),
                              ),
                            )}{' '}
                            km
                          </>
                        )}
                      </div>
                    </div>
                    {ping && ping.datacenter === dc.code && (
                      <div className={s.info}>
                        <div className={s.infoTitle}>Latency</div>
                        <div className={s.infoValue}>
                          {numberWithCommas(ping.latency)} ms
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
