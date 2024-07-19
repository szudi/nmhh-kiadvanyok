function SuggestPrepare(formSelector) {
	function SetKeywordValue(form, value) {
		form.querySelector('[name=fld_keyword]').value = value;
		form.querySelector('[name=fld_compound]').value = '';
	}

	const filter = (response) => {
		const result = {};

		Object.keys(response.suggest).forEach((key) => {
			const source = response.suggest[key];
			const sourceData = source[Object.keys(source)[0]].suggestions;

			const items = sourceData.map(el => ({...el, value: el.term.replaceAll('\u001e',' '), type: key}));

			result[key] = items;
		});

		if (result.Keyword.length > 3) {
			if (result.FreeText.length < 3) {
				result.Keyword = result.Keyword.slice(0, 3 + (3 - result.FreeText.length));
			} else {
				result.Keyword = result.Keyword.slice(0, 3);
			}
		}

		return [...result.Keyword, ...result.FreeText];
	}

	var engine = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		//datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		//prefetch: '',
		//local: []
		remote: {
			url: '/servlets/solr?filter=',
			filter,
			prepare: function(query, settings) {
				settings.url = settings.url + query;

				return settings;
			}
		}
	});

	const suggestion = (data) => {
		const {type, value, weight} = data;

		return `
			<div ${type === 'Keyword' ? `class="keyword"`: ''}>
				${value}
			</div>
		`;
	}

		$(formSelector + ' .typeahead').typeahead({
			hint: false,
			highlight: true,
			minLength: 3
		},{
			name: 'states',
			display: 'value',
			source: engine,
			limit: 6,
			templates: {
				suggestion
			}
	});

	$('input.typeahead').on('typeahead:selected', function(event, selection) {
		if (selection.type !== "FreeText") {
			SetKeywordValue(this.form, selection.value)
		}

		this.form.submit();
	});

	$(formSelector + ' ul a').click(function() {
		engine.clearRemoteCache();

		$(formSelector + ' .typeahead').val('');
	});
}
