ocument.addEventListener("keydown", function(e) {

	if (e.keyCode == 220) {

weather.contrailTemperatureThreshold = 100;

weather.contrailAltitude = 0;

let whiteSmokeEmitter = new geofs.fx.ParticleEmitter({

            anchor: {

                        worldPosition: [0, 0, 0]

                    },

            duration: 1E10,

            rate: .05,

            life: 4E4,

            easing: "easeOutQuart",

            startScale: .01,

            endScale: .01,

            randomizeStartScale: .05,

            randomizeEndScale: .15,

            startOpacity: 0.9,

            endOpacity: 1E-5,

            startRotation: "random",

            texture: "whitesmoke"

        })

   document.addEventListener("keydown", function(e) {

	   if (e.keyCode == 191) {

	whiteSmokeEmitter.destroy()

	weather.contrailTemperatureThreshold = -30;

   weather.contrailAltitude = 1E4;

		}

	})

	}

})

