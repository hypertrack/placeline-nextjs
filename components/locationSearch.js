import { Component } from "react";
import { Input, List } from "antd";
import PlacesAutocomplete from "react-places-autocomplete";

class LocationSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: ""
    };
  }

  handleAddressChange = address => {
    this.setState({ address });
  };

  onAddressSelect = address => {
    this.setState({ address });
    this.props.onAddressSelect(address);
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.address !== this.props.address) {
      this.setState({ address: nextProps.address });
    }
  };

  render() {
    const { address } = this.state;
    const { Search } = Input;

    return (
      <PlacesAutocomplete
        onChange={this.handleAddressChange}
        onSelect={this.onAddressSelect}
        value={address}
      >
        {({ getInputProps, getSuggestionItemProps, suggestions, loading }) => (
          <React.Fragment>
            <Search
              loading={`${loading}`}
              {...getInputProps({
                id: "address-input"
              })}
            />
            <div
              className="autocomplete-dropdown-container"
              style={{
                color: "rgba(0,0,0,0.65)",
                lineHeight: "1.5",
                zIndex: "1050",
                boxSizing: "border-box",
                fontSize: "14px",
                fontVariant: "initial",
                backgroundColor: "#fff",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                cursor: "pointer"
              }}
            >
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                const style = suggestion.active
                  ? {
                      padding: "12px",
                      backgroundColor: "#e6f7ff"
                    }
                  : {
                      padding: "12px"
                    };

                const spread = {
                  ...getSuggestionItemProps(suggestion, {
                    className,
                    style
                  })
                };

                return (
                  <div {...spread} key={suggestion.id}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default LocationSearch;
