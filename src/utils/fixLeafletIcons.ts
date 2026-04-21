import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

type DefaultIconPrototype = typeof L.Icon.Default.prototype & {
  _getIconUrl?: () => string;
};

export function fixLeafletIcons() {
  const proto = L.Icon.Default.prototype as DefaultIconPrototype;

  delete proto._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
  });
}