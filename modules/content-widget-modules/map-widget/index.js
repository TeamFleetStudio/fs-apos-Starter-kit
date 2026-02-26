const aosSchema = require('../../../lib/aosSchema.js');
const customAttributesSchema = require('../../../lib/customAttributesSchema');
const NodeGeocoder = require('node-geocoder');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: {
    // geocoder options can be include inside the main map-widget reference located in the /modules/content-widget-modules/modules.js file
    label: 'Map',
    icon: 'map-icon',
    description: 'Add a map to your page',
    previewImage: 'jpg'
  },
  icons: {
    'map-icon': 'Map'
  },
  fields: {
    add: {
      mapType: {
        type: 'select',
        label: 'Map Type',
        help: 'Choose how the map should be rendered',
        def: 'geocode',
        choices: [
          {
            label: 'Geocoded map (address based)',
            value: 'geocode'
          },
          {
            label: 'Embedded map (iframe)',
            value: 'embed'
          }
        ]
      },
      apiKey: {
        type: 'string',
        label: 'Geocoder API Key',
        help: 'Optional: Enter a MapBox API key here, or leave empty to use GEOCODER_API_KEY from environment variables',
        if: {
          mapType: 'geocode'
        }
      },
      address: {
        type: 'string',
        label: 'Address',
        required: true,
        if: {
          mapType: 'geocode'
        }
      },
      mapZoomLevel: {
        type: 'integer',
        label: 'Map zoom level',
        min: 1,
        max: 14,
        def: 14,
        if: {
          mapType: 'geocode'
        }
      },
      mapEmbedCode: {
        type: 'string',
        label: 'Map Embed Code (iframe)',
        help: 'Paste an embed iframe from Google Maps, Mapbox Studio, etc.',
        textarea: true,
        required: true,
        if: {
          mapType: 'embed'
        }
      },
      ...aosSchema,
      ...customAttributesSchema
    }
  },
  handlers(self) {
    return {
      '@apostrophecms/widget': {
        beforeSave: {
          async validateMapWidget(req, widget) {
            // Only validate map-widget type
            if (widget.type !== 'map-widget') {
              return;
            }
            
            // If embed mode, no validation needed
            if (widget.mapType === 'embed') {
              if (!widget.mapEmbedCode?.trim()) {
                throw self.apos.error('invalid', {
                  message: 'Map Widget: Embed code is required for embedded maps.',
                  field: 'mapEmbedCode'
                });
              }
              return;
            }
            
            // Validate geocode mode
            if (widget.mapType === 'geocode') {
              const widgetApiKey = widget.apiKey?.trim();
              const envApiKey = process.env.GEOCODER_API_KEY?.trim();
              
              if (!widgetApiKey && !envApiKey) {
                throw self.apos.error('invalid', {
                  message: 'Map Widget: Geocoder API key is required. Please enter an API key in the widget settings or set GEOCODER_API_KEY in your environment variables.',
                  field: 'apiKey'
                });
              }
              
              if (!widget.address?.trim()) {
                throw self.apos.error('invalid', {
                  message: 'Map Widget: Address is required for geocoded maps.',
                  field: 'address'
                });
              }
            }
          }
        }
      }
    };
  },
  components(self) {
    return {
      async map(req, data) {

        const body = {};
        const mapType = data.widget.mapType || 'geocode';

        // If using embed mode, skip geocoding entirely
        if (mapType === 'embed') {
          return {
            response: body,
            widget: data.widget
          };
        }

        try {
          const widgetApiKey = data.widget.apiKey?.trim();
          const envApiKey = process.env.GEOCODER_API_KEY?.trim();
          const moduleApiKey = self.options.geocoderSettings?.apiKey?.trim();
          
          const apiKey = widgetApiKey || envApiKey || moduleApiKey;
          
          if (!apiKey) {
            body.message = 'No geocoder API key found. Please enter an API key in the widget settings or set GEOCODER_API_KEY in your environment variables.';
            return {
              response: body,
              widget: data.widget
            };
          }

          if (!data.widget.address?.trim()) {
            body.message = 'No address provided for the map widget.';
            return {
              response: body,
              widget: data.widget
            };
          }

          const options = {
            ...self.options.geocoderSettings,
            apiKey: apiKey 
          };
          const geocoder = NodeGeocoder(options);
          const geocoderAddress = await geocoder.geocode(data.widget.address);

          if (!geocoderAddress.length) {
            throw new Error('No results found for entered street address, please check address is valid and update the field');
          }

          data.widget.latitude = geocoderAddress[0].latitude;
          data.widget.longitude = geocoderAddress[0].longitude;
        } catch (error) {
          body.message = error.message;
        }

        return {
          response: body,
          widget: data.widget
        };
      }
    };
  }
};
