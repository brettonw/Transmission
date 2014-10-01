var atomPrototype = function () {
    var a = Object.create (Object);

    a.init = function (id) {
        this.id = id;
        this.events = [];
    };

    a.map = function () {
        return {
            x: this.id % populationDimension,
            y: Math.floor(this.id / populationDimension)
        };
    };

    a.day = function () {
        return (this.events.length > 0) ? this.events[this.events.length - 1].day : -1;;
    };

    a.setState = function (state, params) {
        this.state = state;
        var event = { day: day };
        if (params != null) {
            for (var param in params) {
                if (params.hasOwnProperty (param)) {
                    event[param] = params[param];
                }
            }
        }
        this.events.push (event);
        if (this.hasOwnProperty ("link")) {
            this.link.style.fill = state.color;
        }
    };

    a.infectBy = function (atom) {
        if (this.state.name == disease.HEALTHY.name) {
            this.setState (disease.INFECTED, { by: atom });
        }
    };

    return a;
} ();
