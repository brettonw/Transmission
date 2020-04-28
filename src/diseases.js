// disease states with parameters, these are not necessarily correct... most are place-holders for a future setup, and should be
// set by matching real-world data
var diseases = {
    "Perfect": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 2, daysMax: 5 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 1.00, mortality: 0.0000, daysMin: 36500, daysMax: 36500 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 0, daysMax: 1 },
        DEAD: { name: "DEAD", color: "#808080", susceptible: false, contagious: 0.00 }
    },
    "Perfect-Convalescent": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 1.00, mortality: 0.0000, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 36500, daysMax: 36500 },
        DEAD: { name: "DEAD", color: "#808080", susceptible: false, contagious: 0.00 }
    },
    "SARS-CoV-2 (COVID-19)": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.10, daysMin: 7, daysMax: 21 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, mortality: 0.002, daysMin: 10, daysMax: 21 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.000, daysMin: 56, daysMax: 1095 },
        DEAD: { name: "DEAD", color: "#808080", susceptible: false, contagious: 0.00 }
    },
    "Recurrent": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.10, mortality: 0.0000, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.01, daysMin: 36500, daysMax: 36500 },
        DEAD: { name: "DEAD", color: "#808080", susceptible: false, contagious: 0.00 }
    },
    "Bacterial": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 3, daysMax: 7 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.35, mortality: 0.0000, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 7, daysMax: 14 },
        DEAD: { name: "DEAD", color: "#808080", susceptible: false, contagious: 0.00 }
    },
    "Rhinovirus (Cold)": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.10, daysMin: 2, daysMax: 5 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.35, mortality: 0.0000, daysMin: 7, daysMax: 10 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 1500, daysMax: 6000 },
        DEAD: { name: "DEAD", color: "#808080", susceptible: false, contagious: 0.00 }
    },
    "Influenza (Flu)": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.10, daysMin: 1, daysMax: 4 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, mortality: 0.0000, daysMin: 5, daysMax: 10 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 1500, daysMax: 6000 },
        DEAD: { name: "DEAD", color: "#808080", susceptible: false, contagious: 0.00 }
    },
    "Chicken Pox": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 10, daysMax: 21 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.75, mortality: 0.0000, daysMin: 4, daysMax: 7 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 1500, daysMax: 6000 },
        DEAD: { name: "DEAD", color: "#808080", susceptible: false, contagious: 0.00 }
    },
    "Ebola": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.05, daysMin: 2, daysMax: 21 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, mortality: 0.0000, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 1500, daysMax: 6000 },
        DEAD: { name: "DEAD", color: "#808080", susceptible: false, contagious: 0.00 }
    },
    "HIV (AIDS)": {
        // http://www.cdc.gov/hiv/policies/law/risk.html
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 14, daysMax: 28 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.0138, mortality: 0.0000, daysMin: 36500, daysMax: 36500 },
        CONVALESCENT: { name: "CONVALESCEN T", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 1500, daysMax: 6000 },
        DEAD: { name: "DEAD", color: "#808080", susceptible: false, contagious: 0.00 }
    },
    "HPV": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.60, mortality: 0.0000, daysMin: 180, daysMax: 540 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 1500, daysMax: 6000 },
        DEAD: { name: "DEAD", color: "#808080", susceptible: false, contagious: 0.00 }
    },
    "HSV-1 (Cold Sores)": {
        // http://www.patient.co.uk/doctor/herpes-simplex-genital
        // http://en.wikipedia.org/wiki/Herpes_simplex
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 2, daysMax: 12 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, mortality: 0.0000, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.05, recurrence: 0.003, daysMin: 36500, daysMax: 36500 },
        DEAD: { name: "DEAD", color: "#808080", susceptible: false, contagious: 0.00 }
    },
    "HSV-2 (Herpes)": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 2, daysMax: 12 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.15, mortality: 0.0000, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.05, recurrence: 0.01111, daysMin: 36500, daysMax: 36500 },
        DEAD: { name: "DEAD", color: "#808080", susceptible: false, contagious: 0.00 }
    }
};

var disease;
