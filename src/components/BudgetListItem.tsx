import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, FONT_SIZES, toCurrency } from '../utils';

type Props = {
  _id?: string;
  groupId?: string;
  name: string;
  budget: number;
  available: number;
  header?: boolean;
  last?: boolean;
  updateBudgetItem: (groupId: string, itemId: string, changes: any) => void;
};

type State = {
  tempBudget: string;
  isFocused: boolean;
};

class BudgetListItem extends React.Component<Props, State> {
  private input!: TextInput;

  static defaultProps: Partial<Props> = {
    _id: '',
    groupId: '',
    header: false,
    last: false,
  };

  state = {
    tempBudget: this.props.budget.toString(),
    isFocused: false,
  };

  handlePressBudget = () => {
    if (!this.props.header) {
      this.setState({
        isFocused: true,
        tempBudget: this.props.budget.toString(),
      });
      this.input.focus();
    }
  };

  handleChangeBudget = (text: string) => {
    if (text.length > this.state.tempBudget.length) {
      const lastCharacter = text[text.length - 1];
      if (isNaN(+lastCharacter) || lastCharacter === ' ') return;
      this.setState({ tempBudget: this.state.tempBudget + lastCharacter });
    } else {
      this.setState({ tempBudget: text });
    }
  };

  handleBlurBudget = () => {
    this.props.updateBudgetItem(this.props.groupId!, this.props._id!, {
      budget: +this.state.tempBudget,
    });
    this.setState({ isFocused: false });
  };

  render() {
    const { header, last, name, budget, available } = this.props;
    return (
      <View style={[styles.container, { borderBottomWidth: last ? 0 : 1 }]}>
        <View style={styles.nameContainer}>
          <Text
            style={[
              styles.text,
              {
                fontWeight: header ? 'bold' : 'normal',
              },
            ]}
          >
            {name}
          </Text>
        </View>
        <View
          style={styles.numberContainer}
          onTouchStart={this.handlePressBudget}
        >
          <Text
            style={[
              styles.text,
              {
                fontWeight: header ? 'bold' : 'normal',
                color: this.state.isFocused
                  ? +this.state.tempBudget === 0
                    ? COLORS.GRAY
                    : +this.state.tempBudget > 0
                      ? COLORS.BLUE
                      : COLORS.RED
                  : budget === 0
                    ? COLORS.GRAY
                    : budget > 0
                      ? COLORS.BLUE
                      : COLORS.RED,
                zIndex: 1,
              },
            ]}
          >
            {toCurrency(this.state.isFocused ? this.state.tempBudget : budget)}
          </Text>

          <TextInput
            ref={(input: TextInput) => (this.input = input)}
            style={styles.hide}
            keyboardType="numeric"
            value={this.state.tempBudget}
            onChangeText={this.handleChangeBudget}
            onBlur={this.handleBlurBudget}
            selectTextOnFocus
          />
        </View>
        <View style={[styles.numberContainer]}>
          <Text
            style={[
              styles.text,
              {
                fontWeight: header ? 'bold' : 'normal',
                color: COLORS.WHITE,
                backgroundColor:
                  available === 0
                    ? COLORS.GRAY
                    : available > 0
                      ? COLORS.GREEN
                      : COLORS.RED,
                borderRadius: 20,
                paddingHorizontal: 8,
                paddingVertical: 2,
              },
            ]}
          >
            {toCurrency(available)}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 14,
    paddingBottom: 14,
    flexDirection: 'row',
    borderBottomColor: COLORS.GRAY,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  numberContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
  },
  hide: {
    position: 'absolute',
    top: 0,
    opacity: 0,
    zIndex: 0,
  },
});

export default BudgetListItem;
