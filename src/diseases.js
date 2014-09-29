// disease states with parameters
var diseases = {
    perfect: {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 1.00, daysMin: 36500, daysMax: 36500 },
    },
    nonconvalescent: {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, daysMin: 36500, daysMax: 36500 },
    },
    bacterial: {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.05, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#FFFFFF", susceptible: true, contagious: 0.00, daysMin: 7, daysMax: 14 }
    },
    rhinovirus: {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.05, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, daysMin: 1500, daysMax: 6000 }
    },
    ebola: {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.05, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, daysMin: 1500, daysMax: 6000 }
    },
    hiv: {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.05, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, daysMin: 1500, daysMax: 6000 }
    },
    hpv: {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.05, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, daysMin: 1500, daysMax: 6000 }
    },
    hsv: {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.05, daysMin: 3, daysMax: 28 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.10, daysMin: 1500, daysMax: 6000 }
    },
    hepatitis: {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.05, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, daysMin: 1500, daysMax: 6000 }
    }
};

var disease;
