## png-geojson

Converts your geographical heatmap images into GeoJson format.

- Images must be below 2mb.
- Images must be below 0.36MP.

## How to use

1. Drop your image into the upload box
2. Specify the latitude and longitude at the bottom left corner and the top right corner of your photo.
3. After submitting, copy and paste the geojson result into [`geojson.io`](http://geojson.io) to verify and visualise the result.

## How to run the code

First, install all the libraries required:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.
