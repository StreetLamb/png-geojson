const PNG = require("pngjs").PNG;
const nearest_color = require("nearest-color");
const polyClipping = require("polygon-clipping");
const helpers = require("@turf/helpers");
const fs = require("fs");
import Jimp from "jimp";

const formatColors = (pixelColor, callback) => {
  //   const colors = {
  //     purple: "#4b0082", //very heavy
  //     red: "#ff0000", //heavy
  //     orange: "#ffa500", //above avg
  //     yellow: "#ffff00", //avg
  //     green: "#008000", //below avg
  //     blue: "#0000ff", //light
  //     // white: "#FFFFFF",
  //     // black: "#000000",
  //   };

  const nearestColor = nearest_color.from(nearest_color.STANDARD_COLORS);
  callback(nearestColor(pixelColor));
};

const convertImagetoGeojson = (
  lowerLat,
  lowerLong,
  upperLat,
  upperLong,
  imageBuffer,
  callback
) => {
  const distanceLat = Math.abs(upperLat - lowerLat);
  const distanceLong = Math.abs(upperLong - lowerLong);

  Jimp.read(imageBuffer)
    .then((image) => {
      let polygonDict = {};

      image
        // .resize(image.bitmap.width / 2, Jimp.AUTO)
        .quality(60)
        .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
          const r = image.bitmap.data[idx];
          const g = image.bitmap.data[idx + 1];
          const b = image.bitmap.data[idx + 2];
          const alpha = image.bitmap.data[idx + 3];

          const isColored = alpha > 0;
          if (isColored) {
            formatColors({ r, g, b }, (newColor) => {
              const { r, g, b } = newColor.rgb;
              image.bitmap.data[idx] = r;
              image.bitmap.data[idx + 1] = g;
              image.bitmap.data[idx + 2] = b;

              //convert to polygon
              const leftLon =
                lowerLong + (x / image.bitmap.width) * distanceLong;
              const rightLon =
                lowerLong + ((x + 1) / image.bitmap.width) * distanceLong;
              const btmLat = upperLat - (y / image.bitmap.height) * distanceLat;
              const topLat =
                upperLat - ((y + 1) / image.bitmap.height) * distanceLat;

              const polygon_coord = [
                [
                  [leftLon, btmLat],
                  [rightLon, btmLat],
                  [rightLon, topLat],
                  [leftLon, topLat],
                  [leftLon, btmLat],
                ],
              ];
              //save polygon according to color
              !polygonDict[newColor.name]
                ? (polygonDict[newColor.name] = [polygon_coord])
                : polygonDict[newColor.name].push(polygon_coord);
            });
          }
        });
      let combinedPolygonList = []; //store all multipolygons
      for (const color in polygonDict) {
        const allPolygons = polygonDict[color];
        //batch unionise polygons
        let combinedPolygon;
        for (let i = 0; i < allPolygons.length / 20000; i++) {
          const polygons = allPolygons.slice(20000 * i, 20000 * (i + 1));
          if (i === 0) {
            combinedPolygon = polyClipping.union(...polygons);
          } else {
            combinedPolygon = polyClipping.union(combinedPolygon, ...polygons);
          }
        }

        // const combinedPolygon = polyClipping.union(...allPolygons);
        const multiPoly = helpers.multiPolygon(
          //add color param to multipoly
          combinedPolygon,
          { color }
        );
        combinedPolygonList.push(multiPoly);
      }
      const polyCollections = helpers.featureCollection(combinedPolygonList, {
        bbox: [lowerLong, lowerLat, upperLong, upperLat],
      });
      callback(polyCollections);
    })
    .catch((err) => {
      callback("error");
    });
};

const unionizePolygons = (polygons) => {
  return polyClipping.union(...allPolygons);
};

export default convertImagetoGeojson;
