ko.bindingHandlers.sliderValue = {
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		var params = valueAccessor();

		// Check whether the value observable is either placed directly or in the paramaters object.
		if (!(ko.isObservable(params) || params['value']))
			throw "You need to define an observable value for the sliderValue. Either pass the observable directly or as the 'value' field in the parameters.";

		// Identify the value and initialize the slider
		var valueObservable;
		if (ko.isObservable(params)) {
			valueObservable = params;
			$(element).slider({value: ko.unwrap(params)});
		}
		else {
			valueObservable = params['value'];
			if (!Array.isArray(valueObservable)) {
				// Replace the 'value' field in the options object with the actual value
				params['value'] = ko.unwrap(valueObservable);
				$(element).slider(params);
			}
			else {
				valueObservable = [params['value'][0], params['value'][1]];
				params['value'][0] = ko.unwrap(valueObservable[0]);
				params['value'][1] = ko.unwrap(valueObservable[1]);
				$(element).slider(params);
			}
		}

		// Make sure we update the observable when changing the slider value
		$(element).on('slide', function (ev) {
			if (!Array.isArray(valueObservable)) {
				valueObservable(ev.value);
			}
			else {
				valueObservable[0](ev.value[0]);
				valueObservable[1](ev.value[1]);
			}
		}).on('change', function (ev) {
			if (!Array.isArray(valueObservable)) {
				valueObservable(ev.value.newValue)
			}
			else {
				valueObservable[0](ev.value.newValue[0]);
				valueObservable[1](ev.value.newValue[1]);
			}
		});

		// Clean up
		ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
			$(element).slider('destroy');
			$(element).off('slide');
		});

	},
	update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		var modelValue = valueAccessor();
		var valueObservable;
		if (ko.isObservable(modelValue))
			valueObservable = modelValue;
		else
			valueObservable = modelValue['value'];

		if (!Array.isArray(valueObservable)) {
			$(element).slider('setValue', parseFloat(valueObservable()));
		}
		else {
			$(element).slider('setValue', [parseFloat(valueObservable[0]()),parseFloat(valueObservable[1]())]);
		}
	}
};
