(function(env) {
    "use strict";
    env.ddg_spice_time = function(api) {

        if (!api || api.info == "No matches") {
            return Spice.failed('time');
        }

        var script = $('[src*="/js/spice/time/"]')[0],
            source = $(script).attr("src"),
            // Query is normalized as we'll normalize the generated strings.
            // if we have a comma separated query it is in the form:
            // "town, state, country"  but state is optional
            query = decodeURIComponent(source.match(/time\/([^\/]+)/)[1]).toLowerCase().split(','),
            chosen;

        for(var i = 0; i < api.locations.length; i++) {
            // query[0] = state
            // query[len-1] = country
            if(DDG.stringsRelevant(query[0], api.locations[i].geo.name) &&
                    DDG.stringsRelevant(query[query.length-1], api.locations[i].geo.country.name)) {
                chosen = api.locations[i];
                break;
            }
        }

        // If there isn't a place, return immediately.
        if(!chosen) {
            return Spice.failed('time');
        }

        var dateObj = DDG.getDateFromString(chosen.time.iso),
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        //Convert 24 hour time to 12 hour time
        function toPrettyTime(date) {
            var hours = date.getHours(),
                minutes = date.getMinutes();
            return {
                hours: (hours % 12) || 12,
                minutes: minutes < 10 ? '0' + minutes : minutes,
                amPM: hours >= 12 ? "PM" : "AM"
            };
        }

        var dateTime = {
            time: toPrettyTime(dateObj),
            dayName: days[dateObj.getDay()],
            day: dateObj.getDate(),
            monthName: months[dateObj.getMonth()],
            year: dateObj.getFullYear(),
            placeName: chosen.geo.state ? (chosen.geo.name + ", " + chosen.geo.state) : chosen.geo.name,
            offset: chosen.time.timezone.offset.replace(/0|:/g, ""),
            zone: chosen.time.timezone.zonename,
            country: chosen.geo.country.name
        };

        Spice.add({
            id: "time",
            name: "Time",
            data: dateTime,
            signal: 'high',
            meta: {
                sourceName: "timeanddate.com",
                sourceUrl: 'http://www.timeanddate.com/worldclock/city.html?n=' + chosen.id
            },
            templates: {
                group: 'base',
                options: {
                    content: Spice.time.content,
                    moreAt: true
                }
            }
        });
    };
}(this));
