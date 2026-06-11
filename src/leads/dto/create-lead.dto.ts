import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

const BLOCKED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
];

@ValidatorConstraint({ name: "corporateDomain", async: false })
export class IsCorporateDomain implements ValidatorConstraintInterface {
  validate(email: string) {
    if (typeof email !== "string") return false;
    const domain = email.split("@")[1]?.toLowerCase();
    return !!domain && !BLOCKED_DOMAINS.includes(domain);
  }

  defaultMessage() {
    return "Enterprise ingestion requires a private corporate domain. Public providers rejected.";
  }
}

const VERTICALS = ["payday_personal", "insurance", "sweepstakes", "auto_loans"];
const DELIVERY_CLASSES = ["real_time", "aged", "exclusive"];

export enum WeeklyVolume {
  UNDER_5K = "under_5k",
  FROM_5K_TO_20K = "5k_to_20k",
  FROM_20K_TO_50K = "20k_to_50k",
  ENTERPRISE = "enterprise_scale",
}

export enum DeliveryMechanism {
  WEBHOOK = "realtime_webhook",
  LIVE_TRANSFER = "live_transfer",
  CSV_SFTP = "encrypted_csv_sftp",
}

export class CreateLeadDto {
  @IsString()
  @MinLength(2, { message: "Corporate legal entity identification required." })
  declare companyName: string;

  @IsString()
  @MinLength(2, { message: "Primary officer designation name required." })
  declare contactPerson: string;

  @IsEmail({}, { message: "Valid corporate email address required." })
  @Validate(IsCorporateDomain)
  declare corporateEmail: string;

  @IsString()
  @MinLength(10, {
    message: "Telephony sequence must include international country codes.",
  })
  declare internationalPhone: string;

  @IsArray()
  @ArrayMinSize(1, {
    message: "At least one target consumer lead vertical must be selected.",
  })
  @IsIn(VERTICALS, { each: true })
  declare targetedVerticals: string[];

  @IsArray()
  @ArrayMinSize(1, {
    message:
      "Specify your required data distribution classification parameters.",
  })
  @IsIn(DELIVERY_CLASSES, { each: true })
  declare leadDeliveryClass: string[];

  @IsEnum(WeeklyVolume, { message: "Select a weekly volume allocation." })
  declare weeklyVolumeAllocation: WeeklyVolume;

  @IsEnum(DeliveryMechanism, {
    message: "Select a preferred delivery mechanism.",
  })
  declare preferredDeliveryMechanism: DeliveryMechanism;

  @IsOptional()
  @IsString()
  operationalNotes?: string;
}
